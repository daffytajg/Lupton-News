'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NewsCard from '@/components/NewsCard';
import { MOCK_NEWS, MOCK_AI_INSIGHTS, MOCK_PREDICTIONS, MOCK_STOCKS } from '@/data/mockNews';
import { SECTORS } from '@/data/sectors';
import { COMPANIES } from '@/data/companies';
import { cn, formatDate, formatPercent } from '@/lib/utils';
import {
  Mail,
  Send,
  Calendar,
  Clock,
  Eye,
  Download,
  Settings,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Building2,
} from 'lucide-react';

export default function EmailDigestPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expandedSections, setExpandedSections] = useState({
    topStories: true,
    companies: true,
    aiInsights: true,
    stocks: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get today's date formatted
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Top stories (first 5)
  const topStories = MOCK_NEWS.slice(0, 5);

  // Company updates (grouped by company)
  const myCompanies = ['nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'];
  const companyUpdates = myCompanies.map((companyId) => {
    const company = COMPANIES.find((c) => c.id === companyId);
    const articles = MOCK_NEWS.filter((n) => n.companies.includes(companyId));
    return { company, articles };
  }).filter((cu) => cu.articles.length > 0);

  // Stock movers
  const stockMovers = MOCK_STOCKS.filter((s) => Math.abs(s.changePercent) > 2);

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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="text-lupton-blue" />
                Email Digest Preview
              </h1>
              <p className="text-gray-500 mt-1">
                Preview your daily email summary before it's sent.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-lupton-blue text-white rounded-lg hover:bg-lupton-navy">
                <Send size={16} />
                Send Now
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Email Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                {/* Email Header */}
                <div className="bg-gradient-to-r from-lupton-navy to-lupton-blue p-6 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-2xl font-bold">L</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Lupton News Daily Digest</h2>
                      <p className="text-white/80 text-sm">{today}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">
                    Your personalized summary of OEM & customer news across Datacenter, Heavy Trucks, Military & Aerospace, Robotics, and Medical sectors.
                  </p>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-4 border-b border-gray-100">
                  <div className="p-4 text-center border-r border-gray-100">
                    <p className="text-2xl font-bold text-lupton-blue">{MOCK_NEWS.length}</p>
                    <p className="text-xs text-gray-500">New Articles</p>
                  </div>
                  <div className="p-4 text-center border-r border-gray-100">
                    <p className="text-2xl font-bold text-purple-600">{MOCK_AI_INSIGHTS.length}</p>
                    <p className="text-xs text-gray-500">AI Insights</p>
                  </div>
                  <div className="p-4 text-center border-r border-gray-100">
                    <p className="text-2xl font-bold text-green-600">{companyUpdates.length}</p>
                    <p className="text-xs text-gray-500">Company Updates</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">{stockMovers.length}</p>
                    <p className="text-xs text-gray-500">Stock Movers</p>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="divide-y divide-gray-100">
                  {/* Top Stories */}
                  <DigestSection
                    title="Top Stories"
                    icon="📰"
                    expanded={expandedSections.topStories}
                    onToggle={() => toggleSection('topStories')}
                  >
                    <div className="space-y-4">
                      {topStories.map((article, index) => (
                        <div key={article.id} className="flex gap-4">
                          <span className="text-2xl font-bold text-gray-200">{index + 1}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 hover:text-lupton-blue cursor-pointer">
                              {article.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {article.summary}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <span>{article.source}</span>
                              <span>•</span>
                              <span>{formatDate(article.publishedAt)}</span>
                              <span className={cn(
                                'px-1.5 py-0.5 rounded',
                                article.sentiment === 'positive' && 'bg-green-100 text-green-700',
                                article.sentiment === 'negative' && 'bg-red-100 text-red-700',
                                article.sentiment === 'neutral' && 'bg-gray-100 text-gray-700'
                              )}>
                                {article.sentiment}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DigestSection>

                  {/* Company Updates */}
                  <DigestSection
                    title="Your Companies"
                    icon="🏢"
                    expanded={expandedSections.companies}
                    onToggle={() => toggleSection('companies')}
                  >
                    <div className="space-y-4">
                      {companyUpdates.slice(0, 3).map(({ company, articles }) => (
                        <div key={company!.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 size={16} className="text-gray-400" />
                            <span className="font-medium text-gray-900">{company!.name}</span>
                            {company!.ticker && (
                              <span className="text-xs text-gray-500">({company!.ticker})</span>
                            )}
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-auto">
                              {articles.length} update{articles.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {articles.slice(0, 2).map((article) => (
                              <li key={article.id} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-gray-400">•</span>
                                <span className="line-clamp-1">{article.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </DigestSection>

                  {/* AI Insights */}
                  <DigestSection
                    title="AI Insights"
                    icon="✨"
                    expanded={expandedSections.aiInsights}
                    onToggle={() => toggleSection('aiInsights')}
                  >
                    <div className="space-y-3">
                      {MOCK_AI_INSIGHTS.slice(0, 3).map((insight) => (
                        <div key={insight.id} className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                          <div className="flex items-start gap-2">
                            <Sparkles size={16} className="text-indigo-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-indigo-600 font-medium">
                                  {insight.confidence}% confidence
                                </span>
                                <span className="text-xs text-gray-400">
                                  {insight.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DigestSection>

                  {/* Stock Movers */}
                  <DigestSection
                    title="Stock Movers"
                    icon="📈"
                    expanded={expandedSections.stocks}
                    onToggle={() => toggleSection('stocks')}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {stockMovers.map((stock) => (
                        <div
                          key={stock.ticker}
                          className={cn(
                            'p-3 rounded-lg',
                            stock.change >= 0 ? 'bg-green-50' : 'bg-red-50'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{stock.ticker}</span>
                            <span className={cn(
                              'flex items-center text-sm font-semibold',
                              stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                            )}>
                              {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {formatPercent(stock.changePercent)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{stock.companyName}</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ${stock.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DigestSection>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <p className="text-center text-xs text-gray-500">
                    You're receiving this email because you're subscribed to Lupton News Daily Digest.
                    <br />
                    <a href="#" className="text-lupton-blue hover:underline">Manage preferences</a>
                    {' · '}
                    <a href="#" className="text-lupton-blue hover:underline">Unsubscribe</a>
                  </p>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    © 2026 Lupton Associates. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="space-y-6">
              {/* Delivery Schedule */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  Delivery Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">Frequency</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Daily</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">Delivery Time</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">8:00 AM EST</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-500" />
                      <span className="text-sm text-blue-700">Next Delivery</span>
                    </div>
                    <span className="text-sm font-medium text-blue-900">Tomorrow, 8:00 AM</span>
                  </div>
                </div>
              </div>

              {/* Digest Content */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-gray-400" />
                  Digest Content
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Top Stories', enabled: true },
                    { label: 'Company Updates', enabled: true },
                    { label: 'AI Insights', enabled: true },
                    { label: 'Stock Movers', enabled: true },
                    { label: 'Sector Highlights', enabled: false },
                    { label: 'Upcoming Events', enabled: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">{item.label}</span>
                      <div className={cn(
                        'w-10 h-5 rounded-full transition-colors cursor-pointer',
                        item.enabled ? 'bg-lupton-blue' : 'bg-gray-300'
                      )}>
                        <div className={cn(
                          'w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform mt-0.5',
                          item.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Recipients</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-lupton-blue flex items-center justify-center text-white text-sm font-medium">
                      AL
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Alan Lupton II</p>
                      <p className="text-xs text-gray-500">alan@luptons.com</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-3 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  + Add Recipient
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-lupton-blue text-white rounded-lg hover:bg-lupton-navy font-medium">
                  <Send size={18} />
                  Send Test Email
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Eye size={18} />
                  Preview Full Email
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DigestSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4"
      >
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </h3>
        {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {expanded && children}
    </div>
  );
}
