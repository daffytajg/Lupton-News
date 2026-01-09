'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Building2, Newspaper, Tag, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { MOCK_NEWS } from '@/data/mockNews';
import { COMPANIES } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Search across news, companies, and sectors
  const searchResults = {
    news: query
      ? MOCK_NEWS.filter(
          article =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.summary.toLowerCase().includes(query.toLowerCase())
        )
      : [],
    companies: query
      ? COMPANIES.filter(
          company =>
            company.name.toLowerCase().includes(query.toLowerCase()) ||
            (company.ticker && company.ticker.toLowerCase().includes(query.toLowerCase())) ||
            (company.description && company.description.toLowerCase().includes(query.toLowerCase()))
        )
      : [],
    sectors: query
      ? SECTORS.filter(
          sector =>
            sector.name.toLowerCase().includes(query.toLowerCase()) ||
            sector.description.toLowerCase().includes(query.toLowerCase())
        )
      : [],
  };

  const totalResults =
    searchResults.news.length + searchResults.companies.length + searchResults.sectors.length;

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

      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Search className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h1>
              {query && (
                <p className="text-gray-600 dark:text-gray-400">
                  {totalResults} results for "{query}"
                </p>
              )}
            </div>
          </div>

          {/* Search input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
              }
            }}
          >
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search news, companies, sectors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
                <Sparkles size={14} className="text-purple-500" />
                <span>AI Search</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Enter a search term
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Search across news articles, companies, and sectors
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Companies */}
            {searchResults.companies.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Companies ({searchResults.companies.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.companies.slice(0, 6).map(company => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.id}`}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {company.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {company.name}
                          </h3>
                          {company.ticker && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {company.ticker}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sectors */}
            {searchResults.sectors.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Sectors ({searchResults.sectors.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.sectors.map(sector => (
                    <Link
                      key={sector.id}
                      href={`/sectors/${sector.id}`}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{sector.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {sector.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {sector.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {searchResults.news.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  News Articles ({searchResults.news.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.news.slice(0, 9).map(article => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
