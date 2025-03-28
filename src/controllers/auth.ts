import { config } from "dotenv";
import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from "../app";
import cache from "../utils/cache";
import validateVerifyAccountDto from "../dtos/auth/verifyAccount.dto";
import { ErrorHandler } from "../utils/errorHandler";
import validateResendOtpDto from "../dtos/auth/resendOtp.dto";
import { sendEmail } from "../utils/sendEmails";
import { CustomJwtPayload } from "../interfaces";
import validateLoginDto from "../dtos/auth/login.dto";
import { User } from "@prisma/client";
import validateForgotPasswordDto from "../dtos/auth/forgotPassword.dto";
import validateResetPasswordDto from "../dtos/auth/resetPassword.dto";
import { deleteJob, getJob, scheduleRecommendationUpdates } from "../utils/scheduleRecommendationsUpdates";

config();

export default class authController {
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
                { expiresIn: '12h' }
            );

            const refreshToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '12h' }
            );

            await Promise.all([
                cache.storeUser(user),
                prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken: refreshToken },
                })
            ]);

            if (user.role === 'CUSTOMER') {
                let job = getJob(user.id);
                if (job) {
                    job.start()
                } else {
                    job = await scheduleRecommendationUpdates(user.id);
                    job.start()
                }
            }

            res.cookie('accessToken', accessToken, {
                maxAge: 12 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }); // 12 hours

            res.cookie('refreshToken', refreshToken, {
                maxAge: 12 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                path: '/api/v1/auth/refresh',
                sameSite: 'none'
            }); // 12 hours

            const { refreshToken: _, password: __, lastKnownIp: ___, ...sanitizedUser } = user;
            res.status(200).json({
                status: 'success',
                message: 'Successfully logged in',
                data: { user: sanitizedUser, accessToken, refreshToken }
            });
        } catch (error) {
            next(error);
        }
    }

    static async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            await validateResendOtpDto(req);

            const { email } = req.body;

            sendEmail('otp', email);

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

            if (!user.isVerified) return next(new ErrorHandler(403, "Account is not verified"));

            // logout user from other sessions.
            await Promise.all([
                prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken: null }
                }),
                cache.removeUser(user.id)
            ]);

            const payload: CustomJwtPayload = {
                id: user.id, role: user.role
            };

            const accessToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '12h' }
            );

            const refreshToken: string = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '12h' }
            );

            let data: any = { refreshToken, lastLoggedIn: new Date() };

            if (req.ip && user.lastKnownIp && req.ip !== user.lastKnownIp) {
                sendEmail('login_location', email, req.ip);

                data['lastKnownIp'] = req.ip;
            }

            await Promise.all([
                cache.storeUser(user),
                prisma.user.update({
                    where: { email },
                    data
                })
            ]);

            if (user.role === 'CUSTOMER') {
                let job = getJob(user.id);
                if (job) {
                    job.start()
                } else {
                    job = await scheduleRecommendationUpdates(user.id);
                    job.start()
                }
            }

            res.cookie('accessToken', accessToken, {
                maxAge: 12 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }); // 12 hours

            res.cookie('refreshToken', refreshToken, {
                maxAge: 12 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                path: '/api/v1/auth/refresh',
                sameSite: 'none'
            }); // 12 hours

            const { refreshToken: _, password: __, lastKnownIp: ___, ...sanitizedUser } = user;
            res.status(200).json({
                status: 'success',
                message: 'Successfully logged in',
                data: { user: sanitizedUser, accessToken, refreshToken }
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

            if (req.user.role === 'CUSTOMER') {
                let job = getJob(req.user.id);
                if (job) {
                    job.stop()
                }
            }
    
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
      
          const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '12h' });
      
          await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
          });          
      
          const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '12h' });
      
          res.cookie('accessToken', newAccessToken, {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
          }); // 12 hours

          res.cookie('refreshToken', newRefreshToken, {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            path: '/api/v1/auth/refresh',
            sameSite: 'none'
          }); // 12 hours
      
          res.status(200).json({
            status: 'success',
            data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
          });
        } catch (error) {
          return next(error);
        }
    }

    static async forgotPassword(req: Request, res: Response, next: NextFunction) {
		try {
            await validateForgotPasswordDto(req);

		    const email= req.body.email;

			const resetToken: string = jwt.sign(
				{ email, reset: true },
				process.env.JWT_SECRET as string,
				{ expiresIn: '10min' }
			);

            sendEmail('password_reset', email, '', resetToken);

			res.status(200).json({
				status: 'success',
				message: 'A password reset link has been sent to your email',
                data: resetToken
			});
		} catch (error) {
			return next(error);
		}
	}

    static async resetPassword(req: Request, res: Response, next: NextFunction) {
		try {
            await validateResetPasswordDto(req);

		    const { newPassword } = req.body;

            const resetToken = req.query.resetToken as string;

            if (!resetToken) {
                return next(new ErrorHandler(400, 'resetToken is required'));
            }

            const decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string, { ignoreExpiration: true }) as CustomJwtPayload;

			await prisma.user.update({
                where: {
                    email: decoded.email
                },
                data: { password: await bcrypt.hash(newPassword, 10), refreshToken: null }
            });

			res.status(200).json({
				status: 'success',
				message: 'Password has been successfully reset'
			});
		} catch (error) {
			return next(error);
		}
	}
}
