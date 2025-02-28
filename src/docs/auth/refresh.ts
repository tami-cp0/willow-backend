/**
 * @openapi
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     description: >
 *       Refreshes the JWT access token and refresh token for the authenticated user.
 *       On success, new tokens are set as cookies.
 *       Rate limited to 1 request per minute.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *       - refreshCookieAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully. New tokens are set as cookies.
 *       401:
 *         description: Unauthorized. Possible reasons include missing or invalid tokens.
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
 *             example:
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
 *             example:
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
