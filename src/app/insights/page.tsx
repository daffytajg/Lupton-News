'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { MOCK_AI_INSIGHTS, MOCK_PREDICTIONS } from '@/data/mockNews';
import { SECTORS } from '@/data/sectors';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Filter,
  RefreshCw,
  Zap,
} from 'lucide-react';

type InsightFilter = 'all' | 'prediction' | 'trend' | 'risk' | 'opportunity' | 'correlation';

export default function InsightsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<InsightFilter>('all');
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredInsights = MOCK_AI_INSIGHTS.filter((insight) => {
    if (filter !== 'all' && insight.type !== filter) return false;
    if (sectorFilter && !insight.relatedSectors.includes(sectorFilter as any)) return false;
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const stats = {
    total: MOCK_AI_INSIGHTS.length,
    predictions: MOCK_AI_INSIGHTS.filter((i) => i.type === 'prediction').length,
    risks: MOCK_AI_INSIGHTS.filter((i) => i.type === 'risk').length,
    opportunities: MOCK_AI_INSIGHTS.filter((i) => i.type === 'opportunity').length,
  };

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

        <main className="flex-1 lg:ml-72 p-4 lg:p-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Sparkles size={28} />
                  </div>
                  <h1 className="text-3xl font-bold">AI Insights & Predictions</h1>
                </div>
                <p className="text-white/80 max-w-xl">
                  Machine learning-powered analysis of news patterns, market signals, and industry trends.
                  Our AI continuously monitors your OEMs and sectors to surface actionable intelligence.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors',
                  isRefreshing && 'pointer-events-none'
                )}
              >
                <RefreshCw size={16} className={cn(isRefreshing && 'animate-spin')} />
                Refresh Analysis
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} />
                  <span className="text-sm text-white/70">Active Insights</span>
                </div>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={16} />
                  <span className="text-sm text-white/70">Predictions</span>
                </div>
                <span className="text-2xl font-bold">{stats.predictions}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} />
                  <span className="text-sm text-white/70">Risk Alerts</span>
                </div>
                <span className="text-2xl font-bold">{stats.risks}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb size={16} />
                  <span className="text-sm text-white/70">Opportunities</span>
                </div>
                <span className="text-2xl font-bold">{stats.opportunities}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Type:</span>
              {[
                { id: 'all' as const, label: 'All', icon: <Sparkles size={14} /> },
                { id: 'prediction' as const, label: 'Predictions', icon: <TrendingUp size={14} /> },
                { id: 'trend' as const, label: 'Trends', icon: <BarChart3 size={14} /> },
                { id: 'risk' as const, label: 'Risks', icon: <AlertTriangle size={14} /> },
                { id: 'opportunity' as const, label: 'Opportunities', icon: <Lightbulb size={14} /> },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    filter === f.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sector:</span>
              <button
                onClick={() => setSectorFilter(null)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  !sectorFilter
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                All Sectors
              </button>
              {SECTORS.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setSectorFilter(sector.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    sectorFilter === sector.id
                      ? `bg-gradient-to-r ${sector.gradient} text-white`
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {sector.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Insights Column */}
            <div className="lg:col-span-2">
              <AIInsightsPanel
                insights={filteredInsights}
                predictions={MOCK_PREDICTIONS}
                variant="full"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How It Works */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">How AI Analysis Works</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Data Collection</p>
                      <p className="text-xs text-gray-500">
                        We aggregate news from 500+ sources, SEC filings, and market data.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Pattern Recognition</p>
                      <p className="text-xs text-gray-500">
                        ML models identify correlations between events and outcomes.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Insight Generation</p>
                      <p className="text-xs text-gray-500">
                        Actionable insights with confidence scores and timeframes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Confidence Levels */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Confidence Levels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-700">High (80%+)</span>
                    </div>
                    <span className="text-xs text-gray-500">Strong signal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm text-gray-700">Medium (60-79%)</span>
                    </div>
                    <span className="text-xs text-gray-500">Monitor closely</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span className="text-sm text-gray-700">Low (&lt;60%)</span>
                    </div>
                    <span className="text-xs text-gray-500">Early indicator</span>
                  </div>
                </div>
              </div>

              {/* Recent Model Updates */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Model Updates</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">●</span>
                    <div>
                      <p className="text-gray-900">M&A Detection v2.3</p>
                      <p className="text-xs text-gray-500">Updated Jan 5, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">●</span>
                    <div>
                      <p className="text-gray-900">Supply Chain Risk v1.8</p>
                      <p className="text-xs text-gray-500">Updated Jan 3, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">●</span>
                    <div>
                      <p className="text-gray-900">Executive Movement v1.5</p>
                      <p className="text-xs text-gray-500">Updated Dec 28, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
