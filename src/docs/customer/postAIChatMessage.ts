/**
 * @openapi
 * /{userId}/ai-conversation:
 *   post:
 *     summary: Chat with AI assistant
 *     description: >
 *       Allows a customer to interact with an AI assistant. The AI responds with a message and may recommend products.
 *       The conversation history is stored in the database.
 *     tags:
 *       - AI Chat
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer’s user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userQuery
 *             properties:
 *               userQuery:
 *                 type: string
 *                 description: The user's query for the AI assistant.
 *                 example: "Do you sell sustainable sneakers?"
 *     responses:
 *       200:
 *         description: AI response retrieved successfully.
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
 *                     response:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                           description: AI-generated response.
 *                           example: "Yes, we do! Here's one example of a shoe we currently offer:"
 *                         products:
 *                           type: array
 *                           description: List of recommended products (if applicable).
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "01JQA3P4SABHC25ZFCSJ8RRGR7"
 *                               name:
 *                                 type: string
 *                                 example: "Nike Jordan"
 *                               price:
 *                                 type: number
 *                                 example: 25000
 *                               images:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     key:
 *                                       type: string
 *                                       example: "1743022394998-jordan(1).jpg"
 *                                     url:
 *                                       type: string
 *                                       format: uri
 *                                       example: "https://pub-98b899a5168d4e2285d560ccb413a7f5.r2.dev/1743022394998-jordan(1).jpg"
 *                                     size:
 *                                       type: integer
 *                                       example: 11454
 *                                     mimetype:
 *                                       type: string
 *                                       example: "image/jpeg"
 *                                     originalname:
 *                                       type: string
 *                                       example: "jordan(1).jpg"
 *                               category:
 *                                 type: string
 *                                 example: "Shoe"
 *                               sold_out:
 *                                 type: boolean
 *                                 example: false
 *                               sourcing:
 *                                 type: string
 *                                 enum: ["LOCALLY_SOURCED", "INTERNATIONALLY_SOURCED"]
 *                                 example: "INTERNATIONALLY_SOURCED"
 *                               on_demand:
 *                                 type: boolean
 *                                 example: true
 *                               packaging:
 *                                 type: string
 *                                 example: "PAPERBOARD_BOX"
 *                               seller_id:
 *                                 type: string
 *                                 example: "01JQA1XGP250E0VF5AY5XZMP9W"
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-03-26T20:53:16.203Z"
 *                               similarity:
 *                                 type: number
 *                                 description: The similarity score of the recommended product.
 *                                 example: 0.5294676566466014
 *                               description:
 *                                 type: string
 *                                 example: "Black and white Nike Jordan shoe that can be worn anywhere."
 *                               businessName:
 *                                 type: string
 *                                 example: "PureBody Ltd."
 *                               end_of_life_info:
 *                                 type: string
 *                                 example: ""
 *                               sustainability_tag:
 *                                 type: string
 *                                 enum: ["SUSTAINABLE", "ECO_FRIENDLY", "INCONCLUSIVE"]
 *                                 example: "INCONCLUSIVE"
 *       400:
 *         description: Missing required fields or invalid request.
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
 *               missingQuery:
 *                 summary: Missing userQuery parameter
 *                 value:
 *                   status: "fail"
 *                   message: "User query is required"
 *       403:
 *         description: Access denied if the user ID does not match the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               status: "fail"
 *               message: "Access denied"
 *       429:
 *         description: >
 *           Rate limit exceeded. You have exceeded your free limit, Try again in an hour.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "You have reached your limit, Try again in an hour."
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
