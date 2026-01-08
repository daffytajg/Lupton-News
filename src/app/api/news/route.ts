import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNews, getNewsBySector, getNewsByCompany, getBreakingNews, refreshNewsCache, getCacheStatus } from '@/lib/googleNews';
import { calculateRelevanceScore, analyzeSentiment, classifyNewsCategories, isRelevantNews } from '@/lib/ai';
import { NewsArticle, Sector, NewsCategory } from '@/types';

// API for fetching and filtering news articles
// Uses Google News RSS feeds with hourly caching

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
  const refresh = searchParams.get('refresh') === 'true';

  try {
    // Fetch articles (from cache or fresh)
    let articles = refresh ? await refreshNewsCache() : await fetchAllNews();

    // Apply filters
    if (sectors && sectors.length > 0) {
      articles = articles.filter(a => a.sectors.some(s => sectors.includes(s)));
    }

    if (categories && categories.length > 0) {
      articles = articles.filter(a => a.categories.some(c => categories.includes(c)));
    }

    if (companies && companies.length > 0) {
      articles = articles.filter(a => a.companies.some(c => companies.includes(c)));
    }

    if (sentiment && sentiment.length > 0) {
      articles = articles.filter(a => sentiment.includes(a.sentiment));
    }

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

    // Get cache status
    const cacheStatus = getCacheStatus();

    return NextResponse.json({
      success: true,
      articles,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        cache: {
          isCached: cacheStatus.isCached,
          lastFetched: cacheStatus.lastFetched?.toISOString() || null,
          expiresAt: cacheStatus.expiresAt?.toISOString() || null,
        },
      },
    });
  } catch (error) {
    console.error('News API error:', error);
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
    const sentimentResult = analyzeSentiment(title, summary);
    const relevanceScore = calculateRelevanceScore(title, summary, source, categories);

    // Return analysis results
    return NextResponse.json({
      success: true,
      relevant: true,
      analysis: {
        categories,
        sentiment: sentimentResult,
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
        sentiment: sentimentResult,
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

// Endpoint for getting sector-specific or company-specific news
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
        const sectorNews = await getNewsBySector(sectorId);
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
        const companyNews = await getNewsByCompany(companyId);
        return NextResponse.json({
          success: true,
          articles: companyNews,
          meta: { total: companyNews.length, company: companyId },
        });

      case 'getBreaking':
        const breakingNews = await getBreakingNews();
        return NextResponse.json({
          success: true,
          articles: breakingNews,
          meta: { total: breakingNews.length },
        });

      case 'refreshCache':
        const refreshedArticles = await refreshNewsCache();
        return NextResponse.json({
          success: true,
          message: 'Cache refreshed successfully',
          meta: { total: refreshedArticles.length },
        });

      case 'getCacheStatus':
        const status = getCacheStatus();
        return NextResponse.json({
          success: true,
          cache: status,
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
