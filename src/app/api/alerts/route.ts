import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ALERTS, MOCK_NEWS } from '@/data/mockNews';
import { getArticlePriority } from '@/lib/ai';

// API for managing user alerts and notifications
// In production, this would integrate with a real notification service

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'user-1';
  const unreadOnly = searchParams.get('unread') === 'true';
  const type = searchParams.get('type');
  const priority = searchParams.get('priority');

  try {
    let alerts = [...MOCK_ALERTS].filter((alert) => alert.userId === userId);

    // Apply filters
    if (unreadOnly) {
      alerts = alerts.filter((alert) => !alert.readAt);
    }

    if (type) {
      alerts = alerts.filter((alert) => alert.type === type);
    }

    if (priority) {
      alerts = alerts.filter((alert) => alert.priority === priority);
    }

    // Sort by creation date (newest first)
    alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      alerts,
      meta: {
        total: alerts.length,
        unread: alerts.filter((a) => !a.readAt).length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId, alertIds } = body;

    switch (action) {
      case 'markAsRead':
        // Mark single alert as read
        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} marked as read`,
          readAt: new Date().toISOString(),
        });

      case 'markAllAsRead':
        // Mark multiple alerts as read
        return NextResponse.json({
          success: true,
          message: `${alertIds?.length || 'All'} alerts marked as read`,
          readAt: new Date().toISOString(),
        });

      case 'delete':
        // Delete alert
        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} deleted`,
        });

      case 'create':
        // Create new alert (for testing or manual alerts)
        const newAlert = {
          id: `alert-${Date.now()}`,
          ...body.alert,
          createdAt: new Date().toISOString(),
        };
        return NextResponse.json({
          success: true,
          alert: newAlert,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process alert action' },
      { status: 500 }
    );
  }
}

// Generate alerts from news articles
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    // In production, this would generate real-time alerts based on
    // incoming news articles and user preferences

    const generatedAlerts = MOCK_NEWS
      .filter((article) => {
        // Filter by user's followed companies
        if (preferences?.followedCompanies?.length) {
          const hasFollowedCompany = article.companies.some((c) =>
            preferences.followedCompanies.includes(c)
          );
          if (!hasFollowedCompany) return false;
        }

        // Filter by user's followed sectors
        if (preferences?.followedSectors?.length) {
          const hasFollowedSector = article.sectors.some((s) =>
            preferences.followedSectors.includes(s)
          );
          if (!hasFollowedSector) return false;
        }

        // Filter by priority threshold
        const articlePriority = getArticlePriority(article);
        if (preferences?.priorityThreshold) {
          const priorityLevels = ['low', 'medium', 'high', 'critical'];
          const thresholdIndex = priorityLevels.indexOf(preferences.priorityThreshold);
          const articleIndex = priorityLevels.indexOf(articlePriority);
          if (articleIndex < thresholdIndex) return false;
        }

        return true;
      })
      .slice(0, 10)
      .map((article) => ({
        id: `alert-${article.id}`,
        type: 'news' as const,
        title: article.title,
        message: article.summary,
        priority: getArticlePriority(article),
        relatedArticle: article.id,
        relatedCompanies: article.companies,
        relatedSectors: article.sectors,
        createdAt: article.publishedAt,
        userId,
      }));

    return NextResponse.json({
      success: true,
      alerts: generatedAlerts,
      meta: {
        generated: generatedAlerts.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate alerts' },
      { status: 500 }
    );
  }
}
