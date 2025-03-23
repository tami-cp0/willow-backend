/**
 * @openapi
 * /sellers/{userId}/products:
 *   post:
 *     summary: Create a new product
 *     description: >
 *       Creates a new product for the authenticated seller. The request must be sent as multipart/form-data and include:
 *       
 *       **File fields:**
 *       - **images** (required): An array of product image files (at least one, up to five).
 *       - **certificate** (optional): A file upload for product certification. If provided, its details will be stored under the
 *         **certification** object.
 *       
 *       **Dropdown && fields to NOTE:**
 *       - **sustainabilityFeatures** (array, required): An array of sustainability features.
 *         Allowed values: BIODEGRADABLE, COMPOSTABLE, REUSABLE, RECYCLED_MATERIALS, WATER_EFFICIENT, SOLAR_POWERED, MINIMAL_CARBON_FOOTPRINT, ENERGY_EFFICIENT, ZERO_WASTE, PLASTIC_FREE, REPAIRABLE_DESIGN, UPCYCLED, CARBON_OFFSET, ORGANIC_MATERIALS, FAIR_TRADE, VEGAN, NON_TOXIC, REGENERATIVE_AGRICULTURE, SLOW_PRODUCTION, WASTE_REDUCING_DESIGN, CIRCULAR_DESIGN, WILDLIFE_FRIENDLY.
 *       - **packaging** (string, required): Packaging type.
 *         Allowed values: PLASTIC_FREE, BIODEGRADABLE, RECYCLED_PAPER, REUSABLE, COMPOSTABLE, MINIMAL, GLASS, METAL, PLASTIC, ECO_FRIENDLY_FOAMS, ALUMINUM, BAMBOO, CORRUGATED_CARDBOARD, PAPERBOARD.
 *       - **sourcing** (string, required): Product sourcing.
 *         Allowed values: LOCALLY_SOURCED, INTERNATIONALLY_SOURCED.
 *       - **certification** (object, optional): An object containing certification details.
 *           - **certificate** (file, optional): The certification file.
 *           - **certifiedBy** (string, optional): The certifying authority.
 *       
 *       **Note:** The seller's user ID is provided as a path parameter and should not be included in the request body.
 *       
 *       After product creation, a sustainability vetting process is executed. Depending on the result, the system
 *       updates the product with sustainabilityScore, sustainabilityScoreReason, sustainabilityTag, and approvalStatus.
 *       A response message is then returned indicating whether the product is approved, rejected, or if extended vetting is required.
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (required, at least one, up to five).
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Optional certification file. Its details will be stored within the **certification** object.
 *               certifiedBy:
 *                 type: string
 *                 description: Optional certifying authority.
 *                 example: "EcoCert"
 *               name:
 *                 type: string
 *                 description: Product name (1-50 characters).
 *                 example: "Eco-Friendly Water Bottle"
 *               description:
 *                 type: string
 *                 description: Product description (1-1000 characters).
 *                 example: "A sustainable water bottle made from recycled materials."
 *               inStock:
 *                 type: number
 *                 description: Available stock quantity. *Required if onDemand is false.*
 *                 example: 100
 *               onDemand:
 *                 type: boolean
 *                 description: Indicates if the product is produced on demand.
 *                 example: false
 *               category:
 *                 type: string
 *                 description: Product category.
 *                 example: "Reusable Products"
 *               options:
 *                 type: object
 *                 description: Optional customizable options (e.g., color, size).
 *                 example: { "color": ["red", "blue"], "size": "M" }
 *               price:
 *                 type: number
 *                 description: Product price.
 *                 example: 19.99
 *               sustainabilityFeatures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [BIODEGRADABLE, COMPOSTABLE, REUSABLE, RECYCLED_MATERIALS, WATER_EFFICIENT, SOLAR_POWERED, MINIMAL_CARBON_FOOTPRINT, ENERGY_EFFICIENT, ZERO_WASTE, PLASTIC_FREE, REPAIRABLE_DESIGN, UPCYCLED, CARBON_OFFSET, ORGANIC_MATERIALS, FAIR_TRADE, VEGAN, NON_TOXIC, REGENERATIVE_AGRICULTURE, SLOW_PRODUCTION, WASTE_REDUCING_DESIGN, CIRCULAR_DESIGN, WILDLIFE_FRIENDLY]
 *                 description: Sustainability features.
 *                 example: ["RECYCLED_MATERIALS", "ZERO_WASTE"]
 *               packaging:
 *                 type: string
 *                 description: Packaging type. (Dropdown)
 *                 enum: [PLASTIC_FREE, BIODEGRADABLE, RECYCLED_PAPER, REUSABLE, COMPOSTABLE, MINIMAL, GLASS, METAL, PLASTIC, ECO_FRIENDLY_FOAMS, ALUMINUM, BAMBOO, CORRUGATED_CARDBOARD, PAPERBOARD]
 *                 example: "BIODEGRADABLE"
 *               sourcing:
 *                 type: string
 *                 description: Product sourcing. (Dropdown)
 *                 enum: [LOCALLY_SOURCED, INTERNATIONALLY_SOURCED]
 *                 example: "LOCALLY_SOURCED"
 *               endOfLifeInfo:
 *                 type: string
 *                 description: Disposal or recycling instructions.
 *                 example: "Recycle after use"
 *             required:
 *               - images
 *               - name
 *               - description
 *               - onDemand
 *               - category
 *               - price
 *               - sustainabilityFeatures
 *               - packaging
 *               - sourcing
 *     responses:
 *       200:
 *         description: >
 *           The product was created successfully. Depending on the sustainability vetting result:
 *           - If the sustainability score is "0" or "0.5", a message is returned indicating that extended vetting is required or the product is rejected.
 *           - Otherwise, the product data is returned with updated sustainability scores and approval status.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     message:
 *                       type: string
 *                       example: "Thank you for your submission. Based on our initial assessment, the available data was insufficient for a definitive sustainability evaluation. We invite you to apply for extended vetting."
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "success"
 *                     message:
 *                       type: string
 *                       example: "Congratulations! Your product has met our sustainability criteria and has been approved for listing on our eco-friendly marketplace. Thank you for contributing to a more responsible and sustainable future."
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "prod123"
 *                         name:
 *                           type: string
 *                           example: "Eco-Friendly Water Bottle"
 *                         description:
 *                           type: string
 *                           example: "A sustainable water bottle made from recycled materials."
 *                         images:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               key:
 *                                 type: string
 *                                 example: "image-key"
 *                               url:
 *                                 type: string
 *                                 example: "https://pub-98b899a5168d4e2285d560ccb413a7f5.r2.dev/image-key"
 *                               size:
 *                                 type: number
 *                                 example: 102400
 *                               mimetype:
 *                                 type: string
 *                                 example: "image/jpeg"
 *                               originalname:
 *                                 type: string
 *                                 example: "product1.jpg"
 *                         inStock:
 *                           type: number
 *                           example: 100
 *                         onDemand:
 *                           type: boolean
 *                           example: false
 *                         category:
 *                           type: string
 *                           example: "Reusable Products"
 *                         options:
 *                           type: object
 *                           example: { "color": ["red", "blue"], "size": "M" }
 *                         price:
 *                           type: number
 *                           example: 19.99
 *                         sustainabilityFeatures:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["RECYCLED_MATERIALS", "ZERO_WASTE"]
 *                         packaging:
 *                           type: string
 *                           example: "BIODEGRADABLE"
 *                         sourcing:
 *                           type: string
 *                           example: "LOCALLY_SOURCED"
 *                         endOfLifeInfo:
 *                           type: string
 *                           example: "Recycle after use"
 *                         certification:
 *                           type: object
 *                           description: Certification details.
 *                           properties:
 *                             certificate:
 *                               type: string
 *                               format: binary
 *                               description: The uploaded certification file.
 *                             certifiedBy:
 *                               type: string
 *                               description: Certifying authority.
 *                               example: "EcoCert"
 *                         sellerId:
 *                           type: string
 *                           example: "seller123"
 *                         sustainabilityScore:
 *                           type: string
 *                           example: "85"
 *                         sustainabilityScoreReason:
 *                           type: string
 *                           example: "High sustainability standards met."
 *                         sustainabilityTag:
 *                           type: string
 *                           example: "Eco-Friendly"
 *                         approvalStatus:
 *                           type: string
 *                           example: "APPROVED"
 *       400:
 *         description: Validation error or bad request. (e.g., missing required fields, invalid enum values)
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
 *               missingImages:
 *                 summary: No images provided
 *                 value:
 *                   status: "fail"
 *                   message: "Product Images are required"
 *               invalidProductName:
 *                 summary: Product name validation error
 *                 value:
 *                   status: "fail"
 *                   message: "Product name must be between 1 and 50 characters"
 *               invalidPackaging:
 *                 summary: Packaging type error
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid packaging type"
 *               invalidSourcing:
 *                 summary: Sourcing value error
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid sourcing provided"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the seller's ID.
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
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
