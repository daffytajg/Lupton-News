'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  TrendingUp,
  TrendingDown,
  Users,
  Newspaper,
  ExternalLink,
  Bell,
  Star,
  Briefcase,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Linkedin,
  AlertTriangle,
  Lightbulb,
  Target,
  Shield,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Activity,
  BarChart3,
  PieChart,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import { getCompanyById, COMPANIES, getSalesTeamsForCompany } from '@/data/companies';
import { SECTORS } from '@/data/sectors';
import { getCompanyIntelligence, getCompanyArticles, getCompanyInsights } from '@/data/companyIntelligence';
import { getArticlesForCompany, ALL_COMPANY_ARTICLES } from '@/data/allCompanyArticles';
import { getArticlesForCompany as getHistoricalArticles, HISTORICAL_ARTICLES } from '@/data/historicalArticles';

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'insights' | 'financials' | 'contacts'>('overview');
  const [showAllActivity, setShowAllActivity] = useState(false);

  const company = getCompanyById(slug);
  const intelligence = getCompanyIntelligence(slug);

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
            The company &quot;{slug}&quot; could not be found in our database.
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

  // Get sales teams
  const salesTeams = getSalesTeamsForCompany(company.id);

  // Get sector info
  const companySectors = company.sectors.map(sectorId =>
    SECTORS.find(s => s.id === sectorId)
  ).filter(Boolean);

  // Get articles and insights - combine from all sources
  const intelligenceArticles = intelligence?.articles || [];
  const companyArticles = getArticlesForCompany(slug);
  const historicalArticles = getHistoricalArticles(slug);
  // Combine and deduplicate articles from all sources
  const articlesMap = new Map();
  [...intelligenceArticles, ...companyArticles, ...historicalArticles].forEach(article => {
    if (!articlesMap.has(article.id)) {
      articlesMap.set(article.id, article);
    }
  });
  const articles = Array.from(articlesMap.values()).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const insights = intelligence?.insights || [];
  const stockData = intelligence?.stockData;
  const financials = intelligence?.financials;
  const contacts = intelligence?.contacts || [];
  const recentActivity = intelligence?.recentActivity || [];
  const swot = intelligence?.swot;
  const luptonRelationship = intelligence?.luptonRelationship;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'news', label: 'News', icon: Newspaper, count: articles.length },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb, count: insights.length },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'contacts', label: 'Contacts', icon: Users, count: contacts.length },
  ];

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
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-3xl font-bold text-white">
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
                {luptonRelationship?.relationshipHealth && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    luptonRelationship.relationshipHealth === 'excellent' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    luptonRelationship.relationshipHealth === 'good' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    luptonRelationship.relationshipHealth === 'fair' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {luptonRelationship.relationshipHealth.charAt(0).toUpperCase() + luptonRelationship.relationshipHealth.slice(1)} Relationship
                  </span>
                )}
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
                {financials?.employees && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {financials.employees} employees
                  </span>
                )}
                {financials?.founded && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Founded {financials.founded}
                  </span>
                )}
              </div>

              {/* Stock ticker if available */}
              {stockData && (
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stockData.price.toFixed(2)}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      stockData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stockData.changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>Mkt Cap: {stockData.marketCap}</span>
                    <span className="mx-2">•</span>
                    <span>Vol: {stockData.volume}</span>
                    {stockData.peRatio && (
                      <>
                        <span className="mx-2">•</span>
                        <span>P/E: {stockData.peRatio}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" title="Set Alert">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" title="Add to Watchlist">
                <Star className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lupton Relationship Card */}
              {luptonRelationship && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Lupton Relationship
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Account Since</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{luptonRelationship.accountSince}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                      <p className="text-lg font-semibold text-green-600">{luptonRelationship.totalRevenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Order</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{luptonRelationship.lastOrderDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Growth Potential</p>
                      <p className={`text-lg font-semibold ${
                        luptonRelationship.growthPotential === 'high' ? 'text-green-600' :
                        luptonRelationship.growthPotential === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {luptonRelationship.growthPotential?.charAt(0).toUpperCase()}{luptonRelationship.growthPotential?.slice(1)}
                      </p>
                    </div>
                  </div>
                  {luptonRelationship.primaryProducts && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Primary Products</p>
                      <div className="flex flex-wrap gap-2">
                        {luptonRelationship.primaryProducts.map((product, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {luptonRelationship.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      {luptonRelationship.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Recent Activity */}
              {recentActivity.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {(showAllActivity ? recentActivity : recentActivity.slice(0, 3)).map((activity, i) => (
                      <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'order' ? 'bg-green-100 text-green-600' :
                          activity.type === 'rfq' ? 'bg-purple-100 text-purple-600' :
                          activity.type === 'call' ? 'bg-yellow-100 text-yellow-600' :
                          activity.type === 'visit' ? 'bg-indigo-100 text-indigo-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.type === 'meeting' ? <Users className="w-5 h-5" /> :
                           activity.type === 'order' ? <FileText className="w-5 h-5" /> :
                           activity.type === 'rfq' ? <Target className="w-5 h-5" /> :
                           activity.type === 'call' ? <Phone className="w-5 h-5" /> :
                           activity.type === 'visit' ? <Building2 className="w-5 h-5" /> :
                           <Mail className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              {activity.type}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {activity.description}
                          </p>
                          {activity.outcome && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              → {activity.outcome}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {recentActivity.length > 3 && (
                    <button
                      onClick={() => setShowAllActivity(!showAllActivity)}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {showAllActivity ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Show All ({recentActivity.length}) <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* SWOT Analysis */}
              {swot && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-indigo-600" />
                    SWOT Analysis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Strengths
                      </h3>
                      <ul className="space-y-1">
                        {swot.strengths.map((item, i) => (
                          <li key={i} className="text-sm text-green-700 dark:text-green-400">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <h3 className="font-medium text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Weaknesses
                      </h3>
                      <ul className="space-y-1">
                        {swot.weaknesses.map((item, i) => (
                          <li key={i} className="text-sm text-red-700 dark:text-red-400">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Opportunities
                      </h3>
                      <ul className="space-y-1">
                        {swot.opportunities.map((item, i) => (
                          <li key={i} className="text-sm text-blue-700 dark:text-blue-400">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Threats
                      </h3>
                      <ul className="space-y-1">
                        {swot.threats.map((item, i) => (
                          <li key={i} className="text-sm text-yellow-700 dark:text-yellow-400">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Latest News Preview */}
              {articles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-orange-600" />
                      Latest News
                    </h2>
                    <button
                      onClick={() => setActiveTab('news')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {articles.slice(0, 3).map(article => (
                      <div key={article.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                        <Link href={`/article/${article.id}`} className="group">
                          <div className="flex items-start gap-3">
                            {article.isBreaking && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded flex-shrink-0">
                                BREAKING
                              </span>
                            )}
                            <div>
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
                                  article.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                  article.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {article.sentiment}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              {stockData && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Stock Performance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">52W High</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">${stockData.high52Week.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">52W Low</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">${stockData.low52Week.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Avg Volume</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{stockData.avgVolume}</span>
                    </div>
                    {stockData.dividend && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Dividend</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{stockData.dividend}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

              {/* Competitors */}
              {intelligence?.competitors && intelligence.competitors.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Competitors</h3>
                  <div className="flex flex-wrap gap-2">
                    {intelligence.competitors.map((comp, i) => (
                      <Link
                        key={i}
                        href={`/companies/${comp}`}
                        className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded hover:bg-red-100 dark:hover:bg-red-900/50"
                      >
                        {comp.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Link>
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
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            {articles.length > 0 ? (
              articles.map(article => (
                <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <Link href={`/article/${article.id}`} className="group">
                    <div className="flex items-start gap-4">
                      {article.isBreaking && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded flex-shrink-0">
                          BREAKING
                        </span>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Newspaper className="w-4 h-4" />
                            {article.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {article.readTime} min read
                          </span>
                          <span className={`px-2 py-0.5 rounded ${
                            article.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            article.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {article.sentiment}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                            {article.relevanceScore}% relevant
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Newspaper className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No News Articles</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We don&apos;t have any news articles for this company yet. Check back later for updates.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights.length > 0 ? (
              insights.map(insight => (
                <div key={insight.id} className={`bg-white dark:bg-gray-800 rounded-xl border p-6 ${
                  insight.type === 'opportunity' ? 'border-green-200 dark:border-green-800' :
                  insight.type === 'risk' ? 'border-red-200 dark:border-red-800' :
                  'border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                      insight.type === 'risk' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {insight.type === 'opportunity' ? <Lightbulb className="w-5 h-5" /> :
                       insight.type === 'risk' ? <AlertTriangle className="w-5 h-5" /> :
                       <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          insight.type === 'opportunity' ? 'bg-green-100 text-green-700' :
                          insight.type === 'risk' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {insight.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {insight.description}
                      </p>
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Action Items:</h4>
                          <ul className="space-y-1">
                            {insight.actionItems.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Target className="w-3 h-3 text-blue-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No AI Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI hasn&apos;t generated any insights for this company yet. Check back later.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {financials ? (
              <>
                {/* Key Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Annual Revenue</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{financials.revenue}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Revenue Growth</span>
                      <span className={`text-xl font-bold ${
                        financials.revenueGrowth?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>{financials.revenueGrowth}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Employees</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{financials.employees}</span>
                    </div>
                    {stockData?.marketCap && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{stockData.marketCap}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quarterly Revenue */}
                {financials.quarterlyRevenue && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quarterly Revenue</h3>
                    <div className="space-y-3">
                      {financials.quarterlyRevenue.map((q, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{q.quarter}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900 dark:text-white">{q.amount}</span>
                            <span className={`text-sm ${
                              q.yoy.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>{q.yoy} YoY</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Earnings Calendar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earnings Calendar</h3>
                  <div className="space-y-4">
                    {financials.lastEarningsDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last Earnings</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(financials.lastEarningsDate).toLocaleDateString('en-US', { 
                              year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {financials.nextEarningsDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Next Earnings</p>
                          <p className="font-medium text-blue-600">
                            {new Date(financials.nextEarningsDate).toLocaleDateString('en-US', { 
                              year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Financial Data</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Financial data is not available for this company. This may be a private company or data is pending.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.length > 0 ? (
              contacts.map((contact, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-white">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.title}</p>
                      {contact.department && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">{contact.department}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </a>
                    )}
                    {contact.linkedin && (
                      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                  {contact.notes && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      {contact.notes}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Contacts</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No contacts have been added for this company yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
