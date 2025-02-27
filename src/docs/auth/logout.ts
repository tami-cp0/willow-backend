/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: >
 *       Logs out the authenticated user by blacklisting the current access token, clearing the refresh token,
 *       and removing the user's cached data. This endpoint requires a valid access token provided via cookies.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Auth
 *     responses:
 *       204:
 *         description: User logged out successfully. No content is returned.
 *       401:
 *         description: Unauthorized. Possible reasons include missing or invalid access token,
 *           token blacklisted, or token verification failure.
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
 *               loginRequired:
 *                 summary: Missing or invalid access token
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
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
