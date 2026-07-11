const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const isMock = 
    !process.env.EMAIL_USER || 
    process.env.EMAIL_USER === 'mock_user';

  if (isMock) {
    console.log('\n================ MOCK EMAIL NOTIFICATION ================');
    console.log(`To:      ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.message}`);
    console.log('=========================================================\n');
    return { success: true, message: 'Mock email logged successfully' };
  }

  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const isGmail = 
    (process.env.EMAIL_HOST && process.env.EMAIL_HOST.includes('gmail')) || 
    (process.env.EMAIL_USER && process.env.EMAIL_USER.endsWith('@gmail.com'));

  let transporterOptions;

  if (isGmail) {
    // Gmail-specific configuration using Nodemailer service helper (extremely stable)
    transporterOptions = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  } else {
    // Custom SMTP transporter configuration
    transporterOptions = {
      host: process.env.EMAIL_HOST,
      port: port,
      secure: port === 465, // true for port 465, false for 587 (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Prevents self-signed certificate blocking
      },
    };
  }

  const transporter = nodemailer.createTransport(transporterOptions);

  // Define email options
  const mailOptions = {
    from: `"InternsHub Support" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<div style="font-family: sans-serif; line-height: 1.5; color: #333;"><p>${options.message.replace(/\n/g, '<br>')}</p></div>`,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
