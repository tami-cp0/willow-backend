/**
 * @openapi
 * /products/{productId}/reviews:
 *   get:
 *     summary: Get reviews for a product
 *     description: >
 *       Retrieves all reviews for a given product along with the average rating and rating distribution.
 *       Reviews are ordered by creation date (most recent first). This endpoint requires cookie-based authentication.
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
 *         description: The ID of the product whose reviews are to be retrieved.
 *     responses:
 *       200:
 *         description: Reviews and rating statistics retrieved successfully.
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
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: Review object (structure may vary)
 *                     averageRating:
 *                       type: number
 *                       example: 4.2
 *                     ratingDistribution:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                       example: { "1": 2, "2": 1, "3": 0, "4": 5, "5": 8 }
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
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
