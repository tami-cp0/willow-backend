import { Router } from "express";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import sellerController from "../controllers/seller";
import { upload } from "../middlewares/upload";
// import PaymentController from "../controllers/payment";

const sellerRouter = Router();


sellerRouter.route('/:userId').get(minimalRateLimiter, sellerController.getSeller);
sellerRouter.route('/:userId/update-profile').patch(moderateRateLimiter, authMiddleware, upload.single('avatar'), sellerController.updateProfile);

sellerRouter.route('/:userId/orders').get(minimalRateLimiter, authMiddleware, sellerController.getOrders); // pagination; optional queries NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
sellerRouter.route('/:userId/orders/:orderId').get(minimalRateLimiter, authMiddleware, sellerController.getOrder);
sellerRouter.route('/:userId/orders/:orderId/update-status').patch(minimalRateLimiter, authMiddleware, sellerController.updateOrderStatus);

sellerRouter.route('/:userId/products').get(minimalRateLimiter, sellerController.getProducts); // pagination; optional queries PENDING, APPROVED, REJECTED
sellerRouter.route('/:userId/products').post(strictRateLimiter, authMiddleware, upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]), sellerController.createProduct);
sellerRouter.route('/:userId/products/:productId').get(minimalRateLimiter, sellerController.getProduct);
sellerRouter.route('/:userId/products/:productId').delete(moderateRateLimiter, authMiddleware, sellerController.deleteProduct);

sellerRouter.route('/:userId/conversations').get(minimalRateLimiter, authMiddleware, sellerController.getConversations);
sellerRouter.route('/:userId/conversations/:conversationId').get(minimalRateLimiter, authMiddleware, sellerController.getConversationWithMessages); // undocumented

// withdrawals done manually temporarily
// sellerRouter.route('/:userId/withdraw-revenue').post(moderateRateLimiter, PaymentController.withdrawPayment);

export default sellerRouter;
