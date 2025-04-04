/**
 * @openapi
 * /customers/{userId}/ai-conversation:
 *   get:
 *     summary: Retrieve AI chat conversation
 *     description: >
 *       Retrieves the AI chat conversation for the specified customer. If no conversation exists, one is created.
 *       The returned conversation includes:
 *         - **id**: The conversation ID.
 *         - **customerId**: The customer’s user ID.
 *         - **status**: The conversation status (OPEN or CLOSED).
 *         - **history**: An array of conversation history entries (after removing the initial system instruction).
 *           Each history entry is an object with:
 *             - **role**: The role of the sender ("user" or "model").
 *             - **parts**: An array of objects, each with a **text** property.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Customers
 *       - AI Chat
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
 *                       enum: [OPEN, CLOSED]
 *                       example: "OPEN"
 *                     history:
 *                       type: array
 *                       description: Array of conversation history entries (after removing system instructions).
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
 *                                   example: "do you sell shoes?"
 *                     isFlagged:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-01T12:05:00Z"
 *             examples:
 *               fullHistoryExample:
 *                 summary: Full conversation history sample
 *                 value:
 *                   status: "success"
 *                   data:
 *                     id: "aichat123"
 *                     customerId: "cust123"
 *                     status: "OPEN"
 *                     history:
 *                       - role: "user"
 *                         parts:
 *                           - text: "do you sell shoes?"
 *                       - role: "model"
 *                         parts:
 *                           - text: {
 *                               "text": "Yes, we do! Here's one example of a shoe we currently offer:",
 *                               "products": [
 *                                 {
 *                                   "id": "01JQA3P4SABHC25ZFCSJ8RRGR7",
 *                                   "name": "Nike jordan",
 *                                   "price": 25000,
 *                                   "images": [
 *                                     {
 *                                       "key": "1743022394998-jordan(1).jpg",
 *                                       "url": "https://pub-98b899a5168d4e2285d560ccb413a7f5.r2.dev/1743022394998-jordan(1).jpg",
 *                                       "size": 11454,
 *                                       "mimetype": "image/jpeg",
 *                                       "originalname": "jordan(1).jpg"
 *                                     },
 *                                     {
 *                                       "key": "1743022394998-jordan(1).jpg",
 *                                       "url": "https://pub-98b899a5168d4e2285d560ccb413a7f5.r2.dev/1743022394998-jordan(1).jpg",
 *                                       "size": 11454,
 *                                       "mimetype": "image/jpeg",
 *                                       "originalname": "jordan(1).jpg"
 *                                     }
 *                                   ],
 *                                   "category": "Shoe",
 *                                   "in_stock": null,
 *                                   "sold_out": false,
 *                                   "sourcing": "INTERNATIONALLY_SOURCED",
 *                                   "on_demand": true,
 *                                   "packaging": "PAPERBOARD_BOX",
 *                                   "seller_id": "01JQA1XGP250E0VF5AY5XZMP9W",
 *                                   "created_at": "2025-03-26T20:53:16.203Z",
 *                                   "similarity": 0.5294676566466014,
 *                                   "description": "black and white nike jordan shoe that can be worn anywhere",
 *                                   "businessName": "PureBody ltd.",
 *                                   "end_of_life_info": "",
 *                                   "sustainability_tag": "INCONCLUSIVE"
 *                                 }
 *                               ]
 *                             }
 *                     isFlagged: false
 *                     createdAt: "2025-03-01T12:00:00Z"
 *                     updatedAt: "2025-03-01T12:05:00Z"
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
