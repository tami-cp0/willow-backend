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
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "order123"
 *                         customerId:
 *                           type: string
 *                           example: "cust123"
 *                         totalAmount:
 *                           type: number
 *                           example: 150.00
 *                         address:
 *                           type: object
 *                           example:
 *                             street: "123 Main St"
 *                             city: "Lagos"
 *                             country: "Nigeria"
 *                         serviceFee:
 *                           type: number
 *                           example: 10
 *                         deliveryFee:
 *                           type: number
 *                           example: 5
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-04-15T10:20:30.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-04-15T11:00:00.000Z"
 *                         orderItems:
 *                           type: array
 *                           items:
 *                             $ref: "#/components/schemas/OrderItem"
 *                         transaction:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "trans123"
 *                             customerId:
 *                               type: string
 *                               example: "cust123"
 *                             reference:
 *                               type: string
 *                               example: "a4b5c6d7-e8f9-4a1b-8c2d-1234567890ab"
 *                             paystackResponse:
 *                               type: object
 *                               example: {}
 *                             status:
 *                               type: string
 *                               enum:
 *                                 - FAILED
 *                                 - SUCCESS
 *                               example: "SUCCESS"
 *                             totalAmount:
 *                               type: number
 *                               example: 15000
 *                             orderId:
 *                               type: string
 *                               example: "order123"
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
