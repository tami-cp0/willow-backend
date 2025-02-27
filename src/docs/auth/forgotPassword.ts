/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     description: >
 *       Generates a password reset token valid for 10 minutes and sends a password reset email
 *       to the specified email address. This endpoint is rate limited to 1 request per minute.
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
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: A password reset link has been sent to the user's email.
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
 *                   example: "A password reset link has been sent to your email"
 *                 data:
 *                   type: string
 *                   description: The password reset token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *               emailNotRegistered:
 *                 summary: Email not registered
 *                 value:
 *                   status: "fail"
 *                   message: "Email is not registered to an account"
 *       429:
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
