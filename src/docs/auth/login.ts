/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: >
 *       Authenticates a user using email and password. On successful authentication,
 *       JWT access and refresh tokens are generated and set as cookies.
 *       If the login request originates from a new IP address, a notification email is sent.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Auth
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
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User successfully logged in.
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
 *                   example: "Successfully logged in"
 *                 data:
 *                   type: object
 *                   description: Sanitized user object (excluding sensitive fields)
 *                   example:
 *                     id: "user_id"
 *                     email: "jane.doe@example.com"
 *                     role: "CUSTOMER"
 *                     isVerified: true
 *                     customer: { firstname: "Jane", lastname: "Doe" }
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
 *                 summary: Invalid email address
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid email address"
 *               missingPassword:
 *                 summary: Missing password field
 *                 value:
 *                   status: "fail"
 *                   message: "Password is required"
 *               shortPassword:
 *                 summary: Password too short
 *                 value:
 *                   status: "fail"
 *                   message: "Password must be at least 6 characters long"
 *               invalidCredentials:
 *                 summary: Invalid email or password
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid email or password"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
