import { Request, Router } from 'express';
import { wsInstance } from '../app';
import { WebSocket } from 'ws';
import ChatController from '../controllers/chat';
import wsAuthMiddleware from '../middlewares/wsAuthMiddleware';

const chatRouter = Router();
wsInstance.applyTo(chatRouter);

chatRouter.ws('/connect', async (ws: WebSocket, req: Request) => {  
  const user = await wsAuthMiddleware(ws, req);
  
  if (!user) {
    return; // Connection was closed in middleware
  }
  
  // Set up the connection for chat
  ChatController.setupConnection(ws, user);
  
  // Handle incoming messages
  ws.on('message', async (msg) => {
    await ChatController.handleMessage(ws, msg.toString(), user);
  });
});

export default chatRouter;