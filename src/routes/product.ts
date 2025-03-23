import { Router } from "express";
import { minimalRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import productController from "../controllers/product";

const productRouter = Router();

productRouter.route('/').get(minimalRateLimiter, productController.getAllProducts);
productRouter.route('/:productId').get(minimalRateLimiter, authMiddleware, productController.getSingleProduct);
productRouter.route('/:productId/reviews').get(minimalRateLimiter, authMiddleware, productController.getProductReviews);

export default productRouter;
