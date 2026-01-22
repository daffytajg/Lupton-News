'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';
import { ArticleActions } from '@/components/ArticleActions';
import { NewsArticle } from '@/types';
import { cn, formatDate, getRelevanceColor, getSentimentColor } from '@/lib/utils';
import { SECTORS, NEWS_CATEGORIES, getCategoryPriorityColor } from '@/data/sectors';
import { getCompanyById } from '@/data/companies';
import { getSourceByName } from '@/data/newsSources';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact' | 'featured' | 'list';
  showCompanyLogos?: boolean;
}

export default function NewsCard({
  article,
  variant = 'default',
  showCompanyLogos = true,
}: NewsCardProps) {
  const relevantSectors = SECTORS.filter(s => article.sectors.includes(s.id));
  const relevantCategories = NEWS_CATEGORIES.filter(c => article.categories.includes(c.id));
  const companies = article.companies.map(id => getCompanyById(id)).filter(Boolean);
  const sourceInfo = getSourceByName(article.source);
  const [imageError, setImageError] = useState(false);
  const hasValidImage = article.imageUrl && !article.imageUrl.startsWith('/images/') && !imageError;

  if (variant === 'featured') {
    return (
      <FeaturedNewsCard
        article={article}
        sectors={relevantSectors}
        categories={relevantCategories}
        companies={companies as any}
      />
    );
  }

  if (variant === 'compact') {
    return (
      <CompactNewsCard
        article={article}
        sectors={relevantSectors}
        categories={relevantCategories}
      />
    );
  }

  if (variant === 'list') {
    return (
      <ListNewsCard
        article={article}
        sectors={relevantSectors}
        categories={relevantCategories}
        companies={companies as any}
      />
    );
  }

  return (
    <article className="news-card bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
        {hasValidImage ? (
          <Image
            src={article.imageUrl!}
            alt={article.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : null}
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${hasValidImage ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-5xl mb-2">
            {relevantSectors[0]?.icon || relevantCategories[0]?.icon || '📰'}
          </div>
          <div className="text-white/50 text-xs font-medium uppercase tracking-wider">
            {relevantSectors[0]?.shortName || 'News'}
          </div>
        </div>
        {article.isBreaking && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
            BREAKING
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Categories & Sentiment */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {relevantCategories.slice(0, 2).map((category) => (
            <span
              key={category.id}
              className={cn(
                'sector-badge border',
                getCategoryPriorityColor(category.priority)
              )}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </span>
          ))}
          <span className={cn(
            'ml-auto text-xs font-medium flex items-center gap-1',
            getSentimentColor(article.sentiment)
          )}>
            {article.sentiment === 'positive' ? (
              <TrendingUp size={12} />
            ) : article.sentiment === 'negative' ? (
              <TrendingDown size={12} />
            ) : null}
            {article.sentiment}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-lupton-blue cursor-pointer">
          <Link href={article.url.startsWith('/') ? article.url : `/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.summary}
        </p>

        {/* Sectors */}
        <div className="flex items-center gap-1.5 mb-3">
          {relevantSectors.map((sector) => (
            <Link
              key={sector.id}
              href={`/sectors/${sector.id}`}
              className={cn(
                'text-xs px-2 py-0.5 rounded-full text-white',
                `bg-gradient-to-r ${sector.gradient}`
              )}
            >
              {sector.icon} {sector.shortName}
            </Link>
          ))}
        </div>

        {/* Companies */}
        {showCompanyLogos && companies.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400">Companies:</span>
            <div className="flex -space-x-2">
              {companies.slice(0, 4).map((company) => (
                <div
                  key={company!.id}
                  className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden"
                  title={company!.name}
                >
                  {company!.logo ? (
                    <Image
                      src={company!.logo}
                      alt={company!.name}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xs font-medium text-gray-600">
                      {company!.name.charAt(0)}
                    </span>
                  )}
                </div>
              ))}
              {companies.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{companies.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: sourceInfo?.color || '#6B7280' }}
              >
                {article.source.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{article.source}</span>
            </div>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(article.publishedAt)}
            </span>
            {article.readTime && (
              <span>{article.readTime} min read</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Relevance Score */}
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              getRelevanceColor(article.relevanceScore)
            )}>
              {article.relevanceScore}%
            </span>

            {/* AI Insights indicator */}
            {article.aiInsights && article.aiInsights.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                <Sparkles size={10} />
                {article.aiInsights.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedNewsCard({
  article,
  sectors,
  categories,
  companies,
}: {
  article: NewsArticle;
  sectors: typeof SECTORS;
  categories: typeof NEWS_CATEGORIES;
  companies: any[];
}) {
  const sourceInfo = getSourceByName(article.source);
  const [imageError, setImageError] = useState(false);
  const hasValidImage = article.imageUrl && !article.imageUrl.startsWith('/images/') && !imageError;

  return (
    <article className="news-card bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative h-64 md:h-full min-h-[280px] bg-gradient-to-br from-lupton-navy to-lupton-blue">
          {hasValidImage ? (
            <Image
              src={article.imageUrl!}
              alt={article.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : null}
          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-lupton-navy via-lupton-blue to-indigo-600 ${hasValidImage ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-8xl mb-4 opacity-80">{categories[0]?.icon || sectors[0]?.icon || '📰'}</div>
            <div className="text-white/60 text-sm font-medium uppercase tracking-wider">
              {sectors[0]?.name || 'Industry News'}
            </div>
          </div>
          {article.isBreaking && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded animate-pulse">
              BREAKING NEWS
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center gap-2">
              {sectors.map((sector) => (
                <span
                  key={sector.id}
                  className="text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm"
                >
                  {sector.icon} {sector.shortName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col">
          {/* Categories */}
          <div className="flex items-center gap-2 mb-3">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className={cn(
                  'sector-badge border text-sm',
                  getCategoryPriorityColor(category.priority)
                )}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-lupton-blue">
            <Link href={article.url.startsWith('/') ? article.url : `/article/${article.id}`}>
              {article.title}
            </Link>
          </h2>

          {/* Summary */}
          <p className="text-gray-600 mb-4 flex-1">
            {article.summary}
          </p>

          {/* AI Insights */}
          {article.aiInsights && article.aiInsights.length > 0 && (
            <div className="ai-insight-card mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">AI Insight</span>
              </div>
              <p className="text-sm text-gray-700">
                {article.aiInsights[0].description}
              </p>
            </div>
          )}

          {/* Companies */}
          {companies.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              {companies.slice(0, 3).map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={20}
                      height={20}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-xs">{company.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{company.name}</span>
                  {company.ticker && (
                    <span className="text-xs text-gray-400">{company.ticker}</span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: sourceInfo?.color || '#6B7280' }}
                >
                  {article.source.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{article.source}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(article.publishedAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ArticleActions
                articleId={article.id}
                articleTitle={article.title}
                articleUrl={`/article/${article.id}`}
              />
              <Link
                href={`/article/${article.id}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-lupton-blue text-white text-sm font-medium rounded-lg hover:bg-lupton-navy transition-colors"
              >
                Read More
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactNewsCard({
  article,
  sectors,
  categories,
}: {
  article: NewsArticle;
  sectors: typeof SECTORS;
  categories: typeof NEWS_CATEGORIES;
}) {
  const sourceInfo = getSourceByName(article.source);

  return (
    <article className="news-card flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-md">
      {/* Priority indicator */}
      <div className={cn(
        'w-1 self-stretch rounded-full flex-shrink-0',
        categories[0]?.priority === 'critical' && 'bg-red-500',
        categories[0]?.priority === 'high' && 'bg-orange-500',
        categories[0]?.priority === 'medium' && 'bg-yellow-500',
        categories[0]?.priority === 'low' && 'bg-blue-500'
      )} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
            style={{ backgroundColor: sourceInfo?.color || '#6B7280' }}
          >
            {article.source.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{article.source}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(article.publishedAt)}</span>
          {article.isBreaking && (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
              BREAKING
            </span>
          )}
        </div>
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-lupton-blue cursor-pointer">
          <Link href={article.url.startsWith('/') ? article.url : `/article/${article.id}`}>
            {article.title}
          </Link>
        </h4>
        <div className="flex items-center gap-2 mt-1">
          {sectors.slice(0, 2).map((sector) => (
            <span
              key={sector.id}
              className="text-xs text-gray-500"
            >
              {sector.icon} {sector.shortName}
            </span>
          ))}
        </div>
      </div>

      <span className={cn(
        'text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0',
        getRelevanceColor(article.relevanceScore)
      )}>
        {article.relevanceScore}%
      </span>
    </article>
  );
}

function ListNewsCard({
  article,
  sectors,
  categories,
  companies,
}: {
  article: NewsArticle;
  sectors: typeof SECTORS;
  categories: typeof NEWS_CATEGORIES;
  companies: any[];
}) {
  const sourceInfo = getSourceByName(article.source);
  const [imageError, setImageError] = useState(false);
  const hasValidImage = article.imageUrl && !article.imageUrl.startsWith('/images/') && !imageError;

  return (
    <article className="news-card bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="hidden sm:block w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {hasValidImage ? (
            <Image
              src={article.imageUrl!}
              alt={article.title}
              width={128}
              height={96}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-3xl">{categories[0]?.icon || '📰'}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {categories.slice(0, 1).map((category) => (
              <span
                key={category.id}
                className={cn(
                  'sector-badge border text-xs',
                  getCategoryPriorityColor(category.priority)
                )}
              >
                <span className="mr-0.5">{category.icon}</span>
                {category.name}
              </span>
            ))}
            {article.isBreaking && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                BREAKING
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                style={{ backgroundColor: sourceInfo?.color || '#6B7280' }}
              >
                {article.source.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {article.source} • {formatDate(article.publishedAt)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-1 hover:text-lupton-blue">
            <Link href={article.url.startsWith('/') ? article.url : `/article/${article.id}`}>
              {article.title}
            </Link>
          </h3>

          {/* Summary */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {article.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sectors.slice(0, 2).map((sector) => (
                <span
                  key={sector.id}
                  className="text-xs text-gray-500"
                >
                  {sector.icon} {sector.shortName}
                </span>
              ))}
              {companies.length > 0 && (
                <span className="text-xs text-gray-400">
                  • {companies.map(c => c.name).join(', ')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded font-medium',
                getRelevanceColor(article.relevanceScore)
              )}>
                {article.relevanceScore}%
              </span>
              {article.aiInsights && article.aiInsights.length > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-indigo-600">
                  <Sparkles size={10} />
                  AI
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
