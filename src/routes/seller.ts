import { Router } from "express";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import sellerController from "../controllers/seller";
import { upload } from "../middlewares/upload";

const sellerRouter = Router();


sellerRouter.route('/sellers/:userId').get(minimalRateLimiter, authMiddleware, sellerController.getSeller);
sellerRouter.route('/sellers/:userId/update-profile').patch(moderateRateLimiter, authMiddleware, upload.single('avatar'), sellerController.updateProfile);

sellerRouter.route('/sellers/:userId/orders').get(minimalRateLimiter, authMiddleware, sellerController.getOrders); // pagination; optional queries NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
sellerRouter.route('/sellers/:userId/orders/:orderId').get(minimalRateLimiter, authMiddleware, sellerController.getOrder);
sellerRouter.route('/sellers/:userId/orders/:orderId/update-status').patch(minimalRateLimiter, authMiddleware, sellerController.updateOrderStatus);

sellerRouter.route('/sellers/:userId/products').get(minimalRateLimiter, authMiddleware, sellerController.getProducts); // pagination; optional queries PENDING, APPROVED, REJECTED
sellerRouter.route('/sellers/:userId/products').post(strictRateLimiter, authMiddleware, upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]), sellerController.createProduct);
sellerRouter.route('/sellers/:userId/products/productId').get(minimalRateLimiter, authMiddleware, sellerController.getProduct);
sellerRouter.route('/sellers/:userId/products/productId').delete(moderateRateLimiter, authMiddleware, sellerController.deleteProduct);

sellerRouter.route('/sellers/:userId/conversations').get();
sellerRouter.route('/sellers/:userId/conversations/conversationId').get();
sellerRouter.route('/sellers/:userId/conversations/conversationId/messages').post();
sellerRouter.route('/sellers/:userId/conversations/conversationId/messages').get();

export default sellerRouter;
