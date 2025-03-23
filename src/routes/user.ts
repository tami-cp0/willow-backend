import { Router } from "express";
import userController from "../controllers/user";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/rateLimiters";
import authMiddleware from "../middlewares/authMiddleware";


const userRouter = Router();

userRouter.route('/register').post(moderateRateLimiter, userController.register);
userRouter.route('/:userId').get(minimalRateLimiter, authMiddleware, userController.getUser);
userRouter.route('/:userId/delete').delete(strictRateLimiter, authMiddleware, userController.delete);

export default userRouter;