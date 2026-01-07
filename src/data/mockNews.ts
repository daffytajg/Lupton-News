import { NewsArticle, AIInsight, PredictiveSignal, StockData, Alert, DashboardStats } from '@/types';

// Mock news articles demonstrating the types of news that matter to Lupton Associates
export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'NVIDIA Secures $2.5B Pentagon Contract for AI Defense Systems',
    summary: 'NVIDIA has been awarded a significant Department of Defense contract to develop AI-powered defense systems, marking a major expansion into the military sector.',
    url: 'https://example.com/nvidia-pentagon',
    source: 'Defense News',
    publishedAt: '2026-01-07T14:30:00Z',
    categories: ['government-contracts'],
    sectors: ['datacenter', 'military-aerospace'],
    companies: ['nvidia'],
    relevanceScore: 98,
    sentiment: 'positive',
    isBreaking: true,
    readTime: 4,
    aiInsights: [
      {
        id: 'insight-1a',
        type: 'opportunity',
        title: 'Supply Chain Opportunity',
        description: 'This contract signals increased demand for GPU cooling solutions and custom enclosures in defense applications.',
        confidence: 85,
        relatedCompanies: ['nvidia', 'vertiv'],
        relatedSectors: ['datacenter', 'military-aerospace'],
        impact: 'high',
        createdAt: '2026-01-07T14:35:00Z',
        tags: ['defense', 'opportunity', 'supply-chain'],
      }
    ],
  },
  {
    id: 'news-2',
    title: 'Lockheed Martin to Build $800M Manufacturing Facility in Texas',
    summary: 'Lockheed Martin announces plans for a new advanced manufacturing facility in Fort Worth, Texas, expected to create 2,000 jobs.',
    url: 'https://example.com/lockheed-texas',
    source: 'Reuters',
    publishedAt: '2026-01-07T12:00:00Z',
    categories: ['new-construction', 'expansion'],
    sectors: ['military-aerospace'],
    companies: ['lockheed'],
    relevanceScore: 95,
    sentiment: 'positive',
    readTime: 3,
  },
  {
    id: 'news-3',
    title: 'PACCAR Reports Record Q4 Earnings, Raises 2026 Guidance',
    summary: 'PACCAR exceeded analyst expectations with Q4 revenue of $8.2B, driven by strong demand for Kenworth and Peterbilt trucks.',
    url: 'https://example.com/paccar-earnings',
    source: 'Wall Street Journal',
    publishedAt: '2026-01-07T08:00:00Z',
    categories: ['quarterly-filings', 'stock'],
    sectors: ['heavy-trucks'],
    companies: ['paccar'],
    relevanceScore: 92,
    sentiment: 'positive',
    readTime: 5,
  },
  {
    id: 'news-4',
    title: 'Medtronic CEO Steps Down; CFO Named Interim Chief',
    summary: 'Medtronic announces departure of CEO Geoffrey Martha, with CFO Karen Parkhill assuming interim leadership role effective immediately.',
    url: 'https://example.com/medtronic-ceo',
    source: 'Bloomberg',
    publishedAt: '2026-01-07T07:30:00Z',
    categories: ['c-suite'],
    sectors: ['medical-scientific'],
    companies: ['medtronic'],
    relevanceScore: 94,
    sentiment: 'neutral',
    isBreaking: true,
    readTime: 3,
  },
  {
    id: 'news-5',
    title: 'Daimler Truck Acquires Electric Powertrain Startup for $450M',
    summary: 'Daimler Truck strengthens its EV portfolio with the acquisition of ElectraDrive Technologies, a leader in heavy-duty electric powertrains.',
    url: 'https://example.com/daimler-acquisition',
    source: 'Automotive News',
    publishedAt: '2026-01-06T16:00:00Z',
    categories: ['mergers-acquisitions'],
    sectors: ['heavy-trucks'],
    companies: ['daimler-truck'],
    relevanceScore: 91,
    sentiment: 'positive',
    readTime: 4,
  },
  {
    id: 'news-6',
    title: 'RTX Awarded $1.2B Army Contract for Next-Gen Missile Systems',
    summary: 'Raytheon receives contract for development and production of advanced missile defense systems for the U.S. Army.',
    url: 'https://example.com/rtx-army',
    source: 'Defense One',
    publishedAt: '2026-01-06T14:00:00Z',
    categories: ['government-contracts'],
    sectors: ['military-aerospace'],
    companies: ['rtx'],
    relevanceScore: 96,
    sentiment: 'positive',
    readTime: 4,
  },
  {
    id: 'news-7',
    title: 'FANUC Opens New Robotics Assembly Plant in Ohio',
    summary: 'FANUC breaks ground on 500,000 sq ft robotics manufacturing facility in Columbus, Ohio, part of $200M U.S. expansion.',
    url: 'https://example.com/fanuc-ohio',
    source: 'Manufacturing Today',
    publishedAt: '2026-01-06T11:00:00Z',
    categories: ['new-construction', 'expansion'],
    sectors: ['robotics-automation'],
    companies: ['fanuc'],
    relevanceScore: 89,
    sentiment: 'positive',
    readTime: 3,
  },
  {
    id: 'news-8',
    title: 'Thermo Fisher Receives FDA Approval for New Diagnostic Platform',
    summary: 'FDA grants 510(k) clearance for Thermo Fisher\'s next-generation molecular diagnostics system for rapid pathogen detection.',
    url: 'https://example.com/thermo-fda',
    source: 'MedTech Dive',
    publishedAt: '2026-01-06T09:30:00Z',
    categories: ['permits', 'product-launch'],
    sectors: ['medical-scientific'],
    companies: ['thermo-fisher'],
    relevanceScore: 88,
    sentiment: 'positive',
    readTime: 4,
  },
  {
    id: 'news-9',
    title: 'Intel Announces 3,000 Layoffs as Part of Restructuring',
    summary: 'Intel to reduce workforce by 3,000 employees in Q1 2026 as company continues turnaround efforts under new leadership.',
    url: 'https://example.com/intel-layoffs',
    source: 'TechCrunch',
    publishedAt: '2026-01-05T17:00:00Z',
    categories: ['layoffs', 'c-suite'],
    sectors: ['datacenter'],
    companies: ['intel'],
    relevanceScore: 90,
    sentiment: 'negative',
    readTime: 5,
  },
  {
    id: 'news-10',
    title: 'Rockwell Automation Partners with Microsoft on Industrial AI',
    summary: 'Strategic partnership will integrate Azure OpenAI into Rockwell\'s FactoryTalk software platform for predictive maintenance.',
    url: 'https://example.com/rockwell-msft',
    source: 'Industry Week',
    publishedAt: '2026-01-05T14:00:00Z',
    categories: ['partnership'],
    sectors: ['robotics-automation'],
    companies: ['rockwell'],
    relevanceScore: 85,
    sentiment: 'positive',
    readTime: 4,
  },
  {
    id: 'news-11',
    title: 'Vertiv Awarded $180M Data Center Contract in Singapore',
    summary: 'Vertiv to provide cooling infrastructure for major hyperscale data center expansion in Singapore.',
    url: 'https://example.com/vertiv-singapore',
    source: 'Data Center Dynamics',
    publishedAt: '2026-01-05T10:00:00Z',
    categories: ['government-contracts', 'expansion'],
    sectors: ['datacenter'],
    companies: ['vertiv'],
    relevanceScore: 87,
    sentiment: 'positive',
    readTime: 3,
  },
  {
    id: 'news-12',
    title: 'Cummins Receives $95M DOE Grant for Hydrogen Engine Development',
    summary: 'Department of Energy awards Cummins significant funding to accelerate hydrogen-powered heavy-duty engine technology.',
    url: 'https://example.com/cummins-doe',
    source: 'Reuters',
    publishedAt: '2026-01-05T08:00:00Z',
    categories: ['grants'],
    sectors: ['heavy-trucks'],
    companies: ['cummins'],
    relevanceScore: 86,
    sentiment: 'positive',
    readTime: 4,
  },
  {
    id: 'news-13',
    title: 'Boeing Files for New Patent on Autonomous Cargo Aircraft',
    summary: 'Boeing patent application reveals development of autonomous cargo delivery aircraft designed for military and commercial use.',
    url: 'https://example.com/boeing-patent',
    source: 'Aviation Week',
    publishedAt: '2026-01-04T15:00:00Z',
    categories: ['permits', 'product-launch'],
    sectors: ['military-aerospace'],
    companies: ['boeing'],
    relevanceScore: 82,
    sentiment: 'positive',
    readTime: 4,
  },
  {
    id: 'news-14',
    title: 'Intuitive Surgical Stock Surges 8% on Strong Robot Procedure Growth',
    summary: 'Da Vinci surgical robot procedures grew 18% YoY, driving Intuitive Surgical shares to all-time high.',
    url: 'https://example.com/isrg-stock',
    source: 'Barron\'s',
    publishedAt: '2026-01-04T12:00:00Z',
    categories: ['stock', 'quarterly-filings'],
    sectors: ['medical-scientific', 'robotics-automation'],
    companies: ['intuitive'],
    relevanceScore: 84,
    sentiment: 'positive',
    readTime: 3,
  },
  {
    id: 'news-15',
    title: 'New Tariff Regulations Impact Heavy Truck Component Imports',
    summary: 'Biden administration announces new tariff structure affecting truck components from China, impacting supply chains.',
    url: 'https://example.com/truck-tariffs',
    source: 'Transport Topics',
    publishedAt: '2026-01-04T09:00:00Z',
    categories: ['regulation'],
    sectors: ['heavy-trucks'],
    companies: ['paccar', 'daimler-truck', 'volvo-trucks'],
    relevanceScore: 88,
    sentiment: 'negative',
    readTime: 5,
  },
];

// AI Insights and Predictions
export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-1',
    type: 'prediction',
    title: 'M&A Activity Surge Expected in Robotics Sector',
    description: 'Based on patent filings, executive movements, and market conditions, we predict 3-5 major acquisitions in the industrial robotics sector within the next 6 months. Key potential targets include smaller vision system companies.',
    confidence: 78,
    relatedCompanies: ['fanuc', 'abb', 'cognex', 'keyence'],
    relatedSectors: ['robotics-automation'],
    timeframe: '6 months',
    impact: 'high',
    createdAt: '2026-01-07T10:00:00Z',
    tags: ['M&A', 'robotics', 'consolidation'],
  },
  {
    id: 'ai-2',
    type: 'trend',
    title: 'Data Center Cooling Demand Accelerating',
    description: 'GPU-intensive AI workloads are driving unprecedented demand for liquid cooling solutions. Companies with thermal management expertise have significant opportunity.',
    confidence: 92,
    relatedCompanies: ['nvidia', 'vertiv', 'supermicro'],
    relatedSectors: ['datacenter'],
    impact: 'high',
    createdAt: '2026-01-07T08:00:00Z',
    tags: ['AI infrastructure', 'cooling', 'growth'],
  },
  {
    id: 'ai-3',
    type: 'risk',
    title: 'Supply Chain Vulnerability in Defense Semiconductors',
    description: 'Analysis indicates potential supply constraints for radiation-hardened semiconductors used in defense applications. Lead times may extend significantly.',
    confidence: 71,
    relatedCompanies: ['lockheed', 'rtx', 'northrop', 'l3harris'],
    relatedSectors: ['military-aerospace', 'datacenter'],
    timeframe: '3-6 months',
    impact: 'medium',
    createdAt: '2026-01-06T14:00:00Z',
    tags: ['supply-chain', 'semiconductors', 'defense'],
  },
  {
    id: 'ai-4',
    type: 'opportunity',
    title: 'Electric Heavy Truck Infrastructure Build-Out',
    description: 'Federal infrastructure spending combined with state mandates is creating significant demand for EV charging solutions for commercial fleets.',
    confidence: 85,
    relatedCompanies: ['paccar', 'daimler-truck', 'volvo-trucks', 'cummins'],
    relatedSectors: ['heavy-trucks'],
    impact: 'high',
    createdAt: '2026-01-06T11:00:00Z',
    tags: ['EV', 'infrastructure', 'commercial-vehicles'],
  },
  {
    id: 'ai-5',
    type: 'correlation',
    title: 'Medical Device Approvals Correlate with Stock Performance',
    description: 'Historical analysis shows companies receiving FDA approvals see average 12% stock increase within 30 days. Three pending approvals detected for tracked companies.',
    confidence: 88,
    relatedCompanies: ['medtronic', 'abbott', 'boston-scientific', 'stryker'],
    relatedSectors: ['medical-scientific'],
    impact: 'medium',
    createdAt: '2026-01-05T16:00:00Z',
    tags: ['FDA', 'stock-performance', 'regulatory'],
  },
];

// Predictive Signals
export const MOCK_PREDICTIONS: PredictiveSignal[] = [
  {
    id: 'pred-1',
    signal: 'NVIDIA Likely to Announce New Data Center Product',
    description: 'Patent filings, supplier activity, and job postings suggest major product announcement in Q1 2026.',
    probability: 82,
    companies: ['nvidia'],
    sectors: ['datacenter'],
    indicators: ['Patent activity +45%', 'Job postings +30%', 'Supplier orders increased'],
    recommendedAction: 'Monitor for component specification changes',
    createdAt: '2026-01-07T12:00:00Z',
  },
  {
    id: 'pred-2',
    signal: 'Defense Budget Increase Expected',
    description: 'Congressional activity and geopolitical tensions suggest 8-12% defense budget increase for FY2027.',
    probability: 75,
    companies: ['lockheed', 'rtx', 'northrop', 'general-dynamics', 'l3harris'],
    sectors: ['military-aerospace'],
    indicators: ['Congressional hearings', 'DOD statements', 'Geopolitical analysis'],
    recommendedAction: 'Prepare for increased defense OEM activity',
    createdAt: '2026-01-06T09:00:00Z',
  },
  {
    id: 'pred-3',
    signal: 'Potential Acquisition: Cognex Target',
    description: 'Trading patterns and industry dynamics suggest Cognex may be acquisition target within 12 months.',
    probability: 45,
    companies: ['cognex', 'keyence', 'fanuc'],
    sectors: ['robotics-automation'],
    indicators: ['Trading volume anomaly', 'Board changes', 'Strategic review rumored'],
    createdAt: '2026-01-05T15:00:00Z',
  },
];

// Mock Stock Data
export const MOCK_STOCKS: StockData[] = [
  { ticker: 'NVDA', companyName: 'NVIDIA', price: 875.50, change: 23.40, changePercent: 2.75, volume: 45000000, marketCap: '$2.15T', dayHigh: 880.00, dayLow: 852.30, week52High: 950.00, week52Low: 450.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'LMT', companyName: 'Lockheed Martin', price: 485.20, change: 8.50, changePercent: 1.78, volume: 2100000, marketCap: '$115B', dayHigh: 488.00, dayLow: 476.50, week52High: 520.00, week52Low: 410.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'PCAR', companyName: 'PACCAR', price: 112.75, change: 4.25, changePercent: 3.92, volume: 3200000, marketCap: '$58B', dayHigh: 113.50, dayLow: 108.20, week52High: 125.00, week52Low: 85.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'MDT', companyName: 'Medtronic', price: 88.40, change: -2.15, changePercent: -2.37, volume: 8500000, marketCap: '$118B', dayHigh: 91.00, dayLow: 87.50, week52High: 95.00, week52Low: 72.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'INTC', companyName: 'Intel', price: 42.80, change: -1.85, changePercent: -4.14, volume: 52000000, marketCap: '$180B', dayHigh: 45.00, dayLow: 42.50, week52High: 55.00, week52Low: 28.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'ROK', companyName: 'Rockwell Automation', price: 285.60, change: 5.20, changePercent: 1.85, volume: 890000, marketCap: '$32B', dayHigh: 287.00, dayLow: 280.10, week52High: 310.00, week52Low: 240.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'RTX', companyName: 'RTX Corporation', price: 118.90, change: 3.80, changePercent: 3.30, volume: 5400000, marketCap: '$165B', dayHigh: 119.50, dayLow: 115.00, week52High: 130.00, week52Low: 90.00, lastUpdated: '2026-01-07T16:00:00Z' },
  { ticker: 'ISRG', companyName: 'Intuitive Surgical', price: 520.00, change: 38.50, changePercent: 8.00, volume: 2800000, marketCap: '$185B', dayHigh: 525.00, dayLow: 482.00, week52High: 530.00, week52Low: 350.00, lastUpdated: '2026-01-07T16:00:00Z' },
];

// Mock Alerts
export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    type: 'news',
    title: 'Breaking: NVIDIA Pentagon Contract',
    message: 'NVIDIA secured $2.5B Pentagon contract for AI defense systems',
    priority: 'critical',
    relatedArticle: 'news-1',
    relatedCompanies: ['nvidia'],
    relatedSectors: ['datacenter', 'military-aerospace'],
    createdAt: '2026-01-07T14:30:00Z',
    userId: 'user-1',
  },
  {
    id: 'alert-2',
    type: 'news',
    title: 'Medtronic CEO Departure',
    message: 'Medtronic CEO Geoffrey Martha stepping down immediately',
    priority: 'high',
    relatedArticle: 'news-4',
    relatedCompanies: ['medtronic'],
    relatedSectors: ['medical-scientific'],
    createdAt: '2026-01-07T07:30:00Z',
    userId: 'user-1',
  },
  {
    id: 'alert-3',
    type: 'ai-insight',
    title: 'AI Prediction: Robotics M&A',
    message: 'High probability of M&A activity in robotics sector within 6 months',
    priority: 'medium',
    relatedCompanies: ['fanuc', 'abb', 'cognex'],
    relatedSectors: ['robotics-automation'],
    createdAt: '2026-01-07T10:00:00Z',
    userId: 'user-1',
  },
  {
    id: 'alert-4',
    type: 'stock',
    title: 'Stock Alert: INTC -4.14%',
    message: 'Intel shares down significantly following layoff announcement',
    priority: 'medium',
    relatedCompanies: ['intel'],
    relatedSectors: ['datacenter'],
    createdAt: '2026-01-07T16:00:00Z',
    userId: 'user-1',
  },
];

// Dashboard Stats
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalArticles: 1247,
  articlesToday: 15,
  activeCompanies: 42,
  aiInsightsCount: 23,
  criticalAlerts: 2,
  sectorBreakdown: {
    'datacenter': 312,
    'heavy-trucks': 198,
    'military-aerospace': 287,
    'robotics-automation': 245,
    'medical-scientific': 205,
  },
  categoryBreakdown: {
    'government-contracts': 145,
    'mergers-acquisitions': 89,
    'quarterly-filings': 234,
    'c-suite': 67,
    'new-construction': 98,
    'permits': 56,
    'grants': 43,
    'stock': 187,
    'expansion': 78,
    'partnership': 92,
    'product-launch': 65,
    'layoffs': 34,
    'bankruptcy': 12,
    'regulation': 47,
  },
  topCompanies: [
    { id: 'nvidia', name: 'NVIDIA', articleCount: 89 },
    { id: 'lockheed', name: 'Lockheed Martin', articleCount: 67 },
    { id: 'rtx', name: 'RTX Corporation', articleCount: 54 },
    { id: 'paccar', name: 'PACCAR', articleCount: 48 },
    { id: 'medtronic', name: 'Medtronic', articleCount: 43 },
  ],
  sentimentOverview: {
    positive: 58,
    neutral: 30,
    negative: 12,
  },
};

// Helper to get news by filters
export function getFilteredNews(filters: {
  sectors?: string[];
  categories?: string[];
  companies?: string[];
  sentiment?: string[];
}): NewsArticle[] {
  let filtered = [...MOCK_NEWS];

  if (filters.sectors?.length) {
    filtered = filtered.filter(n =>
      n.sectors.some(s => filters.sectors!.includes(s))
    );
  }

  if (filters.categories?.length) {
    filtered = filtered.filter(n =>
      n.categories.some(c => filters.categories!.includes(c))
    );
  }

  if (filters.companies?.length) {
    filtered = filtered.filter(n =>
      n.companies.some(c => filters.companies!.includes(c))
    );
  }

  if (filters.sentiment?.length) {
    filtered = filtered.filter(n =>
      filters.sentiment!.includes(n.sentiment)
    );
  }

  return filtered.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getNewsBySector(sector: string): NewsArticle[] {
  return MOCK_NEWS
    .filter(n => n.sectors.includes(sector as any))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getNewsByCompany(companyId: string): NewsArticle[] {
  return MOCK_NEWS
    .filter(n => n.companies.includes(companyId))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
