import { Response, Request, NextFunction } from "express";
import prisma from "../app";
import bcrypt from 'bcryptjs';
import { sendEmail } from "../utils/sendEmails";
import validateCreateUserDto from "../dtos/user/createUser.dto";

class userController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
          await validateCreateUserDto(req);
      
          const { email, password, role, businessName, firstname, lastname, address } = req.body;
      
          const newUser = await prisma.user.create({
            data: {
              email,
              password: await bcrypt.hash(password, 10),
              role,
              ...(role === 'CUSTOMER' && { 
                customer: { create: { firstname, lastname } } 
              }),
              ...(role === 'SELLER' && { 
                seller: { create: { businessName } } 
              }),
            },
            include: {
              customer: true,
            }
          });
      
          if (role === 'CUSTOMER' && newUser.customer) {
            await Promise.all([
                prisma.cart.create({
                    data: {
                      customerId: newUser.customer.userId
                    }
                }),
                prisma.aIChat.create({
                    data: {
                      customerId: newUser.customer.userId
                    }
                })
            ]);
          }
      
          sendEmail('otp', email);
      
          res.status(201).json({
            status: 'success',
            message: 'An OTP has been sent to your email'
          });
        } catch (error) {
          next(error);
        }
      }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await prisma.user.delete({
                where: {
                    id: req.user.id
                }
            })

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
          const user = req.user;
    
          res.status(200).json({
            status: 'success',
            data: user,
          });
        } catch (error) {
          next(error);
        }
    }
}

export default userController;
