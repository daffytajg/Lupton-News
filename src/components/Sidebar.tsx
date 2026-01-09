'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Truck,
  Shield,
  Bot,
  Microscope,
  Building2,
  Sparkles,
  Bell,
  Mail,
  Settings,
  HelpCircle,
  ChevronRight,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SECTORS } from '@/data/sectors';
import { MOCK_DASHBOARD_STATS } from '@/data/mockNews';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sectorIcons: Record<string, React.ReactNode> = {
  'datacenter': <Server size={18} />,
  'heavy-trucks': <Truck size={18} />,
  'military-aerospace': <Shield size={18} />,
  'robotics-automation': <Bot size={18} />,
  'medical-scientific': <Microscope size={18} />,
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-out',
          'lg:translate-x-0 lg:top-[104px] lg:h-[calc(100vh-104px)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo for mobile */}
          <div className="lg:hidden p-4 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-3" onClick={onClose}>
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                <Image
                  src="/lupton-logo.png"
                  alt="Lupton Associates"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg text-lupton-navy">Lupton News</h1>
                <p className="text-xs text-gray-500">Intelligence Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {/* Main Navigation */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                Overview
              </p>
              <NavItem
                href="/"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                isActive={pathname === '/'}
                onClick={onClose}
              />
              <NavItem
                href="/companies"
                icon={<Building2 size={18} />}
                label="Companies"
                isActive={pathname === '/companies' || pathname?.startsWith('/companies/')}
                badge={MOCK_DASHBOARD_STATS.activeCompanies}
                onClick={onClose}
              />
              <NavItem
                href="/insights"
                icon={<Sparkles size={18} />}
                label="AI Insights"
                isActive={pathname === '/insights'}
                badge={MOCK_DASHBOARD_STATS.aiInsightsCount}
                badgeColor="bg-indigo-100 text-indigo-700"
                onClick={onClose}
              />
            </div>

            {/* Sectors */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                Sectors
              </p>
              {SECTORS.map((sector) => (
                <NavItem
                  key={sector.id}
                  href={`/sectors/${sector.id}`}
                  icon={sectorIcons[sector.id]}
                  label={sector.shortName}
                  isActive={pathname === `/sectors/${sector.id}`}
                  badge={MOCK_DASHBOARD_STATS.sectorBreakdown?.[sector.id]}
                  onClick={onClose}
                />
              ))}
            </div>

            {/* News Categories */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                Categories
              </p>
              <NavItem
                href="/categories/government-contracts"
                icon={<FileText size={18} />}
                label="Gov Contracts"
                isActive={pathname === '/categories/government-contracts'}
                badge={MOCK_DASHBOARD_STATS.categoryBreakdown?.['government-contracts']}
                badgeColor="bg-red-100 text-red-700"
                onClick={onClose}
              />
              <NavItem
                href="/categories/mergers-acquisitions"
                icon={<TrendingUp size={18} />}
                label="M&A Activity"
                isActive={pathname === '/categories/mergers-acquisitions'}
                badge={MOCK_DASHBOARD_STATS.categoryBreakdown?.['mergers-acquisitions']}
                onClick={onClose}
              />
            </div>

            {/* Alerts & Reports */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                Alerts & Reports
              </p>
              <NavItem
                href="/alerts"
                icon={<Bell size={18} />}
                label="My Alerts"
                isActive={pathname === '/alerts'}
                badge={MOCK_DASHBOARD_STATS.criticalAlerts}
                badgeColor="bg-red-100 text-red-700"
                onClick={onClose}
              />
              <NavItem
                href="/email-digest"
                icon={<Mail size={18} />}
                label="Email Digest"
                isActive={pathname === '/email-digest'}
                onClick={onClose}
              />
            </div>
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-100">
            <NavItem
              href="/settings"
              icon={<Settings size={18} />}
              label="Settings"
              isActive={pathname === '/settings'}
              onClick={onClose}
            />
            <NavItem
              href="/help"
              icon={<HelpCircle size={18} />}
              label="Help & Support"
              isActive={pathname === '/help'}
              onClick={onClose}
            />

            {/* AI Status */}
            <div className="mt-4 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-indigo-700">AI Engine Active</span>
              </div>
              <p className="text-xs text-gray-600">
                Monitoring 42 companies across 5 sectors
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
  badgeColor?: string;
  onClick?: () => void;
}

function NavItem({
  href,
  icon,
  label,
  isActive,
  badge,
  badgeColor = 'bg-gray-100 text-gray-600',
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
        isActive
          ? 'bg-lupton-blue text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <span className={cn(
        'flex-shrink-0',
        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
      )}>
        {icon}
      </span>
      <span className="flex-1 font-medium text-sm">{label}</span>
      {badge !== undefined && (
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          isActive ? 'bg-white/20 text-white' : badgeColor
        )}>
          {badge}
        </span>
      )}
      <ChevronRight
        size={14}
        className={cn(
          'opacity-0 group-hover:opacity-100 transition-opacity',
          isActive ? 'text-white/60' : 'text-gray-400'
        )}
      />
    </Link>
  );
}
