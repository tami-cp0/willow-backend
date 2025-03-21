/**
 * @openapi
 * /customers/{userId}/orders:
 *   get:
 *     summary: Get customer orders
 *     description: >
 *       Retrieves a list of orders for the specified customer. An optional query parameter allows filtering orders by transaction status (SUCCESS or FAILED).
 *       Orders are returned from newest to oldest.
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
 *       - in: query
 *         name: transactionStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [SUCCESS, FAILED]
 *         description: Optional filter for transaction status.
 *     responses:
 *       200:
 *         description: Orders retrieved successfully.
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
 *                         example: "order123"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T10:00:00Z"
 *                       transaction:
 *                         type: object
 *                         description: Details of the order transaction.
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "trans456"
 *                           status:
 *                             type: string
 *                             example: "SUCCESS"
 *                       orderItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "orderItem789"
 *                             product:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: "prod321"
 *                                 name:
 *                                   type: string
 *                                   example: "Eco-Friendly Water Bottle"
 *                             seller:
 *                               type: object
 *                               properties:
 *                                 userId:
 *                                   type: string
 *                                   example: "seller123"
 *                                 businessName:
 *                                   type: string
 *                                   example: "Green Supplies Inc."
 *                     example: [
 *                       {
 *                         "id": "order123",
 *                         "createdAt": "2025-02-27T10:00:00Z",
 *                         "transaction": { "id": "trans456", "status": "SUCCESS" },
 *                         "orderItems": [
 *                           {
 *                             "id": "orderItem789",
 *                             "product": { "id": "prod321", "name": "Eco-Friendly Water Bottle" },
 *                             "seller": { "userId": "seller123", "businessName": "Green Supplies Inc." }
 *                           }
 *                         ]
 *                       }
 *                     ]
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
 *               invalidTransactionStatus:
 *                 summary: Invalid transaction status
 *                 value:
 *                   status: "fail"
 *                   message: "Transaction status must be FAILED or SUCCESS"
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
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
