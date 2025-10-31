import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Skip email sending if credentials are not properly configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] Email credentials not configured, skipping email to:', options.to);
    return;
  }

  try {
    const mailOptions = {
      from: `"Credit Jambo" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log('[Email] Email sent successfully to:', options.to);
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    // Don't throw error to prevent breaking the main functionality
    console.log('[Email] Continuing without sending email notification');
  }
}

export async function sendDeviceVerificationEmail(email: string, deviceId: string): Promise<void> {
  const subject = 'Device Verification Required - Credit Jambo';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Device Verification Required</h2>
      <p>Hello,</p>
      <p>A new device has been registered with your Credit Jambo account. For security reasons, your device needs to be verified by an administrator before you can log in.</p>
      <p><strong>Device ID:</strong> ${deviceId}</p>
      <p>You will receive a notification once your device has been verified. This process typically takes 24-48 hours.</p>
      <p>If you did not register this device, please contact our support team immediately.</p>
      <br>
      <p>Best regards,<br>Credit Jambo Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html });
}

export async function sendDeviceVerifiedEmail(email: string, deviceId: string): Promise<void> {
  const subject = 'Device Verified - Credit Jambo';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Device Successfully Verified</h2>
      <p>Hello,</p>
      <p>Great news! Your device has been verified and you can now log in to your Credit Jambo account.</p>
      <p><strong>Device ID:</strong> ${deviceId}</p>
      <p>You can now access all features of your account.</p>
      <br>
      <p>Best regards,<br>Credit Jambo Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html });
}

export async function sendTransactionNotification(email: string, type: string, amount: number, balance: number): Promise<void> {
  const subject = `Transaction ${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Notification - Credit Jambo`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Transaction Notification</h2>
      <p>Hello,</p>
      <p>A ${type} transaction has been processed on your Credit Jambo account.</p>
      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>Transaction Type:</strong> ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>New Balance:</strong> $${balance.toFixed(2)}</p>
      </div>
      <p>If you did not authorize this transaction, please contact our support team immediately.</p>
      <br>
      <p>Best regards,<br>Credit Jambo Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html });
}