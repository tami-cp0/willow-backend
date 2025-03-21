/**
 * @openapi
 * /customers/{userId}/update-profile:
 *   post:
 *     summary: Update customer profile
 *     description: >
 *       Updates the profile of the authenticated customer. At least one of the following fields must be provided:
 *         - **firstname** (string, optional)
 *         - **lastname** (string, optional)
 *         - **address** (object, optional): A valid JSON object representing the customer's address.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The customer's first name.
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 description: The customer's last name.
 *                 example: "Doe"
 *               address:
 *                 type: object
 *                 description: The customer's address as a JSON object.
 *                 example: { "street": "123 Main St", "city": "Anytown", "zip": "12345" }
 *             example:
 *               firstname: "John"
 *               lastname: "Doe"
 *               address: { "street": "123 Main St", "city": "Anytown", "zip": "12345" }
 *     responses:
 *       200:
 *         description: Customer profile updated successfully.
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
 *                       example: "cust123"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     address:
 *                       type: object
 *                       example: { "street": "123 Main St", "city": "Anytown", "zip": "12345" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user123"
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: "john.doe@example.com"
 *                         role:
 *                           type: string
 *                           example: "CUSTOMER"
 *       400:
 *         description: Validation error or bad request. (e.g. when none of firstname, lastname, or address is provided)
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
 *                 summary: No fields provided for update
 *                 value:
 *                   status: "fail"
 *                   message: "At least one field (firstname, lastname, or address) must be provided"
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
 */
