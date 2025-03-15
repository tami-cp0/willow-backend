/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get user details
 *     description: >
 *       Retrieves the details of the authenticated user plus customer/seller details which depends on what the user signed up as.
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
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user123"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "CUSTOMER"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     lastLoggedIn:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T10:00:00Z"
 *                     lastKnownIp:
 *                       type: string
 *                       example: "192.168.1.1"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T09:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-27T10:00:00Z"
 *       400:
 *         description: Bad request due to missing or invalid parameters.
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
 *               missingUserId:
 *                 summary: Missing user ID parameter
 *                 value:
 *                   status: "fail"
 *                   message: "User ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitMinimal'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
