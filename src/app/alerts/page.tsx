'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { MOCK_ALERTS, MOCK_NEWS } from '@/data/mockNews';
import { getCompanyById } from '@/data/companies';
import { getSectorById } from '@/data/sectors';
import { cn, formatDate } from '@/lib/utils';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Filter,
  Trash2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

type FilterType = 'all' | 'unread' | 'news' | 'ai-insight' | 'stock';

export default function AlertsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.readAt;
    return alert.type === filter;
  });

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) =>
      a.id === id ? { ...a, readAt: new Date().toISOString() } : a
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, readAt: new Date().toISOString() })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const unreadCount = alerts.filter((a) => !a.readAt).length;

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="text-lupton-blue" />
                Alerts
              </h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
              >
                <CheckCheck size={16} />
                Mark All Read
              </button>
              <Link
                href="/settings/notifications"
                className="flex items-center gap-2 px-4 py-2 bg-lupton-blue text-white rounded-lg hover:bg-lupton-navy text-sm font-medium"
              >
                <Bell size={16} />
                Settings
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {[
              { id: 'all' as const, label: 'All', icon: <Bell size={14} /> },
              { id: 'unread' as const, label: 'Unread', icon: <AlertTriangle size={14} /> },
              { id: 'news' as const, label: 'News', icon: <ExternalLink size={14} /> },
              { id: 'ai-insight' as const, label: 'AI Insights', icon: <Sparkles size={14} /> },
              { id: 'stock' as const, label: 'Stock', icon: <TrendingUp size={14} /> },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filter === f.id
                    ? 'bg-lupton-blue text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {f.icon}
                {f.label}
                {f.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const companies = alert.relatedCompanies
                  .map((id) => getCompanyById(id))
                  .filter(Boolean);
                const sectors = alert.relatedSectors
                  .map((id) => getSectorById(id))
                  .filter(Boolean);
                const relatedArticle = alert.relatedArticle
                  ? MOCK_NEWS.find((n) => n.id === alert.relatedArticle)
                  : null;

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md',
                      !alert.readAt && 'border-l-4',
                      alert.priority === 'critical' && !alert.readAt && 'border-l-red-500',
                      alert.priority === 'high' && !alert.readAt && 'border-l-orange-500',
                      alert.priority === 'medium' && !alert.readAt && 'border-l-yellow-500',
                      alert.priority === 'low' && !alert.readAt && 'border-l-blue-500',
                      alert.readAt && 'border-gray-100 opacity-75'
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                          alert.type === 'news' && 'bg-blue-100 text-blue-600',
                          alert.type === 'ai-insight' && 'bg-purple-100 text-purple-600',
                          alert.type === 'stock' && 'bg-green-100 text-green-600',
                          alert.type === 'system' && 'bg-gray-100 text-gray-600'
                        )}>
                          {alert.type === 'news' && <ExternalLink size={18} />}
                          {alert.type === 'ai-insight' && <Sparkles size={18} />}
                          {alert.type === 'stock' && <TrendingUp size={18} />}
                          {alert.type === 'system' && <Bell size={18} />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              'text-xs font-medium px-2 py-0.5 rounded',
                              alert.priority === 'critical' && 'bg-red-100 text-red-700',
                              alert.priority === 'high' && 'bg-orange-100 text-orange-700',
                              alert.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                              alert.priority === 'low' && 'bg-blue-100 text-blue-700'
                            )}>
                              {alert.priority.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(alert.createdAt)}
                            </span>
                            {!alert.readAt && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1">
                            {alert.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {alert.message}
                          </p>

                          {/* Related entities */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {sectors.map((s) => (
                              <Link
                                key={s!.id}
                                href={`/sectors/${s!.id}`}
                                className={cn(
                                  'text-xs px-2 py-0.5 rounded-full text-white',
                                  `bg-gradient-to-r ${s!.gradient}`
                                )}
                              >
                                {s!.icon} {s!.shortName}
                              </Link>
                            ))}
                            {companies.map((c) => (
                              <Link
                                key={c!.id}
                                href={`/companies/${c!.id}`}
                                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                {c!.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!alert.readAt && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check size={16} className="text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                          </button>
                          {relatedArticle && (
                            <Link
                              href={relatedArticle.url}
                              target="_blank"
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View article"
                            >
                              <ExternalLink size={16} className="text-gray-400 hover:text-blue-500" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <BellOff size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
                <p className="text-gray-500">
                  {filter === 'all'
                    ? "You're all caught up! No new alerts."
                    : `No ${filter} alerts to show.`
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
