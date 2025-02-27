/**
 * @openapi
 * components:
 *   responses:
 *     InternalError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "error"
 *               message:
 *                 type: string
 *                 example: "Internal server error"
 *     
 *     UnauthorizedError:
 *       description: Authentication is required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Login required"
 *     
 *     RateLimitMinimal:
 *       description: Rate limit exceeded (100 requests per 5 minutes)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Too many requests, please try again after 5 minutes"
 *     
 *     RateLimitModerate:
 *       description: Rate limit exceeded (5 requests per minute)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Too many requests, please try again after 1 minute"
 *     
 *     RateLimitStrict:
 *       description: Rate limit exceeded (1 request per minute)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "fail"
 *               message:
 *                 type: string
 *                 example: "Too many requests, please try again after 1 minute"
 */