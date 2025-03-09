/**
 * @openapi
 * /sellers/{userId}/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages for a conversation
 *     description: >
 *       Retrieves all messages for a specific conversation belonging to the seller. For each message,
 *       any attached images are processed to include a signed URL (from the "messagemedia" bucket).
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
 *         description: Messages retrieved successfully.
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
 *                   description: List of messages in the conversation.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "msg201"
 *                       conversationId:
 *                         type: string
 *                         example: "conv123"
 *                       senderId:
 *                         type: string
 *                         example: "customer456"
 *                       receiverId:
 *                         type: string
 *                         example: "seller123"
 *                       content:
 *                         type: string
 *                         example: "Hi, I have a question about the product."
 *                       images:
 *                         type: array
 *                         description: List of image objects with signed URLs.
 *                         items:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               example: "imgKey1"
 *                             url:
 *                               type: string
 *                               example: "https://signed-url.com/imgKey1"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T09:30:00Z"
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
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
