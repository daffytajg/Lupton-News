'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SECTORS } from '@/data/sectors';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Sparkles,
  Bell,
  Mail,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  className?: string;
}

const MAIN_NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/sectors', label: 'Sectors', icon: Layers },
  { href: '/insights', label: 'AI Insights', icon: Sparkles },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/email-digest', label: 'Email Digest', icon: Mail },
];

const BOTTOM_NAV = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
];

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64',
        'hidden lg:flex',
        className
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/lupton-logo.svg"
              alt="Lupton Associates"
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Fallback logo */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white font-bold text-lg">
              L
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                Lupton News
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                Intelligence Platform
              </span>
            </div>
          )}
        </Link>
        
        {/* Branding Credit */}
        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[9px] text-gray-400 dark:text-gray-500 leading-tight">
              Built by Joe Guadagnino
            </p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 leading-tight">
              Powered by Google Cloud
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-3">
          <Link
            href="/search"
            className="flex items-center gap-2 w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Search size={16} />
            <span>Search...</span>
            <kbd className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘K</kbd>
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Main
            </h3>
          )}
          {MAIN_NAV.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sectors Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Sectors
            </h3>
          )}
          {SECTORS.map((sector) => {
            const isActive = pathname === `/sectors/${sector.id}`;
            return (
              <Link
                key={sector.id}
                href={`/sectors/${sector.id}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? sector.name : undefined}
              >
                <span className="text-lg flex-shrink-0">{sector.icon}</span>
                {!isCollapsed && (
                  <span className="truncate">{sector.shortName}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {BOTTOM_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 shadow-sm hover:shadow transition-all"
      >
        {isCollapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>
    </aside>
  );
}

export default AppSidebar;
