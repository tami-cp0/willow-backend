import { Response, Request, NextFunction } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import validateGetCustomerDto from "../dtos/customer/getCustomer.dto";
import prisma from "../app";
import validateUpdateCustomerProfileDto from "../dtos/customer/updateProfile.dto";
import validateGetCartDto from "../dtos/customer/getCart.dto";
import validatePutCartItemDto from "../dtos/customer/putCartItem.dto";
import validateDeleteCartItemDto from "../dtos/customer/deleteCartItem.dto";
import validateLikeProductDto from "../dtos/customer/getLikedProducts.dto";

export default class customerController {
    static async getCustomer(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetCustomerDto(req);
          const { userId } = req.params;
    
          const customer = await prisma.customer.findUnique({
            where: { userId },
            include: {
              user: true,
              cart: true,
              recommendations: {
                include: {
                    product: true
                }
              },
              lastViewed: {
                include: {
                    product: true
                }
              },
              AIChats: {
                include: {
                    messages: true
                }
              },
            },
          });
    
          if (!customer) {
            throw new ErrorHandler(404, 'Customer not found');
          }
    
          res.status(200).json({
            status: 'success',
            data: customer,
          });
        } catch (error) {
          next(error);
        }
      }

      static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
          await validateUpdateCustomerProfileDto(req);
          
          const { firstname, lastname, address } = req.body;
          const userId = req.params.userId;
          
          const user = await prisma.customer.update({
            where: { userId },
            data: {
              firstname,
              lastname,
              address,
            },
            include: {
              user: true,
            },
          });
          
          res.status(200).json({
            status: 'success',
            data: user,
          });
        } catch (error) {
          next(error);
        }
      }

      static async getCart(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetCartDto(req);
          const { userId } = req.params;
          
          const cart = await prisma.cart.findUnique({
            where: { customerId: userId },
            include: {
              cartItems: {
                include: {
                  product: true,
                },
              },
            },
          });
          
          // If no cart exists, return an empty cart structure.
          if (!cart) {
            res.status(200).json({
              status: 'success',
              data: { cartItems: [] },
            });
          } else {
            res.status(200).json({
              status: 'success',
              data: cart,
            });
          }
        } catch (error) {
          next(error);
        }
      }

      static async upsertCartItem(req: Request, res: Response, next: NextFunction) {
        try {
          await validatePutCartItemDto(req);
          
          const { userId, productId } = req.params;
          const { quantity } = req.body;
    
          // Upsert the cart item using the composite unique constraint ([cartId, productId]).
          const cartItem = await prisma.cartItem.upsert({
            where: {
              cartId_productId: {
                cartId: userId,
                productId,
              },
            },
            update: { quantity },
            create: {
              cartId: userId,
              productId,
              quantity,
            },
          });
    
          res.status(200).json({
            status: 'success',
            data: cartItem,
          });
        } catch (error) {
          next(error);
        }
      }

      static async deleteCartItem(req: Request, res: Response, next: NextFunction) {
        try {
          await validateDeleteCartItemDto(req);
          const { userId, productId } = req.params;
    
          // Delete the cart item using the composite unique key.
          await prisma.cartItem.delete({
            where: {
              cartId_productId: {
                cartId: userId,
                productId,
              },
            },
          });
    
          res.status(204).end();
        } catch (error) {
          next(error);
        }
      }

      static async likeProduct(req: Request, res: Response, next: NextFunction) {
        try {
          await validateLikeProductDto(req);
          const { userId } = req.params;
          const { productId } = req.body;
    
          // Ensure product exists
          const product = await prisma.product.findUnique({
            where: { id: productId },
          });
          if (!product) {
            throw new ErrorHandler(404, 'Product not found');
          }
    
          // Upsert liked product
          await prisma.likedProduct.upsert({
            where: { customerId_productId: { customerId: userId, productId } },
            update: { updatedAt: new Date() }, // Updates timestamp if already liked
            create: { customerId: userId, productId },
          });
    
          res.status(201).json({
            status: 'success',
            message: 'Product liked successfully',
          });
        } catch (error) {
          next(error);
        }
      }
}
