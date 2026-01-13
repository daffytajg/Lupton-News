// SMS Service using Twilio for Lupton News Critical Alerts
// Sends SMS notifications for high-priority news events

import twilio from 'twilio';

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }
  
  return twilio(accountSid, authToken);
};

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export interface SMSAlert {
  to: string;
  companyName?: string;
  alertType: 'breaking' | 'critical' | 'government' | 'ma' | 'earnings';
  headline: string;
  summary?: string;
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 1 and has 11 digits, it's already US format
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it has 10 digits, assume US and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // Otherwise, assume it's already in correct format
  return `+${digits}`;
}

/**
 * Get emoji for alert type
 */
function getAlertEmoji(alertType: SMSAlert['alertType']): string {
  switch (alertType) {
    case 'breaking':
      return '🚨';
    case 'critical':
      return '⚠️';
    case 'government':
      return '🏛️';
    case 'ma':
      return '🤝';
    case 'earnings':
      return '📊';
    default:
      return '📰';
  }
}

/**
 * Get alert type label
 */
function getAlertLabel(alertType: SMSAlert['alertType']): string {
  switch (alertType) {
    case 'breaking':
      return 'BREAKING';
    case 'critical':
      return 'CRITICAL';
    case 'government':
      return 'GOV CONTRACT';
    case 'ma':
      return 'M&A ALERT';
    case 'earnings':
      return 'EARNINGS';
    default:
      return 'ALERT';
  }
}

/**
 * Send SMS alert for critical news
 */
export async function sendSMSAlert(alert: SMSAlert): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const client = getTwilioClient();
  
  if (!client) {
    return { success: false, error: 'Twilio not configured' };
  }
  
  if (!TWILIO_PHONE_NUMBER) {
    return { success: false, error: 'Twilio phone number not configured' };
  }
  
  const emoji = getAlertEmoji(alert.alertType);
  const label = getAlertLabel(alert.alertType);
  
  // Format the SMS message (keep under 160 chars for single SMS)
  let message = `${emoji} LUPTON NEWS ${label}`;
  
  if (alert.companyName) {
    message += `\n${alert.companyName}:`;
  }
  
  message += `\n${alert.headline}`;
  
  // Add summary if there's room
  if (alert.summary && message.length + alert.summary.length < 300) {
    message += `\n${alert.summary.substring(0, 100)}...`;
  }
  
  message += `\n\nView: lupton-news.vercel.app`;
  
  try {
    const formattedPhone = formatPhoneNumber(alert.to);
    
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });
    
    console.log(`SMS sent successfully: ${result.sid}`);
    return { success: true, messageId: result.sid };
  } catch (error: any) {
    console.error('Failed to send SMS:', error);
    return { success: false, error: error.message || 'Failed to send SMS' };
  }
}

/**
 * Send bulk SMS alerts to multiple recipients
 */
export async function sendBulkSMSAlerts(
  phoneNumbers: string[],
  alert: Omit<SMSAlert, 'to'>
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };
  
  for (const phone of phoneNumbers) {
    const result = await sendSMSAlert({ ...alert, to: phone });
    
    if (result.success) {
      results.sent++;
    } else {
      results.failed++;
      if (result.error) {
        results.errors.push(`${phone}: ${result.error}`);
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * Check if Twilio is properly configured
 */
export function isTwilioConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

/**
 * Validate a phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}
