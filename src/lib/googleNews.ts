// Google News RSS Feed Integration
// Fetches news from Google News RSS feeds for Lupton Associates customers and sectors

import { NewsArticle, Sector, NewsCategory } from '@/types';
import { COMPANIES, findCompaniesInText } from '@/data/companies';
import { classifyNewsCategories, analyzeSentiment, calculateRelevanceScore, isRelevantNews } from './ai';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source?: string;
}

interface NewsCache {
  articles: NewsArticle[];
  lastFetched: Date;
  expiresAt: Date;
}

// In-memory cache (in production, use Redis or similar)
let newsCache: NewsCache | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Google News RSS base URL
const GOOGLE_NEWS_RSS_BASE = 'https://news.google.com/rss/search';

// Search queries for each sector
const SECTOR_QUERIES: Record<Sector, string[]> = {
  'datacenter': [
    'data center construction',
    'hyperscale computing',
    'fiber optic infrastructure',
    'cloud infrastructure',
    'data center cooling',
  ],
  'heavy-trucks': [
    'commercial vehicle manufacturing',
    'electric vehicle fleet',
    'agricultural equipment',
    'construction equipment manufacturer',
    'golf cart manufacturer',
    'utility vehicle industry',
  ],
  'military-aerospace': [
    'defense contract award',
    'aerospace manufacturing',
    'military procurement',
    'space launch contract',
    'defense electronics',
  ],
  'robotics-automation': [
    'industrial automation',
    'manufacturing robotics',
    'factory automation',
    'smart manufacturing',
  ],
  'medical-scientific': [
    'medical device FDA',
    'healthcare equipment',
    'diagnostic equipment',
    'medical manufacturing',
  ],
};

// Business-critical keywords to prioritize
const PRIORITY_KEYWORDS = [
  'acquisition', 'merger', 'M&A', 'acquires', 'acquired',
  'contract award', 'government contract', 'DoD contract',
  'quarterly earnings', 'Q1', 'Q2', 'Q3', 'Q4', 'fiscal',
  'SEC filing', '10-K', '10-Q', '8-K',
  'CEO', 'CFO', 'executive', 'appoints', 'resignation',
  'expansion', 'new facility', 'construction permit',
  'grant', 'federal grant', 'state grant',
  'IPO', 'stock', 'shares', 'dividend',
  'layoff', 'restructuring', 'bankruptcy',
  'patent', 'FDA approval', 'regulatory',
];

/**
 * Parse RSS XML to extract items
 */
function parseRSSXml(xml: string): RSSItem[] {
  const items: RSSItem[] = [];

  // Simple XML parsing for RSS items
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
    const description = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
    const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';

    if (title && link) {
      items.push({
        title: decodeHTMLEntities(title),
        link,
        pubDate,
        description: decodeHTMLEntities(stripHtml(description)),
        source: decodeHTMLEntities(source),
      });
    }
  }

  return items;
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Fetch RSS feed from Google News
 */
async function fetchGoogleNewsRSS(query: string): Promise<RSSItem[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${GOOGLE_NEWS_RSS_BASE}?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LuptonNews/1.0)',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch RSS for query: ${query}`);
      return [];
    }

    const xml = await response.text();
    return parseRSSXml(xml);
  } catch (error) {
    console.error(`Error fetching Google News RSS for "${query}":`, error);
    return [];
  }
}

/**
 * Fetch news for a specific company
 */
async function fetchCompanyNews(companyName: string, ticker?: string): Promise<RSSItem[]> {
  const queries = [companyName];
  if (ticker) {
    queries.push(`${ticker} stock`);
  }

  const results: RSSItem[] = [];
  for (const query of queries) {
    const items = await fetchGoogleNewsRSS(query);
    results.push(...items);
  }

  return results;
}

/**
 * Convert RSS items to NewsArticle format
 */
function rssItemToNewsArticle(item: RSSItem, index: number): NewsArticle | null {
  const { title, link, pubDate, description, source } = item;

  // Check if article is relevant (filter out charity, sports, etc.)
  if (!isRelevantNews(title, description)) {
    return null;
  }

  // Find companies mentioned in the article
  const mentionedCompanies = findCompaniesInText(`${title} ${description}`);
  const companyIds = mentionedCompanies.map(c => c.id);

  // Determine sectors based on mentioned companies
  const sectors = Array.from(new Set(mentionedCompanies.flatMap(c => c.sectors))) as Sector[];

  // Classify categories
  const categories = classifyNewsCategories(title, description);

  // Analyze sentiment
  const sentiment = analyzeSentiment(title, description);

  // Calculate relevance score
  const relevanceScore = calculateRelevanceScore(title, description, source || 'Google News', categories);

  // Check if it's breaking news (published within last 2 hours and high relevance)
  const publishedDate = new Date(pubDate);
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const isBreaking = publishedDate > twoHoursAgo && relevanceScore >= 80;

  // Check for priority keywords
  const hasPriorityKeyword = PRIORITY_KEYWORDS.some(kw =>
    title.toLowerCase().includes(kw.toLowerCase()) ||
    description.toLowerCase().includes(kw.toLowerCase())
  );

  return {
    id: `gn-${Date.now()}-${index}`,
    title,
    summary: description.slice(0, 300) + (description.length > 300 ? '...' : ''),
    source: source || 'Google News',
    url: link,
    publishedAt: publishedDate.toISOString(),
    companies: companyIds,
    sectors: sectors.length > 0 ? sectors : ['robotics-automation'], // Default sector
    categories,
    sentiment,
    relevanceScore: hasPriorityKeyword ? Math.min(relevanceScore + 10, 100) : relevanceScore,
    isBreaking,
  };
}

/**
 * Fetch all news for Lupton Associates
 */
export async function fetchAllNews(): Promise<NewsArticle[]> {
  // Check cache first
  if (newsCache && new Date() < newsCache.expiresAt) {
    console.log('Returning cached news articles');
    return newsCache.articles;
  }

  console.log('Fetching fresh news from Google News RSS...');
  const allItems: RSSItem[] = [];
  const seenUrls = new Set<string>();

  // Fetch news for top customers (by volume)
  const topCustomers = COMPANIES
    .filter(c => c.type === 'customer' && c.isActive)
    .slice(0, 30); // Top 30 customers

  for (const company of topCustomers) {
    const items = await fetchCompanyNews(company.name, company.ticker);
    for (const item of items) {
      if (!seenUrls.has(item.link)) {
        seenUrls.add(item.link);
        allItems.push(item);
      }
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Fetch sector-specific news
  for (const [sector, queries] of Object.entries(SECTOR_QUERIES)) {
    for (const query of queries) {
      const items = await fetchGoogleNewsRSS(query);
      for (const item of items) {
        if (!seenUrls.has(item.link)) {
          seenUrls.add(item.link);
          allItems.push(item);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Convert to NewsArticle format and filter
  const articles: NewsArticle[] = [];
  for (let i = 0; i < allItems.length; i++) {
    const article = rssItemToNewsArticle(allItems[i], i);
    if (article) {
      articles.push(article);
    }
  }

  // Sort by relevance and recency
  articles.sort((a, b) => {
    // Breaking news first
    if (a.isBreaking && !b.isBreaking) return -1;
    if (!a.isBreaking && b.isBreaking) return 1;

    // Then by relevance
    const relevanceDiff = b.relevanceScore - a.relevanceScore;
    if (Math.abs(relevanceDiff) > 10) return relevanceDiff;

    // Then by date
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Update cache
  newsCache = {
    articles,
    lastFetched: new Date(),
    expiresAt: new Date(Date.now() + CACHE_TTL_MS),
  };

  console.log(`Fetched and processed ${articles.length} relevant articles`);
  return articles;
}

/**
 * Get news for a specific sector
 */
export async function getNewsBySector(sector: Sector): Promise<NewsArticle[]> {
  const allNews = await fetchAllNews();
  return allNews.filter(article => article.sectors.includes(sector));
}

/**
 * Get news for a specific company
 */
export async function getNewsByCompany(companyId: string): Promise<NewsArticle[]> {
  const allNews = await fetchAllNews();
  return allNews.filter(article => article.companies.includes(companyId));
}

/**
 * Get breaking news only
 */
export async function getBreakingNews(): Promise<NewsArticle[]> {
  const allNews = await fetchAllNews();
  return allNews.filter(article => article.isBreaking);
}

/**
 * Force refresh the news cache
 */
export async function refreshNewsCache(): Promise<NewsArticle[]> {
  newsCache = null;
  return fetchAllNews();
}

/**
 * Get cache status
 */
export function getCacheStatus(): { isCached: boolean; lastFetched: Date | null; expiresAt: Date | null; articleCount: number } {
  return {
    isCached: newsCache !== null,
    lastFetched: newsCache?.lastFetched || null,
    expiresAt: newsCache?.expiresAt || null,
    articleCount: newsCache?.articles.length || 0,
  };
}
