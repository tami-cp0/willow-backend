/**
 * @openapi
 * /customers/{userId}/conversations:
 *   get:
 *     summary: Retrieve customer conversations
 *     description: >
 *       Retrieves all conversations for the specified customer.
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
 *         description: The customer's user ID.
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T09:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T09:05:00Z"
 *                       isFlagged:
 *                         type: boolean
 *                         example: false
 *                       customer:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: "cust123"
 *                           firstname:
 *                             type: string
 *                             example: "John"
 *                           lastname:
 *                             type: string
 *                             example: "Doe"
 *                       seller:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: "seller123"
 *                           businessName:
 *                             type: string
 *                             example: "Green Supplies Inc."
 *                       latestMessage:
 *                         type: object
 *                         description: The most recent message in the conversation.
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "msg123"
 *                           senderId:
 *                             type: string
 *                             example: "cust123"
 *                           receiverId:
 *                             type: string
 *                             example: "seller123"
 *                           content:
 *                             type: string
 *                             example: "Hi, is this product available?"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-27T08:55:00Z"
 *             examples:
 *               sampleConversations:
 *                 summary: Sample conversation list
 *                 value:
 *                   status: "success"
 *                   data:
 *                     - id: "conv123"
 *                       createdAt: "2025-02-27T09:00:00Z"
 *                       updatedAt: "2025-02-27T09:05:00Z"
 *                       isFlagged: false
 *                       customer:
 *                         userId: "cust123"
 *                         firstname: "John"
 *                         lastname: "Doe"
 *                       seller:
 *                         userId: "seller123"
 *                         businessName: "Green Supplies Inc."
 *                       latestMessage:
 *                         id: "msg123"
 *                         senderId: "cust123"
 *                         receiverId: "seller123"
 *                         content: "Hi, is this product available?"
 *                         createdAt: "2025-02-27T08:55:00Z"
 *       400:
 *         description: Validation error (e.g., missing customer user ID).
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
