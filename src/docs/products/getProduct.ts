/**
 * @openapi
 * /products/{productId}:
 *   get:
 *     summary: Get a single product
 *     description: >
 *       Retrieves a single product by its ID. The product details include associated reviews and seller information.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   description: Product object including reviews and seller details.
 *       400:
 *         description: Validation error or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             examples:
 *               missingProductId:
 *                 summary: Missing productId
 *                 value:
 *                   status: "fail"
 *                   message: "Product ID is required"
 *               invalidProductId:
 *                 summary: Invalid productId type
 *                 value:
 *                   status: "fail"
 *                   message: "Product ID must be a string"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             examples:
 *               productNotFound:
 *                 summary: Product not found
 *                 value:
 *                   status: "fail"
 *                   message: "Product not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
