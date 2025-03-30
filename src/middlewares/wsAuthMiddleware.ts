// middlewares/wsAuthMiddleware.ts
import { WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces';
import cache from '../utils/cache';
import prisma from '../app';
import { Request } from 'express';

export default async function wsAuthMiddleware(
  ws: WebSocket, 
  req: Request
): Promise<any> {
  const accessToken: string | undefined = req.cookies?.accessToken;
  
  if (!accessToken) {
    ws.close(1000, 'Login required');
    return null;
  }
  
  try {
    const secret: string = process.env.JWT_SECRET as string;
    const decoded: CustomJwtPayload = jwt.verify(accessToken, secret) as CustomJwtPayload;
    
    if ((await cache.isAccessTokenBlacklisted(decoded.id, accessToken)) || decoded.reset) {
      ws.close(1000, 'Login required');
      return null;
    }
    
    // Get the user from cache or database
    let user = await cache.getUser(decoded.id);
    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          id: decoded.id
        },
        include: {
          customer: true,
          seller: true
        }
      });
      
      if (!user) {
        ws.close(1000, 'User not found');
        return null;
      }
      
      if (!user.isVerified) {
        ws.close(1000, 'Account is not verified');
        return null;
      }
      
      await cache.storeUser(user);
    }
    
    return user;
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    ws.close(1000, 'Websocket authentication failed');
    return null;
  }
}