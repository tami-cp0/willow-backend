/**
 * @openapi
 * /users/{userId}/delete:
 *   delete:
 *     summary: Delete a user account
 *     description: >
 *       Deletes the account of the authenticated user.
 *       Rate limited to 1 request per minute.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     responses:
 *       204:
 *         description: User deleted successfully. No content is returned.
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
 *         $ref: '#/components/responses/RateLimitStrict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
