// API endpoint for testing email notifications
// Users can send test messages from the settings page

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, name } = body;

    if (type === 'email') {
      // Test email
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' 
        }, { status: 500 });
      }

      if (!email) {
        return NextResponse.json({ success: false, error: 'Email address required' }, { status: 400 });
      }

      const resend = new Resend(resendApiKey);
      
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Lupton News <digest@resend.dev>',
        to: email,
        subject: '✅ Lupton News - Test Email Successful',
        html: `
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
        `,
      });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Test email sent successfully!' });

    } else {
      return NextResponse.json({ success: false, error: 'Invalid notification type' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Test notification error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
