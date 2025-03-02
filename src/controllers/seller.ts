import { Response, Request, NextFunction } from "express";
import prisma from "../app";
import { ErrorHandler } from "../utils/errorHandler";
import { validateUpdateSellerDto } from "../dtos/seller/updateProfile";
import validateGetOrdersDto from "../dtos/seller/getOrders.dto";
import validateGetOrderDto from "../dtos/seller/getOrder.dto";
import validateUpdateOrderStatusDto from "../dtos/seller/updateOrderStatus.dto";
import { SellerStatus } from "@prisma/client";

class sellerController {
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
                    orders: true,
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

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            await validateUpdateSellerDto(req);

            const avatar = req.file ? JSON.stringify(req.file) : undefined;

            const { businessName, bio } = req.body;

            const user = await prisma.seller.update({
                where: {
                    userId: req.user.id
                },
                data: {
                    avatar, businessName, bio
                }
            });

            res.status(200).json({
                status: 'success',
                data: user
            }); 
        } catch (error) {
            next(error);
        }
    }

    static async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetOrdersDto(req);
      
          const status = req.query.status as string;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const skip = (page - 1) * limit;
      
          const where: Record<string, any> = { sellerId: req.user.id };
          if (status) {
            where.sellerStatus = status;
          }
      
          const [orders, total] = await prisma.$transaction([
            prisma.orderItem.findMany({
              where,
              skip,
              take: limit,
            }),
            prisma.orderItem.count({ where }),
          ]);
      
          res.status(200).json({
            status: 'success',
            data: orders,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
          });
        } catch (error) {
          next(error);
        }
      }
      
      static async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetOrderDto(req);
    
          const orderItem = await prisma.orderItem.findFirst({
            where: {
              id: req.params.orderId,
              sellerId: req.user.id,
            },
            include: {
              product: true,
            },
          });
    
          if (!orderItem) {
            throw new ErrorHandler(404, 'Order not found');
          }
    
          res.status(200).json({
            status: 'success',
            data: orderItem,
          });
        } catch (error) {
          next(error);
        }
      }

      static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
        try {
          await validateUpdateOrderStatusDto(req);

          let data: any = { SellerStatus: req.body.status };
          if (req.body.status === 'CANCELLED') {
            data.sellerCancelMessage = req.body.cancelMessage
          }
    
          const orderItem = await prisma.orderItem.update({
            where: {
              id: req.params.orderId,
              sellerId: req.user.id,
            },
            data
          });
    
          if (!orderItem) {
            throw new ErrorHandler(404, 'Order not found');
          }
    
          res.status(200).json({
            status: 'success',
            data: orderItem,
          });
        } catch (error) {
          next(error);
        }
      }
}

export default sellerController;
