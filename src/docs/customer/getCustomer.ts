/**
 * @openapi
 * /customers/{userId}:
 *   get:
 *     summary: Get customer details
 *     description: >
 *       Retrieves the details of a customer by their user ID.
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
 *         description: The customer’s user ID (must match the authenticated user).
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully.
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
 *                       example: "cust123"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     address:
 *                       type: object
 *                       description: JSON object representing the customer's address.
 *                       example: { "street": "123 Main St", "city": "Anytown", "zip": "12345" }
 *                     points:
 *                       type: number
 *                       example: 150
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user123"
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: "john.doe@example.com"
 *                         role:
 *                           type: string
 *                           example: "CUSTOMER"
 *                         status:
 *                           type: string
 *                           example: "ACTIVE"
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                     cart:
 *                       type: object
 *                       description: The customer's current shopping cart.
 *                       example: { "id": "cart123", "items": [] }
 *                     recommendations:
 *                       type: array
 *                       description: List of product recommendations for the customer.
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             description: Recommended product details.
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "prod456"
 *                               name:
 *                                 type: string
 *                                 example: "Eco-Friendly Water Bottle"
 *                     lastViewed:
 *                       type: array
 *                       description: List of products recently viewed by the customer.
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             description: Last viewed product details.
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "prod789"
 *                               name:
 *                                 type: string
 *                                 example: "Sustainable Notebook"
 *                     AIChats:
 *                       type: array
 *                       description: List of AI chat sessions associated with the customer.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "aichat101"
 *                           status:
 *                             type: string
 *                             example: "OPEN"
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
 *       404:
 *         description: Customer not found.
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
 *               customerNotFound:
 *                 summary: Customer not found
 *                 value:
 *                   status: "fail"
 *                   message: "Customer not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
