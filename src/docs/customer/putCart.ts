/**
 * @openapi
 * /customers/{userId}/cart/{productId}:
 *   put:
 *     summary: Upsert cart item
 *     description: >
 *       Adds a new item to the customer's cart or updates the quantity of an existing item.
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
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the product to add or update in the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product. Must be at least 1.
 *                 example: 3
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Cart item upserted successfully.
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
 *                     cartId:
 *                       type: string
 *                       example: "cust123" 
 *                     productId:
 *                       type: string
 *                       example: "prod456"
 *                     quantity:
 *                       type: number
 *                       example: 3
 *             examples:
 *               updatedItem:
 *                 summary: Item updated
 *                 value:
 *                   status: "success"
 *                   data: { "cartId": "cust123", "productId": "prod456", "quantity": 3 }
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
 *               missingQuantity:
 *                 summary: Missing quantity field
 *                 value:
 *                   status: "fail"
 *                   message: "Quantity is required"
 *               invalidQuantity:
 *                 summary: Invalid quantity
 *                 value:
 *                   status: "fail"
 *                   message: "Quantity must be a number and at least 1"
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
