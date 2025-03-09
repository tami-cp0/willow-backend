/**
 * @openapi
 * /sellers/{userId}/orders/{orderId}/update-status:
 *   patch:
 *     summary: Update order status
 *     description: >
 *       Updates the status of a specific order item for the authenticated seller.
 *       The request body must include a new status value and, if the status is CANCELLED, a cancellation message is required.
 *       statuses - [NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
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
 *         description: The order item ID to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new order status.
 *                 enum: [NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *                 example: "CANCELLED"
 *               cancelMessage:
 *                 type: string
 *                 description: The cancellation message (required if status is CANCELLED).
 *                 example: "Customer requested cancellation due to delay"
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Order status updated successfully.
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
 *                     sellerId:
 *                       type: string
 *                       example: "seller123"
 *                     customerStatus:
 *                       type: string
 *                       example: "ORDERED"
 *                     sellerStatus:
 *                       type: string
 *                       example: "CANCELLED"
 *                     sellerCancelMessage:
 *                       type: string
 *                       example: "Customer requested cancellation due to delay"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 29.99
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
 *               missingOrderId:
 *                 summary: Missing order ID
 *                 value:
 *                   status: "fail"
 *                   message: "Order ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if authenticated user's ID does not match the seller userId.
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
 *         description: Order item not found.
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
