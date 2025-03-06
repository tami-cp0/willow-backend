import { Response, Request, NextFunction } from 'express';
import prisma from '../app';
import { ErrorHandler } from '../utils/errorHandler';
import validateUpdateSellerDto from '../dtos/seller/updateProfile.dto';
import validateGetOrdersDto from '../dtos/seller/getOrders.dto';
import validateGetOrderDto from '../dtos/seller/getOrder.dto';
import validateUpdateOrderStatusDto from '../dtos/seller/updateOrderStatus.dto';
import validateGetProductsDto from '../dtos/seller/getProducts.dto';
import validateCreateProductDto from '../dtos/seller/createProduct.dto';
import generateProductEmbedding from '../utils/dataEmbedding';
import { ApprovalStatus, Prisma } from '@prisma/client';
import vetProduct from '../utils/vetProduct';
import validateGetProductDto from '../dtos/seller/getProduct.dto';
import validateDeleteProductDto from '../dtos/seller/deleteProductDto';

class sellerController {
	static async getSeller(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.sellerId;
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
					conversations: {
						include: {
							messages: true,
						},
					},
				},
			});

			if (!user) {
				return next(new ErrorHandler(404, 'Seller not found'));
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

			const avatar = req.file ? JSON.stringify(req.file) : undefined;

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
			const limit = Number(req.query.limit as string) || 10;
			const skip = (page - 1) * limit;
			const status = req.query.status as string;

			const where: Record<string, any> = { sellerId: req.params.userId };
			if (status) {
				where.approvalStatus = status;
			}

			const [products, total] = await prisma.$transaction([
				prisma.product.findMany({
					where,
					skip,
					take: limit,
					include: { reviews: true }
				}),
				prisma.product.count({ where }),
			]);

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

			const uploadedFiles = req.files as Express.MulterS3.File[];

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

			const images = uploadedFiles
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

			const scoreMatch = vetResponse.match(
				/Sustainability Score.*?:\s*(\d{1,3})/
			);
			const tagMatch = vetResponse.match(
				/Sustainability Tag.*?:\s*(.+?)\n/
			);
			const explanationMatch = vetResponse.match(
				/Explanation.*?:\s*([\s\S]+)/
			);

			const sustainabilityScore = scoreMatch
				? scoreMatch[1].trim()
				: null;
			const sustainabilityTag = tagMatch ? tagMatch[1].trim() : null;
			const sustainabilityScoreReason = explanationMatch
				? explanationMatch[1].trim()
				: null;

			if (sustainabilityScoreReason === 'Inconclusive') {
				res.status(200).json({
					status: 'success',
					message:
						'Thank you for your submission. Based on our initial assessment, the available data was insufficient for a definitive sustainability evaluation. We invite you to apply for extended vetting, which provides an extended in-person review to help determine if your product meets our sustainability criteria for listing',
				});
			} else {
				let message =
					'Congratulations! Your product has met our sustainability criteria and has been approved for listing on our eco-friendly marketplace. Thank you for contributing to a more responsible and sustainable future.';
				let approvalStatus: ApprovalStatus = 'APPROVED';
				if (Number(sustainabilityScore) < 50) {
					approvalStatus = 'REJECTED';
					message =
						'Thank you for your submission. Unfortunately, after a comprehensive sustainability evaluation, your product did not meet our minimum standards and will not be listed. Please review our guidelines for further improvements and consider resubmitting in the future.';
				}

				product = {
					...product,
					sustainabilityTag,
					sustainabilityScore,
					sustainabilityScoreReason,
					approvalStatus,
				};

				const embedding = generateProductEmbedding(product);

				await prisma.$executeRawUnsafe(
					`
					UPDATE "products"
					SET 
						"embedding" = $1,
						"sustainability_score" = $2,
						"sustainability_score_reason" = $3,
						"sustainability_tag" = $4,
						"approval_status" = $5
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
					data: product,
				});
			}
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
				reviews: true
			}
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

	  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
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
}

export default sellerController;
