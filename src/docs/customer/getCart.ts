/**
 * @openapi
 * /customers/{userId}/cart:
 *   get:
 *     summary: Get customer cart
 *     description: >
 *       Retrieves the shopping cart for the specified customer.
 *       If no cart exists, an empty cart structure is returned (with `cartItems` as an empty array).
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
 *         description: Customer cart retrieved successfully.
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
 *                     cartItems:
 *                       type: array
 *                       description: List of items in the customer's cart.
 *                       items:
 *                         type: object
 *                         properties:
 *                           cartId:
 *                             type: string
 *                             example: "cart123"
 *                           productId:
 *                             type: string
 *                             example: "prod456"
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           product:
 *                             type: object
 *                             description: Product details.
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "prod456"
 *                               name:
 *                                 type: string
 *                                 example: "Eco-Friendly Water Bottle"
 *                               price:
 *                                 type: number
 *                                 example: 19.99
 *             examples:
 *               emptyCart:
 *                 summary: No cart exists
 *                 value:
 *                   status: "success"
 *                   data: { "cartItems": [] }
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
