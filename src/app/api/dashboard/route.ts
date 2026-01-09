import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's assigned companies
    const userAssignments = await prisma.userCompanyAssignment.findMany({
      where: { userId },
      include: { company: true },
    });
    const companyIds = userAssignments.map(a => a.companyId);

    // Get recent articles for user's companies
    const recentArticles = await prisma.newsArticle.findMany({
      where: {
        OR: [
          { companies: { some: { companyId: { in: companyIds } } } },
          { relevanceScore: { gte: 70 } },
        ],
        publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: [
        { isBreaking: 'desc' },
        { relevanceScore: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: 50,
      include: {
        companies: { include: { company: true } },
      },
    });

    // Get active alerts for user
    const alerts = await prisma.alert.findMany({
      where: {
        userId,
        dismissedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        article: true,
        company: true,
      },
    });

    // Get AI insights
    const insights = await prisma.aIInsight.findMany({
      where: {
        isActive: true,
        OR: [
          { companies: { some: { companyId: { in: companyIds } } } },
          { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        ],
      },
      orderBy: { confidence: 'desc' },
      take: 10,
    });

    // Get prospect leads
    const leads = await prisma.prospectLead.findMany({
      where: {
        status: { in: ['new', 'contacted'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Calculate stats
    const stats = {
      breakingNews: recentArticles.filter(a => a.isBreaking).length,
      activeAlerts: alerts.length,
      newOpportunities: insights.filter(i => i.type === 'OPPORTUNITY').length,
      trackedCompanies: companyIds.length,
    };

    // Get sector activity
    const sectorActivity = await getSectorActivity();

    return NextResponse.json({
      stats,
      articles: recentArticles.map(a => ({
        id: a.id,
        title: a.title,
        summary: a.aiSummary || a.summary,
        source: a.source,
        url: a.url,
        publishedAt: a.publishedAt,
        relevanceScore: a.relevanceScore,
        sentiment: a.sentiment,
        isBreaking: a.isBreaking,
        companies: a.companies.map(c => ({
          id: c.company.id,
          name: c.company.name,
          shortName: c.company.shortName,
        })),
        categories: JSON.parse(a.categories || '[]'),
      })),
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.type,
        priority: a.priority,
        title: a.title,
        message: a.message,
        createdAt: a.createdAt,
        company: a.company?.name,
      })),
      insights: insights.map(i => ({
        id: i.id,
        type: i.type,
        title: i.title,
        description: i.description,
        confidence: i.confidence,
        impact: i.impact,
      })),
      leads: leads.map(l => ({
        id: l.id,
        companyName: l.companyName,
        sector: l.sector,
        rationale: l.aiRationale,
        status: l.status,
      })),
      sectorActivity,
      companies: userAssignments.map(a => ({
        id: a.company.id,
        name: a.company.name,
        shortName: a.company.shortName,
        ticker: a.company.stockTicker,
        type: a.company.type,
        isPrimary: a.isPrimary,
      })),
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}

async function getSectorActivity() {
  const sectors = ['datacenter', 'military-aerospace', 'heavy-trucks', 'medical-scientific', 'robotics-automation'];
  const activity: Record<string, any> = {};

  for (const sector of sectors) {
    const articles = await prisma.newsArticle.findMany({
      where: {
        sectors: { contains: sector },
        publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: {
        sentiment: true,
        sentimentScore: true,
      },
    });

    const positiveCount = articles.filter(a => a.sentiment === 'positive').length;
    const totalCount = articles.length;

    activity[sector] = {
      articleCount: totalCount,
      sentimentScore: totalCount > 0 ? positiveCount / totalCount : 0.5,
      trend: totalCount > 5 ? 'up' : 'neutral',
    };
  }

  return activity;
}
