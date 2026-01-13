// Cron endpoint for sending SMS alerts for critical news
// This checks for breaking/critical news and sends SMS to subscribed users

import { NextResponse } from 'next/server';
import { sendSMSAlert, isTwilioConfigured } from '@/lib/sms';
import { MOCK_NEWS } from '@/data/mockNews';
import { HISTORICAL_ARTICLES } from '@/data/historicalArticles';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

// SMS recipients - in production this would come from a database
const SMS_RECIPIENTS = [
  { name: 'Joe Guadagnino', phone: process.env.SMS_PHONE_1 || '', enabled: true },
  // Add more recipients as needed
];

// Track sent alerts to avoid duplicates (in production, use a database)
const sentAlertIds = new Set<string>();

export async function GET(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTwilioConfigured()) {
    return NextResponse.json({ 
      error: 'Twilio not configured',
      message: 'Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables'
    }, { status: 500 });
  }

  // Combine all articles
  const allArticles = [...MOCK_NEWS, ...Object.values(HISTORICAL_ARTICLES).flat()];
  
  // Get critical articles from the last hour that haven't been sent
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  const criticalArticles = allArticles.filter(article => {
    // Check if it's recent
    const articleDate = new Date(article.publishedAt);
    if (articleDate < oneHourAgo) return false;
    
    // Check if already sent
    if (sentAlertIds.has(article.id)) return false;
    
    // Check if it's critical/breaking
    const isCritical = 
      article.isBreaking ||
      (article.relevanceScore && article.relevanceScore >= 90) ||
      article.categories?.some(c => 
        ['government-contracts', 'mergers-acquisitions', 'c-suite'].includes(c)
      );
    
    return isCritical;
  });

  const results: { phone: string; articleId: string; success: boolean; error?: string }[] = [];

  // Send SMS for each critical article to each enabled recipient
  for (const article of criticalArticles.slice(0, 3)) { // Limit to 3 alerts per run
    for (const recipient of SMS_RECIPIENTS) {
      if (!recipient.enabled || !recipient.phone) continue;

      // Determine alert type
      let alertType: 'breaking' | 'critical' | 'government' | 'ma' | 'earnings' = 'critical';
      if (article.isBreaking) alertType = 'breaking';
      else if (article.categories?.includes('government-contracts')) alertType = 'government';
      else if (article.categories?.includes('mergers-acquisitions')) alertType = 'ma';
      else if (article.categories?.includes('quarterly-filings')) alertType = 'earnings';

      const result = await sendSMSAlert({
        to: recipient.phone,
        alertType,
        companyName: article.companies[0] || undefined,
        headline: article.title,
        summary: article.summary,
      });

      results.push({
        phone: recipient.phone,
        articleId: article.id,
        success: result.success,
        error: result.error,
      });

      // Mark as sent
      if (result.success) {
        sentAlertIds.add(article.id);
      }
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return NextResponse.json({
    message: `Sent ${successCount} SMS alerts, ${failCount} failed`,
    criticalArticlesFound: criticalArticles.length,
    results,
    timestamp: new Date().toISOString(),
  });
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
