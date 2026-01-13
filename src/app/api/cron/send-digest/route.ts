// Cron endpoint for sending daily email digests
// This should be triggered by Vercel Cron or an external scheduler

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { MOCK_NEWS, MOCK_STOCK_DATA } from '@/data/mockNews';
import { HISTORICAL_ARTICLES } from '@/data/historicalArticles';
import { SECTORS } from '@/data/sectors';
import { COMPANIES } from '@/data/companies';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

// User data - in production this would come from a database
const DIGEST_RECIPIENTS = [
  { name: 'Joe Guadagnino', email: process.env.DIGEST_EMAIL_1 || '', enabled: true },
  { name: 'Alan Lupton', email: process.env.DIGEST_EMAIL_2 || '', enabled: true },
  // Add more recipients as needed
];

export async function GET(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);
  const results: { email: string; success: boolean; error?: string }[] = [];

  // Combine all articles
  const allArticles = [...MOCK_NEWS, ...Object.values(HISTORICAL_ARTICLES).flat()];
  
  // Get recent articles (last 24 hours for daily digest)
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const recentArticles = allArticles
    .filter(a => new Date(a.publishedAt) > oneDayAgo)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Generate digest content
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get top stories
  const topStories = recentArticles
    .filter(a => a.relevanceScore && a.relevanceScore > 70)
    .slice(0, 5);

  // Get sector highlights
  const sectorHighlights: Record<string, string> = {};
  for (const sector of SECTORS) {
    const sectorArticles = recentArticles.filter(a => 
      a.sectors?.includes(sector.id) || 
      a.companies.some(c => {
        const company = COMPANIES.find(co => co.id === c || co.name === c);
        return company?.sectors.includes(sector.id);
      })
    );
    if (sectorArticles.length > 0) {
      sectorHighlights[sector.name] = `${sectorArticles.length} articles - ${sectorArticles[0]?.title?.substring(0, 60)}...`;
    }
  }

  // Get stock movers
  const stockMovers = MOCK_STOCK_DATA
    .filter(s => Math.abs(s.changePercent || 0) > 1)
    .sort((a, b) => Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0))
    .slice(0, 5);

  // Generate email HTML
  const generateEmailHtml = (recipientName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupton News Daily Digest</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="padding: 24px; background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                📰 Lupton News
              </h1>
              <p style="margin: 8px 0 0 0; color: #93c5fd; font-size: 14px;">
                Daily Intelligence Digest
              </p>
            </td>
            <td style="text-align: right; color: #93c5fd; font-size: 13px;">
              ${today}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Greeting -->
    <tr>
      <td style="padding: 24px 24px 16px 24px;">
        <p style="margin: 0; font-size: 15px; color: #374151;">
          Good morning, <strong>${recipientName}</strong>! Here's your AI-curated news digest for today.
        </p>
      </td>
    </tr>

    <!-- Quick Stats -->
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 12px; background-color: #eff6ff; border-radius: 8px; text-align: center;" width="33%">
              <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${recentArticles.length}</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">New Articles</div>
            </td>
            <td width="8"></td>
            <td style="padding: 12px; background-color: #f0fdf4; border-radius: 8px; text-align: center;" width="33%">
              <div style="font-size: 24px; font-weight: 700; color: #10b981;">${recentArticles.filter(a => a.sentiment === 'positive').length}</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Positive</div>
            </td>
            <td width="8"></td>
            <td style="padding: 12px; background-color: #fef2f2; border-radius: 8px; text-align: center;" width="33%">
              <div style="font-size: 24px; font-weight: 700; color: #ef4444;">${recentArticles.filter(a => a.isBreaking).length}</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Breaking</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Top Stories -->
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
          🔥 Top Stories
        </h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${topStories.length > 0 ? topStories.map(story => `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #1f2937;">${story.title}</h3>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">${story.summary?.substring(0, 150) || ''}...</p>
                <p style="margin: 0; font-size: 12px;">
                  <span style="color: #2563eb;">${story.source}</span>
                  ${story.companies.length > 0 ? ` • <span style="color: #6b7280;">${story.companies.slice(0, 2).join(', ')}</span>` : ''}
                </p>
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td style="padding: 12px 0; color: #6b7280; font-style: italic;">
                No major stories in the last 24 hours. Check the dashboard for historical news.
              </td>
            </tr>
          `}
        </table>
      </td>
    </tr>

    <!-- Sector Highlights -->
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
          📊 Sector Highlights
        </h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${Object.entries(sectorHighlights).map(([sector, highlight]) => `
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 8px;">
                <strong style="color: #1f2937;">${sector}:</strong>
                <span style="color: #6b7280;"> ${highlight}</span>
              </td>
            </tr>
            <tr><td style="height: 8px;"></td></tr>
          `).join('')}
        </table>
      </td>
    </tr>

    <!-- Stock Movers -->
    ${stockMovers.length > 0 ? `
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
          📈 Stock Movers
        </h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${stockMovers.map(stock => `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <strong style="color: #1f2937;">${stock.symbol}</strong>
                      <span style="color: #6b7280; font-size: 13px;"> ${stock.companyId || stock.symbol}</span>
                    </td>
                    <td style="text-align: right;">
                      <span style="color: #1f2937; font-weight: 600;">$${stock.price?.toFixed(2)}</span>
                      <span style="color: ${(stock.changePercent || 0) >= 0 ? '#10b981' : '#ef4444'}; font-size: 13px; margin-left: 8px;">
                        ${(stock.changePercent || 0) >= 0 ? '↑' : '↓'} ${Math.abs(stock.changePercent || 0).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('')}
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- CTA -->
    <tr>
      <td style="padding: 0 24px 24px 24px; text-align: center;">
        <a href="https://lupton-news.vercel.app"
           style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          View Full Dashboard →
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px; background-color: #1f2937; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff;">
          Built by Joe Guadagnino | Powered by Google Cloud
        </p>
        <p style="margin: 0; font-size: 11px; color: #9ca3af;">
          Lupton Associates News Intelligence Platform
          <br>
          <a href="https://lupton-news.vercel.app/settings" style="color: #60a5fa;">Manage preferences</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // Send emails to all enabled recipients
  for (const recipient of DIGEST_RECIPIENTS) {
    if (!recipient.enabled || !recipient.email) continue;

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Lupton News <digest@resend.dev>',
        to: recipient.email,
        subject: `📰 Lupton News Daily Digest - ${today}`,
        html: generateEmailHtml(recipient.name),
      });

      if (error) {
        results.push({ email: recipient.email, success: false, error: error.message });
      } else {
        results.push({ email: recipient.email, success: true });
      }
    } catch (err: any) {
      results.push({ email: recipient.email, success: false, error: err.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return NextResponse.json({
    message: `Digest sent to ${successCount} recipients, ${failCount} failed`,
    results,
    timestamp: new Date().toISOString(),
  });
}

// Also support POST for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
