/**
 * @openapi
 * /sellers/{userId}/conversations:
 *   get:
 *     summary: Get seller conversations
 *     description: >
 *       Retrieves all conversations for the specified seller. Each conversation includes the associated customer and seller details,
 *       plus the latest message. The conversations themselves are ordered by updatedAt descending.
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
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully.
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
 *                         example: "conv123"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T11:00:00Z"
 *                       customer:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: "customer456"
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                         description: Details of the customer.
 *                       seller:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: "seller123"
 *                           businessName:
 *                             type: string
 *                             example: "Green Supplies Inc."
 *                         description: Details of the seller.
 *                       messages:
 *                         type: array
 *                         description: Latest message in the conversation.
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "msg123"
 *                             conversationId:
 *                               type: string
 *                               example: "conv123"
 *                             senderId:
 *                               type: string
 *                               example: "customer456"
 *                             receiverId:
 *                               type: string
 *                               example: "seller123"
 *                             content:
 *                               type: string
 *                               example: "Hi, is this product available?"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-02-27T10:00:00Z"
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
 *                 summary: Missing seller user ID
 *                 value:
 *                   status: "fail"
 *                   message: "Seller user ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the seller user ID.
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
