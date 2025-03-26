import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ErrorHandler } from "../utils/errorHandler";
import { CustomJwtPayload } from "../interfaces";
import cache from "../utils/cache";
import { User } from "@prisma/client";
import prisma from "../app";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
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

        if (req.originalUrl.includes('sellers') && user.role !== 'SELLER') {
            return next(new ErrorHandler(403, 'Unauthorized route - cannot access with Customers account'));
        }

        if ((req.originalUrl.includes('customers') || req.originalUrl.includes('products')) && user.role !== 'CUSTOMER') {
            return next(new ErrorHandler(403, 'Unauthorized route - cannot access with Sellers account'));
        }
        
        req.user = user;

        return next();
    } catch (error: any) {
        console.log(error);
        return next(new ErrorHandler(401, "Login required"));
    }
}

export default authMiddleware;