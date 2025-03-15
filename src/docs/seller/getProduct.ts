/**
 * @openapi
 * /sellers/{userId}/products/{productId}:
 *   get:
 *     summary: Get a seller's product
 *     description: >
 *       Retrieves detailed information for a specific product owned by the seller. The product details include associated reviews and seller information.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Sellers
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller's user ID (must match the authenticated user).
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
 *                       example: "prod123"
 *                     name:
 *                       type: string
 *                       example: "Eco-Friendly Water Bottle"
 *                     description:
 *                       type: string
 *                       example: "A sustainable water bottle made from recycled materials."
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                             example: "image-key"
 *                           url:
 *                             type: string
 *                             example: "https://example.com/image-key"
 *                           size:
 *                             type: number
 *                             example: 102400
 *                           mimetype:
 *                             type: string
 *                             example: "image/jpeg"
 *                           originalname:
 *                             type: string
 *                             example: "product1.jpg"
 *                     inStock:
 *                       type: number
 *                       example: 100
 *                     onDemand:
 *                       type: boolean
 *                       example: false
 *                     category:
 *                       type: string
 *                       example: "Reusable Products"
 *                     options:
 *                       type: object
 *                       example: { "color": ["red", "blue"], "size": "M" }
 *                     price:
 *                       type: number
 *                       example: 19.99
 *                     sustainabilityFeatures:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["RECYCLED_MATERIALS", "ZERO_WASTE"]
 *                     packaging:
 *                       type: string
 *                       example: "BIODEGRADABLE"
 *                     sourcing:
 *                       type: string
 *                       example: "LOCALLY_SOURCED"
 *                     endOfLifeInfo:
 *                       type: string
 *                       example: "Recycle after use"
 *                     certification:
 *                       type: object
 *                       description: Certification file details (if provided).
 *                       properties:
 *                         certificate:
 *                           type: string
 *                           format: binary
 *                           description: The uploaded certification file.
 *                         certifiedBy:
 *                           type: string
 *                           description: Certifying authority.
 *                           example: "EcoCert"
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "review123"
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
 *               missingSellerId:
 *                 summary: Missing seller user ID
 *                 value:
 *                   status: "fail"
 *                   message: "Seller user ID is required"
 *               missingProductId:
 *                 summary: Missing product ID
 *                 value:
 *                   status: "fail"
 *                   message: "Product ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the seller user ID.
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
 *       404:
 *         description: Product not found.
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
 *               productNotFound:
 *                 summary: Product not found
 *                 value:
 *                   status: "fail"
 *                   message: "Product not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
