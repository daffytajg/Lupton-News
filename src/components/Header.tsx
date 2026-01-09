'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Settings,
  Menu,
  X,
  User,
  ChevronDown,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_ALERTS } from '@/data/mockNews';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadAlerts = MOCK_ALERTS.filter(a => !a.readAt).length;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar with stock ticker */}
      <div className="bg-lupton-navy text-white py-1 overflow-hidden">
        <div className="ticker-animate flex items-center gap-8 whitespace-nowrap">
          <StockTicker symbol="NVDA" price={875.50} change={2.75} />
          <StockTicker symbol="LMT" price={485.20} change={1.78} />
          <StockTicker symbol="PCAR" price={112.75} change={3.92} />
          <StockTicker symbol="MDT" price={88.40} change={-2.37} />
          <StockTicker symbol="INTC" price={42.80} change={-4.14} />
          <StockTicker symbol="ROK" price={285.60} change={1.85} />
          <StockTicker symbol="RTX" price={118.90} change={3.30} />
          <StockTicker symbol="ISRG" price={520.00} change={8.00} />
          {/* Duplicate for seamless loop */}
          <StockTicker symbol="NVDA" price={875.50} change={2.75} />
          <StockTicker symbol="LMT" price={485.20} change={1.78} />
          <StockTicker symbol="PCAR" price={112.75} change={3.92} />
          <StockTicker symbol="MDT" price={88.40} change={-2.37} />
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-navy flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl text-lupton-navy">Lupton News</h1>
                <p className="text-xs text-gray-500">Intelligence Platform</p>
              </div>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search news, companies, sectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lupton-blue focus:border-transparent transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
                  <Sparkles size={14} className="text-lupton-accent" />
                  <span>AI Search</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* AI Insights Button */}
            <Link
              href="/insights"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all"
            >
              <Sparkles size={16} />
              <span className="text-sm font-medium">AI Insights</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell size={22} className="text-gray-600" />
                {unreadAlerts > 0 && (
                  <span className="notification-dot" />
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  alerts={MOCK_ALERTS}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Settings */}
            <Link href="/settings" className="p-2 rounded-lg hover:bg-gray-100">
              <Settings size={22} className="text-gray-600" />
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-lupton-blue flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </button>

              {showUserMenu && (
                <UserDropdown onClose={() => setShowUserMenu(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StockTicker({ symbol, price, change }: { symbol: string; price: number; change: number }) {
  const isPositive = change >= 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-semibold">{symbol}</span>
      <span>${price.toFixed(2)}</span>
      <span className={cn(
        'flex items-center gap-0.5',
        isPositive ? 'text-green-400' : 'text-red-400'
      )}>
        <TrendingUp size={12} className={!isPositive ? 'rotate-180' : ''} />
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    </div>
  );
}

function NotificationDropdown({
  alerts,
  onClose,
}: {
  alerts: typeof MOCK_ALERTS;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <Link
            href="/alerts"
            className="text-sm text-lupton-blue hover:underline"
            onClick={onClose}
          >
            View All
          </Link>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer',
                !alert.readAt && 'bg-blue-50/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                  alert.priority === 'critical' && 'bg-red-500',
                  alert.priority === 'high' && 'bg-orange-500',
                  alert.priority === 'medium' && 'bg-yellow-500',
                  alert.priority === 'low' && 'bg-blue-500'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <Link
            href="/settings?tab=notifications"
            className="text-sm text-gray-600 hover:text-lupton-blue"
            onClick={onClose}
          >
            Manage notification preferences →
          </Link>
        </div>
      </div>
    </>
  );
}

function UserDropdown({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <p className="font-medium text-gray-900">Alan Lupton II</p>
          <p className="text-sm text-gray-500">alan@luptons.com</p>
        </div>
        <div className="p-2">
          <Link
            href="/settings?tab=profile"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={onClose}
          >
            Profile Settings
          </Link>
          <Link
            href="/settings?tab=companies"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={onClose}
          >
            My Companies
          </Link>
          <Link
            href="/settings?tab=notifications"
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={onClose}
          >
            Notification Settings
          </Link>
        </div>
        <div className="p-2 border-t border-gray-100">
          <button className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
