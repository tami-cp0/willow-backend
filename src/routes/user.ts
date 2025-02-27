import { Router } from "express";
import userController from "../controllers/user";
import { minimalRateLimiter, moderateRateLimiter } from "../utils/rateLimiters";


const userRouter = Router();

userRouter.route('/register').post(moderateRateLimiter, userController.register);

// sellers
userRouter.route('/:sellerId').get(minimalRateLimiter, userController.getSeller);

export default userRouter;