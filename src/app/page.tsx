'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { SectorSidebar } from '@/components/SectorSidebar';
import NewsCard from '@/components/NewsCard';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import StatsCards, {
  SectorBreakdown,
  SentimentOverview,
  TopCompanies,
} from '@/components/StatsCards';
import {
  MOCK_NEWS,
  MOCK_AI_INSIGHTS,
  MOCK_PREDICTIONS,
  MOCK_DASHBOARD_STATS,
} from '@/data/mockNews';
import { NewsArticle } from '@/types';
import { getGreeting } from '@/lib/utils';
import {
  Filter,
  Grid3X3,
  List,
  Clock,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'relevance' | 'trending';

interface ArticleGroup {
  id: string;
  mainArticle: NewsArticle;
  relatedArticles: NewsArticle[];
  totalSources: number;
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Get featured article (breaking or highest relevance)
  const featuredArticle = MOCK_NEWS.find(a => a.isBreaking) || MOCK_NEWS[0];
  const otherNews = MOCK_NEWS.filter(a => a.id !== featuredArticle.id);

  // Sort news
  const sortedNews = useMemo(() => {
    return [...otherNews].sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'relevance') {
        return b.relevanceScore - a.relevanceScore;
      }
      // trending - combine recency and relevance
      const aScore = a.relevanceScore + (a.isBreaking ? 20 : 0);
      const bScore = b.relevanceScore + (b.isBreaking ? 20 : 0);
      return bScore - aScore;
    });
  }, [otherNews, sortBy]);

  // Group articles by similar topics (Multiple Perspectives feature)
  const articleGroups = useMemo(() => {
    const groups: ArticleGroup[] = [];
    const processed = new Set<string>();

    sortedNews.forEach((article) => {
      if (processed.has(article.id)) return;

      // Find related articles (same companies or sectors)
      const related = sortedNews.filter((other) => {
        if (other.id === article.id || processed.has(other.id)) return false;

        // Check for overlapping companies
        const hasCommonCompanies = article.companies.some(c => other.companies.includes(c));

        // Check for overlapping sectors
        const hasCommonSectors = article.sectors.some(s => other.sectors.includes(s));

        // Check if published within 24 hours
        const timeDiff = Math.abs(
          new Date(article.publishedAt).getTime() - new Date(other.publishedAt).getTime()
        );
        const within24Hours = timeDiff < 24 * 60 * 60 * 1000;

        return (hasCommonCompanies || hasCommonSectors) && within24Hours;
      });

      if (related.length > 0) {
        groups.push({
          id: article.id,
          mainArticle: article,
          relatedArticles: related.slice(0, 3), // Max 3 related articles
          totalSources: related.length + 1,
        });
        processed.add(article.id);
        related.forEach(r => processed.add(r.id));
      } else {
        groups.push({
          id: article.id,
          mainArticle: article,
          relatedArticles: [],
          totalSources: 1,
        });
        processed.add(article.id);
      }
    });

    return groups;
  }, [sortedNews]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* 3-Column Layout */}
      <div className="flex gap-4 p-4 lg:p-6 max-w-[2000px] mx-auto">
        {/* Left Sidebar - Sector Activity */}
        <aside className="hidden xl:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <SectorSidebar />
          </div>
        </aside>

        {/* Center Column - News Feed */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {getGreeting()}, Alan
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Here&apos;s what&apos;s happening with your OEMs and customers today.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className={cn(
                'flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                isRefreshing && 'pointer-events-none'
              )}
            >
              <RefreshCw
                size={16}
                className={cn(isRefreshing && 'animate-spin')}
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={MOCK_DASHBOARD_STATS} />

          {/* Your Briefing Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="live-indicator pl-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Your Briefing
              </span>
            </div>
            <NewsCard article={featuredArticle} variant="featured" />
          </section>

          {/* News Feed Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy('latest')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  sortBy === 'latest'
                    ? 'bg-lupton-blue text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <Clock size={14} />
                Latest
              </button>
              <button
                onClick={() => setSortBy('relevance')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  sortBy === 'relevance'
                    ? 'bg-lupton-blue text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <Sparkles size={14} />
                Relevance
              </button>
              <button
                onClick={() => setSortBy('trending')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  sortBy === 'trending'
                    ? 'bg-lupton-blue text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <TrendingUp size={14} />
                Trending
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Filter size={14} />
                Filter
              </button>
              <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 transition-colors',
                    viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 transition-colors',
                    viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* News Feed with Multiple Perspectives */}
          <section className="space-y-4">
            {articleGroups.map((group) => (
              <div key={group.id}>
                {/* Main Article */}
                {viewMode === 'grid' ? (
                  <NewsCard article={group.mainArticle} />
                ) : (
                  <NewsCard article={group.mainArticle} variant="list" />
                )}

                {/* Related Articles (Multiple Perspectives) */}
                {group.relatedArticles.length > 0 && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {group.totalSources} sources covering this story
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.relatedArticles.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Load More */}
          <div className="text-center">
            <button className="px-6 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium">
              Load More Articles
            </button>
          </div>
        </main>

        {/* Right Sidebar - AI Insights & Stats */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* AI Insights */}
            <AIInsightsPanel
              insights={MOCK_AI_INSIGHTS}
              predictions={MOCK_PREDICTIONS}
            />

            {/* Sector Breakdown */}
            <SectorBreakdown breakdown={MOCK_DASHBOARD_STATS.sectorBreakdown} />

            {/* Sentiment Overview */}
            <SentimentOverview sentiment={MOCK_DASHBOARD_STATS.sentimentOverview} />

            {/* Top Companies */}
            <TopCompanies companies={MOCK_DASHBOARD_STATS.topCompanies} />
          </div>
        </aside>
      </div>
    </div>
  );
}
