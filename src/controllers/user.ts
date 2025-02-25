import { config } from "dotenv";
import { Response, Request, NextFunction } from "express";
import prisma from "../app";
import bcrypt from 'bcryptjs';
import { otpEmailTemplate, sendEmail } from "../utils/emails";
import cache from "../utils/cache";
import validateCreateUserDto from "../dtos/user/createUser.dto";
import validateVerifyAccountDto from "../dtos/user/verifyAccount.dto";
import { ErrorHandler } from "../utils/errorHandler";

config()

class userController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            await validateCreateUserDto(req);

            const { email, password, role, storename, firstname, lastname, address } = req.body;
    
            await prisma.user.create({
                data: {
                    email,
                    password: await bcrypt.hash(password, 10),
                    role,
                    ...(role === 'CUSTOMER' && { customer: { create: { firstname, lastname } } }),
                    ...(role === 'SELLER' && { seller: { create: { storename } } }),
                },
            });

            sendEmail(otpEmailTemplate, email);

            res.status(201).json({
                status: 'success',
                message: 'An OTP has been sent to your email'
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyAccount(req: Request, res: Response, next: NextFunction) {
        try {
            await validateVerifyAccountDto(req);

            const { email, otp } = req.body;

            if (!(await cache.isOtpValid(email, otp))) {
                throw new ErrorHandler(401, 'Invalid OTP');
            }

            const user = await prisma.user.update({
                where: {
                    email
                },
                data: {
                    isVerified: true,
                    lastLoggedIn: new Date()
                },
                include: {
                    seller: true,
                    customer: true,
                },
            });

            // set jwt cookie
            // maybe move this to under auth

            res.status(201).json({
                status: 'success',
                message: 'Successfully logged in',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

}

export default userController;
