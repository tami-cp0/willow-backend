import { Response, Request, NextFunction } from 'express';
import prisma from '../app';
import { ErrorHandler } from '../utils/errorHandler';
import validateGetAllProductsDto from '../dtos/product/getProducts.dto';
import validateGetSingleProductDto from '../dtos/product/getProduct.dto';
import validateGetProductReviewsDto from '../dtos/product/getProductReviews.dto';
import generateProductEmbedding from '../utils/generateEmbedding';
import { Prisma } from '@prisma/client';

export default class productController {
	static async getAllProducts(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetAllProductsDto(req);

			const page = Number(req.query.page as string) || 1;
			const limit = Number(req.query.limit as string) || 20;
			const skip = (page - 1) * limit;
			const status = req.query.status;

			const { sellerId } = req.query;

			const where: Record<string, any> = {approvalStatus: 'APPROVED'};
			if (status) {
				where.approvalStatus = 'APPROVED';
			}

			if (sellerId) {
				where.sellerId = sellerId;
			}

			const [products, total] = await prisma.$transaction([
				prisma.product.findMany({
					where,
					skip,
					take: limit,
					include: { reviews: true, seller: true, orderItems: true },
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

	// NO DTO
	static async searchProducts(req: Request, res: Response, next: NextFunction) {
        const text = req.query.text as string;
        const page = Number(req.query.page as string) || 1;
        const limit = Number(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;
    
        if (!text) return next(new ErrorHandler(400, 'text is missing'));
    
        try {
            const embedding = await generateProductEmbedding(undefined, text);
    
            const embeddingVector = Prisma.sql`ARRAY[${Prisma.join(embedding)}]::vector`;
			
    
            const products = await prisma.$queryRaw`
				WITH ranked_products AS (
					SELECT id, name, description, images, in_stock, on_demand, category, options, price,
						sold_out, approval_status, packaging, 
						created_at, updated_at, end_of_life_info, sourcing, sustainability_score, 
						sustainability_score_reason, sustainability_tag, certification, seller_id,
						(1 - (embedding <=> ${embeddingVector}))::float AS similarity
					FROM products
					WHERE approval_status = 'APPROVED'::"ApprovalStatus"
					AND embedding IS NOT NULL
				)
				SELECT * FROM ranked_products
				WHERE similarity > 0.5
				ORDER BY similarity DESC
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

	static async getSingleProduct(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetSingleProductDto(req);
			const { productId } = req.params;

			const product = await prisma.product.findUnique({
				where: { id: productId, approvalStatus: 'APPROVED' },
				include: { reviews: true, seller: true, orderItems: true },
			});

			if (!product) {
				throw new ErrorHandler(404, 'Product not found');
			}

			const userId = req.user.id;

			if (req.user.role === 'CUSTOMER') {
				// if it has already been viewed then update the viewedAt otherwise cerate it
				await prisma.lastViewed.upsert({
					where: {
						customerId_productId: {
							customerId: userId,
							productId: productId,
						},
					},
					update: { viewedAt: new Date() },
					create: {
						customerId: userId,
						productId: productId,
					},
				});

				// After upserting, ensure there are no more than 5 records for this customer.
				const lastViewedRecords = await prisma.lastViewed.findMany({
					where: { customerId: userId },
					orderBy: { viewedAt: 'desc' },
				});

				if (lastViewedRecords.length > 5) {
					// Delete records beyond the 5 most recent ones.
					const recordsToDelete = lastViewedRecords.slice(5);
					await Promise.all(
						recordsToDelete.map((record) =>
							prisma.lastViewed.delete({
								where: {
									customerId_productId: {
										customerId: record.customerId,
										productId: record.productId,
									},
								},
							})
						)
					);
				}
			}

			res.status(200).json({
				status: 'success',
				data: product,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getProductReviews(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			await validateGetProductReviewsDto(req);
			const { productId } = req.params;

			// Retrieve all reviews for the given product
			const reviews = await prisma.review.findMany({
				where: { productId },
				orderBy: { createdAt: 'desc' },
				include: { customer: true },
			});

			// Calculate average rating
			const aggregateResult = await prisma.review.aggregate({
				_avg: { rating: true },
				where: { productId },
			});
			const averageRating = aggregateResult._avg.rating || 0;

			// Group reviews by rating to compute distribution
			const groupResult = await prisma.review.groupBy({
				by: ['rating'],
				_count: { rating: true },
				where: { productId },
			});

			// Initialize distribution object for ratings 1 through 5
			const ratingDistribution: { [key: number]: number } = {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
			};
			groupResult.forEach((group) => {
				ratingDistribution[group.rating] = group._count.rating;
			});

			res.status(200).json({
				status: 'success',
				data: {
					reviews,
					averageRating,
					ratingDistribution,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
