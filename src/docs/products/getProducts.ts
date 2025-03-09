/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     description: >
 *       Retrieves all products with optional pagination and filtering by approval status.
 *       Query parameters:
 *       - **page**: The page number for pagination (default is "1").
 *       - **limit**: The number of products per page (default is "20").
 *       - **status**: Filter by product approval status (allowed values: PENDING, APPROVED, REJECTED).
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: The page number for pagination (default - "1").
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: The number of products per page (default - "20").
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter products by approval status.
 *     responses:
 *       200:
 *         description: A list of products along with pagination details.
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
 *                     description: Product object (structure may vary)
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 100
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 20
 *                     totalPages:
 *                       type: number
 *                       example: 5
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
 *               invalidPage:
 *                 summary: Invalid page parameter
 *                 value:
 *                   status: "fail"
 *                   message: "Page must be a string"
 *               invalidLimit:
 *                 summary: Invalid limit parameter
 *                 value:
 *                   status: "fail"
 *                   message: "Limit must be a string"
 *               invalidStatus:
 *                 summary: Invalid status parameter
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid status"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
