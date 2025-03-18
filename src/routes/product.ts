import { Router } from "express";
import { minimalRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import productController from "../controllers/product";

const productRouter = Router();

productRouter.route('/').get(minimalRateLimiter, productController.getAllProducts);
productRouter.route('/:productId').get(minimalRateLimiter, productController.getSingleProduct);
productRouter.route('/:productId/reviews').get(minimalRateLimiter, productController.getProductReviews);

export default productRouter;
