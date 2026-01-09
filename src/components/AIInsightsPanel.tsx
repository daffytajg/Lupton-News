'use client';

import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Target,
  ChevronRight,
} from 'lucide-react';
import { AIInsight, PredictiveSignal } from '@/types';
import { cn } from '@/lib/utils';
import { getCompanyById } from '@/data/companies';
import { getSectorById } from '@/data/sectors';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  predictions?: PredictiveSignal[];
  variant?: 'sidebar' | 'full' | 'compact';
}

export default function AIInsightsPanel({
  insights,
  predictions,
  variant = 'sidebar',
}: AIInsightsPanelProps) {
  if (variant === 'compact') {
    return (
      <div className="ai-insight-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={18} />
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
          </div>
          <Link
            href="/insights"
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-2">
          {insights.slice(0, 2).map((insight) => (
            <InsightCard key={insight.id} insight={insight} compact />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className="space-y-6">
        {/* Insights Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">AI-Powered Insights</h2>
            </div>
            <span className="text-sm text-gray-500">
              {insights.length} active insights
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Predictions Section */}
        {predictions && predictions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="text-purple-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Predictive Signals</h2>
              </div>
              <span className="text-sm text-gray-500">
                {predictions.length} active signals
              </span>
            </div>
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sidebar variant (default)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={18} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Insights</h3>
          </div>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
            {insights.length} new
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {insights.slice(0, 4).map((insight) => (
          <InsightCard key={insight.id} insight={insight} sidebar />
        ))}
      </div>

      {predictions && predictions.length > 0 && (
        <>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-purple-600 dark:text-purple-400" size={16} />
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Predictive Signals</h4>
            </div>
            <div className="space-y-2">
              {predictions.slice(0, 2).map((prediction) => (
                <MiniPredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>
        </>
      )}

      <Link
        href="/insights"
        className="block p-3 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
      >
        View All Insights →
      </Link>
    </div>
  );
}

function InsightCard({
  insight,
  compact,
  sidebar,
}: {
  insight: AIInsight;
  compact?: boolean;
  sidebar?: boolean;
}) {
  const typeConfig = {
    prediction: {
      icon: <TrendingUp size={16} />,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      label: 'Prediction',
    },
    trend: {
      icon: <BarChart3 size={16} />,
      color: 'text-green-600 bg-green-50 border-green-200',
      label: 'Trend',
    },
    risk: {
      icon: <AlertTriangle size={16} />,
      color: 'text-red-600 bg-red-50 border-red-200',
      label: 'Risk',
    },
    opportunity: {
      icon: <Lightbulb size={16} />,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      label: 'Opportunity',
    },
    correlation: {
      icon: <Target size={16} />,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      label: 'Correlation',
    },
  };

  const config = typeConfig[insight.type];
  const companies = insight.relatedCompanies.map(id => getCompanyById(id)).filter(Boolean);
  const sectors = insight.relatedSectors.map(id => getSectorById(id)).filter(Boolean);

  if (compact) {
    return (
      <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
        <span className={cn('p-1 rounded', config.color)}>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 line-clamp-1">
            {insight.title}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">
            {insight.description}
          </p>
        </div>
        <span className="text-xs font-medium text-gray-600">
          {insight.confidence}%
        </span>
      </div>
    );
  }

  if (sidebar) {
    return (
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <span className={cn('p-1.5 rounded-lg', config.color)}>
            {config.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', config.color)}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {insight.confidence}% confidence
              </span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">
              {insight.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {insight.description}
            </p>
            {sectors.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {sectors.slice(0, 2).map(s => (
                  <span key={s!.id} className="text-xs text-gray-400 dark:text-gray-500">
                    {s!.icon} {s!.shortName}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
        </div>
      </div>
    );
  }

  // Full card
  return (
    <div className={cn(
      'p-4 rounded-xl border',
      config.color.split(' ')[1],
      'border-opacity-50'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('p-2 rounded-lg', config.color)}>
            {config.icon}
          </span>
          <div>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded', config.color)}>
              {config.label}
            </span>
            <span className={cn(
              'ml-2 text-xs font-medium px-2 py-0.5 rounded',
              insight.impact === 'high' ? 'bg-red-100 text-red-700' :
              insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            )}>
              {insight.impact.toUpperCase()} IMPACT
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{insight.confidence}%</div>
          <div className="text-xs text-gray-500">confidence</div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{insight.description}</p>

      {insight.timeframe && (
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-medium">Timeframe:</span> {insight.timeframe}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {sectors.map(s => (
          <Link
            key={s!.id}
            href={`/sectors/${s!.id}`}
            className={cn(
              'text-xs px-2 py-1 rounded-full text-white',
              `bg-gradient-to-r ${s!.gradient}`
            )}
          >
            {s!.icon} {s!.shortName}
          </Link>
        ))}
        {companies.slice(0, 3).map(c => (
          <Link
            key={c!.id}
            href={`/companies/${c!.id}`}
            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {c!.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {insight.tags.map(tag => (
          <span key={tag} className="text-xs text-gray-400">#{tag}</span>
        ))}
      </div>
    </div>
  );
}

function PredictionCard({ prediction }: { prediction: PredictiveSignal }) {
  const companyIds = prediction.companies || prediction.relatedCompanies || [];
  const companies = companyIds.map(id => getCompanyById(id)).filter(Boolean);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="text-purple-600" size={18} />
          <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
            SIGNAL
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-700">{prediction.probability}%</div>
          <div className="text-xs text-gray-500">probability</div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{prediction.title || prediction.signal}</h3>
      <p className="text-sm text-gray-600 mb-4">{prediction.description}</p>

      {/* Indicators */}
      {prediction.indicators && prediction.indicators.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Key Indicators:</p>
          <div className="flex flex-wrap gap-2">
            {prediction.indicators.map((indicator, i) => (
              <span
                key={i}
                className="text-xs bg-white px-2 py-1 rounded border border-purple-100"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Companies */}
      {companies.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500">Companies:</span>
          {companies.slice(0, 3).map(c => (
            <Link
              key={c!.id}
              href={`/companies/${c!.id}`}
              className="text-xs px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:border-purple-300"
            >
              {c!.name}
            </Link>
          ))}
        </div>
      )}

      {/* Recommended Action */}
      {prediction.recommendedAction && (
        <div className="p-3 bg-white rounded-lg border border-purple-100">
          <p className="text-xs font-medium text-purple-700 mb-1">Recommended Action:</p>
          <p className="text-sm text-gray-700">{prediction.recommendedAction}</p>
        </div>
      )}
    </div>
  );
}

function MiniPredictionCard({ prediction }: { prediction: PredictiveSignal }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
          {prediction.signal}
        </span>
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{prediction.probability}%</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{prediction.description}</p>
    </div>
  );
}
