/**
 * @openapi
 * /customers/{userId}/orders/{orderId}:
 *   get:
 *     summary: Get a specific customer order
 *     description: >
 *       Retrieves details for a specific order identified by orderId belonging to the customer.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer's user ID (must match the authenticated user).
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the order.
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
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
 *                       example: "order123"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T10:00:00Z"
 *                     transaction:
 *                       type: object
 *                       description: Order transaction details.
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "trans456"
 *                         status:
 *                           type: string
 *                           example: "SUCCESS"
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "orderItem789"
 *                           product:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "prod321"
 *                               name:
 *                                 type: string
 *                                 example: "Eco-Friendly Water Bottle"
 *                           seller:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                                 example: "seller123"
 *                               businessName:
 *                                 type: string
 *                                 example: "Green Supplies Inc."
 *                     example: {
 *                       "id": "order123",
 *                       "createdAt": "2025-02-27T10:00:00Z",
 *                       "transaction": { "id": "trans456", "status": "SUCCESS" },
 *                       "orderItems": [
 *                         {
 *                           "id": "orderItem789",
 *                           "product": { "id": "prod321", "name": "Eco-Friendly Water Bottle" },
 *                           "seller": { "userId": "seller123", "businessName": "Green Supplies Inc." }
 *                         }
 *                       ]
 *                     }
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
 *               missingUserId:
 *                 summary: Missing customer user ID
 *                 value:
 *                   status: "fail"
 *                   message: "Customer user ID is required"
 *               missingOrderId:
 *                 summary: Missing order ID
 *                 value:
 *                   status: "fail"
 *                   message: "Order ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the customer user ID.
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
