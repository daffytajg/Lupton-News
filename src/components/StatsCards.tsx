'use client';

import {
  Newspaper,
  Building2,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { DashboardStats } from '@/types';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Articles Today"
        value={stats.articlesToday}
        total={stats.totalArticles}
        icon={<Newspaper size={20} />}
        color="blue"
        trend={12}
      />
      <StatCard
        title="Active Companies"
        value={stats.activeCompanies}
        icon={<Building2 size={20} />}
        color="green"
      />
      <StatCard
        title="AI Insights"
        value={stats.aiInsightsCount ?? stats.aiInsights ?? 0}
        icon={<Sparkles size={20} />}
        color="purple"
        trend={8}
      />
      <StatCard
        title="Critical Alerts"
        value={stats.criticalAlerts}
        icon={<AlertTriangle size={20} />}
        color="red"
        alert={stats.criticalAlerts > 0}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow';
  trend?: number;
  alert?: boolean;
}

function StatCard({ title, value, total, icon, color, trend, alert }: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600',
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100 text-orange-600',
      text: 'text-orange-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'bg-yellow-100 text-yellow-600',
      text: 'text-yellow-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow',
      alert && 'ring-2 ring-red-200 animate-pulse-slow'
    )}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg', colors.icon)}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'
          )}>
            {trend > 0 ? (
              <TrendingUp size={12} />
            ) : trend < 0 ? (
              <TrendingDown size={12} />
            ) : (
              <Minus size={12} />
            )}
            {Math.abs(trend)}%
          </div>
        )}
        {alert && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {total && (
            <span className="text-sm text-gray-400">/ {total.toLocaleString()}</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      </div>
    </div>
  );
}

// Sector breakdown mini chart
export function SectorBreakdown({ breakdown }: { breakdown: DashboardStats['sectorBreakdown'] }) {
  const sectors = [
    { id: 'datacenter', name: 'Datacenter', color: '#6366f1', icon: '🖥️' },
    { id: 'heavy-trucks', name: 'Trucks', color: '#f97316', icon: '🚛' },
    { id: 'military-aerospace', name: 'Defense', color: '#22c55e', icon: '✈️' },
    { id: 'robotics-automation', name: 'Robotics', color: '#8b5cf6', icon: '🤖' },
    { id: 'medical-scientific', name: 'Medical', color: '#ec4899', icon: '🔬' },
  ];

  const safeBreakdown = breakdown || {} as Record<string, number>;
  const total = Object.values(safeBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Sector Breakdown</h3>
      <div className="space-y-3">
        {sectors.map((sector) => {
          const count = safeBreakdown[sector.id as keyof typeof safeBreakdown] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={sector.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <span>{sector.icon}</span>
                  <span className="text-gray-700">{sector.name}</span>
                </span>
                <span className="text-gray-500">{count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: sector.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Sentiment overview
export function SentimentOverview({ sentiment }: { sentiment: DashboardStats['sentimentOverview'] }) {
  const safeSentiment = sentiment || { positive: 0, neutral: 0, negative: 0 };
  const total = safeSentiment.positive + safeSentiment.neutral + safeSentiment.negative || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Sentiment Overview</h3>

      <div className="flex items-center gap-1 h-4 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-green-500"
          style={{ width: `${(safeSentiment.positive / total) * 100}%` }}
        />
        <div
          className="h-full bg-gray-400"
          style={{ width: `${(safeSentiment.neutral / total) * 100}%` }}
        />
        <div
          className="h-full bg-red-500"
          style={{ width: `${(safeSentiment.negative / total) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-lg font-bold text-green-600">{safeSentiment.positive}%</span>
          </div>
          <p className="text-xs text-gray-500">Positive</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-lg font-bold text-gray-600">{safeSentiment.neutral}%</span>
          </div>
          <p className="text-xs text-gray-500">Neutral</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-lg font-bold text-red-600">{safeSentiment.negative}%</span>
          </div>
          <p className="text-xs text-gray-500">Negative</p>
        </div>
      </div>
    </div>
  );
}

// Top Companies widget
export function TopCompanies({ companies }: { companies: DashboardStats['topCompanies'] }) {
  const safeCompanies = companies || [];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Top Companies</h3>
      <div className="space-y-2">
        {safeCompanies.map((company, index) => (
          <div
            key={company.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              index === 0 ? 'bg-yellow-100 text-yellow-700' :
              index === 1 ? 'bg-gray-200 text-gray-700' :
              index === 2 ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-500'
            )}>
              {index + 1}
            </span>
            <span className="flex-1 font-medium text-gray-700 text-sm">
              {company.name}
            </span>
            <span className="text-sm text-gray-500">
              {company.articleCount} articles
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
