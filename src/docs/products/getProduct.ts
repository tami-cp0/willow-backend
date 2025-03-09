/**
 * @openapi
 * /products/{productId}:
 *   get:
 *     summary: Get a single product
 *     description: >
 *       Retrieves detailed information for a single product by its ID, including associated reviews and seller information.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the product.
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
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
 *                     id:
 *                       type: string
 *                       example: "01F0abcdef1234567890"
 *                     name:
 *                       type: string
 *                       example: "Eco-Friendly Water Bottle"
 *                     description:
 *                       type: string
 *                       example: "A sustainable water bottle made from recycled materials."
 *                     images:
 *                       type: object
 *                       description: "JSON object representing product images."
 *                       example: { "thumbnail": "https://example.com/img1.jpg", "gallery": ["https://example.com/img2.jpg"] }
 *                     inStock:
 *                       type: integer
 *                       example: 50
 *                     onDemand:
 *                       type: boolean
 *                       example: false
 *                     category:
 *                       type: string
 *                       example: "Reusable Products"
 *                     options:
 *                       type: object
 *                       description: "Additional customizable options (e.g., color, size)."
 *                       example: { "color": ["red", "blue"], "size": "M" }
 *                     price:
 *                       type: number
 *                       example: 19.99
 *                     soldOut:
 *                       type: boolean
 *                       example: false
 *                     isReported:
 *                       type: boolean
 *                       example: false
 *                     reportCount:
 *                       type: integer
 *                       example: 0
 *                     reportMessages:
 *                       type: object
 *                       description: "Array of report messages."
 *                       example: []
 *                     approvalStatus:
 *                       type: string
 *                       enum: [PENDING, APPROVED, REJECTED]
 *                       example: "APPROVED"
 *                     sustainabilityFeatures:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["RECYCLED_MATERIALS", "LOW_CARBON"]
 *                     packaging:
 *                       type: string
 *                       enum: [PLASTIC_FREE, BIODEGRADABLE, RECYCLED_PAPER, REUSABLE, COMPOSTABLE, MINIMAL, GLASS, METAL, PLASTIC, ECO_FRIENDLY_FOAMS, ALUMINUM, BAMBOO, CORRUGATED_CARDBOARD, PAPERBOARD]
 *                       example: "BIODEGRADABLE"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T12:00:00Z"
 *                     seller:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: "seller123"
 *                         businessName:
 *                           type: string
 *                           example: "Green Supplies Inc."
 *                         bio:
 *                           type: string
 *                           example: "Leading provider of eco-friendly products."
 *                         status:
 *                           type: string
 *                           enum: [PENDING, APPROVED, FAILED]
 *                           example: "APPROVED"
 *                         avatar:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               example: "avatar-key"
 *                             url:
 *                               type: string
 *                               example: "https://signed-url.com/avatar.jpg"
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "review123"
 *                           productId:
 *                             type: string
 *                             example: "01F0abcdef1234567890"
 *                           customerId:
 *                             type: string
 *                             example: "customer456"
 *                           rating:
 *                             type: integer
 *                             example: 5
 *                           comment:
 *                             type: string
 *                             example: "Excellent product!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-27T11:00:00Z"
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
 *               missingProductId:
 *                 summary: Missing productId
 *                 value:
 *                   status: "fail"
 *                   message: "Product ID is required"
 *               invalidProductId:
 *                 summary: Invalid productId type
 *                 value:
 *                   status: "fail"
 *                   message: "Product ID must be a string"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
