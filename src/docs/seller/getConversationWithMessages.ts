/**
 * @openapi
 * /sellers/{userId}/conversations/{conversationId}:
 *   get:
 *     summary: Get a conversation with its messages
 *     description: >
 *       Retrieves details for a specific conversation belonging to the seller, including all messages (ordered from oldest to newest) and associated customer and seller details.
 *       Any attached images in the messages will have signed URLs for client use.
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
 *         description: The seller's user ID.
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the conversation.
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully.
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
 *                       example: "conv123"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T09:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T09:05:00Z"
 *                     customer:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: "customer456"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                     seller:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: "seller123"
 *                         businessName:
 *                           type: string
 *                           example: "Green Supplies Inc."
 *                     messages:
 *                       type: array
 *                       description: All messages in the conversation, ordered by creation time (ascending).
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "msg101"
 *                           conversationId:
 *                             type: string
 *                             example: "conv123"
 *                           senderId:
 *                             type: string
 *                             example: "customer456"
 *                           receiverId:
 *                             type: string
 *                             example: "seller123"
 *                           content:
 *                             type: string
 *                             example: "Hello, I have a question about the product."
 *                           images:
 *                             type: array
 *                             description: List of image objects with signed URLs.
 *                             items:
 *                               type: object
 *                               properties:
 *                                 key:
 *                                   type: string
 *                                   example: "imgKey1"
 *                                 url:
 *                                   type: string
 *                                   example: "https://signed-url.com/imgKey1"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-27T09:00:00Z"
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
 *               missingConversationId:
 *                 summary: Missing conversation ID
 *                 value:
 *                   status: "fail"
 *                   message: "Conversation ID is required"
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
 *       404:
 *         description: Conversation not found.
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
 *               conversationNotFound:
 *                 summary: Conversation not found
 *                 value:
 *                   status: "fail"
 *                   message: "Conversation not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
