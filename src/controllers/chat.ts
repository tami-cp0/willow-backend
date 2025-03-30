import { WebSocket } from 'ws';
import prisma from '../app';
import { User, Role } from '@prisma/client';

// Track active connections, temporarily in-memory
const activeConnections: Map<string, WebSocket> = new Map();

export default class ChatController {
  // Set up connection and event handlers
  static setupConnection(ws: WebSocket, user: User) {
    activeConnections.set(user.id, ws);

    // Set up ping/pong to keep connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        activeConnections.delete(user.id);
        clearInterval(pingInterval);
      }
    }, 30000);

    ws.on('close', () => {
        activeConnections.delete(user.id);
        clearInterval(pingInterval);
        console.log(`Connection closed for user ${user.id}`);
    });

    // Send connection confirmation
    ws.send(JSON.stringify({
      type: 'connected',
      data: {
        userId: user.id,
        role: user.role
      }
    }));
  }

  // Handle incoming messages
  static async handleMessage(ws: WebSocket, message: string, user: User) {
    try {
      const parsedMessage = JSON.parse(message);

      // data = { conversationId, content, recipientId }
      if (
        !parsedMessage.data ||
        (!parsedMessage.data.content || !parsedMessage.data.recipientId)
      ) {
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Missing required fields in message data - (content, recipientId)' }
        }));
        return;
      }
      
      await ChatController.handleChatMessage(ws, parsedMessage.data, user);

    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Server error processing message' }
      }));
    }
  }

  // Handle chat messages
  static async handleChatMessage(ws: WebSocket, data: any, user: User) {
    const { conversationId, content } = data;
    let recipientId = data.recipientId;

    try {
      if (!content || content.trim() === '') {
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Message content cannot be empty' }
        }));
        return;
      }
      
      let conversation;
      
      // If no conversationId, check if we need to create a new conversation
      if (!conversationId) {
        // Determine roles for the conversation
        const customerId = user.role === Role.CUSTOMER ? user.id : recipientId;
        const sellerId = user.role === Role.SELLER ? user.id : recipientId;

        // Check if conversation already exists
        conversation = await prisma.conversation.findUnique({
          where: {
            customerId_sellerId: {
              customerId,
              sellerId
            }
          }
        });

        // Create a new conversation atomically if it doesn't exist
        if (!conversation) {
          conversation = await prisma.conversation.upsert({
            where: {
              customerId_sellerId: {
                customerId,
                sellerId,
              },
            },
            update: {},
            create: {
              customerId,
              sellerId,
            },
          });          
        }
      } else {
        // Get existing conversation
        conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        if (!conversation) {
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Conversation not found - Invalid ID' }
          }));
          return;
        }

        // Check if user is part of the conversation
        if (user.role === Role.CUSTOMER && conversation.customerId !== user.id) {
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'You are not part of this conversation' }
          }));
          return;
        } else if (user.role === Role.SELLER && conversation.sellerId !== user.id) {
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'You are not part of this conversation' }
          }));
          return;
        }
      }

      // Save the message to the database
      const newMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          receiverId: recipientId,
          content,
        }
      });

      // Format the response
      const messageResponse = {
        id: newMessage.id,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.content,
        createdAt: newMessage.createdAt
      };

      // Send message to the sender to confirm receipt
      ws.send(JSON.stringify({
        type: 'message',
        data: messageResponse
      }));

      // Send message to the recipient if they're online
      const recipientWs = activeConnections.get(recipientId);
      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify({
          type: 'message',
          data: messageResponse
        }));
      }

    } catch (error) {
      console.error('Error handling chat message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Failed to send message' }
      }));
    }
  }
}
