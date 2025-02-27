/**
 * @openapi
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     description: >
 *       Refreshes the JWT access token and refresh token for the authenticated user.
 *       Requires a valid refresh token provided via cookies. On success, new tokens are set as cookies.
 *       Rate limited to 1 request per minute.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully. New tokens are set as cookies.
 *       401:
 *         description: Unauthorized. Possible reasons include missing or invalid refresh token.
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
 *               missingToken:
 *                 summary: Missing refresh token
 *                 value:
 *                   status: "fail"
 *                   message: "Login required"
 *               invalidToken:
 *                 summary: Invalid refresh token
 *                 value:
 *                   status: "fail"
 *                   message: "Login required"
 *       403:
 *         description: Forbidden. The account is not verified.
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
 *               accountNotVerified:
 *                 summary: Account is not verified
 *                 value:
 *                   status: "fail"
 *                   message: "Account is not verified"
 *       404:
 *         description: Not Found. The account does not exist.
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
 *               accountNotFound:
 *                 summary: Account not found
 *                 value:
 *                   status: "fail"
 *                   message: "Account does not exist: Invalid ID"
 *       429:
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
