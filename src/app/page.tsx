'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
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
import { getGreeting } from '@/lib/utils';
import {
  Filter,
  Grid3X3,
  List,
  Clock,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'relevance' | 'trending';

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
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
  const sortedNews = [...otherNews].sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-4 lg:p-6">
          {/* Welcome Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, Alan
                </h1>
                <p className="text-gray-500 mt-1">
                  Here&apos;s what&apos;s happening with your OEMs and customers today.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors',
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
          </div>

          {/* Stats Cards */}
          <div className="mb-6">
            <StatsCards stats={MOCK_DASHBOARD_STATS} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main News Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Article */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="live-indicator pl-4 text-sm font-semibold text-gray-700">
                    Breaking & Top Stories
                  </span>
                </div>
                <NewsCard article={featuredArticle} variant="featured" />
              </section>

              {/* News Feed Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortBy('latest')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      sortBy === 'latest'
                        ? 'bg-lupton-blue text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <TrendingUp size={14} />
                    Trending
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    <Filter size={14} />
                    Filter
                  </button>
                  <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-1.5 transition-colors',
                        viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                      )}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'p-1.5 transition-colors',
                        viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                      )}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* News Grid/List */}
              <section>
                {viewMode === 'grid' ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {sortedNews.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedNews.map((article) => (
                      <NewsCard key={article.id} article={article} variant="list" />
                    ))}
                  </div>
                )}
              </section>

              {/* Load More */}
              <div className="text-center">
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
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
          </div>
        </main>
      </div>
    </div>
  );
}
