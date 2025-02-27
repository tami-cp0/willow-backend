import { Router, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import authRouter from "./auth";
import { CustomError, handleError } from "../utils/errorHandler";
import userRouter from "./user";
import swaggerSpec from "../docs/swagger";

const router = Router();

router.use('/api/v1/auth', authRouter);
router.use('/api/v1/users', userRouter);
router.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get("/", (req: Request, res: Response) => {
    res.redirect("/api/v1/docs");
});

router.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
});

router.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// router.use('/api/v1/ping', (req: Request, res: Response) => {
//     return res.status(200).end();
// });

export default router;