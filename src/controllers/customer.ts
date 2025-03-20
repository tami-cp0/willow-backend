import { Response, Request, NextFunction } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import validateGetCustomerDto from '../dtos/customer/getCustomer.dto';
import prisma from '../app';
import validateUpdateCustomerProfileDto from '../dtos/customer/updateProfile.dto';
import validateGetCartDto from '../dtos/customer/getCart.dto';
import validatePutCartItemDto from '../dtos/customer/putCartItem.dto';
import validateDeleteCartItemDto from '../dtos/customer/deleteCartItem.dto';
import validateLikeProductDto from '../dtos/customer/getLikedProducts.dto';
import validateGetLikedProductsDto from '../dtos/customer/getLikedProducts.dto';
import validateDeleteLikedProductDto from '../dtos/customer/deleteLikedProduct.dto';
import validateGetLastViewedProductsDto from '../dtos/customer/getLastViewed.dto';
import validateGetCustomerOrdersDto from '../dtos/customer/getOrders.dto';
import validateGetCustomerOrderDto from '../dtos/customer/getOrder.dto';
import validateDeleteReviewDto from '../dtos/customer/deleteReview.dto';
import validateCreateReviewDto from '../dtos/customer/postReview.dto';
import { getSignedUrlForFile } from '../config/r2Config';
import validateGetConversationsDto from '../dtos/customer/getConversations.dto';
import validateGetConversationWithMessagesDto from '../dtos/customer/getConversationWithMessages.dto';
import validateGetAIChatDto from '../dtos/customer/getAIChat.dto';
import validatePostAIChatDto from '../dtos/customer/postAIChat.dto';
import processUserQuery from '../utils/queryAI';

type Image = {
	key: string;
	url: string;
	size: number;
	mimetype: string;
	originalname: string;
};

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
							product: true,
						},
					},
					lastViewed: {
						include: {
							product: true,
						},
					},
					AIChats: true,
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

	static async updateProfile(
		req: Request,
		res: Response,
		next: NextFunction
	) {
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

	static async upsertCartItem(
		req: Request,
		res: Response,
		next: NextFunction
	) {
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

	static async deleteCartItem(
		req: Request,
		res: Response,
		next: NextFunction
	) {
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

			res.status(200).json({
				status: 'success',
				message: 'Product removed from cart successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	static async likeProduct(req: Request, res: Response, next: NextFunction) {
		try {
			await validateLikeProductDto(req);
			const { userId, productId } = req.params;

			const product = await prisma.product.findUnique({
				where: { id: productId },
			});
			if (!product) {
				throw new ErrorHandler(404, 'Product not found');
			}

			// Upsert liked product. If it exists, the updatedAt timestamp is auto-updated.
			await prisma.likedProduct.upsert({
				where: {
					customerId_productId: { customerId: userId, productId },
				},
				update: {},
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

	static async getLikedProducts(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetLikedProductsDto(req);
			const { userId } = req.params;

			const likedProducts = await prisma.likedProduct.findMany({
				where: { customerId: userId },
				include: { product: { include: { seller: true } } },
				orderBy: { updatedAt: 'desc' },
			});

			res.status(200).json({
				status: 'success',
				data: likedProducts,
			});
		} catch (error) {
			next(error);
		}
	}

	static async deleteLikedProduct(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateDeleteLikedProductDto(req);
			const { userId, productId } = req.params;

			const likedProduct = await prisma.likedProduct.findUnique({
				where: {
					customerId_productId: { customerId: userId, productId },
				},
			});
			if (!likedProduct) {
				throw new ErrorHandler(404, 'Liked product not found');
			}

			await prisma.likedProduct.delete({
				where: {
					customerId_productId: { customerId: userId, productId },
				},
			});

			res.status(200).json({
				status: 'success',
				message: 'Product removed from liked products successfully',
			});
		} catch (error) {
			next(error);
		}
	}

	static async getLastViewed(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetLastViewedProductsDto(req);
			const { userId } = req.params;

			const lastViewedProducts = await prisma.lastViewed.findMany({
				where: { customerId: userId },
				include: { product: { include: { seller: true } } },
				orderBy: { viewedAt: 'desc' },
				take: 5,
			});

			res.status(200).json({
				status: 'success',
				data: lastViewedProducts,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getOrders(req: Request, res: Response, next: NextFunction) {
		try {
			await validateGetCustomerOrdersDto(req);
			const { userId } = req.params;
			const transactionStatus = req.query.transactionStatus as
				| string
				| undefined;

			const where: any = { customerId: userId };
			if (transactionStatus) {
				where.transaction = { status: transactionStatus };
			}

			const orders = await prisma.order.findMany({
				where,
				include: {
					transaction: true,
					orderItems: { include: { product: true, seller: true } },
				},
				orderBy: { createdAt: 'desc' },
			});

			res.status(200).json({
				status: 'success',
				data: orders,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getOrder(req: Request, res: Response, next: NextFunction) {
		try {
			await validateGetCustomerOrderDto(req);
			const { userId, orderId } = req.params;

			const order = await prisma.order.findUnique({
				where: {
					id: orderId,
					customerId: userId,
				},
				include: {
					transaction: true,
					orderItems: { include: { product: true, seller: true } },
				},
			});

			if (!order) {
				throw new ErrorHandler(404, 'Order not found');
			}

			res.status(200).json({
				status: 'success',
				data: order,
			});
		} catch (error) {
			next(error);
		}
	}

	static async deleteReview(req: Request, res: Response, next: NextFunction) {
		try {
			await validateDeleteReviewDto(req);
			const { userId, productId, reviewId } = req.params;

			const review = await prisma.review.findUnique({
				where: { id: reviewId },
			});

			if (
				!review ||
				review.customerId !== userId ||
				review.productId !== productId
			) {
				throw new ErrorHandler(404, 'Review not found');
			}

			await prisma.review.delete({
				where: { id: reviewId },
			});

			res.status(204).end();
		} catch (error) {
			next(error);
		}
	}

	static async createReview(req: Request, res: Response, next: NextFunction) {
		try {
			await validateCreateReviewDto(req);
			const { userId, productId } = req.params;
			const { orderId, rating, comment } = req.body;

			const orderItem = await prisma.orderItem.findFirst({
				where: {
					orderId,
					productId,
					order: { customerId: userId },
					customerStatus: 'DELIVERED',
				},
			});

			if (!orderItem) {
				throw new ErrorHandler(
					400,
					'You can only review products from orders that have been delivered.'
				);
			}

			const review = await prisma.review.create({
				data: {
					productId,
					customerId: userId,
					rating,
					comment,
				},
			});

			res.status(201).json({
				status: 'success',
				data: review,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getConversations(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetConversationsDto(req);
			const { userId } = req.params;

			const conversations = await prisma.conversation.findMany({
				where: { customerId: userId },
				include: {
					customer: true,
					seller: true,
					messages: {
						orderBy: { createdAt: 'desc' },
						take: 1,
					},
				},
				orderBy: { updatedAt: 'desc' },
			});

			res.status(200).json({
				status: 'success',
				data: conversations,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getConversationWithMessages(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetConversationWithMessagesDto(req);
			const { conversationId, userId } = req.params;

			const conversation = await prisma.conversation.findFirst({
				where: {
					id: conversationId,
					customerId: userId,
				},
				include: {
					customer: true,
					seller: true,
					messages: {
						orderBy: { createdAt: 'asc' },
					},
				},
			});

			if (!conversation) {
				throw new ErrorHandler(404, 'Conversation not found');
			}

			// Process each message: sign all image URLs
			conversation.messages = await Promise.all(
				conversation.messages.map(async (message) => {
					// Assuming message.images is an array of images, each with a "key" property
					const images = message.images as Image[];
					if (images && images.length) {
						message.images = await Promise.all(
							images.map(async (image) => {
								image.url = await getSignedUrlForFile(
									'messagemedia',
									image.key,
									1
								);
								return image;
							})
						);
					}
					return message;
				})
			);

			res.status(200).json({
				status: 'success',
				data: conversation,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getAIChat(req: Request, res: Response, next: NextFunction) {
		try {
			await validateGetAIChatDto(req);
			const { userId } = req.params;

			let AIChat = await prisma.aIChat.findUnique({
				where: {
					customerId: userId
				}
			});

			if (!AIChat) {
				AIChat = await prisma.aIChat.create({
                    data: {
                      customerId: userId
                    }
                });
			}

			// Remove the first JSON element from the history array which contains system instructions
			const modifiedHistory =
				AIChat.history && AIChat.history.length > 0
					? AIChat.history.slice(1)
					: [];

			AIChat.history = modifiedHistory;

			res.status(200).json({
				status: 'success',
				data:  AIChat,
			});
		} catch (error) {
			next(error);
		}
	}

	static async postAIChat(req: Request, res: Response, next: NextFunction) {
		try {
			await validatePostAIChatDto(req);
			const { userId } = req.params;
			const { userQuery } = req.body;

			const { text, history, instruction } = await processUserQuery(
				userQuery,
				userId
			);

			const newHistoryEntryUser = {
				role: 'user',
				parts: [{ text: userQuery }],
			};
			const newHistoryEntryModel = {
				role: 'model',
				parts: [{ text }],
			};
			const updatedHistory = [
				...history,
				newHistoryEntryUser,
				newHistoryEntryModel,
			];

			// Ensure the system instruction is at the start of the history.
			if (
				!updatedHistory[0] ||
				updatedHistory[0].parts[0].text !== instruction.trim()
			) {
				updatedHistory.unshift({
					role: 'user',
					parts: [{ text: instruction.trim() }],
				});
			}

			await prisma.aIChat.update({
				where: { customerId: userId },
				data: { history: updatedHistory },
			});

			res.status(201).json({
				status: 'success',
				data: text,
			});
		} catch (error) {
			next(error);
		}
	}
}
