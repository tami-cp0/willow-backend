import { Response, Request, NextFunction } from 'express';
import prisma from '../app';
import { ErrorHandler } from '../utils/errorHandler';
import validateUpdateSellerDto from '../dtos/seller/updateProfile.dto';
import validateGetOrdersDto from '../dtos/seller/getOrders.dto';
import validateGetOrderDto from '../dtos/seller/getOrder.dto';
import validateUpdateOrderStatusDto from '../dtos/seller/updateOrderStatus.dto';
import validateGetProductsDto from '../dtos/seller/getProducts.dto';
import validateCreateProductDto from '../dtos/seller/createProduct.dto';
import generateProductEmbedding from '../utils/generateEmbedding';
import { ApprovalStatus, Prisma, Product } from '@prisma/client';
import vetProduct from '../utils/vetProduct';
import validateGetProductDto from '../dtos/seller/getProduct.dto';
import validateDeleteProductDto from '../dtos/seller/deleteProduct.dto';
import validateGetConversationsDto from '../dtos/seller/getConversations.dto';
import { getSignedUrlForFile } from '../config/r2Config';
import { sendEmail } from '../utils/sendEmails';
import validateGetConversationWithMessagesDto from '../dtos/seller/getConversationWithMessages.dto';

type Image = {
	key: string;
	url: string;
	size: number;
	mimetype: string;
	originalname: string;
};

export default class sellerController {
	static async getSeller(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.userId;
			if (!userId) {
				return next(new ErrorHandler(400, 'Seller ID is required'));
			}

			const user = await prisma.seller.findUnique({
				where: {
					userId,
				},
				include: {
					orders: true,
					products: {
						include: {
							reviews: true,
						},
					},
					conversations: true,
				},
			});

			if (!user) {
				return next(new ErrorHandler(404, 'Seller not found'));
			}

			let avatar = user?.avatar as Image;

			if (avatar) {
				avatar.url = await getSignedUrlForFile(
					'avatars',
					avatar.key,
					604800
				); // 7 days
				user.avatar = avatar;
			}

			res.status(200).json({
				status: 'success',
				data: user,
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
			await validateUpdateSellerDto(req);

			const file = req.file as Express.MulterS3.File;
			let avatar;
			if (req.file) {
				avatar = {
					key: file.key,
					url: file.location,
					size: file.size,
					mimetype: file.mimetype,
					originalname: file.originalname,
				};
			}

			const { businessName, bio } = req.body;

			const user = await prisma.seller.update({
				where: {
					userId: req.user.id,
				},
				data: {
					avatar,
					businessName,
					bio,
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

	static async getOrders(req: Request, res: Response, next: NextFunction) {
		try {
			await validateGetOrdersDto(req);

			const status = req.query.status as string;
			const page = Number(req.query.page as string) || 1;
			const limit = Number(req.query.limit as string) || 20;
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
					include: {
						product: true,
						order: { include: { transaction: true } },
					},
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
					order: { include: { transaction: true } },
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

	static async updateOrderStatus(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateUpdateOrderStatusDto(req);

			let data: any = { SellerStatus: req.body.status };
			if (req.body.status === 'CANCELLED') {
				data.sellerCancelMessage = req.body.cancelMessage;
			}

			const orderItem = await prisma.orderItem.update({
				where: {
					id: req.params.orderId,
					sellerId: req.user.id,
				},
				data,
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

	static async getProducts(req: Request, res: Response, next: NextFunction) {
		try {
			await validateGetProductsDto(req);

			const page = Number(req.query.page as string) || 1;
			const limit = Number(req.query.limit as string) || 20;
			const skip = (page - 1) * limit;
			const status = req.query.status as string;

			const where: Record<string, any> = { sellerId: req.params.userId };

			if (status && status !== 'OUT_OF_STOCK') {
				where.approvalStatus = status;
			}

			let [products, total] = await prisma.$transaction([
				prisma.product.findMany({
					where,
					skip,
					take: limit,
					include: { reviews: true, seller: true },
				}),
				prisma.product.count({ where }),
			]);

			if (status && status === 'OUT_OF_STOCK') {
				products = products.filter(
					(product: Product) => product.inStock === 0
				);
			}

			res.status(200).json({
				status: 'success',
				data: products,
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

	// NO DTO
	static async searchProducts(req: Request, res: Response, next: NextFunction) {
		const text = req.query.text as string;
		const userId = req.params.userId
		const approvalStatus = req.query.approvalStatus || 'APPROVED'; // Default to 'APPROVED'
		const page = Number(req.query.page as string) || 1;
		const limit = Number(req.query.limit as string) || 20;
		const offset = (page - 1) * limit;
	
		if (!userId) return next(new ErrorHandler(400, 'userId is missing'));
		if (!text) return next(new ErrorHandler(400, 'text is missing'));
	
		try {
			const embedding = await generateProductEmbedding(undefined, text);
	
			const embeddingVector = Prisma.sql`ARRAY[${Prisma.join(embedding)}]::vector`;
	
			const products = await prisma.$queryRaw`
				SELECT *, similarity
				FROM (
					SELECT *, (embedding <=> ${embeddingVector}) AS similarity
					FROM products
					WHERE approval_status = ${Prisma.sql`${approvalStatus}`}::"ApprovalStatus"
					AND seller_id = ${Prisma.sql`${userId}`}
				) sub
				ORDER BY similarity ASC
				LIMIT ${Prisma.sql`${limit}`}
				OFFSET ${Prisma.sql`${offset}`};
			`;

	
			res.status(200).json({
				status: 'success',
				data: products,
				pagination: {
					page,
					limit,
				},
			});
		} catch (error) {
			next(error);
		}
	}	

	static async createProduct(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateCreateProductDto(req);

			const sellerId = req.user.id;

			const {
				name,
				description,
				inStock,
				onDemand,
				category,
				options,
				price,
				sustainabilityFeatures,
				packaging,
				endOfLifeInfo,
				sourcing,
			} = req.body;

			// Ensuring correct type when handling req.files
			// Cast req.files as an object with string keys and file array values
			const uploadedFiles = Object.values(
				(req.files ?? {}) as {
					[field: string]: Express.MulterS3.File[];
				}
			).flat() as Express.MulterS3.File[];

			// Validate and map file to Image type
			const certificateFile = uploadedFiles.find(
				(file) => file.fieldname === 'certificate'
			);

			const certification = certificateFile
				? {
						key: certificateFile.key,
						url: `https://pub-98b899a5168d4e2285d560ccb413a7f5.r2.dev/${certificateFile.key}`,
						size: certificateFile.size,
						mimetype: certificateFile.mimetype,
						originalname: certificateFile.originalname,
						certifiedBy: req.body.certifiedBy,
				  }
				: Prisma.JsonNull;

			const images: Image[] = uploadedFiles
				.filter((file) => file.fieldname !== 'certificate')
				.map((file) => ({
					key: file.key,
					url: `https://pub-98b899a5168d4e2285d560ccb413a7f5.r2.dev/${file.key}`,
					size: file.size,
					mimetype: file.mimetype,
					originalname: file.originalname,
				}));

			let product = await prisma.product.create({
				data: {
					name,
					description,
					images,
					inStock,
					onDemand,
					category,
					options,
					price,
					sustainabilityFeatures,
					packaging,
					endOfLifeInfo,
					sourcing,
					certification,
					sellerId,
				},
			});

			const vetResponse: string = await vetProduct(product);
			console.log(vetResponse);

			const scoreMatch = vetResponse.match(
				/Sustainability Score:\s*(\d{1,3})/ // Matches the score, considering potential leading spaces
			);
			const tagMatch = vetResponse.match(
				/Sustainability Tag:\s*(\S+.*?)(\n|$)/ // Matches the tag, allowing non-space characters followed by the line break or end of input
			);
			const explanationMatch = vetResponse.match(
				/Explanation:\s*([\s\S]+?)\n+/ // Captures the explanation, allowing newlines and spaces
			);

			const sustainabilityScore = scoreMatch
				? scoreMatch[1].trim()
				: null;
			const sustainabilityTag = tagMatch ? tagMatch[1].trim() : null;
			const sustainabilityScoreReason = explanationMatch
				? explanationMatch[1].trim()
				: null;

			let message;
			let approvalStatus: ApprovalStatus = 'PENDING';
			let certificateExists = false;
			let embedding;

			if (sustainabilityScore === '0') {
				sendEmail({inconclusive: true}, req.user.email, '', '', product);
				message =
					'Thank you for your submission. Based on our initial assessment, the available data was insufficient for a definitive sustainability evaluation. We invite you to apply for extended vetting, which provides an extended in-person review to help determine if your product meets our sustainability criteria for listing';
			} else if (sustainabilityScore === '0.5') {
				sendEmail({mismatch: true}, req.user.email, '', '', product);
				message =
					'Thank you for your submission. However, our initial assessment identified a significant mismatch between the provided product description and the uploaded images. Due to this discrepancy, we are unable to evaluate the sustainability of your product. We recommend updating your listing with accurate details and images that align with the product description before resubmitting for review.';
				approvalStatus = 'REJECTED';
			} else {
				if (Number(sustainabilityScore) < 50) {
					sendEmail({rejection: true}, req.user.email, '', '', product);
					approvalStatus = 'REJECTED';
					message =
						'Thank you for your submission. Unfortunately, after a comprehensive sustainability evaluation, your product did not meet our minimum standards and will not be listed. Please review our guidelines for further improvements and consider resubmitting in the future.';
				} else {
					sendEmail({success: true}, req.user.email, '', '', product);
					message =
						'Congratulations! Your product has met our sustainability criteria and has been approved for listing on our eco-friendly marketplace. Thank you for contributing to a more responsible and sustainable future.';
					approvalStatus = 'APPROVED';
				}

				product = {
					...product,
					sustainabilityTag,
					sustainabilityScore,
					sustainabilityScoreReason,
					approvalStatus,
				};

				embedding = await generateProductEmbedding(product);

				if (certificateFile) {
					certificateExists = true; // for frontend
					approvalStatus = 'PENDING';
					message =
						"Thank you for your submission. Based on our assessment, we require 24 to 48 hours to verify the validity of your certificate. This process ensures your certification's credibility and product's alignment with our sustainability criteria for listing. We appreciate your patience and commitment to eco-conscious practices";
					// send email to admin
					sendEmail(
						'certificate',
						req.user.email as string,
						'',
						'',
						product
					);

					// send email to seller
					sendEmail({certificate: true}, req.user.email, '', '', product);
				}
			}

			console.log(sustainabilityScore, sustainabilityScoreReason, sustainabilityTag)

			await prisma.$executeRawUnsafe(
				`
			UPDATE "products"
			SET "embedding" = $1,
				"sustainability_score" = $2,
				"sustainability_score_reason" = $3,
				"sustainability_tag" = $4,
				"approval_status" = $5::"ApprovalStatus"
			WHERE "id" = $6
		  `,
				embedding,
				sustainabilityScore,
				sustainabilityScoreReason,
				sustainabilityTag,
				approvalStatus,
				product.id
			);

			res.status(200).json({
				status: 'success',
				message,
				certificateExists,
				data: product,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getProduct(req: Request, res: Response, next: NextFunction) {
		try {
			await validateGetProductDto(req);

			const { productId } = req.params;

			const product = await prisma.product.findUnique({
				where: {
					id: productId,
				},
				include: {
					reviews: true,
					seller: true,
				},
			});

			if (!product) {
				throw new ErrorHandler(404, 'Product not found');
			}

			res.status(200).json({
				status: 'success',
				data: product,
			});
		} catch (error) {
			next(error);
		}
	}

	static async deleteProduct(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateDeleteProductDto(req);

			const { userId, productId } = req.params;

			const product = await prisma.product.findFirst({
				where: {
					id: productId,
					sellerId: userId,
				},
			});

			if (!product) {
				throw new ErrorHandler(404, 'Product not found');
			}

			await prisma.product.delete({
				where: { id: productId },
			});

			res.status(204).end();
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
				where: { sellerId: userId },
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
					sellerId: userId,
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
}
