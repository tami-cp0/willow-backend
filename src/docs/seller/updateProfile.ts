/**
 * @openapi
 * /sellers/{userId}/update-profile:
 *   patch:
 *     summary: Update seller profile
 *     description: >
 *       Updates the seller's profile. You may update one or more of the following:
 *       - **avatar**: Upload a new avatar file.
 *       - **businessName**: A new business name (max 20 characters).
 *       - **bio**: A new bio (max 255 characters).
 *       - **bucketName**: "avatars"
 *       At least one field (avatar, businessName, or bio) must be provided.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Sellers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID of the seller.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional file upload for the seller's avatar.
 *               businessName:
 *                 type: string
 *                 description: Optional new business name (max 20 characters).
 *                 example: "Green Supplies Inc."
 *               bio:
 *                 type: string
 *                 description: Optional new bio (max 255 characters).
 *                 example: "Leading provider of eco-friendly products."
 *               bucketName:
 *                 type: string
 *                 description: name of the bucket to upload to
 *                 example: avatars
 *     responses:
 *       200:
 *         description: Seller profile updated successfully.
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
 *                     userId:
 *                       type: string
 *                       example: "seller123"
 *                     businessName:
 *                       type: string
 *                       example: "Green Supplies Inc."
 *                     bio:
 *                       type: string
 *                       example: "Leading provider of eco-friendly products."
 *                     avatar:
 *                       type: object
 *                       properties:
 *                         key:
 *                           type: string
 *                           example: "avatar-key"
 *                         url:
 *                           type: string
 *                           example: "https://signed-url.com/avatar.jpg"
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
 *               noFieldProvided:
 *                 summary: No field provided for update
 *                 value:
 *                   status: "fail"
 *                   message: "At least one field (avatar, businessName, or bio) must be provided"
 *               invalidBusinessName:
 *                 summary: Business name validation error
 *                 value:
 *                   status: "fail"
 *                   message: "Business name must not exceed 20 characters"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the seller ID.
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
 *               accessDenied:
 *                 summary: Access denied
 *                 value:
 *                   status: "fail"
 *                   message: "Access denied"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
