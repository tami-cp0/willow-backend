import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { ErrorHandler } from '../utils/errorHandler';
import { config } from 'dotenv';
import prisma from '../app';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/sendEmails';
import { CartItem } from '@prisma/client';

config();

export default class PaymentController {
	private static readonly secret: string = process.env
		.PAYSTACK_LIVE_SECRET_KEY as string;
	private static readonly baseUrl: string = 'https://api.paystack.co';
	private static readonly paystackIps: string[] = [
		'52.31.139.75',
		'52.49.173.169',
		'52.214.14.220',
	];

	static async initializePayment(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		if (req.user.role !== 'CUSTOMER') {
			return next(new ErrorHandler(403, 'Accesss denied'));
		}

		try {
			// amonut in NGN
			let {
				email,
				amount,
				address,
				serviceFee,
				deliveryFee,
			} = req.body;
			const userId = req.user.id;

			if (userId !== req.params.userId || req.user.email !== email) {
				console.error(
					`${userId}:${req.user.email} is initiating payment for ${req.params.userId}:${email}`
				);
				return next(new ErrorHandler(403, 'Access denied'));
			}

			amount = amount ? JSON.parse(amount) : undefined;
			serviceFee = serviceFee ? JSON.parse(serviceFee) : undefined;
			deliveryFee = deliveryFee ? JSON.parse(deliveryFee) : undefined;

			if (
				!email ||
				amount  == null ||
				!address ||
				serviceFee == null ||
				deliveryFee == null
			) {
				console.log(req.body)
				return next(
					new ErrorHandler(
						400,
						'One of the fields is missing (email, amount, address, serviceFee, deliveryFee)'
					)
				);
			}

			// Prepare payload for Paystack (amount should be in kobo)
			const payload = {
				email,
				amount: Number(amount) * 100,
			};

			// Make POST request to Paystack using Axios
			const paystackResponse = await axios.post(
				'https://api.paystack.co/transaction/initialize',
				payload,
				{
					headers: {
						Authorization: `Bearer ${PaymentController.secret}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const parsedData = paystackResponse.data;
			if (!parsedData.data?.access_code) {
				console.error(
					`Paystack request error from ${email}: ${JSON.stringify(
						parsedData,
						null,
						2
					)}`
				);
				return next(
					new ErrorHandler(
						400,
						parsedData.data?.message || 'Failed to get access code'
					)
				);
			}

			const reference = parsedData.data.reference;
			const accessCode = parsedData.data.access_code;

			// get cart items
			const cart = await prisma.cart.findMany({
				where: {
					customerId: userId
				},
				include: {
					cartItems: true
				}
			}) as any;

			const cartItems: CartItem[] = cart.cartItems

			// Create the order, order items, and transaction in one Prisma query
			const order = await prisma.order.create({
				data: {
					customerId: userId,
					totalAmount: amount,
					address,
					serviceFee: Number(serviceFee),
					deliveryFee: Number(deliveryFee),
					orderItems: {
						create: cartItems.map((item: any) => ({
							productId: item.productId,
							sellerId: item.product.sellerId,
							quantity: item.quantity,
							price: item.product.price,
						})),
					},
					transaction: {
						create: {
							customerId: userId,
							totalAmount: amount,
							reference: reference,
							status: 'FAILED', // Default until payment confirmation via webhook
						},
					},
				},
				include: {
					transaction: true,
					orderItems: true,
				},
			});

			res.status(200).json({
				status: 'success',
				data: {
					accessCode,
					order,
				},
			});
		} catch (error) {
			console.error('Error initializing payment:', error);
			next(new ErrorHandler(500, 'Internal Server Error'));
		}
	}

	static async verify(req: Request, res: Response, next: NextFunction) {
		if (req.ip && !PaymentController.paystackIps.includes(req.ip)) {
			console.log(`Unauthorized IP: ${req.ip}`);
			throw new ErrorHandler(403, 'Access denied');
		}

		try {
			// Validate event signature
			const hash = crypto
				.createHmac('sha512', PaymentController.secret)
				.update(JSON.stringify(req.body))
				.digest('hex');

			if (hash !== req.headers['x-paystack-signature']) {
				console.log('Invalid signature');
				throw new ErrorHandler(400, 'Invalid signature');
			}

			const event = req.body;

			// Handle event types
			switch (event.event) {
				case 'charge.success':
					console.log('Payment successful:', event.data);

					const reference = event.data.reference
					const transaction = await prisma.transaction.update({
						where: {
							reference,
						},
						data: {
							paystackResponse: event.data,
							status: 'SUCCESS',
						},
						include: {
							customer: {
								include: {
									user: true
								}
							}
						}
					});

					sendEmail('payment', transaction.customer.user.email, '', '', null, {
						transferRef: reference,
						amount: transaction.totalAmount,
						orderId: transaction.orderId
					});
	
					break;

				case 'charge.failed':
					console.log('Payment failed:', event.data);
					// Payment is defaultly marked as failed.
					break;

				case 'bank.transfer.rejected':
					console.log('Payment Transfer failed:', event.data);
					// Payment is defaultly marked as failed.
					break;

				default:
					console.log('Unhandled event:', event.event);
					break;
			}
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	}

	// normal transfer implementation
	//   static async withdrawPayment(req: Request, res: Response, next: NextFunction) {
	// 	const { accountNumber, bankCode, amount } = req.body;
	// 	if (!accountNumber || !bankCode || !amount) {
	// 		return next(new ErrorHandler(400, 'At least one field (accountNumber, bankCode, amount) is required'));
	// 	}

	// 	if (req.user.role !== 'SELLER') {
	// 		return next(new ErrorHandler(403, 'Accesss denied'));
	// 	}

	// 	try {
	// 		const orders = await prisma.orderItem.findMany({
	// 			where: {
	// 				sellerId: req.user.id,
	// 				order: {
	// 					transaction: {
	// 						status: 'SUCCESS'
	// 					}
	// 				}
	// 			},
	// 			include: {
	// 				product: true
	// 			}
	// 		});

	// 		if (orders.length === 0) {
	// 			return next(new ErrorHandler(400, 'You have no sales'))
	// 		}

	// 		const revenue = orders.reduce((sum, order) => sum + order.product.price, 0);

	// 		if (Number(amount) > revenue) {
	// 			return next(new ErrorHandler(400, 'Insufficient balance'));
	// 		}

	// 		const resolveRes = await axios.get(
	// 			`${PaymentController.baseUrl}/bank/resolve`,
	// 			{
	// 				params: { account_number: accountNumber, bank_code: bankCode },
	// 				headers: {
	// 					Authorization: `Bearer ${PaymentController.secret}`,
	// 					'Content-Type': 'application/json'
	// 				}
	// 			}
	// 		)

	// 		const transferReceiptRes = await axios.post(
	// 			`${PaymentController.baseUrl}/transferrecipient`,
	// 			{
	// 			  type: 'nuban',
	// 			  name: resolveRes.data.data.account_name,
	// 			  account_number: accountNumber,
	// 			  bank_code: bankCode,
	// 			  currency: 'NGN',
	// 			},
	// 			{
	// 			  headers: {
	// 				Authorization: `Bearer ${PaymentController.secret}`,
	// 				'Content-Type': 'application/json',
	// 			  },
	// 			}
	// 		  );
	// 		console.log(`transferReceiptRes: ${JSON.stringify(transferReceiptRes.data, null, 2)}`);

	// 		const transferReference = {
	// 			"source": "balance",
	// 			"reason": "sales withdrawal",
	// 			amount: amount * 100, // NGN to kobo
	// 			"reference": uuidv4(),
	// 			"recipient": transferReceiptRes.data.data.recipient_code
	// 		}

	// 		// initiate transfer
	// 		const transferRes = await axios.post(
	// 			`${PaymentController.baseUrl}/transfer`,
	// 			transferReference,
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${PaymentController.secret}`,
	// 					"Content-Type": "application/json"
	// 				}
	// 			}
	// 		)
	// 		console.log(`transferReceiptRes: ${JSON.stringify(transferRes.data, null, 2)}`);

	// 		res.status(200).send("sent")
	// 	} catch (error: any) {
	// 		if (axios.isAxiosError(error)) {
	// 			console.log(error.response?.data)
	// 			return next(new ErrorHandler(500, error.response?.data.message));
	// 		}
	// 		return next(error);
	// 	}
	//   }
}
