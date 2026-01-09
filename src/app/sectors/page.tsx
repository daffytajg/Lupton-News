'use client';

import Link from 'next/link';
import { ArrowLeft, TrendingUp, Newspaper, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import { SECTORS } from '@/data/sectors';
import { COMPANIES } from '@/data/companies';
import { MOCK_NEWS } from '@/data/mockNews';

export default function SectorsPage() {
  // Calculate stats for each sector
  const sectorStats = SECTORS.map(sector => {
    const companyCount = COMPANIES.filter(c => c.sectors.includes(sector.id as any)).length;
    const articleCount = MOCK_NEWS.filter(a => a.sectors.includes(sector.id as any)).length;
    return {
      ...sector,
      companyCount,
      articleCount,
    };
  });

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

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Industry Sectors</h1>
          <p className="text-purple-100 mt-2">
            Explore news and companies across Lupton Associates' key industry verticals
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {SECTORS.length} sectors
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {COMPANIES.length} companies
            </span>
            <span className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              {MOCK_NEWS.length} articles
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectorStats.map(sector => (
            <Link
              key={sector.id}
              href={`/sectors/${sector.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{sector.icon}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  sector.articleCount > 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {sector.articleCount} articles
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {sector.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {sector.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {sector.companyCount} companies
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                    View sector →
                  </span>
                </div>
              </div>
              {/* Key OEMs preview */}
              {sector.keyOEMs && sector.keyOEMs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {sector.keyOEMs.slice(0, 3).map((oem, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                      {oem}
                    </span>
                  ))}
                  {sector.keyOEMs.length > 3 && (
                    <span className="px-2 py-0.5 text-gray-500 text-xs">
                      +{sector.keyOEMs.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
