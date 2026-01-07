import { NextRequest, NextResponse } from 'next/server';
import { MOCK_NEWS, getFilteredNews, getNewsBySector, getNewsByCompany } from '@/data/mockNews';
import { calculateRelevanceScore, analyzeSentiment, classifyNewsCategories, isRelevantNews } from '@/lib/ai';
import { NewsArticle, Sector, NewsCategory } from '@/types';

// API for fetching and filtering news articles
// In production, this would connect to a real news aggregation service

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse filter parameters
  const sectors = searchParams.get('sectors')?.split(',') as Sector[] | undefined;
  const categories = searchParams.get('categories')?.split(',') as NewsCategory[] | undefined;
  const companies = searchParams.get('companies')?.split(',');
  const sentiment = searchParams.get('sentiment')?.split(',') as ('positive' | 'negative' | 'neutral')[] | undefined;
  const minRelevance = searchParams.get('minRelevance') ? parseInt(searchParams.get('minRelevance')!) : undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
  const sortBy = searchParams.get('sortBy') || 'latest'; // latest, relevance, trending

  try {
    let articles = getFilteredNews({
      sectors,
      categories,
      companies,
      sentiment,
    });

    // Apply relevance filter
    if (minRelevance) {
      articles = articles.filter((a) => a.relevanceScore >= minRelevance);
    }

    // Sort articles
    switch (sortBy) {
      case 'relevance':
        articles.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      case 'trending':
        // Combine recency and relevance
        articles.sort((a, b) => {
          const aScore = a.relevanceScore + (a.isBreaking ? 20 : 0);
          const bScore = b.relevanceScore + (b.isBreaking ? 20 : 0);
          return bScore - aScore;
        });
        break;
      case 'latest':
      default:
        articles.sort((a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }

    // Apply pagination
    const total = articles.length;
    articles = articles.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      articles,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// Endpoint for analyzing/processing new articles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, source, url } = body;

    // Validate required fields
    if (!title || !summary || !source) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, summary, source' },
        { status: 400 }
      );
    }

    // Check if article is relevant (not garbage)
    const relevant = isRelevantNews(title, summary);

    if (!relevant) {
      return NextResponse.json({
        success: true,
        relevant: false,
        message: 'Article filtered out as not relevant to Lupton Associates interests',
        reason: 'Contains filtered keywords or lacks relevant business indicators',
      });
    }

    // Analyze the article
    const categories = classifyNewsCategories(title, summary);
    const sentiment = analyzeSentiment(title, summary);
    const relevanceScore = calculateRelevanceScore(title, summary, source, categories);

    // Return analysis results
    return NextResponse.json({
      success: true,
      relevant: true,
      analysis: {
        categories,
        sentiment,
        relevanceScore,
        recommendation: relevanceScore >= 80 ? 'high_priority' :
                       relevanceScore >= 60 ? 'monitor' : 'low_priority',
      },
      article: {
        title,
        summary,
        source,
        url,
        categories,
        sentiment,
        relevanceScore,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze article' },
      { status: 500 }
    );
  }
}

// Endpoint for getting sector-specific news
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sectorId, companyId } = body;

    switch (action) {
      case 'getBySector':
        if (!sectorId) {
          return NextResponse.json(
            { success: false, error: 'Sector ID required' },
            { status: 400 }
          );
        }
        const sectorNews = getNewsBySector(sectorId);
        return NextResponse.json({
          success: true,
          articles: sectorNews,
          meta: { total: sectorNews.length, sector: sectorId },
        });

      case 'getByCompany':
        if (!companyId) {
          return NextResponse.json(
            { success: false, error: 'Company ID required' },
            { status: 400 }
          );
        }
        const companyNews = getNewsByCompany(companyId);
        return NextResponse.json({
          success: true,
          articles: companyNews,
          meta: { total: companyNews.length, company: companyId },
        });

      case 'getBreaking':
        const breakingNews = MOCK_NEWS.filter((a) => a.isBreaking);
        return NextResponse.json({
          success: true,
          articles: breakingNews,
          meta: { total: breakingNews.length },
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
