export const otpEmailTemplate = [
	'Account Verification',
	`
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
        <div class="footer">&copy; 2025 Willow</div>
    </div>
</body>
</html>`,
];

export const passwordResetEmailTemplate = [
	'Password Reset',
	`
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
        <p><a href="${process.env.FRONTEND_PASSWORD_RESET_LINK}?resetToken=<reset_token>" class="btn">Reset Password</p>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <div class="footer">&copy; 2025 Willow</div>
    </div>
</body>
</html>`,
];

export const newLoginLocationEmailTemplate = [
	'New Login Location Detected',
	`
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
            <div class="footer">&copy; 2025 Willow</div>
        </div>
    </body>
    </html>`,
];

export const newProductSubmissionWithCertificateEmailTemplate = [
	'New Product Submission with Certificate',
	`
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Product Submission with Certificate</title>
              <style>
                  body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                  .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
                  .details { background: #eee; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
                  .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <h2>New Product Submission with Certificate</h2>
                  <p>A new product submission has been received with an attached sustainability certificate.</p>
                  <div class="details">
                      <p><strong>Product id:</strong> <product_id></p>
                      <p><strong>Seller Email:</strong> <seller_email></p>
                      <p><strong>Submission Date:</strong> ${new Date()}</p>
                  </div>
                  <p>Please review the certificate for validation within the next <strong>24–48 hours</strong>.</p>
                  <div class="footer">&copy; 2025 Willow</div>
              </div>
          </body>
          </html>`,
];

export const paymentSuccessEmailTemplate = [
	'Payment Successful',
	`
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
      .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
      .details { background: #eee; padding: 10px; border-radius: 5px; margin: 10px 0; }
      .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Payment Successful</h2>
      <p>Dear Customer,</p>
      <p>Your payment for Order <strong><order_id></strong> has been successfully processed.</p>
      <div class="details">
        <p><strong>Transaction Reference:</strong> <transaction_reference></p>
        <p><strong>Amount:</strong> NGN <amount></p>
      </div>
      <p>Thank you for shopping with Willow, your eco-friendly e-commerce platform that champions sustainable choices.</p>
      <p>If you have any questions or need assistance, please contact our support team.</p>
      <div class="footer">&copy; 2025 Willow</div>
    </div>
  </body>
  </html>
    `,
];

const baseStyles = `
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
    .button-container { text-align: center; margin: 20px 0; }
    .btn { background-color: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 16px; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
  </style>
`;

export const productOutcomeEmailTemplates = {
  rejection: [
    'Product Rejected',
    `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            <p>Thank you for your submission. Unfortunately, after a comprehensive sustainability evaluation, your product <strong><product_name></strong> did not meet our minimum standards for listing.</p>
            <p>Please review our sustainability approach and consider resubmitting in the future.</p>
            <div class="button-container">
              <a href="<sustainability_approach_link>" class="btn">Learn More</a>
            </div>
            <div class="footer">&copy; 2025 Willow</div>
          </div>
        </body>
      </html>
    `
  ],
  inconclusive: [
    'Submission Inconclusive',
    `
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            <p>Thank you for your submission of <strong><product_name></strong>. Based on our initial assessment, the available data was insufficient for a definitive sustainability evaluation.</p>
            <p>We invite you to apply for extended vetting for a more in-depth review.</p>
            <div class="button-container">
              <a href="<sustainability_approach_link>" class="btn">Learn More</a>
            </div>
            <div class="footer">&copy; 2025 Willow</div>
          </div>
        </body>
      </html>
    `
  ],
  mismatch: [
    'Submission Mismatch',
    `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <p>Thank you for your submission of <strong><product_name></strong>. However, our initial assessment identified a significant mismatch between the provided product information and the uploaded images. Due to this discrepancy, we are unable to correctly evaluate your product. We recommend resubmitting your product with accurate details and images that align with the product description.</p>
          <div class="footer">&copy; 2025 Willow</div>
        </div>
      </body>
      </html>
    `
  ],
  certificate: [
    'Certificate Received',
    `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <p>We have received the certificate for your product <strong><product_name></strong>.</p>
          <p>Your certificate will be verified within the next 24 to 48 hours. You will be notified once the process is complete.</p>
          <div class="footer">&copy; 2025 Willow</div>
        </div>
      </body>
      </html>
    `
  ],
  success: [
    'Product Approved',
    `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${baseStyles}
      </head>
      <body>
        <div class="container">
          <p>Congratulations! Your product <strong><product_name></strong> has met our sustainability criteria and has been approved for listing on our marketplace.</p>
          <p>Thank you for your contribution to a sustainable future.</p>
          <div class="footer">&copy; 2025 Willow</div>
        </div>
      </body>
      </html>
    `
  ]
};

export const unreadMessageEmailTemplate = [
  'You Have an Unread Message',
  `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unread Message</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 5px; }
          .message-info { background: #eee; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
          .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #28a745;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
          }
          .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
      </style>
  </head>
  <body>
      <div class="container">
          <p>You have a new unread message from <strong><seller></strong>.</p>
          <p>Please click the button below to view your conversation.</p>
          <a class="btn" href="<conversation_link>">View Conversation</a>
          <div class="footer">
              &copy; 2025 Willow
          </div>
      </div>
  </body>
  </html>
  `,
];
