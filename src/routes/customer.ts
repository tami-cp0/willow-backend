import { Router } from "express";
import { aiChatRateLimiter, minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import customerController from "../controllers/customer";
import PaymentController from "../controllers/payment";


const customerRouter = Router();

customerRouter.route('/:userId').get(minimalRateLimiter, authMiddleware, customerController.getCustomer);
customerRouter.route('/:userId/update-profile').post(moderateRateLimiter, authMiddleware, customerController.updateProfile);

customerRouter.route('/:userId/cart').get(minimalRateLimiter, authMiddleware, customerController.getCart);
customerRouter.route('/:userId/cart/:productId').put(minimalRateLimiter, authMiddleware, customerController.upsertCartItem); // add new or update cart item using upsert
customerRouter.route('/:userId/cart/:productId').delete(minimalRateLimiter, authMiddleware, customerController.deleteCartItem);
customerRouter.route('/:userId/cart/checkout').post(strictRateLimiter, authMiddleware, PaymentController.initializePayment);

customerRouter.route('/:userId/liked-products/:productId').post(minimalRateLimiter, authMiddleware, customerController.likeProduct);
customerRouter.route('/:userId/liked-products').get(minimalRateLimiter, authMiddleware, customerController.getLikedProducts);
customerRouter.route('/:userId/liked-products/:productId').delete(minimalRateLimiter, authMiddleware, customerController.deleteLikedProduct);

customerRouter.route('/:userId/last-viewed').get(minimalRateLimiter, authMiddleware, customerController.getLastViewed);

customerRouter.route('/customers/:userId/recommendations').get(minimalRateLimiter, authMiddleware, customerController.getRecommendations);

customerRouter.route('/:userId/orders').get(minimalRateLimiter, authMiddleware, customerController.getOrders); // query options: SUCCESS, FAILED
customerRouter.route('/:userId/orders/:orderId').get(minimalRateLimiter, authMiddleware, customerController.getOrder);

customerRouter.route('/customers/:userId/ai-conversation').get(minimalRateLimiter, authMiddleware, customerController.getAIChat);
customerRouter.route('/customers/:userId/ai-conversation').post(aiChatRateLimiter, authMiddleware, customerController.postAIChat);

customerRouter.route('/:userId/products/:productId/reviews').post(moderateRateLimiter, authMiddleware, customerController.createReview);
customerRouter.route('/:userId/products/:productId/reviews/:reviewId').delete(moderateRateLimiter, authMiddleware, customerController.deleteReview);

customerRouter.route('/customers/:userId/conversations').get(minimalRateLimiter, authMiddleware, customerController.getConversations);
customerRouter.route('/customers/:userId/conversations/:conversationId').get(minimalRateLimiter, authMiddleware, customerController.getConversationWithMessages);

export default customerRouter;