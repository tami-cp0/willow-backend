import { Router } from "express";
import authController from "../controllers/auth";
import authMidlleware from "../middlewares/authMiddleware";
import { minimalRateLimiter, strictRateLimiter } from "../utils/rateLimiters";

const authRouter = Router();

authRouter.route('/verify-account').post(minimalRateLimiter, authController.verifyAccount);
authRouter.route('/resend-otp').post(strictRateLimiter, authController.resendOtp);
authRouter.route('/login').post(minimalRateLimiter, authController.login);
authRouter.route('/logout').post(minimalRateLimiter, authMidlleware, authController.logout);
authRouter.route('/refresh-tokens').post(minimalRateLimiter, authMidlleware, authController.refreshAccessToken);

export default authRouter