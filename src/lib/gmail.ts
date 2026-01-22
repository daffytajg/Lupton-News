// Gmail SMTP service using Nodemailer
// Uses App Password for authentication

import nodemailer from 'nodemailer';

// Create reusable transporter
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    const user = process.env.GMAIL_USER;

    const info = await transporter.sendMail({
      from: `"Lupton News" <${user}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Gmail send error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendTestEmail(to: string, name?: string): Promise<{ success: boolean; error?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 32px; background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">✅ Test Successful!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px; text-align: center;">
        <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">
          Hi ${name || 'there'},
        </p>
        <p style="margin: 0 0 24px 0; font-size: 15px; color: #6b7280;">
          Your email notifications are working correctly! You will receive daily digests at your configured time.
        </p>
        <a href="https://lupton-news.vercel.app/settings" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Go to Settings
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #f9fafb; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          Built by Joe Guadagnino | Powered by Google Cloud
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject: '✅ Lupton News - Test Email Successful',
    html,
    text: `Hi ${name || 'there'}, Your email notifications are working correctly!`,
  });
}
