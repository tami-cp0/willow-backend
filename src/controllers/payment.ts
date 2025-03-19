import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import https from 'https';
import { ErrorHandler } from '../utils/errorHandler';
import { ClientRequest, IncomingMessage } from 'http';
import { config } from 'dotenv';
import prisma from '../app';

config();

export default class PaymentController {
	private static readonly secret: string = process.env
		.PAYSTACK_LIVE_SECRET_KEY as string;
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
		try {
		  const { email, amount, address, cartItems, serviceFee, deliveryFee } = req.body; // cartItems = [{ sellerId, productId, quantity, price }, ...]
		  const userId = req.user.id;
	  
		  if (userId !== req.params.userId || req.user.email !== email) {
			console.error(`${userId}:${req.user.email} is initiating payment for ${req.params.userId}:${email}`);
			next(new ErrorHandler(403, 'Access denied'));
		  }
	  
		  if (!email || !amount || !address || !cartItems?.length || !serviceFee || !deliveryFee) {
			next(new ErrorHandler(400, 'One of the fields is missing (email, amount, address, cartItems, serviceFee, deliveryFee)'));
		  }
	  
		  // Prepare Paystack payload (amount in kobo)
		  const params = JSON.stringify({ email, amount });
	  
		  // Paystack API options
		  const options = {
			hostname: 'api.paystack.co',
			port: 443,
			path: '/transaction/initialize',
			method: 'POST',
			headers: {
			  Authorization: `Bearer ${PaymentController.secret}`,
			  'Content-Type': 'application/json',
			},
		  };
	  
		  const paystackRequest: ClientRequest = https.request(options, (paystackRes: IncomingMessage) => {
			let data = '';
	  
			// Collect response chunks
			paystackRes.on('data', (chunk) => {
			  data += chunk;
			});
	  
			// When response is fully received
			paystackRes.on('end', async () => {
			  try {
				const parsedData = JSON.parse(data);
	  
				if (!parsedData.data?.access_code) {
				  console.error(`Paystack request error from ${email}: ${JSON.stringify(parsedData, null, 2)}`);
				  return next(new ErrorHandler(400, parsedData.data?.message || "Failed to get access code"));
				}
	  
				const reference = parsedData.data.reference;
				const accessCode = parsedData.data.access_code;
	  
				// Create the order, order items, and transaction in one Prisma query
				const order = await prisma.order.create({
				  data: {
					customerId: userId,
					totalAmount: amount / 100, // Convert kobo to NGN
					address,
					serviceFee: Number(serviceFee),
					deliveryFee: Number(deliveryFee),
					// Create order items directly from cartItems
					orderItems: {
					  create: cartItems.map((item: any) => ({
						productId: item.productId,
						sellerId: item.product.sellerId,
						quantity: item.quantity,
						price: item.product.price,
					  })),
					},
					// Create transaction (using the sellerId of the first cart item)
					transaction: {
					  create: {
						customerId: userId,
						totalAmount: amount / 100, // Convert kobo to NGN
						reference: parsedData.data.reference,
						status: "FAILED", // Default until payment confirmation via webhook
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
				console.error(`Invalid response from Paystack when initializing payment for ${email}`, error);
				next(new ErrorHandler(500, 'Invalid response from Paystack'));
			  }
			});
		  });
	  
		  // Handle request errors
		  paystackRequest.on('error', (error) => {
			console.error(`Payment initialization failed for ${email}:`, error);
			next(new ErrorHandler(500, 'Initialization failed'));
		  });
	  
		  // Send request body & finalize
		  paystackRequest.write(params);
		  paystackRequest.end();
		} catch (error) {
		  console.error('Error initializing payment:', error);
		  next(new ErrorHandler(500, 'Internal Server Error'));
		}
	  }
	  

	static async verifyPayment(
		req: Request,
		res: Response,
		next: NextFunction
	) {
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
					await prisma.transaction.update({
						where: {
							reference: event.data.reference
						},
						data: {
							paystackResponse: event.parsedData,
							status: 'SUCCESS'
						}
					});
					break;

				case 'charge.failed':
					console.log('Payment failed:', event.data);
					// payment is defaultly marked as failed.
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
}
