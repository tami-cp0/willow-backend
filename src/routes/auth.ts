import { Router } from "express";
import authController from "../controllers/auth";
import authMiddleware from "../middlewares/authMiddleware";
import { minimalRateLimiter, moderateRateLimiter, strictRateLimiter } from "../utils/rateLimiters";

const authRouter = Router();

authRouter.route('/verify-account').patch(moderateRateLimiter, authController.verifyAccount);
authRouter.route('/resend-otp').post(strictRateLimiter, authController.resendOtp);
authRouter.route('/login').post(moderateRateLimiter, authController.login);
authRouter.route('/logout').post(moderateRateLimiter, authMiddleware, authController.logout);
authRouter.route('/refresh-tokens').post(strictRateLimiter, authMiddleware, authController.refreshAccessToken);
authRouter.route('/forgot-password').post(strictRateLimiter, authController.forgotPassword); // can be used to resend passwod reset link
authRouter.route('/password-reset').patch(moderateRateLimiter, authController.resetPassword);

export default authRouter