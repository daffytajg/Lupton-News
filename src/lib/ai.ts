// AI-powered news filtering and analysis utilities
import { NewsArticle, NewsCategory, AIInsight, PredictiveSignal } from '@/types';
import { FILTERED_KEYWORDS, RELEVANT_KEYWORDS } from '@/data/sectors';

/**
 * Calculate relevance score for a news article
 * Uses keyword matching, source credibility, and content analysis
 */
export function calculateRelevanceScore(
  title: string,
  summary: string,
  source: string,
  categories: NewsCategory[]
): number {
  let score = 50; // Base score

  const content = `${title} ${summary}`.toLowerCase();

  // Penalize filtered keywords (garbage news)
  for (const keyword of FILTERED_KEYWORDS) {
    if (content.includes(keyword.toLowerCase())) {
      score -= 15;
    }
  }

  // Boost for relevant keywords
  for (const category of categories) {
    const keywords = RELEVANT_KEYWORDS[category] || [];
    for (const keyword of keywords) {
      if (content.includes(keyword.toLowerCase())) {
        score += 8;
      }
    }
  }

  // Source credibility boost
  const credibleSources = [
    'reuters', 'bloomberg', 'wall street journal', 'wsj',
    'financial times', 'sec', 'defense news', 'aviation week',
    'automotive news', 'barrons', 'techcrunch', 'industry week'
  ];

  if (credibleSources.some(s => source.toLowerCase().includes(s))) {
    score += 10;
  }

  // Breaking news boost
  if (title.toLowerCase().includes('breaking') ||
      title.toLowerCase().includes('exclusive')) {
    score += 5;
  }

  // Cap score between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Determine sentiment from text analysis
 */
export function analyzeSentiment(title: string, summary: string): 'positive' | 'negative' | 'neutral' {
  const content = `${title} ${summary}`.toLowerCase();

  const positiveIndicators = [
    'awarded', 'wins', 'secures', 'record', 'growth', 'expands',
    'launches', 'approved', 'breakthrough', 'surges', 'beats',
    'exceeds', 'partnership', 'innovation', 'milestone'
  ];

  const negativeIndicators = [
    'layoff', 'cuts', 'decline', 'falls', 'bankruptcy', 'lawsuit',
    'recall', 'investigation', 'delay', 'loss', 'misses', 'warns',
    'downgrades', 'suspended', 'terminated', 'restructuring'
  ];

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of positiveIndicators) {
    if (content.includes(word)) positiveScore++;
  }

  for (const word of negativeIndicators) {
    if (content.includes(word)) negativeScore++;
  }

  if (positiveScore > negativeScore + 1) return 'positive';
  if (negativeScore > positiveScore + 1) return 'negative';
  return 'neutral';
}

/**
 * Classify news into categories based on content
 */
export function classifyNewsCategories(title: string, summary: string): NewsCategory[] {
  const content = `${title} ${summary}`.toLowerCase();
  const categories: NewsCategory[] = [];

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(RELEVANT_KEYWORDS)) {
    const matchCount = keywords.filter(kw => content.includes(kw.toLowerCase())).length;
    if (matchCount >= 1) {
      categories.push(category as NewsCategory);
    }
  }

  // Ensure at least one category
  if (categories.length === 0) {
    // Default categorization based on common patterns
    if (content.includes('stock') || content.includes('share')) {
      categories.push('stock');
    } else {
      categories.push('partnership'); // Generic fallback
    }
  }

  return categories;
}

/**
 * Filter out garbage news that doesn't matter to Lupton Associates
 */
export function isRelevantNews(title: string, summary: string): boolean {
  const content = `${title} ${summary}`.toLowerCase();

  // Check for filtered keywords
  const garbageCount = FILTERED_KEYWORDS.filter(kw =>
    content.includes(kw.toLowerCase())
  ).length;

  // If more than 2 garbage keywords, filter it out
  if (garbageCount >= 2) return false;

  // Check for any relevant keywords
  const allRelevantKeywords = Object.values(RELEVANT_KEYWORDS).flat();
  const relevantCount = allRelevantKeywords.filter(kw =>
    content.includes(kw.toLowerCase())
  ).length;

  // Must have at least one relevant keyword
  return relevantCount >= 1;
}

/**
 * Generate AI insights from news patterns
 */
export function generateInsightsFromNews(articles: NewsArticle[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Analyze patterns
  const companyCounts: Record<string, number> = {};
  const sectorCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  for (const article of articles) {
    for (const company of article.companies) {
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    }
    for (const sector of article.sectors) {
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    }
    for (const category of article.categories) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }

  // Generate trend insights for high-activity sectors
  for (const [sector, count] of Object.entries(sectorCounts)) {
    if (count >= 3) {
      insights.push({
        id: `insight-trend-${sector}`,
        type: 'trend',
        title: `Elevated Activity in ${sector.replace('-', ' ').toUpperCase()}`,
        description: `${count} news items detected in this sector recently, indicating heightened activity.`,
        confidence: Math.min(90, 50 + count * 5),
        relatedCompanies: [],
        relatedSectors: [sector as any],
        impact: count >= 5 ? 'high' : 'medium',
        createdAt: new Date().toISOString(),
        tags: ['trend', sector],
      });
    }
  }

  return insights;
}

/**
 * Score article priority for notifications
 */
export function getArticlePriority(article: NewsArticle): 'critical' | 'high' | 'medium' | 'low' {
  // Critical: Breaking news with high relevance
  if (article.isBreaking && article.relevanceScore >= 90) {
    return 'critical';
  }

  // High: Government contracts, M&A, bankruptcy, C-suite changes
  const highPriorityCategories = ['government-contracts', 'mergers-acquisitions', 'bankruptcy', 'c-suite'];
  if (article.categories.some(c => highPriorityCategories.includes(c))) {
    return 'high';
  }

  // Medium: New construction, permits, quarterly filings
  const mediumPriorityCategories = ['new-construction', 'permits', 'quarterly-filings', 'grants'];
  if (article.categories.some(c => mediumPriorityCategories.includes(c))) {
    return 'medium';
  }

  // Low: Everything else
  return 'low';
}

/**
 * Generate predictive signals from market data
 */
export function generatePredictiveSignals(
  articles: NewsArticle[],
  stockData: { ticker: string; changePercent: number }[]
): PredictiveSignal[] {
  const signals: PredictiveSignal[] = [];

  // Detect companies with multiple positive news + stock movement
  const companyActivity: Record<string, { news: number; sentiment: number }> = {};

  for (const article of articles) {
    for (const company of article.companies) {
      if (!companyActivity[company]) {
        companyActivity[company] = { news: 0, sentiment: 0 };
      }
      companyActivity[company].news++;
      companyActivity[company].sentiment += article.sentiment === 'positive' ? 1 :
                                            article.sentiment === 'negative' ? -1 : 0;
    }
  }

  for (const [company, activity] of Object.entries(companyActivity)) {
    if (activity.news >= 2 && activity.sentiment >= 1) {
      signals.push({
        id: `signal-${company}-momentum`,
        signal: `Positive momentum detected for ${company}`,
        description: `${activity.news} positive news items detected, suggesting continued growth trajectory.`,
        probability: Math.min(85, 50 + activity.news * 10 + activity.sentiment * 5),
        companies: [company],
        sectors: [],
        indicators: [`${activity.news} recent articles`, `Net positive sentiment: ${activity.sentiment}`],
        createdAt: new Date().toISOString(),
      });
    }
  }

  return signals;
}
