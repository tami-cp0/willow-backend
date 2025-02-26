import { config } from "dotenv";
import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../app";
import cache from "../utils/cache";
import validateVerifyAccountDto from "../dtos/auth/verifyAccount.dto";
import { ErrorHandler } from "../utils/errorHandler";
import validateResendOtpDto from "../dtos/auth/resendOtp.dto";
import { newLoginLocationEmailTemplate, otpEmailTemplate, sendEmail } from "../utils/emails";
import { CustomJwtPayload } from "../interfaces";
import validateLoginDto from "../dtos/auth/login.dto";
import { User } from "@prisma/client";

config();

class authController {
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

            const payload: CustomJwtPayload = {
                id: user.id, role: user.role
            };

            const accessToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '5min' }
            );

            const refreshToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            await Promise.all([
                cache.storeUser(user),
                prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken: refreshToken },
                })
            ]);

            res.cookie('accessToken', accessToken, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }); // 5min

            res.cookie('refreshToken', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                path: '/api/v1/auth/refresh',
                sameSite: 'none'
            }); // 7d

            const { refreshToken: _, password: __, lastKnownIp: ___, ...sanitizedUser } = user;
            res.status(200).json({
                status: 'success',
                message: 'Successfully logged in',
                data: sanitizedUser
            });
        } catch (error) {
            next(error);
        }
    }

    static async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            await validateResendOtpDto(req);

            const { email } = req.body;

            sendEmail('otp', otpEmailTemplate, email);

            res.status(200).json({
                status: 'success',
                message: 'An OTP has been sent to your email'
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            await validateLoginDto(req);

            const { email } = req.body;
    
            const user = await prisma.user.findUnique({
                where: {
                  email
                },
                include: {
                    seller: true,
                    customer: true,
                },
            }) as User;

            const payload: CustomJwtPayload = {
                id: user.id, role: user.role
            };

            const accessToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '5min' }
            );

            const refreshToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            let data: any = { refreshToken, lastLoggedIn: new Date() };

            if (req.ip !== user.lastKnownIp) {
                sendEmail('login_location', newLoginLocationEmailTemplate, email, req.ip);

                data['lastKnownIp'] = req.ip;
            }

            await Promise.all([
                cache.storeUser(user),
                prisma.user.update({
                    where: { email },
                    data
                })
            ]);

            res.cookie('accessToken', accessToken, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }); // 5min

            res.cookie('refreshToken', refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                path: '/api/v1/auth/refresh',
                sameSite: 'none'
            }); // 7d

            const { refreshToken: _, password: __, lastKnownIp: ___, ...sanitizedUser } = user;
            res.status(200).json({
                status: 'success',
                message: 'Successfully logged in',
                data: sanitizedUser
            });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken: string = req.cookies?.accessToken;
    
            await Promise.all([
                cache.blacklistAccessToken(req.user.id, accessToken),
                prisma.user.update({
                    where: { id: req.user.id },
                    data: { refreshToken: null }
                }),
                cache.removeUser(req.user.id)
            ]);
    
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    static async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
        try {
          const refreshToken = req.cookies?.refreshToken;
          if (!refreshToken) return next(new ErrorHandler(401, 'Login required'));
      
          const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as CustomJwtPayload;
      
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
          });
          if (!user) {
            return next(new ErrorHandler(404, "Accont does not exist"));
          }
      
          if (user.refreshToken !== refreshToken) {
            return next(new ErrorHandler(401, "Login required"));
          }
      
          const payload: CustomJwtPayload = { id: user.id, role: user.role };
      
          const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
      
          await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
          });          
      
          const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '5min' });
      
          res.cookie('accessToken', newAccessToken, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
          }); // 5 min

          res.cookie('refreshToken', newRefreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            path: '/api/v1/auth/refresh',
            sameSite: 'none'
          }); // 7d
      
          res.status(200).end();
        } catch (error) {
          return next(error);
        }
      }
}

export default authController;
