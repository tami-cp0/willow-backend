/**
 * @openapi
 * /sellers/{userId}/orders/{orderId}:
 *   get:
 *     summary: Get a single order item
 *     description: >
 *       Retrieves a specific order item for the authenticated seller by its order ID.
 *       The order item includes associated product details.
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
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the order item.
 *     responses:
 *       200:
 *         description: Order item retrieved successfully.
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
 *                     id:
 *                       type: string
 *                       example: "orderItem123"
 *                     orderId:
 *                       type: string
 *                       example: "order123"
 *                     productId:
 *                       type: string
 *                       example: "prod123"
 *                     sellerId:
 *                       type: string
 *                       example: "seller123"
 *                     customerStatus:
 *                       type: string
 *                       example: "ORDERED"
 *                     sellerStatus:
 *                       type: string
 *                       example: "NEW"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 29.99
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "prod123"
 *                         name:
 *                           type: string
 *                           example: "Eco-Friendly Water Bottle"
 *                         price:
 *                           type: number
 *                           example: 19.99
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
 *               missingOrderId:
 *                 summary: Missing order ID
 *                 value:
 *                   status: "fail"
 *                   message: "Order ID is required"
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
 *       404:
 *         description: Order not found.
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
 *               orderNotFound:
 *                 summary: Order not found
 *                 value:
 *                   status: "fail"
 *                   message: "Order not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
