'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Building2, Newspaper, Tag, Sparkles, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import { MOCK_NEWS } from '@/data/mockNews';
import { COMPANIES } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

// Fuzzy search helper - checks if query words appear in text
function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Direct match
  if (textLower.includes(queryLower)) return true;
  
  // Word-by-word match (all words must be present)
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  if (queryWords.length > 1) {
    return queryWords.every(word => textLower.includes(word));
  }
  
  return false;
}

// Keyword mappings for better search
const SEARCH_KEYWORDS: Record<string, string[]> = {
  'robotics': ['robot', 'automation', 'fanuc', 'rockwell', 'industrial', 'manufacturing', 'ai'],
  'datacenter': ['data center', 'nvidia', 'intel', 'gpu', 'server', 'cloud', 'computing', 'vertiv'],
  'defense': ['military', 'aerospace', 'pentagon', 'contract', 'lockheed', 'boeing', 'rtx', 'raytheon'],
  'trucks': ['truck', 'paccar', 'daimler', 'kenworth', 'peterbilt', 'freightliner', 'cummins', 'heavy'],
  'medical': ['medtronic', 'thermo fisher', 'healthcare', 'fda', 'surgical', 'diagnostic', 'intuitive'],
  'news': ['article', 'report', 'announces', 'earnings', 'contract', 'acquisition'],
  'ai': ['artificial intelligence', 'machine learning', 'nvidia', 'automation', 'smart'],
  'earnings': ['quarterly', 'revenue', 'profit', 'guidance', 'q4', 'q1', 'q2', 'q3', 'financial'],
  'acquisition': ['merger', 'acquires', 'acquisition', 'm&a', 'deal', 'buyout'],
};

// Expand search query with related keywords
function expandQuery(query: string): string[] {
  const queryLower = query.toLowerCase();
  const expanded = [queryLower];
  
  for (const [key, synonyms] of Object.entries(SEARCH_KEYWORDS)) {
    if (queryLower.includes(key) || synonyms.some(s => queryLower.includes(s))) {
      expanded.push(...synonyms);
    }
  }
  
  return Array.from(new Set(expanded));
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSearchTerm(query);
    
    // Generate AI suggestions based on query
    if (query) {
      const suggestions: string[] = [];
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('robot') || queryLower.includes('automation')) {
        suggestions.push('FANUC robotics news', 'Rockwell Automation updates', 'Industrial automation trends');
      }
      if (queryLower.includes('datacenter') || queryLower.includes('data center')) {
        suggestions.push('NVIDIA GPU contracts', 'Vertiv cooling solutions', 'Intel datacenter news');
      }
      if (queryLower.includes('truck') || queryLower.includes('transport')) {
        suggestions.push('PACCAR earnings', 'Daimler Truck news', 'Cummins hydrogen');
      }
      if (queryLower.includes('defense') || queryLower.includes('military')) {
        suggestions.push('Pentagon contracts', 'Lockheed Martin facilities', 'Boeing defense');
      }
      if (queryLower.includes('medical') || queryLower.includes('health')) {
        suggestions.push('Medtronic leadership', 'FDA approvals', 'Surgical robotics');
      }
      
      setAiSuggestions(suggestions.slice(0, 3));
    }
  }, [query]);

  // Expanded search with fuzzy matching
  const expandedTerms = query ? expandQuery(query) : [];
  
  const searchResults = {
    news: query
      ? MOCK_NEWS.filter(article => {
          // Check title, summary, source
          const textToSearch = `${article.title} ${article.summary} ${article.source} ${article.sectors?.join(' ')} ${article.categories?.join(' ')}`;
          return expandedTerms.some(term => fuzzyMatch(textToSearch, term));
        })
      : [],
    companies: query
      ? COMPANIES.filter(company => {
          const textToSearch = `${company.name} ${company.ticker || ''} ${company.description || ''} ${company.sectors?.join(' ') || ''}`;
          return expandedTerms.some(term => fuzzyMatch(textToSearch, term));
        })
      : [],
    sectors: query
      ? SECTORS.filter(sector => {
          const textToSearch = `${sector.name} ${sector.description} ${sector.id}`;
          return expandedTerms.some(term => fuzzyMatch(textToSearch, term));
        })
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
                  {totalResults} results for &quot;{query}&quot;
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
                className="w-full pl-12 pr-24 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                <Sparkles size={14} />
                <span>AI Search</span>
              </button>
            </div>
          </form>
          
          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Try:</span>
              {aiSuggestions.map((suggestion, idx) => (
                <Link
                  key={idx}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="text-sm px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          )}
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
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search across news articles, companies, and sectors
            </p>
            
            {/* Popular searches */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['robotics news', 'datacenter', 'defense contracts', 'truck earnings', 'medical devices'].map(term => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or browse by category
            </p>
            
            {/* Suggested searches */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try these searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['NVIDIA', 'Lockheed', 'PACCAR', 'robotics', 'datacenter'].map(term => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Found <strong>{searchResults.news.length}</strong> articles, <strong>{searchResults.companies.length}</strong> companies, and <strong>{searchResults.sectors.length}</strong> sectors matching your search
              </span>
            </div>
            
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
