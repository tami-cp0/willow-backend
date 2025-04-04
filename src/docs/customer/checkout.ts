/**
 * @openapi
 * /customers/{userId}/cart/checkout:
 *   post:
 *     summary: Initialize payment for cart checkout
 *     description: >
 *       Initializes the payment process for the customer's cart checkout.
 *       Upon success, the endpoint initializes a transaction with Paystack, creates the order, order items, and transaction in the database, and returns the Paystack access code along with the created order.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The customer's email address.
 *                 example: "john.doe@example.com"
 *               amount:
 *                 type: number
 *                 description: The total amount in NGN (will be converted to kobo).
 *                 example: 2500
 *               address:
 *                 type: object
 *                 description: The delivery address as a JSON object.
 *                 example: { "street": "123 Main St", "city": "Lagos", "zip": "101001" }
 *               serviceFee:
 *                 type: number
 *                 description: The service fee amount.
 *                 example: 100
 *               deliveryFee:
 *                 type: number
 *                 description: The delivery fee amount.
 *                 example: 200
 *             required:
 *               - email
 *               - amount
 *               - address
 *               - serviceFee
 *               - deliveryFee
 *     responses:
 *       200:
 *         description: Payment initialized successfully.
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
 *                     accessCode:
 *                       type: string
 *                       description: The access code returned by Paystack for the transaction.
 *                       example: "AC_1234567890abcdef"
 *                     order:
 *                       type: object
 *                       description: The created order details.
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "order123"
 *                         customerId:
 *                           type: string
 *                           example: "cust123"
 *                         totalAmount:
 *                           type: number
 *                           example: 2500
 *                         address:
 *                           type: object
 *                           example: { "street": "123 Main St", "city": "Lagos", "zip": "101001" }
 *                         serviceFee:
 *                           type: number
 *                           example: 100
 *                         deliveryFee:
 *                           type: number
 *                           example: 200
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-02-27T10:00:00Z"
 *                         transaction:
 *                           type: object
 *                           description: The associated transaction details.
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "trans456"
 *                             reference:
 *                               type: string
 *                               example: "REF_abcdef123456"
 *                             status:
 *                               type: string
 *                               example: "FAILED"
 *       400:
 *         description: Missing or invalid fields (e.g., one of email, amount, address, cartItems, serviceFee, or deliveryFee is missing).
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
 *               missingField:
 *                 summary: Missing required field
 *                 value:
 *                   status: "fail"
 *                   message: "One of the fields is missing (email, amount, address, cartItems, serviceFee, deliveryFee)"
 *       403:
 *         description: Access denied if the authenticated customer's ID or email does not match the request.
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
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
