/**
 * Personalized Email Digest Service
 * Generates and sends AI-powered daily/weekly email summaries
 */

import { Resend } from 'resend';
import { prisma } from './db';
import { generateUserBriefing } from './ai-pipeline';

const resend = new Resend(process.env.RESEND_API_KEY);

interface DigestArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  relevanceScore: number;
  sentiment: string;
  companies: string[];
  categories: string[];
}

interface UserDigestData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    teamName?: string;
  };
  aiBriefing: string;
  topArticles: DigestArticle[];
  alerts: Array<{
    type: string;
    priority: string;
    title: string;
    message: string;
  }>;
  insights: Array<{
    type: string;
    title: string;
    description: string;
    confidence: number;
  }>;
  opportunities: Array<{
    title: string;
    company: string;
    rationale: string;
  }>;
  sectorHighlights: Record<string, {
    articleCount: number;
    topStory: string;
    sentiment: string;
  }>;
}

/**
 * Generate digest data for a specific user
 */
async function generateUserDigestData(userId: string, frequency: 'daily' | 'weekly'): Promise<UserDigestData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
      team: true,
      assignedCompanies: { include: { company: true } },
    },
  });

  if (!user || !user.preferences?.emailEnabled) {
    return null;
  }

  const timeRange = frequency === 'daily' 
    ? new Date(Date.now() - 24 * 60 * 60 * 1000)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const companyIds = user.assignedCompanies.map(a => a.companyId);
  const followedSectors = JSON.parse(user.preferences.followedSectors || '[]') as string[];

  // Get relevant articles
  const articles = await prisma.newsArticle.findMany({
    where: {
      publishedAt: { gte: timeRange },
      relevanceScore: { gte: user.preferences.minRelevanceScore },
      OR: [
        { companies: { some: { companyId: { in: companyIds } } } },
        { sectors: { in: followedSectors.map(s => `"${s}"`) } },
      ],
    },
    orderBy: [
      { relevanceScore: 'desc' },
      { publishedAt: 'desc' },
    ],
    take: frequency === 'daily' ? 10 : 25,
    include: {
      companies: { include: { company: true } },
    },
  });

  // Get alerts
  const alerts = await prisma.alert.findMany({
    where: {
      userId,
      createdAt: { gte: timeRange },
      emailSentAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Get insights
  const insights = await prisma.aIInsight.findMany({
    where: {
      createdAt: { gte: timeRange },
      isActive: true,
      OR: [
        { companies: { some: { companyId: { in: companyIds } } } },
      ],
    },
    orderBy: { confidence: 'desc' },
    take: 5,
  });

  // Get prospect leads
  const leads = await prisma.prospectLead.findMany({
    where: {
      createdAt: { gte: timeRange },
      status: 'new',
    },
    take: 3,
  });

  // Generate AI briefing
  let aiBriefing = '';
  try {
    aiBriefing = await generateUserBriefing(userId);
  } catch (error) {
    console.error('Failed to generate AI briefing:', error);
    aiBriefing = `Good morning, ${user.name.split(' ')[0]}. Here's your ${frequency} intelligence digest.`;
  }

  // Calculate sector highlights
  const sectorHighlights: Record<string, any> = {};
  for (const sector of followedSectors) {
    const sectorArticles = articles.filter(a => {
      const sectors = JSON.parse(a.sectors || '[]');
      return sectors.includes(sector);
    });
    
    if (sectorArticles.length > 0) {
      const positiveCount = sectorArticles.filter(a => a.sentiment === 'positive').length;
      sectorHighlights[sector] = {
        articleCount: sectorArticles.length,
        topStory: sectorArticles[0].title,
        sentiment: positiveCount > sectorArticles.length / 2 ? 'positive' : 'neutral',
      };
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamName: user.team?.name,
    },
    aiBriefing,
    topArticles: articles.map(a => ({
      id: a.id,
      title: a.title,
      summary: a.aiSummary || a.summary || '',
      source: a.source,
      url: a.url,
      relevanceScore: a.relevanceScore,
      sentiment: a.sentiment || 'neutral',
      companies: a.companies.map(c => c.company.name),
      categories: JSON.parse(a.categories || '[]'),
    })),
    alerts: alerts.map(a => ({
      type: a.type,
      priority: a.priority,
      title: a.title,
      message: a.message,
    })),
    insights: insights.map(i => ({
      type: i.type,
      title: i.title,
      description: i.description,
      confidence: i.confidence,
    })),
    opportunities: leads.map(l => ({
      title: `New Lead: ${l.companyName}`,
      company: l.companyName,
      rationale: l.aiRationale || '',
    })),
    sectorHighlights,
  };
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(data: UserDigestData, frequency: 'daily' | 'weekly'): string {
  const firstName = data.user.name.split(' ')[0];
  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lupton Intelligence ${frequency === 'daily' ? 'Daily' : 'Weekly'} Digest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; margin: 0; padding: 0; background: #f5f5f7; }
    .container { max-width: 680px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
    .header p { color: #94a3b8; margin: 10px 0 0; font-size: 14px; }
    .logo { width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
    .logo span { color: white; font-size: 24px; font-weight: bold; }
    .content { padding: 30px; }
    .greeting { font-size: 18px; color: #1e3a5f; margin-bottom: 20px; }
    .ai-briefing { background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 30px; }
    .ai-briefing h2 { color: #1e3a5f; font-size: 16px; margin: 0 0 15px; display: flex; align-items: center; gap: 8px; }
    .ai-briefing p { color: #475569; margin: 0; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
    .article { padding: 15px; background: #f8fafc; border-radius: 12px; margin-bottom: 12px; }
    .article-title { font-size: 14px; font-weight: 600; color: #1e3a5f; margin: 0 0 8px; }
    .article-title a { color: #1e3a5f; text-decoration: none; }
    .article-title a:hover { color: #3b82f6; }
    .article-meta { font-size: 12px; color: #64748b; margin-bottom: 8px; }
    .article-summary { font-size: 13px; color: #475569; margin: 0; }
    .tag { display: inline-block; padding: 2px 8px; background: #e0e7ff; color: #4338ca; border-radius: 4px; font-size: 11px; margin-right: 5px; }
    .tag.positive { background: #dcfce7; color: #166534; }
    .tag.negative { background: #fee2e2; color: #991b1b; }
    .tag.high { background: #fef3c7; color: #92400e; }
    .alert-item { padding: 12px 15px; background: #fef3c7; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #f59e0b; }
    .alert-item.high { background: #fee2e2; border-color: #ef4444; }
    .alert-title { font-size: 13px; font-weight: 600; color: #1e3a5f; margin: 0; }
    .alert-message { font-size: 12px; color: #64748b; margin: 5px 0 0; }
    .insight { padding: 12px 15px; background: #f0fdf4; border-radius: 8px; margin-bottom: 8px; }
    .insight.risk { background: #fef2f2; }
    .insight-type { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #059669; margin-bottom: 5px; }
    .insight.risk .insight-type { color: #dc2626; }
    .insight-title { font-size: 13px; color: #1e3a5f; margin: 0; }
    .sector-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .sector-card { padding: 15px; background: #f8fafc; border-radius: 8px; }
    .sector-name { font-size: 12px; font-weight: 600; color: #1e3a5f; margin-bottom: 5px; }
    .sector-count { font-size: 20px; font-weight: 700; color: #3b82f6; }
    .sector-label { font-size: 11px; color: #64748b; }
    .cta { text-align: center; padding: 30px; background: #f8fafc; }
    .cta-button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .footer { padding: 30px; text-align: center; background: #1e3a5f; color: #94a3b8; }
    .footer p { margin: 0 0 10px; font-size: 12px; }
    .footer a { color: #60a5fa; text-decoration: none; }
    @media (max-width: 600px) {
      .content { padding: 20px; }
      .sector-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo"><span>L</span></div>
      <h1>Lupton Intelligence</h1>
      <p>${frequency === 'daily' ? 'Daily' : 'Weekly'} Digest • ${dateStr}</p>
    </div>
    
    <div class="content">
      <p class="greeting">Good morning, ${firstName}!</p>
      
      <div class="ai-briefing">
        <h2>✨ AI Executive Summary</h2>
        <p>${data.aiBriefing.replace(/\n/g, '<br>')}</p>
      </div>

      ${data.alerts.length > 0 ? `
      <div class="section">
        <h3 class="section-title">🔔 Priority Alerts</h3>
        ${data.alerts.map(alert => `
          <div class="alert-item ${alert.priority === 'HIGH' ? 'high' : ''}">
            <p class="alert-title">${alert.title}</p>
            <p class="alert-message">${alert.message}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="section">
        <h3 class="section-title">📰 Top Stories For You</h3>
        ${data.topArticles.slice(0, 5).map(article => `
          <div class="article">
            <h4 class="article-title"><a href="${article.url}">${article.title}</a></h4>
            <p class="article-meta">
              ${article.source} • 
              <span class="tag ${article.sentiment}">${article.sentiment}</span>
              <span class="tag">${article.relevanceScore}% relevant</span>
            </p>
            <p class="article-summary">${article.summary.slice(0, 200)}${article.summary.length > 200 ? '...' : ''}</p>
            <p style="margin-top: 8px;">
              ${article.companies.slice(0, 3).map(c => `<span class="tag">${c}</span>`).join('')}
            </p>
          </div>
        `).join('')}
      </div>

      ${data.insights.length > 0 ? `
      <div class="section">
        <h3 class="section-title">💡 AI Insights</h3>
        ${data.insights.map(insight => `
          <div class="insight ${insight.type === 'RISK' ? 'risk' : ''}">
            <p class="insight-type">${insight.type} • ${insight.confidence}% confidence</p>
            <p class="insight-title">${insight.title}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${Object.keys(data.sectorHighlights).length > 0 ? `
      <div class="section">
        <h3 class="section-title">📊 Sector Activity</h3>
        <div class="sector-grid">
          ${Object.entries(data.sectorHighlights).map(([sector, info]) => `
            <div class="sector-card">
              <p class="sector-name">${formatSectorName(sector)}</p>
              <p class="sector-count">${info.articleCount}</p>
              <p class="sector-label">articles this ${frequency === 'daily' ? 'day' : 'week'}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${data.opportunities.length > 0 ? `
      <div class="section">
        <h3 class="section-title">🎯 New Opportunities</h3>
        ${data.opportunities.map(opp => `
          <div class="article">
            <h4 class="article-title">${opp.title}</h4>
            <p class="article-summary">${opp.rationale}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <div class="cta">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://lupton-news.vercel.app'}/dashboard" class="cta-button">
        View Full Dashboard →
      </a>
    </div>

    <div class="footer">
      <p>Lupton Associates Intelligence Platform</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://lupton-news.vercel.app'}/settings">Manage email preferences</a></p>
      <p>© ${new Date().getFullYear()} Lupton Associates • <a href="https://www.luptons.com">www.luptons.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

function formatSectorName(sector: string): string {
  return sector
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Send digest email to a user
 */
async function sendDigestEmail(data: UserDigestData, frequency: 'daily' | 'weekly'): Promise<boolean> {
  const html = generateEmailHTML(data, frequency);
  const subject = `${frequency === 'daily' ? '📰 Daily' : '📊 Weekly'} Intelligence Digest - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  try {
    const result = await resend.emails.send({
      from: 'Lupton Intelligence <digest@luptons.com>',
      to: data.user.email,
      subject,
      html,
    });

    // Track the digest
    await prisma.emailDigest.create({
      data: {
        userId: data.user.id,
        type: frequency,
        subject,
        htmlContent: html,
        articleIds: JSON.stringify(data.topArticles.map(a => a.id)),
        delivered: true,
      },
    });

    // Mark alerts as sent
    await prisma.alert.updateMany({
      where: {
        userId: data.user.id,
        emailSentAt: null,
      },
      data: {
        emailSentAt: new Date(),
      },
    });

    console.log(`✅ Sent ${frequency} digest to ${data.user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send digest to ${data.user.email}:`, error);
    return false;
  }
}

/**
 * Send daily digests to all eligible users
 */
export async function sendDailyDigests(): Promise<{ sent: number; failed: number }> {
  console.log('📧 Starting daily digest distribution...');
  
  const users = await prisma.user.findMany({
    where: {
      preferences: {
        emailEnabled: true,
        emailFrequency: { in: ['daily', 'twice-daily'] },
      },
    },
    include: { preferences: true },
  });

  let sent = 0;
  let failed = 0;

  for (const user of users) {
    const data = await generateUserDigestData(user.id, 'daily');
    if (data && data.topArticles.length > 0) {
      const success = await sendDigestEmail(data, 'daily');
      if (success) sent++;
      else failed++;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`📧 Daily digest complete: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

/**
 * Send weekly digests to all eligible users
 */
export async function sendWeeklyDigests(): Promise<{ sent: number; failed: number }> {
  console.log('📧 Starting weekly digest distribution...');
  
  const users = await prisma.user.findMany({
    where: {
      preferences: {
        emailEnabled: true,
        emailFrequency: 'weekly',
      },
    },
    include: { preferences: true },
  });

  let sent = 0;
  let failed = 0;

  for (const user of users) {
    const data = await generateUserDigestData(user.id, 'weekly');
    if (data && data.topArticles.length > 0) {
      const success = await sendDigestEmail(data, 'weekly');
      if (success) sent++;
      else failed++;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`📧 Weekly digest complete: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

export default {
  generateUserDigestData,
  sendDigestEmail,
  sendDailyDigests,
  sendWeeklyDigests,
};
