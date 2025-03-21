/**
 * @openapi
 * /customers/{userId}/conversations/{conversationId}:
 *   get:
 *     summary: Get conversation with messages
 *     description: >
 *       Retrieves a specific conversation for the customer, including all messages ordered from oldest to newest.
 *       Each message may include attached images whose URLs are updated with signed URLs.
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
 *                     isFlagged:
 *                       type: boolean
 *                       example: false
 *                     customer:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: "cust123"
 *                         firstname:
 *                           type: string
 *                           example: "John"
 *                         lastname:
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
 *                       description: All messages in the conversation, ordered by createdAt ascending.
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
 *                             example: "cust123"
 *                           receiverId:
 *                             type: string
 *                             example: "seller123"
 *                           content:
 *                             type: string
 *                             example: "Hello, I have a question about my order."
 *                           images:
 *                             type: array
 *                             description: Array of image objects with signed URLs.
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
 *             examples:
 *               sampleConversation:
 *                 summary: Sample conversation with messages
 *                 value:
 *                   status: "success"
 *                   data:
 *                     id: "conv123"
 *                     createdAt: "2025-02-27T09:00:00Z"
 *                     updatedAt: "2025-02-27T09:05:00Z"
 *                     isFlagged: false
 *                     customer:
 *                       userId: "cust123"
 *                       firstname: "John"
 *                       lastname: "Doe"
 *                     seller:
 *                       userId: "seller123"
 *                       businessName: "Green Supplies Inc."
 *                     messages:
 *                       - id: "msg101"
 *                         conversationId: "conv123"
 *                         senderId: "cust123"
 *                         receiverId: "seller123"
 *                         content: "Hello, I have a question about my order."
 *                         images: []
 *                         createdAt: "2025-02-27T09:00:00Z"
 *       400:
 *         description: Validation error (e.g., missing conversation ID).
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
