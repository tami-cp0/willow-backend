import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import cache from './cache';
import { ErrorHandler } from './errorHandler';
import { Product } from '@prisma/client';
import { newLoginLocationEmailTemplate, newProductSubmissionWithCertificateEmailTemplate, otpEmailTemplate, passwordResetEmailTemplate, paymentSuccessEmailTemplate, productOutcomeEmailTemplates } from './emailTemplates';

config();

type Image = {
	key: string;
	url: string;
	size: number;
	mimetype: string;
	originalname: string;
};

const generateOTP = (length = 6): string => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

type EmailType = 'login_location' | 'password_reset' | 'otp' | 'certificate' | 'payment' | {rejection?: boolean, inconclusive?: boolean, mismatch?: boolean, certificate?: boolean, success?: boolean};
export async function sendEmail(
	type: EmailType,
	email: string,
	ip?: string,
	resetToken?: string,
	product?: Product | null,
    payment?: { orderId?: string, transferRef?: string, amount: number }
) {
	try {
		let html: string[] = otpEmailTemplate; // default

		if (type === 'otp') {
			const otp = generateOTP();

			cache.saveOTP(email, otp);
			html[1] = otpEmailTemplate[1].replace('<otp_code>', otp);
		} else if (type === 'login_location') {
			if (!ip) {
				console.error('IP is missing for login location');
				throw new ErrorHandler(500, 'Internal server error');
			}
			try {
				const res = await fetch(`http://ip-api.com/json/${ip}`);
				if (!res.ok) {
					console.error('Failed to fetch IP location:');
					throw new ErrorHandler(500, 'Failed to get IP location');
				}
				const data = await res.json();
				html = newLoginLocationEmailTemplate;
				html[1] = html[1]
					.replace(
						'<location>',
						`${data.country}, ${data.regionName}, ${data.city}.`
					)
					.replace('<ip_address>', ip);
			} catch (error) {
				console.error('Error fetching IP location:', error);
				throw new ErrorHandler(500, 'Failed to fetch IP location');
			}
		} else if (type === 'password_reset') {
			if (!resetToken) {
				console.error('resetToken is required - password reset');
				throw new ErrorHandler(500, 'Internal server error');
			}

			html = passwordResetEmailTemplate;
			html[1] = html[1].replace('<reset_token>', resetToken);
		} else if (type === 'certificate') {
			html = newProductSubmissionWithCertificateEmailTemplate;
			html[1] = html[1]
				.replace('<product_id>', product!.id)
				.replace('<seller_email>', email);

			// temporarily send to my email
			email = 'findtamilore@gmail.com';
		} else if (type === 'payment') {
			html = paymentSuccessEmailTemplate
            const {transferRef, orderId, amount} = payment || {};
			html[1] = html[1]
				.replace('<transaction_reference>', transferRef as string)
				.replace('<order_id>', orderId as string)
				.replace('<amount>', (amount as number).toString());
		} else if (typeof type === 'object') {
            if (!product) {
                throw new ErrorHandler(500, 'Internal email server error');
            }
            const name = product?.name;
            const url = (product?.images as Image[])[0].url;
            const sustainabilityApproachLink = '';
            if (type.rejection) {
                html = productOutcomeEmailTemplates.rejection;
                html[1] = html[1].replace('<product_name>', name).replace('<product_image>', url).replace('<sustainability_approach_link>', sustainabilityApproachLink);
                
            } else if (type.inconclusive) {
                html = productOutcomeEmailTemplates.inconclusive;
                html[1] = html[1].replace('<product_name>', name).replace('<product_image>', url).replace('<sustainability_approach_link>', sustainabilityApproachLink);
                
            } else if (type.mismatch) {
                html = productOutcomeEmailTemplates.mismatch;
                html[1] = html[1].replace('<product_name>', name).replace('<product_image>', url).replace('<sustainability_approach_link>', sustainabilityApproachLink);
                
            } else if (type.certificate) {
                html = productOutcomeEmailTemplates.certificate;
                html[1] = html[1].replace('<product_name>', name).replace('<product_image>', url);
            }  else if (type.success) {
                html = productOutcomeEmailTemplates.success;
                html[1] = html[1].replace('<product_name>', name).replace('<product_image>', url);
            }
        }

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_APP_PASSWORD,
			},
		});

		transporter
			.sendMail({
				from: process.env.EMAIL,
				to: email,
				subject: html[0],
				html: html[1],
			})
			.catch((error) => {
				console.error('Failed to send email:', error);
			});
	} catch (error) {
		throw error;
	}
}
