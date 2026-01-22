// API endpoint for testing email notifications
// Users can send test messages from the settings page
// Uses Gmail SMTP with App Password

import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/gmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, name } = body;

    if (type === 'email') {
      // Check if Gmail is configured
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email service not configured. Please add GMAIL_USER and GMAIL_APP_PASSWORD to environment variables.' 
        }, { status: 500 });
      }

      if (!email) {
        return NextResponse.json({ success: false, error: 'Email address required' }, { status: 400 });
      }

      const result = await sendTestEmail(email, name);

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
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
