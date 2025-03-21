/**
 * @openapi
 * /customers/{userId}/products/{productId}/reviews:
 *   post:
 *     summary: Post a product review
 *     description: >
 *       Post a new review for a product by the authenticated customer.
 *       The customer must have an order for the product that has been delivered in order to review it.
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
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID for which the review is being created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The order ID associated with the product review.
 *                 example: "order123"
 *               rating:
 *                 type: integer
 *                 description: >
 *                   The review rating. Must be an integer between 1 and 5.
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Optional review comment.
 *                 example: "Excellent product!"
 *             required:
 *               - orderId
 *               - rating
 *     responses:
 *       201:
 *         description: Review created successfully.
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
 *                   description: The created review object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "review789"
 *                     productId:
 *                       type: string
 *                       example: "prod456"
 *                     customerId:
 *                       type: string
 *                       example: "cust123"
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "Excellent product!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T11:00:00Z"
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
 *               invalidRating:
 *                 summary: Rating validation error
 *                 value:
 *                   status: "fail"
 *                   message: "Rating must be an integer between 1 and 5"
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
 *         description: Either the order item for review or the product is not found, or the order is not delivered.
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
 *               orderNotDelivered:
 *                 summary: Order not delivered or invalid order for review
 *                 value:
 *                   status: "fail"
 *                   message: "You can only review products from orders that have been delivered."
 *               productNotFound:
 *                 summary: Product not found
 *                 value:
 *                   status: "fail"
 *                   message: "Product not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
