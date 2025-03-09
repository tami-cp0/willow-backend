import { Response, Request, NextFunction } from 'express';
import prisma from '../app';
import { ErrorHandler } from '../utils/errorHandler';
import validateGetAllProductsDto from '../dtos/product/getProducts.dto';
import validateGetSingleProductDto from '../dtos/product/getProduct.dto';
import validateGetProductReviewsDto from '../dtos/product/getProductReviews.dto';

class productController {
    static async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetAllProductsDto(req);
    
          const page = Number(req.query.page as string) || 1;
          const limit = Number(req.query.limit as string) || 20;
          const skip = (page - 1) * limit;
          const status = req.query.status as string;
    
          const where: Record<string, any> = {};
          if (status) {
            where.approvalStatus = status;
          }
    
          const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
              where,
              skip,
              take: limit,
              include: { reviews: true, seller: true }
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

    static async getSingleProduct(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetSingleProductDto(req);
          const { productId } = req.params;
    
          const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { reviews: true , seller: true }
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

    static async getProductReviews(req: Request, res: Response, next: NextFunction) {
        try {
          await validateGetProductReviewsDto(req);
          const { productId } = req.params;
    
          // Retrieve all reviews for the given product
          const reviews = await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: { customer: true }
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
          const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
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

export default productController;
