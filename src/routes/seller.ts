import { Router } from "express";
import userController from "../controllers/user";
import { minimalRateLimiter, moderateRateLimiter } from "../utils/rateLimiters";


const sellerrRouter = Router();

sellerrRouter.route('/sellers/:userId').get();
sellerrRouter.route('/sellers/:userId/update-profile').patch();

export default sellerrRouter;