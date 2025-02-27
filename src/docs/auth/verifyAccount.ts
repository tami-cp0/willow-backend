/**
 * @openapi
 * /auth/verify-account:
 *   patch:
 *     summary: Verify user account using OTP
 *     description: >
 *       Verifies a user's account by validating the provided email and OTP.
 *       If the OTP is valid, the user's account is updated as verified, and JWT access and refresh tokens are generated and sent as cookies.
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
 *               otp:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: Account verified successfully and tokens set.
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
 *               emailNotRegistered:
 *                 summary: Email not registered
 *                 value:
 *                   status: "fail"
 *                   message: "Email is not registered to an account"
 *               missingOtp:
 *                 summary: Missing OTP field
 *                 value:
 *                   status: "fail"
 *                   message: "OTP is required"
 *               invalidOtpFormat:
 *                 summary: Invalid OTP format
 *                 value:
 *                   status: "fail"
 *                   message: "Invalid OTP"
 *       401:
 *         description: Unauthorized - invalid OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
