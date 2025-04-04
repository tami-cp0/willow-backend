import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ErrorHandler } from "../utils/errorHandler";
import { CustomJwtPayload } from "../interfaces";
import cache from "../utils/cache";
import { User } from "@prisma/client";
import prisma from "../app";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} Request made to ${req.originalUrl} by ${req.ip}`);

    const accessToken: string | undefined = req.cookies?.accessToken;
    const secret: string = process.env.JWT_SECRET as string;

    if (!accessToken) {
        return next(new ErrorHandler(401, 'Login required'));
    }

    try {
        const decoded: CustomJwtPayload = jwt.verify(accessToken, secret) as CustomJwtPayload;

        // reset token misuse detection
        if ((await cache.isAccessTokenBlacklisted(decoded._id, accessToken)) || decoded.reset) {
            return next(new ErrorHandler(401, "Login required"));
        }

        if (req.originalUrl.includes('/api/v1/sellers') && decoded.role !== 'SELLER') {
            return next(new ErrorHandler(403, 'Unauthorized route - cannot access with Customers account'));
        }

        if ((req.originalUrl.includes('/api/v1/customers') || req.originalUrl.includes('/api/v1/products')) && decoded.role !== 'CUSTOMER') {
            return next(new ErrorHandler(403, 'Unauthorized route - cannot access with Sellers account'));
        }

        let user: User | null = await cache.getUser(decoded._id);
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
            if (!user) return next(new ErrorHandler(404, "Account does not exist: Invalid ID"));
            await cache.storeUser(user);
        }
        if (!user.isVerified) return next(new ErrorHandler(403, 'Account is not verified'));
        
        req.user = user;

        return next();
    } catch (error: any) {
        console.log(error);
        return next(new ErrorHandler(401, "Login required"));
    }
}

export default authMiddleware;