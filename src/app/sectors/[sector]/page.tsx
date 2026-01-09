'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NewsCard from '@/components/NewsCard';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { SECTORS, getSectorById } from '@/data/sectors';
import { getCompaniesBySector } from '@/data/companies';
import { getNewsBySector, MOCK_AI_INSIGHTS, MOCK_PREDICTIONS, MOCK_STOCKS } from '@/data/mockNews';
import { cn, formatPercent } from '@/lib/utils';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Filter,
  Bell,
  BellOff,
} from 'lucide-react';
import { Sector } from '@/types';

export default function SectorPage() {
  const params = useParams();
  const sectorId = params.sector as Sector;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  const sector = getSectorById(sectorId);
  if (!sector) {
    notFound();
  }

  const companies = getCompaniesBySector(sectorId);
  const news = getNewsBySector(sectorId);
  const sectorInsights = MOCK_AI_INSIGHTS.filter(i =>
    i.relatedSectors.includes(sectorId)
  );
  const sectorPredictions = MOCK_PREDICTIONS.filter(p =>
    (p.sectors || p.relatedSectors || []).includes(sectorId)
  );

  // Get relevant stocks for this sector
  const companyTickers = companies.map(c => c.ticker).filter(Boolean);
  const sectorStocks = MOCK_STOCKS.filter(s => companyTickers.includes(s.ticker || s.symbol));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          {/* Sector Header */}
          <div className={cn(
            'rounded-2xl p-6 mb-6 text-white bg-gradient-to-r',
            sector.gradient
          )}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{sector.icon}</span>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">{sector.name}</h1>
                </div>
                <p className="text-white max-w-xl drop-shadow-md font-medium">
                  {sector.description}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} />
                    <span>{companies.length} Companies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{news.length}</span>
                    <span>Articles</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  isFollowing
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                )}
              >
                {isFollowing ? <Bell size={18} /> : <BellOff size={18} />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stock Ticker for Sector */}
              {sectorStocks.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-lupton-blue" />
                    Sector Stocks
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sectorStocks.map((stock) => (
                      <div
                        key={stock.ticker}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900 dark:text-white">{stock.ticker}</span>
                          <span className={cn(
                            'flex items-center text-sm font-medium',
                            stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {formatPercent(stock.changePercent ?? stock.change)}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${stock.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{stock.companyName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies in this Sector */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-lupton-blue" />
                    Companies in {sector.shortName}
                  </h2>
                  <Link
                    href="/companies"
                    className="text-sm text-lupton-blue hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {companies.slice(0, 9).map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {company.logo ? (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">
                            {company.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {company.name}
                        </p>
                        {company.ticker && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{company.ticker}</p>
                        )}
                      </div>
                      <ExternalLink size={14} className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* News Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Latest News</h2>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Filter size={14} />
                    Filter
                  </button>
                </div>

                {news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((article) => (
                      <NewsCard key={article.id} article={article} variant="list" />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No news articles found for this sector.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* AI Insights for Sector */}
              {sectorInsights.length > 0 && (
                <AIInsightsPanel
                  insights={sectorInsights}
                  predictions={sectorPredictions}
                />
              )}

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sector Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Companies</span>
                    <span className="font-semibold dark:text-white">{companies.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">News (7 days)</span>
                    <span className="font-semibold dark:text-white">{news.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">AI Insights</span>
                    <span className="font-semibold dark:text-white">{sectorInsights.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">OEMs</span>
                    <span className="font-semibold dark:text-white">
                      {companies.filter(c => c.type === 'oem').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Principals</span>
                    <span className="font-semibold dark:text-white">
                      {companies.filter(c => c.type === 'principal').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Other Sectors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Other Sectors</h3>
                <div className="space-y-2">
                  {SECTORS.filter(s => s.id !== sectorId).map((s) => (
                    <Link
                      key={s.id}
                      href={`/sectors/${s.id}`}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                      )}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
