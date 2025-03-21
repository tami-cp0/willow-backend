/**
 * @openapi
 * /customers/{userId}/ai-conversation:
 *   get:
 *     summary: Get AI chat conversation
 *     description: >
 *       Retrieves the AI chat conversation record for the specified customer.
 *       The response contains the AIChat object, including the chat history.
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
 *     responses:
 *       200:
 *         description: AI chat conversation retrieved successfully.
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
 *                       example: "aichat123"
 *                     customerId:
 *                       type: string
 *                       example: "cust123"
 *                     status:
 *                       type: string
 *                       example: "OPEN"
 *                     history:
 *                       type: array
 *                       description: >
 *                         An array of conversation history entries. Each entry is an object with:
 *                         - **role**: the role of the sender ("user" or "model")
 *                         - **parts**: an array of objects, each containing a "text" property.
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             example: "user"
 *                           parts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 text:
 *                                   type: string
 *                                   example: "Hi, how can I help you?"
 *             examples:
 *               sampleAIChat:
 *                 summary: Sample AI chat conversation (system instruction removed)
 *                 value:
 *                   status: "success"
 *                   data:
 *                     id: "aichat123"
 *                     customerId: "cust123"
 *                     status: "OPEN"
 *                     history:
 *                       - role: "user"
 *                         parts:
 *                           - text: "Hi, how can I help you?"
 *                       - role: "model"
 *                         parts:
 *                           - text: "Hello! What can I do for you today?"
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
