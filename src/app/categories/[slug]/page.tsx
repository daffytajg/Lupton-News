'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, Filter } from 'lucide-react';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { MOCK_NEWS } from '@/data/mockNews';
import { NewsCategory } from '@/types';

const CATEGORY_INFO: Record<string, { name: string; description: string; icon: string }> = {
  'government-contracts': {
    name: 'Government Contracts',
    description: 'Federal, state, and defense contract awards and procurement news',
    icon: '🏛️',
  },
  'mergers-acquisitions': {
    name: 'Mergers & Acquisitions',
    description: 'M&A activity, buyouts, and corporate restructuring',
    icon: '🤝',
  },
  'earnings': {
    name: 'Quarterly Earnings',
    description: 'Quarterly and annual financial results, SEC filings',
    icon: '📊',
  },
  'executive-changes': {
    name: 'Executive Changes',
    description: 'C-suite appointments, departures, and leadership news',
    icon: '👔',
  },
  'expansion': {
    name: 'Expansion & Construction',
    description: 'New facilities, permits, and capacity expansion',
    icon: '🏗️',
  },
  'grants': {
    name: 'Grants & Funding',
    description: 'Government grants, R&D funding, and financial incentives',
    icon: '💰',
  },
  'product-launch': {
    name: 'Product Launches',
    description: 'New product announcements and innovations',
    icon: '🚀',
  },
  'partnership': {
    name: 'Partnerships',
    description: 'Strategic partnerships and joint ventures',
    icon: '🔗',
  },
  'regulatory': {
    name: 'Regulatory & Compliance',
    description: 'FDA approvals, regulatory changes, compliance news',
    icon: '⚖️',
  },
  'supply-chain': {
    name: 'Supply Chain',
    description: 'Supply chain updates, logistics, and sourcing news',
    icon: '📦',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const categoryInfo = CATEGORY_INFO[slug];

  // Map slug to NewsCategory type
  const categoryMap: Record<string, NewsCategory> = {
    'government-contracts': 'government-contracts',
    'mergers-acquisitions': 'mergers-acquisitions',
    'earnings': 'quarterly-filings',
    'executive-changes': 'c-suite',
    'expansion': 'new-construction',
    'grants': 'grants',
    'product-launch': 'product-launch',
    'partnership': 'partnership',
    'regulatory': 'permits',
    'supply-chain': 'stock',
  };

  const category = categoryMap[slug];

  // Filter news by category
  const categoryNews = category
    ? MOCK_NEWS.filter(article => article.categories.includes(category))
    : [];

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The category "{slug}" could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{categoryInfo.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
              <p className="text-indigo-100 mt-1">{categoryInfo.description}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {categoryNews.length} {categoryNews.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categoryNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryNews.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              There are no articles in this category at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
