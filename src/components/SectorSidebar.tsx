'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SECTORS } from '@/data/sectors';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectorSidebarProps {
  className?: string;
}

// Mock data for sector performance (in production, fetch from API)
const SECTOR_STATS = [
  { sectorId: 'datacenter', articleCount: 47, trend: 5.2, change: 'up' },
  { sectorId: 'heavy-trucks', articleCount: 32, trend: -2.1, change: 'down' },
  { sectorId: 'military-aerospace', articleCount: 58, trend: 8.4, change: 'up' },
  { sectorId: 'robotics-automation', articleCount: 41, trend: 3.7, change: 'up' },
  { sectorId: 'medical-scientific', articleCount: 29, trend: -1.5, change: 'down' },
];

// Generate deterministic sparkline heights based on sector ID
function generateSparklineHeights(sectorId: string): number[] {
  const seed = sectorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array.from({ length: 12 }, (_, i) => {
    // Use a simple seeded random-like formula
    const value = ((seed * (i + 1) * 13) % 100);
    return Math.max(20, value);
  });
}

export function SectorSidebar({ className }: SectorSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Sector Activity
        </h3>
        <Link
          href="/sectors"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </Link>
      </div>

      {SECTOR_STATS.map((stat) => {
        const sector = SECTORS.find(s => s.id === stat.sectorId);
        if (!sector) return null;

        return (
          <Link
            key={sector.id}
            href={`/sectors/${sector.id}`}
            className="block group"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sector.icon}</span>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {sector.shortName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.articleCount} articles
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Mini sparkline chart */}
              <div className="flex items-end gap-0.5 h-8 mb-2">
                {generateSparklineHeights(sector.id).map((height, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 rounded-t transition-all',
                      stat.change === 'up' ? 'bg-green-500/30 dark:bg-green-500/20' : 'bg-red-500/30 dark:bg-red-500/20'
                    )}
                    style={{ height: mounted ? `${height}%` : '50%' }}
                  />
                ))}
              </div>

              {/* Trend indicator */}
              <div className="flex items-center justify-between">
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  stat.change === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {stat.change === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(stat.trend)}%
                </div>
                <span className="text-xs text-gray-400">vs. last week</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default SectorSidebar;
