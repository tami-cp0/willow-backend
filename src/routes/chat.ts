import { Router, Request } from 'express';
import { WebSocket } from 'ws';
import ChatController from '../controllers/chat';
import wsAuthMiddleware from '../middlewares/wsAuthMiddleware';
import expressWs from 'express-ws';

// Export a function that accepts the wsInstance and returns the chat router
export default function createChatRouter(wsInstance: expressWs.Instance) {
  const chatRouter = Router();

  // Manually apply WebSocket support to only this router
  wsInstance.applyTo(chatRouter);

  // Define your WebSocket endpoint
  (chatRouter as any).ws('/connect', async (ws: WebSocket, req: Request) => {
    const user = await wsAuthMiddleware(ws, req);
    if (!user) return; // Connection closed by middleware if auth fails

    // Set up the connection for chat
    ChatController.setupConnection(ws, user);

    // Listen for incoming messages
    ws.on('message', async (msg: string) => {
      await ChatController.handleMessage(ws, msg.toString(), user);
    });
  });

  return chatRouter;
}
