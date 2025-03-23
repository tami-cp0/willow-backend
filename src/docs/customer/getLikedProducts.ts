/**
 * @openapi
 * /customers/{userId}/liked-products:
 *   get:
 *     summary: Get liked products
 *     description: >
 *       Retrieves a list of products that the customer has liked.
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
 *         description: Liked products retrieved successfully.
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
 *                       customerId:
 *                         type: string
 *                         example: "cust123"
 *                       productId:
 *                         type: string
 *                         example: "prod456"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T11:00:00Z"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "prod456"
 *                           name:
 *                             type: string
 *                             example: "Eco-Friendly Water Bottle"
 *                           price:
 *                             type: number
 *                             example: 19.99
 *                           seller:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                                 example: "seller123"
 *                               businessName:
 *                                 type: string
 *                                 example: "Green Supplies Inc."
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
