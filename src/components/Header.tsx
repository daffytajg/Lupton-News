'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Home,
  Building2,
  Layers,
  Newspaper,
  BarChart3,
  Mail,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_ALERTS } from '@/data/mockNews';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SECTORS } from '@/data/sectors';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadAlerts = MOCK_ALERTS.filter(a => !a.readAt).length;

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  const isMenuOpen = isMobileMenuOpen !== undefined ? isMobileMenuOpen : mobileMenuOpen;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
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
                onClick={handleMenuToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu size={24} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-[#1a1a1a]">
                  <Image
                    src="/lupton-logo.png"
                    alt="Lupton Associates"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-xl text-lupton-navy dark:text-white">Lupton News</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Intelligence Platform</p>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lupton-blue focus:border-transparent transition-all text-gray-900 dark:text-white"
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
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all"
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
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                >
                  <Bell size={22} className="text-gray-600 dark:text-gray-400" />
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
              <Link href="/settings" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings size={22} className="text-gray-600 dark:text-gray-400" />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleMenuToggle}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
              <Image
                src="/lupton-logo.png"
                alt="Lupton Associates"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg text-lupton-navy dark:text-white">Lupton News</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Intelligence Platform</p>
            </div>
          </div>
          <button
            onClick={handleMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                handleMenuToggle();
              }
            }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
              />
            </div>
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          
          <MobileNavLink href="/" icon={Home} label="Dashboard" onClick={handleMenuToggle} />
          <MobileNavLink href="/companies" icon={Building2} label="Companies" onClick={handleMenuToggle} />
          <MobileNavLink href="/sectors" icon={Layers} label="Sectors" onClick={handleMenuToggle} />
          <MobileNavLink href="/insights" icon={Sparkles} label="AI Insights" onClick={handleMenuToggle} />
          <MobileNavLink href="/alerts" icon={Bell} label="Alerts" onClick={handleMenuToggle} />
          <MobileNavLink href="/email-digest" icon={Mail} label="Email Digest" onClick={handleMenuToggle} />

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Sectors
            </p>
            {SECTORS.map((sector) => (
              <MobileNavLink
                key={sector.id}
                href={`/sectors/${sector.id}`}
                icon={Layers}
                label={sector.name}
                onClick={handleMenuToggle}
              />
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Account
            </p>
            <MobileNavLink href="/settings" icon={Settings} label="Settings" onClick={handleMenuToggle} />
            <MobileNavLink href="/help" icon={HelpCircle} label="Help & Support" onClick={handleMenuToggle} />
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-lupton-blue flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Alan Lupton II</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">alan@luptons.com</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <Icon size={20} className="text-gray-500 dark:text-gray-400" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function StockTicker({ symbol, price, change }: { symbol: string; price: number; change: number }) {
  const isPositive = change >= 0;

  return (
    <div className="flex items-center gap-2 text-sm" title={`Last updated: ${new Date().toLocaleTimeString()}`}>
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
      <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
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
            <Link
              key={alert.id}
              href="/alerts"
              onClick={onClose}
              className={cn(
                'block p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                !alert.readAt && 'bg-blue-50/50 dark:bg-blue-900/20'
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
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {alert.message}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <Link
            href="/settings"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-lupton-blue"
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
      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">Alan Lupton II</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">alan@luptons.com</p>
        </div>
        <div className="p-2">
          <Link
            href="/settings"
            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            onClick={onClose}
          >
            Profile Settings
          </Link>
          <Link
            href="/companies"
            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            onClick={onClose}
          >
            My Companies
          </Link>
          <Link
            href="/settings"
            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            onClick={onClose}
          >
            Notification Settings
          </Link>
        </div>
        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
          <button className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
