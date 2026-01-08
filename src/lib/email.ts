// Email Service using Resend for Lupton News Daily Digests
// Sends AI-curated daily summaries to the sales team

import { Resend } from 'resend';
import { NewsArticle } from '@/types';
import { DailyDigest } from './claude';
import { SALES_TEAMS, COMPANIES, getCompanyById } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

// Initialize Resend client
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured');
    return null;
  }
  return new Resend(apiKey);
};

// Email templates
interface DigestEmailData {
  recipientName: string;
  recipientEmail: string;
  digest: DailyDigest;
  articles: NewsArticle[];
  teamId?: string;
}

/**
 * Generate HTML email template for daily digest
 */
function generateDigestEmailHtml(data: DigestEmailData): string {
  const { recipientName, digest, articles, teamId } = data;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get team-specific articles if teamId provided
  let teamArticles = articles;
  if (teamId) {
    const team = SALES_TEAMS.find(t => t.id === teamId);
    if (team) {
      teamArticles = articles.filter(a =>
        a.companies.some(c => team.assignedCustomers.includes(c))
      );
    }
  }

  const topArticlesHtml = digest.topStories
    .slice(0, 5)
    .map(story => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #1f2937;">${story.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">${story.summary}</p>
          <p style="margin: 0; font-size: 12px; color: #3b82f6;">${story.importance}</p>
        </td>
      </tr>
    `)
    .join('');

  const sectorHighlightsHtml = Object.entries(digest.sectorHighlights)
    .map(([sectorId, highlight]) => {
      const sector = SECTORS.find(s => s.id === sectorId);
      return `
        <tr>
          <td style="padding: 8px 12px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 4px;">
            <strong style="color: #1f2937;">${sector?.name || sectorId}:</strong>
            <span style="color: #6b7280;"> ${highlight}</span>
          </td>
        </tr>
      `;
    })
    .join('<tr><td style="height: 8px;"></td></tr>');

  const actionItemsHtml = digest.actionItems
    .map(item => `<li style="margin-bottom: 6px; color: #374151;">${item}</li>`)
    .join('');

  const watchListHtml = digest.watchList
    .map(item => `<li style="margin-bottom: 4px; color: #6b7280;">${item}</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupton News Daily Digest</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
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
      <td style="padding: 24px 24px 0 24px;">
        <p style="margin: 0; font-size: 15px; color: #374151;">
          Good morning, <strong>${recipientName}</strong>! Here's your AI-curated news digest.
        </p>
      </td>
    </tr>

    <!-- Executive Summary -->
    <tr>
      <td style="padding: 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
          <tr>
            <td style="padding: 16px;">
              <h2 style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">
                Executive Summary
              </h2>
              <p style="margin: 0; font-size: 14px; color: #1f2937; line-height: 1.5;">
                ${digest.executiveSummary}
              </p>
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
          ${topArticlesHtml}
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
          ${sectorHighlightsHtml}
        </table>
      </td>
    </tr>

    <!-- Action Items -->
    ${digest.actionItems.length > 0 ? `
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef3c7; border-radius: 8px;">
          <tr>
            <td style="padding: 16px;">
              <h2 style="margin: 0 0 12px 0; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">
                ⚡ Action Items
              </h2>
              <ul style="margin: 0; padding-left: 20px;">
                ${actionItemsHtml}
              </ul>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- Watch List -->
    ${digest.watchList.length > 0 ? `
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
          👁️ Watch List
        </h2>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
          ${watchListHtml}
        </ul>
      </td>
    </tr>
    ` : ''}

    <!-- Stats -->
    <tr>
      <td style="padding: 0 24px 24px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; text-align: center;" width="33%">
              <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${articles.length}</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Articles Today</div>
            </td>
            <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; text-align: center;" width="33%">
              <div style="font-size: 24px; font-weight: 700; color: #10b981;">${articles.filter(a => a.sentiment === 'positive').length}</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Positive</div>
            </td>
            <td style="padding: 12px; background-color: #f9fafb; border-radius: 8px; text-align: center;" width="33%">
              <div style="font-size: 24px; font-weight: 700; color: #ef4444;">${articles.filter(a => a.isBreaking).length}</div>
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Breaking</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 0 24px 24px 24px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}"
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          View Full Dashboard →
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px; background-color: #1f2937; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">
          Lupton News | Built by Joe Guadagnino | Using Google Cloud
        </p>
        <p style="margin: 0; font-size: 11px; color: #6b7280;">
          This digest was generated by AI and curated for Lupton Associates.
          <br>
          <a href="#" style="color: #60a5fa;">Manage preferences</a> ·
          <a href="#" style="color: #60a5fa;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generate plain text version of email
 */
function generateDigestEmailText(data: DigestEmailData): string {
  const { recipientName, digest, articles } = data;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
LUPTON NEWS DAILY DIGEST
${today}

Good morning, ${recipientName}!

EXECUTIVE SUMMARY
${digest.executiveSummary}

TOP STORIES
${digest.topStories.map((s, i) => `${i + 1}. ${s.title}\n   ${s.summary}\n   → ${s.importance}`).join('\n\n')}

SECTOR HIGHLIGHTS
${Object.entries(digest.sectorHighlights).map(([sector, highlight]) => `• ${sector}: ${highlight}`).join('\n')}

${digest.actionItems.length > 0 ? `ACTION ITEMS\n${digest.actionItems.map(item => `⚡ ${item}`).join('\n')}` : ''}

${digest.watchList.length > 0 ? `WATCH LIST\n${digest.watchList.map(item => `👁️ ${item}`).join('\n')}` : ''}

TODAY'S STATS
• ${articles.length} articles analyzed
• ${articles.filter(a => a.sentiment === 'positive').length} positive sentiment
• ${articles.filter(a => a.isBreaking).length} breaking news

View full dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

---
Lupton News | Built by Joe Guadagnino | Using Google Cloud
`;
}

/**
 * Send daily digest email to a recipient
 */
export async function sendDailyDigest(
  recipientEmail: string,
  recipientName: string,
  digest: DailyDigest,
  articles: NewsArticle[],
  teamId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();

  const emailData: DigestEmailData = {
    recipientEmail,
    recipientName,
    digest,
    articles,
    teamId,
  };

  if (!resend) {
    console.log('Email would be sent to:', recipientEmail);
    console.log('Subject: Lupton News Daily Digest');
    return {
      success: true,
      messageId: 'mock-' + Date.now(),
      error: 'RESEND_API_KEY not configured - email logged to console',
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Lupton News <news@updates.luptons.com>',
      to: recipientEmail,
      subject: `📰 Lupton News Daily Digest - ${new Date().toLocaleDateString()}`,
      html: generateDigestEmailHtml(emailData),
      text: generateDigestEmailText(emailData),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send digest to all sales team members
 */
export async function sendTeamDigests(
  digest: DailyDigest,
  articles: NewsArticle[],
  teamEmails: Record<string, { email: string; name: string }>
): Promise<{ sent: number; failed: number; results: Array<{ email: string; success: boolean }> }> {
  const results: Array<{ email: string; success: boolean }> = [];

  for (const [teamId, { email, name }] of Object.entries(teamEmails)) {
    const result = await sendDailyDigest(email, name, digest, articles, teamId);
    results.push({ email, success: result.success });

    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return {
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}

/**
 * Send breaking news alert
 */
export async function sendBreakingNewsAlert(
  recipientEmail: string,
  recipientName: string,
  article: NewsArticle
): Promise<{ success: boolean; error?: string }> {
  const resend = getResendClient();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Breaking News Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fef2f2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 24px; background-color: #dc2626;">
        <h1 style="margin: 0; color: #ffffff; font-size: 20px;">
          🚨 BREAKING NEWS ALERT
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #1f2937;">
          ${article.title}
        </h2>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">
          Source: ${article.source} | ${new Date(article.publishedAt).toLocaleString()}
        </p>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #374151; line-height: 1.6;">
          ${article.summary}
        </p>
        <a href="${article.url}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px;">
          Read Full Article →
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 24px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280;">
        Lupton News | Built by Joe Guadagnino | Using Google Cloud
      </td>
    </tr>
  </table>
</body>
</html>
`;

  if (!resend) {
    console.log('Breaking news alert would be sent to:', recipientEmail);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Lupton News <alerts@updates.luptons.com>',
      to: recipientEmail,
      subject: `🚨 Breaking: ${article.title.slice(0, 50)}...`,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
