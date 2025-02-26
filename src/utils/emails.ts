import nodemailer from "nodemailer";
import { config } from "dotenv";
import cache from "./cache";
import { ErrorHandler } from "./errorHandler";

config();

export const otpEmailTemplate = ['Acconut verification', `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
        .otp { font-size: 24px; font-weight: bold; background: #eee; padding: 10px; border-radius: 5px; display: inline-block; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Your OTP Code</h2>
        <p>Use the following OTP to verify your account:</p>
        <p class="otp"><otp_code></p>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        <div class="footer">&copy; 2025 Your Company Name</div>
    </div>
</body>
</html>`]

export const passwordResetEmailTemplate = ['Password Reset', `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
        .btn { background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p><a href="${process.env.FRONTEND_PASSWORD_RESET_LINK}" class="btn">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <div class="footer">&copy; 2025 Your Company Name</div>
    </div>
</body>
</html>`]

export const newLoginLocationEmailTemplate = ['New Login Location Detected', `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Location Detected</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
            .details { background: #eee; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
            .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Login Location Detected</h2>
            <p>We noticed a login to your account from a new location:</p>
            <div class="details">
                <p><strong>IP Address:</strong> <ip_address></p>
                <p><strong>Location:</strong> <location></p>
                <p><strong>Time:</strong> ${new Date()}</p>
            </div>
            <p>If this was you, no action is needed. If you do not recognize this activity, please contact our support team immediately.</p>
            <div class="footer">&copy; 2025 Your Company Name</div>
        </div>
    </body>
    </html>`]
    

const generateOTP = (length = 6): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function sendEmail(type: 'login_location' | 'password_reset' | 'otp', emailTemplate: string[], email: string, ip?: string) {
    try {
        let bodyHtml: string = emailTemplate[1];

        if (type === 'otp') {
            const otp = generateOTP();

            cache.saveOTP(email, otp);
            bodyHtml = bodyHtml.replace('<otp_code>', otp);
        } else if (type === 'login_location') {
            if (!ip) {
                console.error('ip is missing for login location')
                throw new ErrorHandler(500, 'Internal server error - email')
            }
            const res = await fetch('http://ip-api.com/json/');
            const data = await res.json();

            bodyHtml = bodyHtml.replace('<location>', `${data.country}, ${data.regionName}, ${data.city}.`);
            bodyHtml = bodyHtml.replace('<ip_address>', ip);
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
        
        transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: emailTemplate[0],
            html: bodyHtml
        });   
    } catch (error) {
        return error;
    }
}
