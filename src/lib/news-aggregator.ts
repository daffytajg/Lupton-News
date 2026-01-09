/**
 * Professional News Aggregation Service
 * Fetches news from multiple reliable sources
 */

import { prisma } from './db';
import { processArticle } from './ai-pipeline';

// News source configurations
const NEWS_SOURCES = {
  newsapi: {
    name: 'NewsAPI',
    baseUrl: 'https://newsapi.org/v2',
    requiresKey: true,
  },
  gnews: {
    name: 'GNews',
    baseUrl: 'https://gnews.io/api/v4',
    requiresKey: true,
  },
  rss: {
    name: 'RSS Feeds',
    feeds: [
      // Industry-specific feeds
      { url: 'https://www.datacenterknowledge.com/rss.xml', sector: 'datacenter' },
      { url: 'https://www.defensenews.com/arc/outboundfeeds/rss/', sector: 'military-aerospace' },
      { url: 'https://www.truckingnews.com/feed/', sector: 'heavy-trucks' },
      { url: 'https://www.medtechdive.com/feeds/news/', sector: 'medical-scientific' },
      { url: 'https://www.therobotreport.com/feed/', sector: 'robotics-automation' },
      // General business
      { url: 'https://feeds.bloomberg.com/markets/news.rss', sector: 'general' },
      { url: 'https://www.reuters.com/rssFeed/businessNews', sector: 'general' },
    ],
  },
};

// Search queries by sector
const SECTOR_QUERIES = {
  datacenter: [
    'datacenter construction',
    'AI infrastructure investment',
    'hyperscale datacenter',
    'NVIDIA datacenter',
    'cloud infrastructure expansion',
    'data center power',
    'GPU cluster',
  ],
  'military-aerospace': [
    'defense contract award',
    'Pentagon procurement',
    'aerospace manufacturing',
    'military technology',
    'defense budget',
    'DOD contract',
  ],
  'heavy-trucks': [
    'commercial truck manufacturing',
    'fleet expansion',
    'trucking industry',
    'heavy duty truck',
    'freight transportation',
    'truck electrification',
  ],
  'medical-scientific': [
    'medical device manufacturing',
    'hospital equipment',
    'laboratory equipment',
    'FDA approval',
    'healthcare technology',
    'scientific instruments',
  ],
  'robotics-automation': [
    'industrial automation',
    'manufacturing robotics',
    'factory automation',
    'robotic systems',
    'automation investment',
    'smart manufacturing',
  ],
};

// Company-specific search terms
async function getCompanySearchTerms(): Promise<string[]> {
  const companies = await prisma.company.findMany({
    select: { name: true, shortName: true, stockTicker: true },
  });
  
  return companies.flatMap(c => [
    c.name,
    c.shortName,
    c.stockTicker,
  ].filter(Boolean) as string[]);
}

interface RawArticle {
  title: string;
  description?: string;
  content?: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

/**
 * Fetch from NewsAPI
 */
async function fetchFromNewsAPI(query: string): Promise<RawArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];
  
  try {
    const response = await fetch(
      `${NEWS_SOURCES.newsapi.baseUrl}/everything?` +
      `q=${encodeURIComponent(query)}&` +
      `language=en&` +
      `sortBy=publishedAt&` +
      `pageSize=10&` +
      `apiKey=${apiKey}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      source: a.source?.name || 'NewsAPI',
      publishedAt: a.publishedAt,
      imageUrl: a.urlToImage,
    }));
  } catch (error) {
    console.error('NewsAPI error:', error);
    return [];
  }
}

/**
 * Fetch from GNews
 */
async function fetchFromGNews(query: string): Promise<RawArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];
  
  try {
    const response = await fetch(
      `${NEWS_SOURCES.gnews.baseUrl}/search?` +
      `q=${encodeURIComponent(query)}&` +
      `lang=en&` +
      `max=10&` +
      `apikey=${apiKey}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      source: a.source?.name || 'GNews',
      publishedAt: a.publishedAt,
      imageUrl: a.image,
    }));
  } catch (error) {
    console.error('GNews error:', error);
    return [];
  }
}

/**
 * Fetch from RSS feeds
 */
async function fetchFromRSS(feedUrl: string): Promise<RawArticle[]> {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) return [];
    
    const xml = await response.text();
    
    // Simple RSS parsing
    const items: RawArticle[] = [];
    const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    
    for (const item of itemMatches.slice(0, 10)) {
      const title = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || '';
      const link = item.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1] || '';
      const description = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      
      if (title && link) {
        items.push({
          title: title.replace(/<[^>]*>/g, '').trim(),
          description: description.replace(/<[^>]*>/g, '').trim(),
          url: link.trim(),
          source: new URL(feedUrl).hostname,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error('RSS fetch error:', feedUrl, error);
    return [];
  }
}

/**
 * Deduplicate articles by URL and similar titles
 */
function deduplicateArticles(articles: RawArticle[]): RawArticle[] {
  const seen = new Set<string>();
  const result: RawArticle[] = [];
  
  for (const article of articles) {
    // Create a normalized key
    const urlKey = article.url.toLowerCase().replace(/[?#].*$/, '');
    const titleKey = article.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
    
    if (!seen.has(urlKey) && !seen.has(titleKey)) {
      seen.add(urlKey);
      seen.add(titleKey);
      result.push(article);
    }
  }
  
  return result;
}

/**
 * Main aggregation function - fetch news from all sources
 */
export async function aggregateNews(): Promise<{ fetched: number; processed: number; relevant: number }> {
  console.log('🔄 Starting news aggregation...');
  
  const allArticles: RawArticle[] = [];
  
  // Fetch from RSS feeds
  for (const feed of NEWS_SOURCES.rss.feeds) {
    const articles = await fetchFromRSS(feed.url);
    allArticles.push(...articles);
  }
  
  // Fetch from NewsAPI for each sector
  for (const [sector, queries] of Object.entries(SECTOR_QUERIES)) {
    for (const query of queries.slice(0, 2)) { // Limit to avoid rate limits
      const articles = await fetchFromNewsAPI(query);
      allArticles.push(...articles);
    }
  }
  
  // Fetch for specific companies
  const companyTerms = await getCompanySearchTerms();
  for (const term of companyTerms.slice(0, 10)) { // Limit to top companies
    const articles = await fetchFromNewsAPI(term);
    allArticles.push(...articles);
  }
  
  // Deduplicate
  const uniqueArticles = deduplicateArticles(allArticles);
  console.log(`📰 Fetched ${uniqueArticles.length} unique articles`);
  
  // Save and process articles
  let processed = 0;
  let relevant = 0;
  
  for (const article of uniqueArticles) {
    try {
      // Check if already exists
      const existing = await prisma.newsArticle.findFirst({
        where: { url: article.url },
      });
      
      if (existing) continue;
      
      // Create article
      const created = await prisma.newsArticle.create({
        data: {
          title: article.title,
          summary: article.description,
          content: article.content,
          url: article.url,
          source: article.source,
          sourceType: 'aggregated',
          imageUrl: article.imageUrl,
          publishedAt: new Date(article.publishedAt),
        },
      });
      
      // Process with AI pipeline
      const result = await processArticle({
        id: created.id,
        title: created.title,
        content: created.content || created.summary || undefined,
        summary: created.summary || undefined,
        source: created.source,
        url: created.url,
      });
      
      processed++;
      if (result.analysis.isRelevant) relevant++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error processing article:', article.title, error);
    }
  }
  
  console.log(`✅ Processed ${processed} articles, ${relevant} relevant`);
  
  return {
    fetched: uniqueArticles.length,
    processed,
    relevant,
  };
}

/**
 * Search for specific news about a company or topic
 */
export async function searchNews(query: string, options?: {
  sector?: string;
  limit?: number;
  fromDate?: Date;
}): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  
  // Search NewsAPI
  const newsApiResults = await fetchFromNewsAPI(query);
  articles.push(...newsApiResults);
  
  // Search GNews
  const gnewsResults = await fetchFromGNews(query);
  articles.push(...gnewsResults);
  
  // Deduplicate and filter
  let results = deduplicateArticles(articles);
  
  if (options?.fromDate) {
    results = results.filter(a => new Date(a.publishedAt) >= options.fromDate!);
  }
  
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
}

/**
 * Get trending topics in Lupton's industries
 */
export async function getTrendingTopics(): Promise<Array<{
  topic: string;
  sector: string;
  articleCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}>> {
  // Get recent articles grouped by categories
  const recentArticles = await prisma.newsArticle.findMany({
    where: {
      publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      relevanceScore: { gte: 50 },
    },
    select: {
      categories: true,
      sentiment: true,
      sectors: true,
    },
  });
  
  // Count topics
  const topicCounts: Record<string, { count: number; sentiments: string[]; sectors: string[] }> = {};
  
  for (const article of recentArticles) {
    const categories = JSON.parse(article.categories || '[]') as string[];
    const sectors = JSON.parse(article.sectors || '[]') as string[];
    
    for (const category of categories) {
      if (!topicCounts[category]) {
        topicCounts[category] = { count: 0, sentiments: [], sectors: [] };
      }
      topicCounts[category].count++;
      if (article.sentiment) topicCounts[category].sentiments.push(article.sentiment);
      topicCounts[category].sectors.push(...sectors);
    }
  }
  
  // Convert to array and sort
  return Object.entries(topicCounts)
    .map(([topic, data]) => {
      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
      for (const s of data.sentiments) {
        if (s in sentimentCounts) sentimentCounts[s as keyof typeof sentimentCounts]++;
      }
      const dominantSentiment = Object.entries(sentimentCounts)
        .sort((a, b) => b[1] - a[1])[0][0] as 'positive' | 'negative' | 'neutral';
      
      const sectorCounts: Record<string, number> = {};
      for (const s of data.sectors) {
        sectorCounts[s] = (sectorCounts[s] || 0) + 1;
      }
      const dominantSector = Object.entries(sectorCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';
      
      return {
        topic,
        sector: dominantSector,
        articleCount: data.count,
        sentiment: dominantSentiment,
      };
    })
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 10);
}

export default {
  aggregateNews,
  searchNews,
  getTrendingTopics,
};
