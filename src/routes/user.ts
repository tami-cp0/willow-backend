import { Router } from "express";
import userController from "../controllers/user";


const userRouter = Router();

userRouter.route('/register').post(userController.register);
userRouter.route('/verify-account').post(userController.verifyAccount);

export default userRouter;