/**
 * @openapi
 * /sellers/{userId}/products:
 *   get:
 *     summary: Get seller's products - paginated
 *     description: >
 *       Retrieves a paginated list of products offered by the specified seller.
 *       Optional query parameters can filter products by approval status (PENDING, APPROVED, REJECTED, OUT_OF_STOCK).
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Sellers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller's user ID (must match the authenticated user).
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Optional filter for product approval status.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: string
 *         description: Page number for pagination (default is "1").
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: string
 *         description: Number of products per page (default is "20").
 *     responses:
 *       200:
 *         description: A list of products with pagination details.
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
 *                       id:
 *                         type: string
 *                         example: "prod123"
 *                       name:
 *                         type: string
 *                         example: "Eco-Friendly Water Bottle"
 *                       description:
 *                         type: string
 *                         example: "A sustainable water bottle made from recycled materials."
 *                       images:
 *                         type: object
 *                         description: JSON object representing product images.
 *                         example: { "thumbnail": "https://example.com/img1.jpg", "gallery": ["https://example.com/img2.jpg"] }
 *                       inStock:
 *                         type: integer
 *                         example: 50
 *                       onDemand:
 *                         type: boolean
 *                         example: false
 *                       category:
 *                         type: string
 *                         example: "Reusable Products"
 *                       options:
 *                         type: object
 *                         description: Additional options (e.g., color, size).
 *                         example: { "color": ["red", "blue"], "size": "M" }
 *                       price:
 *                         type: number
 *                         example: 19.99
 *                       soldOut:
 *                         type: boolean
 *                         example: false
 *                       isReported:
 *                         type: boolean
 *                         example: false
 *                       reportCount:
 *                         type: integer
 *                         example: 0
 *                       reportMessages:
 *                         type: object
 *                         description: Array of report messages.
 *                         example: []
 *                       approvalStatus:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED]
 *                         example: "APPROVED"
 *                       sustainabilityFeatures:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["RECYCLED_MATERIALS", "LOW_CARBON"]
 *                       packaging:
 *                         type: string
 *                         enum: [PLASTIC_FREE, BIODEGRADABLE, RECYCLED_PAPER, REUSABLE, COMPOSTABLE, MINIMAL, GLASS, METAL, PLASTIC, ECO_FRIENDLY_FOAMS, ALUMINUM, BAMBOO, CORRUGATED_CARDBOARD, PAPERBOARD]
 *                         example: "BIODEGRADABLE"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-27T12:00:00Z"
 *                       seller:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: "seller123"
 *                           businessName:
 *                             type: string
 *                             example: "Green Supplies Inc."
 *                           bio:
 *                             type: string
 *                             example: "Leading provider of eco-friendly products."
 *                           status:
 *                             type: string
 *                             enum: [PENDING, APPROVED, FAILED]
 *                             example: "APPROVED"
 *                           avatar:
 *                             type: object
 *                             properties:
 *                               key:
 *                                 type: string
 *                                 example: "avatar-key"
 *                               url:
 *                                 type: string
 *                                 example: "https://signed-url.com/avatar.jpg"
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "review123"
 *                             productId:
 *                               type: string
 *                               example: "prod123"
 *                             customerId:
 *                               type: string
 *                               example: "customer456"
 *                             rating:
 *                               type: integer
 *                               example: 5
 *                             comment:
 *                               type: string
 *                               example: "Excellent product!"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-02-27T11:00:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
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
 *               missingUserId:
 *                 summary: Missing seller user ID
 *                 value:
 *                   status: "fail"
 *                   message: "Seller user ID is required"
 *               invalidStatus:
 *                 summary: Invalid status value
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid status"
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
