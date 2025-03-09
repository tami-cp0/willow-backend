/**
 * @openapi
 * /sellers/{userId}:
 *   get:
 *     summary: Get seller details
 *     description: >
 *       Retrieves details for a seller by their user ID. The response includes the seller’s
 *       business name, bio, status, avatar (with a signed URL), as well as associated orders,
 *       products, and conversations.
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
 *         description: The user ID of the seller.
 *     responses:
 *       200:
 *         description: Seller details retrieved successfully.
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
 *                     userId:
 *                       type: string
 *                       example: "seller123"
 *                     businessName:
 *                       type: string
 *                       example: "Green Supplies Inc."
 *                     bio:
 *                       type: string
 *                       example: "Leading provider of eco-friendly products."
 *                     status:
 *                       type: string
 *                       enum: [PENDING, APPROVED, FAILED]
 *                       example: "APPROVED"
 *                     avatar:
 *                       type: object
 *                       properties:
 *                         key:
 *                           type: string
 *                           example: "avatar-key"
 *                         url:
 *                           type: string
 *                           example: "https://signed-url.com/avatar.jpg"
 *                     orders:
 *                       type: array
 *                       description: List of order items associated with the seller.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "orderItem123"
 *                           orderId:
 *                             type: string
 *                             example: "order123"
 *                           productId:
 *                             type: string
 *                             example: "prod123"
 *                           sellerId:
 *                             type: string
 *                             example: "seller123"
 *                           customerStatus:
 *                             type: string
 *                             example: "ORDERED"
 *                           sellerStatus:
 *                             type: string
 *                             example: "NEW"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 29.99
 *                     products:
 *                       type: array
 *                       description: List of products offered by the seller.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "prod123"
 *                           name:
 *                             type: string
 *                             example: "Eco-Friendly Water Bottle"
 *                           description:
 *                             type: string
 *                             example: "A sustainable water bottle made from recycled materials."
 *                           price:
 *                             type: number
 *                             example: 19.99
 *                           approvalStatus:
 *                             type: string
 *                             enum: [PENDING, APPROVED, REJECTED]
 *                             example: "APPROVED"
 *                     conversations:
 *                       type: array
 *                       description: List of conversations involving the seller.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "conv123"
 *                           customerId:
 *                             type: string
 *                             example: "customer456"
 *                           sellerId:
 *                             type: string
 *                             example: "seller123"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-27T10:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-27T12:00:00Z"
 *                           isFlagged:
 *                             type: boolean
 *                             example: false
 *                           messages:
 *                             type: array
 *                             description: List of messages in the conversation.
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: "msg123"
 *                                 conversationId:
 *                                   type: string
 *                                   example: "conv123"
 *                                 senderId:
 *                                   type: string
 *                                   example: "customer456"
 *                                 receiverId:
 *                                   type: string
 *                                   example: "seller123"
 *                                 content:
 *                                   type: string
 *                                   example: "I am interested in your products."
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-02-27T10:05:00Z"
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
 *               missingSellerId:
 *                 summary: Missing seller ID
 *                 value:
 *                   status: "fail"
 *                   message: "Seller ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Seller not found.
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
 *               sellerNotFound:
 *                 summary: Seller not found
 *                 value:
 *                   status: "fail"
 *                   message: "Seller not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
