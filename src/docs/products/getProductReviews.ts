/**
 * @openapi
 * /products/{productId}/reviews:
 *   get:
 *     summary: Get product reviews
 *     description: >
 *       Retrieves all reviews for a given product along with rating statistics,
 *       including the average rating and distribution of ratings from 1 to 5.
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
 *         description: The ID of the product for which reviews are to be retrieved.
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
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "review123"
 *                           productId:
 *                             type: string
 *                             example: "01F0abcdef1234567890"
 *                           customerId:
 *                             type: string
 *                             example: "customer456"
 *                           rating:
 *                             type: integer
 *                             example: 5
 *                           comment:
 *                             type: string
 *                             example: "Excellent product!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-27T11:00:00Z"
 *                     averageRating:
 *                       type: number
 *                       example: 4.2
 *                     ratingDistribution:
 *                       type: object
 *                       properties:
 *                         "1":
 *                           type: integer
 *                           example: 2
 *                         "2":
 *                           type: integer
 *                           example: 1
 *                         "3":
 *                           type: integer
 *                           example: 0
 *                         "4":
 *                           type: integer
 *                           example: 5
 *                         "5":
 *                           type: integer
 *                           example: 8
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
