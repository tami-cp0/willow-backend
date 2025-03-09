/**
 * @openapi
 * /sellers/{userId}/orders:
 *   get:
 *     summary: Get seller orders - paginated
 *     description: >
 *       Retrieves a paginated list of order items for the authenticated seller.
 *       You can optionally filter orders by their seller status.
 *       Query parameters:
 *         - **status**: Optional filter for order status. Allowed values: NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED.
 *         - **page**: Page number for pagination (default: "1").
 *         - **limit**: Number of orders per page (default: "20").
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Sellers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller's user ID (must match the authenticated user).
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *         description: Optional filter for order status.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: string
 *         description: Page number for pagination (default is "1").
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: string
 *         description: Number of orders per page (default is "20").
 *     responses:
 *       200:
 *         description: A list of order items for the seller with pagination details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "orderItem123"
 *                       orderId:
 *                         type: string
 *                         example: "order123"
 *                       productId:
 *                         type: string
 *                         example: "prod123"
 *                       sellerId:
 *                         type: string
 *                         example: "seller123"
 *                       customerStatus:
 *                         type: string
 *                         example: "ORDERED"
 *                       sellerStatus:
 *                         type: string
 *                         example: "NEW"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 29.99
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "prod123"
 *                           name:
 *                             type: string
 *                             example: "Eco-Friendly Water Bottle"
 *                           price:
 *                             type: number
 *                             example: 19.99
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 5
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
 *               invalidStatus:
 *                 summary: Invalid status value
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid status"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the seller userId.
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
 *               accessDenied:
 *                 summary: Access denied
 *                 value:
 *                   status: "fail"
 *                   message: "Access denied"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
