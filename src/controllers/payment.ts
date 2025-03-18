import e, { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { ErrorHandler } from '../utils/errorHandler';
import { ClientRequest, IncomingMessage } from 'http';
import { config } from 'dotenv';

config();

export default class PaymentController {
	private static readonly secret: string = process.env
		.PAYSTACK_LIVE_SECRET_KEY as string;
	// private static readonly baseUrl: string = "https://api.paystack.co";
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
		const https = require('https');
        const { email, amount } = req.body;
        console.log(email, amount);

		const params = JSON.stringify({ email, amount });

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
            paystackRes.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    console.log(parsedData);
                    res.status(200).json({
                        status: 'success',
                        data: parsedData, // Return Paystack response
                    });
                } catch (error) {
                    console.log(`Invalid response from Paystack when initializing payment for ${email}`);
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
					// TODO: Update order/payment status in DB
					break;

				case 'charge.failed':
					console.log('Payment failed:', event.data);
					// TODO: Mark payment as failed in DB
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
