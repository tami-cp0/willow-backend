import { Router } from "express";
import { minimalRateLimiter, moderateRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";
import customerController from "../controllers/customer";
import PaymentController from "../controllers/payment";


const customerRouter = Router();

customerRouter.route('/:userId').get(minimalRateLimiter, authMiddleware, customerController.getCustomer);
customerRouter.route('/:userId/update-profile').post(moderateRateLimiter, authMiddleware, customerController.updateProfile);

customerRouter.route('/:userId/cart').get(minimalRateLimiter, authMiddleware, customerController.getCart);
customerRouter.route('/:userId/cart/:productId').put(minimalRateLimiter, authMiddleware, customerController.upsertCartItem); // add new or update cart item using upsert
customerRouter.route('/:userId/cart/:productId').delete();
customerRouter.route('/:userId/cart/checkout').post(minimalRateLimiter, PaymentController.initializePayment);
 


customerRouter.route('/:userId/liked-products').post();
customerRouter.route('/:userId/liked-products').get();
customerRouter.route('/:userId/liked-products').delete();

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