'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Building2, 
  Tag, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Check,
  RotateCcw
} from 'lucide-react';
import { SECTORS, NEWS_CATEGORIES } from '@/data/sectors';
import { NewsFilters, Sector, NewsCategory } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: NewsFilters;
  onFiltersChange: (filters: NewsFilters) => void;
}

export default function FilterPanel({ isOpen, onClose, filters, onFiltersChange }: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [localFilters, setLocalFilters] = useState<NewsFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const toggleSector = (sectorId: Sector) => {
    const currentSectors = localFilters.sectors || [];
    const newSectors = currentSectors.includes(sectorId)
      ? currentSectors.filter(s => s !== sectorId)
      : [...currentSectors, sectorId];
    setLocalFilters({ ...localFilters, sectors: newSectors });
  };

  const toggleCategory = (categoryId: NewsCategory) => {
    const currentCategories = localFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(c => c !== categoryId)
      : [...currentCategories, categoryId];
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const toggleSentiment = (sentiment: 'positive' | 'negative' | 'neutral') => {
    const currentSentiment = localFilters.sentiment || [];
    const newSentiment = currentSentiment.includes(sentiment)
      ? currentSentiment.filter(s => s !== sentiment)
      : [...currentSentiment, sentiment];
    setLocalFilters({ ...localFilters, sentiment: newSentiment });
  };

  const setDateRange = (range: 'today' | 'week' | 'month' | 'all') => {
    const now = new Date();
    let dateFrom: string | undefined;
    
    switch (range) {
      case 'today':
        dateFrom = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        break;
      case 'week':
        dateFrom = new Date(now.setDate(now.getDate() - 7)).toISOString();
        break;
      case 'month':
        dateFrom = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        break;
      case 'all':
        dateFrom = undefined;
        break;
    }
    
    setLocalFilters({ ...localFilters, dateFrom, dateTo: undefined });
  };

  const setMinRelevance = (value: number) => {
    setLocalFilters({ ...localFilters, minRelevance: value });
  };

  const resetFilters = () => {
    setLocalFilters({});
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.sectors?.length) count += localFilters.sectors.length;
    if (localFilters.categories?.length) count += localFilters.categories.length;
    if (localFilters.sentiment?.length) count += localFilters.sentiment.length;
    if (localFilters.dateFrom) count += 1;
    if (localFilters.minRelevance && localFilters.minRelevance > 0) count += 1;
    return count;
  };

  const getCurrentDateRange = () => {
    if (!localFilters.dateFrom) return 'all';
    const dateFrom = new Date(localFilters.dateFrom);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return 'today';
    if (diffDays <= 7) return 'week';
    if (diffDays <= 31) return 'month';
    return 'all';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter Articles</h2>
            {getActiveFilterCount() > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Date Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Calendar size={16} />
              Date Range
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' },
              ].map(range => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id as 'today' | 'week' | 'month' | 'all')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    getCurrentDateRange() === range.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Building2 size={16} />
              Sectors
            </label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map(sector => (
                <button
                  key={sector.id}
                  onClick={() => toggleSector(sector.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    localFilters.sectors?.includes(sector.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <span>{sector.icon}</span>
                  <span>{sector.shortName}</span>
                  {localFilters.sectors?.includes(sector.id) && (
                    <Check size={14} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Tag size={16} />
              News Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {NEWS_CATEGORIES.slice(0, 10).map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    localFilters.categories?.includes(category.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  {localFilters.categories?.includes(category.id) && (
                    <Check size={14} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Sentiment
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleSentiment('positive')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  localFilters.sentiment?.includes('positive')
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <TrendingUp size={16} />
                Positive
              </button>
              <button
                onClick={() => toggleSentiment('neutral')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  localFilters.sentiment?.includes('neutral')
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <Minus size={16} />
                Neutral
              </button>
              <button
                onClick={() => toggleSentiment('negative')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  localFilters.sentiment?.includes('negative')
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <TrendingDown size={16} />
                Negative
              </button>
            </div>
          </div>

          {/* Minimum Relevance */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Minimum Relevance Score: {localFilters.minRelevance || 0}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={localFilters.minRelevance || 0}
              onChange={(e) => setMinRelevance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
