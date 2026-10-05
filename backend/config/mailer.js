const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Create Ethereal test account automatically
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`📧 Ethereal Test Mailer initialized. User: ${testAccount.user}`);
  }
  return transporter;
};

const sendVerificationEmail = async (email, otp) => {
  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail({
      from: '"👑 Royal Pizza" <noreply@royalpizza.com>',
      to: email,
      subject: 'Verify Your Email - Royal Pizza',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style=": #7E121D; text-align: center;">👑 Royal Pizza - Email Verification</h2>
          <p>Welcome to <strong>Royal Pizza</strong>! Your verification OTP code is:</p>
          <div style="background: #7E121D; color: #fff; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`📨 Verification OTP sent to ${email}. Preview: ${nodemailer.getTestMessageUrl(info) || 'Sent'}`);
    return info;
  } catch (err) {
    console.error(`Error sending verification email: ${err.message}`);
  }
};

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const mailer = await getTransporter();
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const info = await mailer.sendMail({
      from: '"👑 Royal Pizza" <noreply@royalpizza.com>',
      to: email,
      subject: 'Reset Password Request - Royal Pizza',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #7E121D; text-align: center;">👑 Royal Pizza - Password Reset</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #7E121D; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or paste this link into your browser: <br/><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });
    console.log(`📨 Reset password link sent to ${email}. Preview: ${nodemailer.getTestMessageUrl(info) || 'Sent'}`);
    return info;
  } catch (err) {
    console.error(`Error sending reset password email: ${err.message}`);
  }
};

const sendStockAlertEmail = async (adminEmail, lowStockItems) => {
  try {
    const mailer = await getTransporter();
    const itemsList = lowStockItems.map(item => `<li><strong>${item.name}</strong> (${item.category}): <span>${item.stock} units left</span> (Min Threshold: ${item.minThreshold})</li>`).join('');

    const info = await mailer.sendMail({
      from: '"👑 Royal Pizza System" <system@royalpizza.com>',
      to: adminEmail,
      subject: '⚠️ LOW STOCK ALERT - Royal Pizza Inventory',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 2px solid #e53e3e; border-radius: 10px;">
          <h2 style="color: #e53e3e;">⚠️ Royal Pizza Low Stock Alert</h2>
          <p>The following inventory items have fallen below their minimum configured threshold:</p>
          <ul>${itemsList}</ul>
          <p style="margin-top: 20px;">Please login to the Admin Dashboard to replenish stock immediately.</p>
        </div>
      `,
    });
    console.log(`🚨 Admin Low Stock Email Alert sent to ${adminEmail}. Preview: ${nodemailer.getTestMessageUrl(info) || 'Sent'}`);
    return info;
  } catch (err) {
    console.error(`Error sending stock alert email: ${err.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendStockAlertEmail,
};
