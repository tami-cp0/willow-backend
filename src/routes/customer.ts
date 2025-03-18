import { Router } from "express";
import { minimalRateLimiter, moderateRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import customerController from "../controllers/customer";
import PaymentController from "../controllers/payment";


const customerRouter = Router();

customerRouter.route('/customers/:userId').get(minimalRateLimiter, authMiddleware, customerController.getCustomer);
customerRouter.route('/customers/:userId/update-profile').post(moderateRateLimiter, authMiddleware, customerController.updateProfile);

customerRouter.route('/customers/:userId/cart').get(minimalRateLimiter, authMiddleware, customerController.getCart);
customerRouter.route('/customers/:userId/cart/:productId').put(minimalRateLimiter, authMiddleware, customerController.upsertCartItem); // add new or update cart item using upsert
customerRouter.route('/customers/:userId/cart/:productId').delete();
customerRouter.route('/customers/:userId/cart/checkout').post(minimalRateLimiter, PaymentController.initializePayment);
 


customerRouter.route('/customers/:userId/liked-products').post();
customerRouter.route('/customers/:userId/liked-products').get();
customerRouter.route('/customers/:userId/liked-products').delete();

// customerRouter.route('/customers/:userId/last-viewed').post();
// customerRouter.route('/customers/:userId/last-viewed').get();

// customerRouter.route('/customers/:userId/recommendations').get();

// customerRouter.route('/customers/:userId/orders').get();
// customerRouter.route('/customers/:userId/orders/:orderId').get();

// customerRouter.route('/customers/:userId/conversations').get();
// customerRouter.route('/customers/:userId/conversations').post();
// customerRouter.route('/customers/:userId/conversations/:conversationId').get();

// customerRouter.route('/customers/:userId/ai-conversation').get();

// productRouter.route('/products/:productId/reviews').post();
// productRouter.route('/products/:productId/reviews/:reviewId').patch();
// productRouter.route('/products/:productId/reviews/:reviewId').delete();

// customerRouter.route('/customers/:userId/conversations').get(minimalRateLimiter, authMiddleware, customerController.getConversations);
// customerRouter.route('/customers/:userId/conversations/:conversationId').get(minimalRateLimiter, authMiddleware, customerController.getConversation);
// customerRouter.route('/customers/:userId/conversations/:conversationId/messages').get(moderateRateLimiter, authMiddleware, customerController.getConversationMessages);

export default customerRouter;