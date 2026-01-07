import { NextRequest, NextResponse } from 'next/server';
import { MOCK_NEWS, MOCK_AI_INSIGHTS, MOCK_STOCKS } from '@/data/mockNews';
import { COMPANIES } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

// This API route generates and could send the daily email digest
// In production, this would integrate with a service like Resend, SendGrid, or AWS SES

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'user-1';
  const preview = searchParams.get('preview') === 'true';

  try {
    // In production, you would fetch user preferences from a database
    const userPreferences = {
      followedCompanies: ['nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'],
      followedSectors: ['datacenter', 'military-aerospace'],
      includeAI: true,
      includeStocks: true,
    };

    // Generate digest content
    const digest = generateDigest(userPreferences);

    if (preview) {
      return NextResponse.json({
        success: true,
        preview: true,
        digest,
      });
    }

    // In production, this would send the email
    // await sendEmail(digest);

    return NextResponse.json({
      success: true,
      message: 'Email digest generated successfully',
      digest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate email digest' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, recipients, sendNow } = body;

    // Validate request
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Fetch user preferences
    // 2. Generate personalized digest
    // 3. Send email via email service

    const digest = generateDigest({
      followedCompanies: ['nvidia', 'lockheed', 'paccar'],
      followedSectors: ['datacenter'],
      includeAI: true,
      includeStocks: true,
    });

    // Mock sending email
    if (sendNow) {
      // In production: await sendEmail(digest, recipients);
      return NextResponse.json({
        success: true,
        message: 'Email digest sent successfully',
        sentTo: recipients || ['alan@luptons.com'],
        sentAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email digest scheduled',
      digest,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send email digest' },
      { status: 500 }
    );
  }
}

interface UserPreferences {
  followedCompanies: string[];
  followedSectors: string[];
  includeAI: boolean;
  includeStocks: boolean;
}

function generateDigest(preferences: UserPreferences) {
  const today = new Date().toISOString().split('T')[0];

  // Get top stories (highest relevance)
  const topStories = [...MOCK_NEWS]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)
    .map((article) => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      source: article.source,
      publishedAt: article.publishedAt,
      sentiment: article.sentiment,
      relevanceScore: article.relevanceScore,
      url: article.url,
      categories: article.categories,
      isBreaking: article.isBreaking,
    }));

  // Get company updates for followed companies
  const companyUpdates = preferences.followedCompanies.map((companyId) => {
    const company = COMPANIES.find((c) => c.id === companyId);
    const articles = MOCK_NEWS.filter((n) => n.companies.includes(companyId));
    return {
      company: company ? {
        id: company.id,
        name: company.name,
        ticker: company.ticker,
        type: company.type,
      } : null,
      articleCount: articles.length,
      articles: articles.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        sentiment: a.sentiment,
      })),
    };
  }).filter((cu) => cu.company && cu.articleCount > 0);

  // Get sector highlights
  const sectorHighlights = preferences.followedSectors.map((sectorId) => {
    const sector = SECTORS.find((s) => s.id === sectorId);
    const articles = MOCK_NEWS.filter((n) => n.sectors.includes(sectorId as any));
    return {
      sector: sector ? {
        id: sector.id,
        name: sector.name,
        icon: sector.icon,
      } : null,
      articleCount: articles.length,
      topArticle: articles[0] ? {
        id: articles[0].id,
        title: articles[0].title,
      } : null,
    };
  }).filter((sh) => sh.sector);

  // Get AI insights
  const aiInsights = preferences.includeAI
    ? MOCK_AI_INSIGHTS.slice(0, 3).map((insight) => ({
        id: insight.id,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence: insight.confidence,
        impact: insight.impact,
      }))
    : [];

  // Get stock movers for followed companies
  const stockMovers = preferences.includeStocks
    ? MOCK_STOCKS.filter((s) => Math.abs(s.changePercent) > 1.5).map((stock) => ({
        ticker: stock.ticker,
        companyName: stock.companyName,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
      }))
    : [];

  return {
    generatedAt: new Date().toISOString(),
    date: today,
    summary: {
      totalArticles: MOCK_NEWS.length,
      aiInsightsCount: aiInsights.length,
      companyUpdatesCount: companyUpdates.length,
      stockMoversCount: stockMovers.length,
    },
    topStories,
    companyUpdates,
    sectorHighlights,
    aiInsights,
    stockMovers,
  };
}
