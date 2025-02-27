/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP for account verification
 *     description: >
 *       Resends a one-time password (OTP) to the user's email for account verification.
 *       Rate limited to 1 request per minute.
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
 *         description: OTP successfully resent.
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
