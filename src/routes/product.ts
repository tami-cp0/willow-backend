import { Router } from "express";

const productRouter = Router();

productRouter.route('/products').get();
productRouter.route('/products/:productId').get();
productRouter.route('/products/:productId/reviews').get();

export default productRouter;
