/**
 * @openapi
 * /customers/{userId}/products/{productId}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a product review
 *     description: >
*       Deletes a review from a product.
 *       This endpoint requires cookie-based authentication.
 *     tags:
 *       - Customers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer's user ID (must match the authenticated user).
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID for which the review was created.
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the review.
 *     responses:
 *       204:
 *         description: Review deleted successfully. No content is returned.
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
 *               missingUserId:
 *                 summary: Missing customer user ID
 *                 value:
 *                   status: "fail"
 *                   message: "Customer user ID is required"
 *               missingProductId:
 *                 summary: Missing product ID
 *                 value:
 *                   status: "fail"
 *                   message: "Product ID is required"
 *               missingReviewId:
 *                 summary: Missing review ID
 *                 value:
 *                   status: "fail"
 *                   message: "Review ID is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied if the authenticated user's ID does not match the customer user ID.
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
 *       404:
 *         description: Review not found, or review does not belong to the specified product or customer.
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
 *               reviewNotFound:
 *                 summary: Review not found
 *                 value:
 *                   status: "fail"
 *                   message: "Review not found"
 *       429:
 *         $ref: '#/components/responses/RateLimitModerate'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
