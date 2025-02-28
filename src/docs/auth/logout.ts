/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: >
 *       Logs out the authenticated user.
 *       Rate limited to 5 requests per minute.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: User logged out successfully. No content is returned.
 *       401:
 *         description: Unauthorized. Possible reasons include missing or invalid access token,
 *           token blacklisting, or token verification failure.
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
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
