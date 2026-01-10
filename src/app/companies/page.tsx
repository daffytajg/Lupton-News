'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { COMPANIES, getCompaniesBySector } from '@/data/companies';
import { SECTORS } from '@/data/sectors';
import { MOCK_NEWS, MOCK_STOCKS } from '@/data/mockNews';
import { ARTICLE_COUNTS, getArticleCountForCompany } from '@/data/allCompanyArticles';
import { cn, formatPercent } from '@/lib/utils';
import {
  Search,
  Building2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Filter,
  Grid3X3,
  List,
  Star,
  StarOff,
} from 'lucide-react';
import { Sector } from '@/types';

type ViewMode = 'grid' | 'list';
type CompanyFilter = 'all' | 'oem' | 'customer' | 'principal' | 'manufacturer';

export default function CompaniesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [typeFilter, setTypeFilter] = useState<CompanyFilter>('all');
  const [sectorFilter, setSectorFilter] = useState<Sector | 'all'>('all');
  const [followedCompanies, setFollowedCompanies] = useState<string[]>([
    'nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'
  ]);

  const filteredCompanies = useMemo(() => {
    return COMPANIES.filter((company) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          company.name.toLowerCase().includes(query) ||
          company.ticker?.toLowerCase().includes(query) ||
          company.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && company.type !== typeFilter) return false;

      // Sector filter
      if (sectorFilter !== 'all' && !company.sectors.includes(sectorFilter)) return false;

      return company.isActive;
    });
  }, [searchQuery, typeFilter, sectorFilter]);

  const toggleFollow = (companyId: string) => {
    setFollowedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  // Get article counts for companies - use comprehensive article database
  const articleCounts = useMemo(() => {
    // Combine counts from both sources
    const counts: Record<string, number> = { ...ARTICLE_COUNTS };
    MOCK_NEWS.forEach((article) => {
      article.companies.forEach((companyId) => {
        counts[companyId] = (counts[companyId] || 0) + 1;
      });
    });
    return counts;
  }, []);

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
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="text-lupton-blue" />
                  Companies
                </h1>
                <p className="text-gray-500 mt-1">
                  {COMPANIES.filter((c) => c.isActive).length} active OEMs, customers, and principals
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Type:</span>
                {(['all', 'oem', 'customer', 'principal'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                      typeFilter === type
                        ? 'bg-lupton-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Sector Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sector:</span>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value as Sector | 'all')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 border-0 focus:ring-2 focus:ring-lupton-blue"
                >
                  <option value="all">All Sectors</option>
                  {SECTORS.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.icon} {sector.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredCompanies.length} of {COMPANIES.length} companies
          </p>

          {/* Companies Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => {
                const stock = MOCK_STOCKS.find((s) => 
                  s.companyId === company.id || 
                  s.symbol === company.ticker || 
                  s.ticker === company.ticker
                );
                const articleCount = articleCounts[company.id] || 0;
                const isFollowed = followedCompanies.includes(company.id);

                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <Image
                              src={company.logo}
                              alt={company.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-xl font-bold text-gray-400">
                              {company.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{company.name}</h3>
                          <div className="flex items-center gap-2">
                            {company.ticker && (
                              <span className="text-xs text-gray-500">{company.ticker}</span>
                            )}
                            <span className={cn(
                              'text-xs px-1.5 py-0.5 rounded capitalize',
                              company.type === 'oem' && 'bg-blue-100 text-blue-700',
                              company.type === 'customer' && 'bg-green-100 text-green-700',
                              company.type === 'principal' && 'bg-purple-100 text-purple-700'
                            )}>
                              {company.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(company.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          isFollowed ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-300 hover:bg-gray-100'
                        )}
                      >
                        {isFollowed ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                      </button>
                    </div>

                    {/* Stock info */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                      {stock ? (
                        <>
                          <span className="font-semibold text-gray-900">${stock.price.toFixed(2)}</span>
                          <span className={cn(
                            'flex items-center text-sm font-medium',
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          )}>
                            {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {formatPercent(stock.changePercent ?? stock.change)}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">{stock.marketCap}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-400">Private Company</span>
                          <span className="text-xs text-gray-300 ml-auto">Stock N/A</span>
                        </>
                      )}
                    </div>

                    {/* Sectors */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {company.sectors.map((sectorId) => {
                        const sector = SECTORS.find((s) => s.id === sectorId);
                        return sector ? (
                          <span
                            key={sectorId}
                            className="text-xs text-gray-500"
                          >
                            {sector.icon} {sector.shortName}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {articleCount} article{articleCount !== 1 ? 's' : ''}
                      </span>
                      <Link
                        href={`/companies/${company.id}`}
                        className="flex items-center gap-1 text-sm text-lupton-blue hover:underline"
                      >
                        View Details
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sectors</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Articles</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCompanies.map((company) => {
                    const stock = MOCK_STOCKS.find((s) => 
                  s.companyId === company.id || 
                  s.symbol === company.ticker || 
                  s.ticker === company.ticker
                );
                    const articleCount = articleCounts[company.id] || 0;
                    const isFollowed = followedCompanies.includes(company.id);

                    return (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleFollow(company.id)}
                              className={cn(
                                'flex-shrink-0',
                                isFollowed ? 'text-yellow-500' : 'text-gray-300'
                              )}
                            >
                              {isFollowed ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                            </button>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {company.logo ? (
                                <Image
                                  src={company.logo}
                                  alt={company.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-sm font-bold text-gray-400">
                                  {company.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{company.name}</p>
                              {company.ticker && (
                                <p className="text-xs text-gray-500">{company.ticker}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded capitalize',
                            company.type === 'oem' && 'bg-blue-100 text-blue-700',
                            company.type === 'customer' && 'bg-green-100 text-green-700',
                            company.type === 'principal' && 'bg-purple-100 text-purple-700'
                          )}>
                            {company.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {company.sectors.slice(0, 2).map((sectorId) => {
                              const sector = SECTORS.find((s) => s.id === sectorId);
                              return sector ? (
                                <span key={sectorId} className="text-sm">
                                  {sector.icon}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {stock ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">${stock.price.toFixed(2)}</span>
                              <span className={cn(
                                'text-xs font-medium',
                                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                              )}>
                                {formatPercent(stock.changePercent ?? stock.change)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{articleCount}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/companies/${company.id}`}
                            className="text-lupton-blue hover:underline text-sm"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
