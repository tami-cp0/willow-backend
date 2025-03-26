/**
 * @openapi
 * /customers/{userId}/recommendations:
 *   get:
 *     summary: Get product recommendations for a customer
 *     description: >
 *       Retrieves the list of product recommendations for the specified customer. Each recommendation includes:
 *         - The customer ID.
 *         - The product ID.
 *         - Timestamps for creation and update.
 *         - The recommended product details (including its id, name, price, category, etc.).
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
 *         description: Recommendations retrieved successfully.
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T10:05:00Z"
 *                       product:
 *                         type: object
 *                         description: Details of the recommended product.
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
 *                           category:
 *                             type: string
 *                             example: "Reusable Products"
 *             examples:
 *               sampleRecommendations:
 *                 summary: Sample recommendations list
 *                 value:
 *                   status: "success"
 *                   data:
 *                     - customerId: "cust123"
 *                       productId: "prod456"
 *                       createdAt: "2025-02-27T10:00:00Z"
 *                       updatedAt: "2025-02-27T10:05:00Z"
 *                       product:
 *                         id: "prod456"
 *                         name: "Eco-Friendly Water Bottle"
 *                         price: 19.99
 *                         category: "Reusable Products"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match.
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
