/**
 * @openapi
 * /products/search:
 *   get:
 *     summary: Search for products
 *     description: >
 *       Performs a similarity-based search for products that are approved for listing.
 *       Optional pagination parameters include **page** and **limit**.
 * 
 *       This route doesnt include total and totalPages necessary for pagination because it is considered expensive to calculate similarity just to count.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *           description: The text query to search for.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: string
 *           description: Page number for pagination (default - "1").
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: string
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
 *                   description: List of products with a similarity score.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "prod123"
 *                       name:
 *                         type: string
 *                         example: "Eco-Friendly Water Bottle"
 *                       description:
 *                         type: string
 *                         example: "A sustainable water bottle made from recycled materials."
 *                       price:
 *                         type: number
 *                         example: 19.99
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
 *               missingUserId:
 *                 summary: Missing userId parameter
 *                 value:
 *                   status: "fail"
 *                   message: "userId is missing"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
