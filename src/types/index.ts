// Industry Sectors
export type Sector =
  | 'datacenter'
  | 'heavy-trucks'
  | 'military-aerospace'
  | 'robotics-automation'
  | 'medical-scientific';

export interface SectorInfo {
  id: Sector;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

// News Categories that matter to Lupton Associates
export type NewsCategory =
  | 'permits'
  | 'mergers-acquisitions'
  | 'stock'
  | 'quarterly-filings'
  | 'c-suite'
  | 'new-construction'
  | 'grants'
  | 'government-contracts'
  | 'product-launch'
  | 'expansion'
  | 'layoffs'
  | 'bankruptcy'
  | 'partnership'
  | 'regulation'
  | 'earnings'
  | 'executive-moves'
  | 'capex';

export interface NewsCategoryInfo {
  id: NewsCategory;
  name: string;
  icon: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

// OEM/Customer/Principal types
export type CompanyType = 'oem' | 'customer' | 'principal' | 'manufacturer';

export interface Company {
  id: string;
  name: string;
  ticker?: string;
  logo?: string;
  website?: string;
  type: CompanyType;
  sectors: Sector[];
  description?: string;
  headquarters?: string;
  marketCap?: string;
  employees?: number;
  isActive: boolean;
  assignedTo?: string[]; // Sales team IDs for notification routing
  lastUpdated?: string;
  // Disambiguation fields to avoid matching wrong companies
  searchIdentifiers?: string[]; // Alternative names, locations, divisions
  parentCompany?: string; // Parent company name if subsidiary
  parentTicker?: string; // Parent company ticker if subsidiary
}

// News Article
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  imageUrl?: string;
  categories: NewsCategory[];
  sectors: Sector[];
  companies: string[]; // Company IDs mentioned
  relevanceScore: number; // AI-calculated 0-100
  sentiment: 'positive' | 'negative' | 'neutral';
  isBreaking?: boolean;
  readTime?: number;
  aiInsights?: AIInsight[];
}

// AI Insights and Predictions
export interface AIInsight {
  id: string;
  type: 'prediction' | 'trend' | 'risk' | 'opportunity' | 'correlation';
  title: string;
  description: string;
  confidence: number; // 0-100
  relatedCompanies: string[];
  relatedSectors: Sector[];
  timeframe?: string;
  impact?: 'high' | 'medium' | 'low';
  createdAt: string;
  tags?: string[];
  actionItems?: string[];
}

export interface PredictiveSignal {
  id: string;
  signal?: string;
  title?: string;
  description: string;
  probability: number;
  timeframe?: string;
  companies?: string[];
  relatedCompanies?: string[];
  sectors?: Sector[];
  relatedSectors?: Sector[];
  indicators?: string[];
  recommendedAction?: string;
  createdAt: string;
}

// Stock/Financial Data
export interface StockData {
  symbol?: string;
  ticker?: string;
  companyName?: string;
  companyId?: string;
  price: number;
  change: number;
  changePercent?: number;
  volume?: number;
  marketCap?: string;
  dayHigh?: number;
  dayLow?: number;
  week52High?: number;
  week52Low?: number;
  lastUpdated?: string;
}

// User/Employee
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'manager' | 'viewer';
  assignedCompanies: string[]; // Company IDs
  assignedSectors: Sector[];
  notifications: NotificationPreferences;
  avatar?: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    dailySummaryTime?: string; // e.g., "08:00"
    categories: NewsCategory[];
  };
  push: {
    enabled: boolean;
    breakingOnly: boolean;
    categories: NewsCategory[];
  };
  sms?: {
    enabled: boolean;
    phone?: string;
    criticalOnly: boolean;
  };
}

// Alert/Notification
export interface Alert {
  id: string;
  type: 'news' | 'stock' | 'ai-insight' | 'system' | 'breaking' | 'c-suite' | 'expansion' | 'regulation';
  title: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  relatedArticle?: string;
  relatedArticleId?: string;
  relatedCompanies?: string[];
  relatedSectors?: Sector[];
  createdAt: string;
  readAt?: string;
  isRead?: boolean;
  userId?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalArticles: number;
  articlesToday: number;
  activeCompanies: number;
  aiInsightsCount?: number;
  aiInsights?: number;
  criticalAlerts: number;
  articlesChange?: number;
  insightsChange?: number;
  lastUpdated?: string;
  sectorBreakdown?: Record<Sector, number>;
  categoryBreakdown?: Record<NewsCategory, number>;
  topCompanies?: { id: string; name: string; articleCount: number }[];
  sentimentOverview?: { positive: number; neutral: number; negative: number };
}

// Email Summary
export interface EmailSummary {
  id: string;
  userId: string;
  date: string;
  topStories: NewsArticle[];
  companyUpdates: { company: Company; articles: NewsArticle[] }[];
  sectorHighlights: { sector: Sector; articles: NewsArticle[] }[];
  aiPredictions: PredictiveSignal[];
  stockMovers: StockData[];
  sentAt?: string;
}

// Filter/Search
export interface NewsFilters {
  sectors?: Sector[];
  categories?: NewsCategory[];
  companies?: string[];
  dateFrom?: string;
  dateTo?: string;
  sentiment?: ('positive' | 'negative' | 'neutral')[];
  minRelevance?: number;
  searchQuery?: string;
}
