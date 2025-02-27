import { Response, Request, NextFunction } from "express";
import prisma from "../app";
import bcrypt from 'bcryptjs';
import { otpEmailTemplate, sendEmail } from "../utils/emails";
import validateCreateUserDto from "../dtos/user/createUser.dto";
import { ErrorHandler } from "../utils/errorHandler";
import { Seller, User } from "@prisma/client";

class userController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            await validateCreateUserDto(req);

            const { email, password, role, businessName, firstname, lastname, address } = req.body;
    
            await prisma.user.create({
                data: {
                    email,
                    password: await bcrypt.hash(password, 10),
                    role,
                    ...(role === 'CUSTOMER' && { customer: { create: { firstname, lastname } } }),
                    ...(role === 'SELLER' && { seller: { create: { businessName } } }),
                },
            });

            sendEmail('otp', otpEmailTemplate, email);

            res.status(201).json({
                status: 'success',
                message: 'An OTP has been sent to your email'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.sellerId;
            if (!userId) {
            return next(new ErrorHandler(400, 'Seller ID is required'));
            }

            const user = await prisma.seller.findUnique({
                where: {
                    userId
                },
                include: {
                    sales: true,
                    products: {
                        include: {
                            reviews: true
                        }
                    },
                    conversations: {
                        include: {
                            messages: true
                        }
                    }
                }
            });

            if (!user) {
                return next(new ErrorHandler(404, "Seller not found"));
            }

            res.status(200).json({
                status: 'success',
                data: user
            })
            
        } catch (error) {
            next(error);
        }
    }

    // static async updateSeller(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const userId = req.params.sellerId;
    //         if (!userId) {
    //         return next(new ErrorHandler(400, 'Seller ID is required'));
    //         }

    //         const user = await prisma.seller.findUnique({
    //             where: {
    //                 userId
    //             },
    //             include: {
    //                 sales: true,
    //                 products: {
    //                     include: {
    //                         reviews: true
    //                     }
    //                 },
    //                 conversations: {
    //                     include: {
    //                         messages: true
    //                     }
    //                 }
    //             }
    //         });

    //         if (!user) {
    //             return next(new ErrorHandler(404, "Seller not found"));
    //         }

    //         res.status(200).json({
    //             status: 'success',
    //             data: user
    //         })
            
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

export default userController;
