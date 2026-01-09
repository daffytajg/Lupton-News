/**
 * Proactive Alerting & Lead Generation Service
 * Intelligent system for identifying opportunities and risks
 */

import { prisma } from './db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Alert priority levels
export type AlertPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

// Alert types
export type AlertType = 
  | 'BREAKING_NEWS'
  | 'GOVERNMENT_CONTRACT'
  | 'M_AND_A'
  | 'C_SUITE_CHANGE'
  | 'EARNINGS'
  | 'NEW_FACILITY'
  | 'COMPETITOR_MOVE'
  | 'POLICY_CHANGE'
  | 'SUPPLY_CHAIN'
  | 'NEW_LEAD'
  | 'RISK_ALERT';

// Trigger conditions for different alert types
const ALERT_TRIGGERS = {
  BREAKING_NEWS: {
    keywords: ['breaking', 'urgent', 'just announced', 'developing'],
    relevanceThreshold: 85,
    priority: 'HIGH' as AlertPriority,
  },
  GOVERNMENT_CONTRACT: {
    keywords: ['contract award', 'government contract', 'DOD', 'Pentagon', 'federal contract', 'procurement'],
    relevanceThreshold: 75,
    priority: 'HIGH' as AlertPriority,
  },
  M_AND_A: {
    keywords: ['acquisition', 'merger', 'acquires', 'acquired', 'buyout', 'takeover', 'deal'],
    relevanceThreshold: 80,
    priority: 'CRITICAL' as AlertPriority,
  },
  C_SUITE_CHANGE: {
    keywords: ['CEO', 'CFO', 'COO', 'CTO', 'appointed', 'resignation', 'steps down', 'executive'],
    relevanceThreshold: 70,
    priority: 'HIGH' as AlertPriority,
  },
  EARNINGS: {
    keywords: ['earnings', 'quarterly results', 'revenue', 'profit', 'Q1', 'Q2', 'Q3', 'Q4', 'fiscal'],
    relevanceThreshold: 65,
    priority: 'MEDIUM' as AlertPriority,
  },
  NEW_FACILITY: {
    keywords: ['new facility', 'expansion', 'construction', 'new plant', 'manufacturing site', 'headquarters'],
    relevanceThreshold: 75,
    priority: 'HIGH' as AlertPriority,
  },
  COMPETITOR_MOVE: {
    keywords: ['competitor', 'market share', 'competing', 'rivalry'],
    relevanceThreshold: 70,
    priority: 'MEDIUM' as AlertPriority,
  },
  POLICY_CHANGE: {
    keywords: ['regulation', 'policy', 'tariff', 'executive order', 'legislation', 'FDA', 'EPA'],
    relevanceThreshold: 70,
    priority: 'HIGH' as AlertPriority,
  },
  SUPPLY_CHAIN: {
    keywords: ['supply chain', 'shortage', 'disruption', 'logistics', 'inventory'],
    relevanceThreshold: 70,
    priority: 'MEDIUM' as AlertPriority,
  },
};

/**
 * Determine alert type from article content
 */
function determineAlertType(
  title: string,
  content: string,
  categories: string[]
): { type: AlertType; priority: AlertPriority } | null {
  const text = `${title} ${content}`.toLowerCase();
  
  // Check each trigger type
  for (const [type, config] of Object.entries(ALERT_TRIGGERS)) {
    const matchCount = config.keywords.filter(kw => text.includes(kw.toLowerCase())).length;
    if (matchCount >= 1) {
      return {
        type: type as AlertType,
        priority: config.priority,
      };
    }
  }
  
  // Check categories
  if (categories.includes('mergers-acquisitions')) {
    return { type: 'M_AND_A', priority: 'CRITICAL' };
  }
  if (categories.includes('government-contracts')) {
    return { type: 'GOVERNMENT_CONTRACT', priority: 'HIGH' };
  }
  if (categories.includes('c-suite')) {
    return { type: 'C_SUITE_CHANGE', priority: 'HIGH' };
  }
  
  return null;
}

/**
 * Create alerts for relevant users based on article
 */
export async function createAlertsForArticle(articleId: string): Promise<number> {
  const article = await prisma.newsArticle.findUnique({
    where: { id: articleId },
    include: {
      companies: { include: { company: true } },
    },
  });
  
  if (!article || article.relevanceScore < 60) {
    return 0;
  }
  
  const categories = JSON.parse(article.categories || '[]') as string[];
  const alertInfo = determineAlertType(article.title, article.content || '', categories);
  
  if (!alertInfo) {
    return 0;
  }
  
  // Find users who should receive this alert
  const companyIds = article.companies.map(c => c.companyId);
  const sectors = JSON.parse(article.sectors || '[]') as string[];
  
  const relevantUsers = await prisma.user.findMany({
    where: {
      OR: [
        // Users assigned to these companies
        { assignedCompanies: { some: { companyId: { in: companyIds } } } },
        // Executives see all high-priority alerts
        { role: 'EXECUTIVE' },
      ],
    },
    include: {
      preferences: true,
    },
  });
  
  let alertsCreated = 0;
  
  for (const user of relevantUsers) {
    // Check if user wants this type of alert
    const prefs = user.preferences;
    if (!prefs?.pushEnabled) continue;
    
    // Check priority threshold
    const priorityOrder = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const userThreshold = priorityOrder.indexOf(prefs.alertPriorityThreshold.toUpperCase());
    const alertPriority = priorityOrder.indexOf(alertInfo.priority);
    
    if (alertPriority < userThreshold) continue;
    
    // Create the alert
    await prisma.alert.create({
      data: {
        userId: user.id,
        type: alertInfo.type,
        priority: alertInfo.priority,
        title: generateAlertTitle(alertInfo.type, article.title),
        message: article.aiSummary || article.summary || article.title,
        articleId: article.id,
        companyId: companyIds[0] || null,
      },
    });
    
    alertsCreated++;
  }
  
  return alertsCreated;
}

/**
 * Generate a concise alert title
 */
function generateAlertTitle(type: AlertType, articleTitle: string): string {
  const prefixes: Record<AlertType, string> = {
    BREAKING_NEWS: '🚨 Breaking:',
    GOVERNMENT_CONTRACT: '📋 Contract:',
    M_AND_A: '🤝 M&A Alert:',
    C_SUITE_CHANGE: '👔 Leadership:',
    EARNINGS: '📊 Earnings:',
    NEW_FACILITY: '🏭 Expansion:',
    COMPETITOR_MOVE: '⚔️ Competitor:',
    POLICY_CHANGE: '📜 Policy:',
    SUPPLY_CHAIN: '🔗 Supply Chain:',
    NEW_LEAD: '🎯 New Lead:',
    RISK_ALERT: '⚠️ Risk:',
  };
  
  const prefix = prefixes[type] || '📰';
  const shortTitle = articleTitle.length > 80 
    ? articleTitle.slice(0, 77) + '...'
    : articleTitle;
  
  return `${prefix} ${shortTitle}`;
}

/**
 * AI-powered lead identification from news
 */
export async function identifyLeadsFromArticle(articleId: string): Promise<string | null> {
  const article = await prisma.newsArticle.findUnique({
    where: { id: articleId },
  });
  
  if (!article || article.relevanceScore < 70) {
    return null;
  }
  
  const prompt = `Analyze this news article for potential sales leads for Lupton Associates, a manufacturers' representative company serving:
- Datacenter/AI Infrastructure
- Military & Aerospace
- Heavy Trucks
- Medical & Scientific
- Robotics & Automation

ARTICLE:
Title: ${article.title}
Content: ${article.content || article.summary || ''}

Identify if there's a NEW company (not already a major player) that could benefit from a manufacturers' rep. Look for:
1. Companies announcing expansion into these industries
2. New facilities being built that need industrial equipment
3. Startups receiving funding in relevant sectors
4. Companies making their first major purchase in these areas

If you identify a potential lead, respond with JSON:
{
  "isLead": true,
  "companyName": "Company Name",
  "sector": "datacenter|military-aerospace|heavy-trucks|medical-scientific|robotics-automation",
  "rationale": "Why this is a good lead",
  "suggestedApproach": "How to approach them",
  "estimatedValue": "small|medium|large",
  "territory": "Geographic region if mentioned"
}

If no lead is identified, respond with:
{"isLead": false}

Return ONLY valid JSON.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      if (result.isLead && result.companyName) {
        // Check if lead already exists
        const existing = await prisma.prospectLead.findFirst({
          where: { companyName: result.companyName },
        });
        
        if (!existing) {
          const lead = await prisma.prospectLead.create({
            data: {
              companyName: result.companyName,
              sourceType: 'news',
              sourceArticleId: articleId,
              sector: result.sector || 'general',
              territory: result.territory,
              estimatedValue: result.estimatedValue,
              aiRationale: result.rationale,
              suggestedApproach: result.suggestedApproach,
              status: 'new',
            },
          });
          
          // Create alert for executives about new lead
          const executives = await prisma.user.findMany({
            where: { role: 'EXECUTIVE' },
          });
          
          for (const exec of executives) {
            await prisma.alert.create({
              data: {
                userId: exec.id,
                type: 'NEW_LEAD',
                priority: 'HIGH',
                title: `🎯 New Lead Identified: ${result.companyName}`,
                message: result.rationale,
              },
            });
          }
          
          return lead.id;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Lead identification error:', error);
    return null;
  }
}

/**
 * Monitor for government policy changes affecting industries
 */
export async function monitorPolicyChanges(): Promise<void> {
  // Search for recent policy-related articles
  const recentPolicyArticles = await prisma.newsArticle.findMany({
    where: {
      publishedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      categories: { contains: 'regulation' },
      processed: true,
    },
    orderBy: { relevanceScore: 'desc' },
    take: 10,
  });
  
  for (const article of recentPolicyArticles) {
    // Check if we already have a policy update for this
    const existing = await prisma.policyUpdate.findFirst({
      where: {
        OR: [
          { url: article.url },
          { title: article.title },
        ],
      },
    });
    
    if (existing) continue;
    
    // Analyze policy impact
    const prompt = `Analyze this policy/regulation news for impact on industrial sectors:

ARTICLE: ${article.title}
${article.content || article.summary || ''}

Identify:
1. Which sectors are affected (datacenter, military-aerospace, heavy-trucks, medical-scientific, robotics-automation)
2. Impact level (high/medium/low)
3. Action items for a manufacturers' rep

Respond in JSON:
{
  "affectedSectors": ["sector1", "sector2"],
  "impactLevel": "high|medium|low",
  "summary": "Brief summary of the policy",
  "actionItems": ["action1", "action2"],
  "effectiveDate": "YYYY-MM-DD or null"
}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        await prisma.policyUpdate.create({
          data: {
            title: article.title,
            summary: result.summary || article.aiSummary || '',
            source: article.source,
            url: article.url,
            type: 'regulation',
            affectedSectors: JSON.stringify(result.affectedSectors || []),
            impactLevel: result.impactLevel || 'medium',
            aiAnalysis: text,
            actionItems: JSON.stringify(result.actionItems || []),
            effectiveDate: result.effectiveDate ? new Date(result.effectiveDate) : null,
            publishedAt: article.publishedAt,
          },
        });
        
        // Alert relevant users
        if (result.impactLevel === 'high') {
          const users = await prisma.user.findMany({
            where: {
              OR: [
                { role: 'EXECUTIVE' },
                {
                  preferences: {
                    followedSectors: {
                      contains: result.affectedSectors?.[0] || '',
                    },
                  },
                },
              ],
            },
          });
          
          for (const user of users) {
            await prisma.alert.create({
              data: {
                userId: user.id,
                type: 'POLICY_CHANGE',
                priority: 'HIGH',
                title: `📜 Policy Alert: ${article.title.slice(0, 60)}...`,
                message: result.summary,
                articleId: article.id,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Policy analysis error:', error);
    }
  }
}

/**
 * Get user's active alerts with pagination
 */
export async function getUserAlerts(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    priority?: AlertPriority;
    unreadOnly?: boolean;
  }
): Promise<{
  alerts: any[];
  total: number;
  unreadCount: number;
}> {
  const where: any = {
    userId,
    dismissedAt: null,
  };
  
  if (options?.priority) {
    where.priority = options.priority;
  }
  
  if (options?.unreadOnly) {
    where.readAt = null;
  }
  
  const [alerts, total, unreadCount] = await Promise.all([
    prisma.alert.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: options?.limit || 20,
      skip: options?.offset || 0,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            url: true,
            source: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
      },
    }),
    prisma.alert.count({ where }),
    prisma.alert.count({
      where: {
        userId,
        dismissedAt: null,
        readAt: null,
      },
    }),
  ]);
  
  return { alerts, total, unreadCount };
}

/**
 * Mark alert as read
 */
export async function markAlertRead(alertId: string, userId: string): Promise<void> {
  await prisma.alert.updateMany({
    where: {
      id: alertId,
      userId,
    },
    data: {
      readAt: new Date(),
    },
  });
}

/**
 * Dismiss alert
 */
export async function dismissAlert(alertId: string, userId: string): Promise<void> {
  await prisma.alert.updateMany({
    where: {
      id: alertId,
      userId,
    },
    data: {
      dismissedAt: new Date(),
    },
  });
}

export default {
  createAlertsForArticle,
  identifyLeadsFromArticle,
  monitorPolicyChanges,
  getUserAlerts,
  markAlertRead,
  dismissAlert,
};
