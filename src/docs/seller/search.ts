/**
 * @openapi
 * /{userId}/catalogue/search:
 *   get:
 *     summary: Search a seller's product catalogue
 *     description: >
 *       Allows a seller to search through their product catalog.
 *       Sellers can filter by approval status (**PENDING, APPROVED, REJECTED**) and use pagination.
 * 
 *       This route doesnt include total and totalPages necessary for pagination because it is considered expensive to calculate similarity just to count.
 *     tags:
 *       - Sellers Products Search
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: The seller's user ID.
 *       - in: query
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *           description: The search text query to match products.
 *       - in: query
 *         name: approvalStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           default: APPROVED
 *           description: Filter results by product approval status.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: Page number for pagination (default - "1").
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: Number of products per page (default - "20").
 *     responses:
 *       200:
 *         description: Products matching the search query retrieved successfully.
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
 *                   description: List of matching products with similarity scores.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "prod123"
 *                       name:
 *                         type: string
 *                         example: "Bamboo Toothbrush"
 *                       description:
 *                         type: string
 *                         example: "Eco-friendly toothbrush made from bamboo."
 *                       approvalStatus:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED]
 *                         example: "APPROVED"
 *                       similarity:
 *                         type: number
 *                         description: The computed similarity score from the embedding.
 *                         example: 0.12345
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *       400:
 *         description: Missing required query parameters.
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
 *               missingText:
 *                 summary: Missing text parameter
 *                 value:
 *                   status: "fail"
 *                   message: "text is missing"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
