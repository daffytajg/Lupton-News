'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  TrendingUp,
  Users,
  Newspaper,
  ExternalLink,
  Bell,
  Star,
  Briefcase
} from 'lucide-react';
import Header from '@/components/Header';
import { getCompanyById, COMPANIES, getSalesTeamsForCompany } from '@/data/companies';
import { SECTORS } from '@/data/sectors';
import { MOCK_NEWS } from '@/data/mockNews';

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const company = getCompanyById(slug);

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Company Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The company "{slug}" could not be found in our database.
          </p>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  // Get related news
  const companyNews = MOCK_NEWS.filter(article =>
    article.companies.includes(company.id)
  ).slice(0, 5);

  // Get sales teams
  const salesTeams = getSalesTeamsForCompany(company.id);

  // Get sector info
  const companySectors = company.sectors.map(sectorId =>
    SECTORS.find(s => s.id === sectorId)
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </Link>
      </div>

      {/* Company Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Logo placeholder */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {company.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {company.name}
                </h1>
                {company.ticker && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-mono rounded">
                    {company.ticker}
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  company.type === 'customer'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {company.type.charAt(0).toUpperCase() + company.type.slice(1)}
                </span>
              </div>

              {company.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {company.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {company.headquarters && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.headquarters}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {company.marketCap && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {company.marketCap}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Star className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent News */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                Recent News
              </h2>

              {companyNews.length > 0 ? (
                <div className="space-y-4">
                  {companyNews.map(article => (
                    <div key={article.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <Link href={`/article/${article.id}`} className="group">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          <span className={`px-1.5 py-0.5 rounded ${
                            article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                            article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {article.sentiment}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent news articles for this company.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sectors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sectors</h3>
              <div className="flex flex-wrap gap-2">
                {companySectors.map(sector => sector && (
                  <Link
                    key={sector.id}
                    href={`/sectors/${sector.id}`}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {sector.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Assigned Sales Teams */}
            {salesTeams.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assigned Teams
                </h3>
                <div className="space-y-2">
                  {salesTeams.map(team => (
                    <div key={team.id} className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{team.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Identifiers */}
            {company.searchIdentifiers && company.searchIdentifiers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Also Known As
                </h3>
                <div className="flex flex-wrap gap-1">
                  {company.searchIdentifiers.map((identifier, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                      {identifier}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Parent Company */}
            {company.parentCompany && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Parent Company
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{company.parentCompany}</p>
                {company.parentTicker && (
                  <p className="text-sm text-gray-500 font-mono">{company.parentTicker}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
