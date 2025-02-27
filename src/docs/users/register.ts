/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Registers a new user. Depending on the provided role, additional data is required:
 *       - For CUSTOMER: `firstname` and `lastname` must be provided.
 *       - For SELLER: `businessName` must be provided.
 *       On success, an OTP is sent to the provided email.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, SELLER, ADMIN]
 *                 example: "CUSTOMER"
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               businessName:
 *                 type: string
 *                 example: "John's Store"
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User registered successfully and OTP sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "An OTP has been sent to your email"
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
 *               missingEmail:
 *                 summary: Missing email field
 *                 value:
 *                   status: "fail"
 *                   message: "Email is required"
 *               invalidEmail:
 *                 summary: Invalid email address provided
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid email address"
 *               emailInUse:
 *                 summary: Email already in use
 *                 value:
 *                   status: "fail"
 *                   message: "Email is already in use"
 *               missingPassword:
 *                 summary: Missing password field
 *                 value:
 *                   status: "fail"
 *                   message: "Password is required"
 *               invalidRole:
 *                 summary: Role is invalid
 *                 value:
 *                   status: "fail"
 *                   message: "Role must be one of CUSTOMER, SELLER, ADMIN"
 *               missingFirstname:
 *                 summary: Missing first name for CUSTOMER
 *                 value:
 *                   status: "fail"
 *                   message: "First name is required"
 *               missingLastname:
 *                 summary: Missing last name for CUSTOMER
 *                 value:
 *                   status: "fail"
 *                   message: "Last name is required"
 *               missingBusinessName:
 *                 summary: Missing business name for SELLER
 *                 value:
 *                   status: "fail"
 *                   message: "Business name is required"
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
