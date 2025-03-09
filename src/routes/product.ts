import { Router } from "express";
import { minimalRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import productController from "../controllers/product";

const productRouter = Router();

productRouter.route('/products').get(minimalRateLimiter, authMiddleware, productController.getAllProducts);
productRouter.route('/products/:productId').get(minimalRateLimiter, authMiddleware, productController.getSingleProduct);
productRouter.route('/products/:productId/reviews').get(minimalRateLimiter, authMiddleware, productController.getProductReviews);

export default productRouter;
