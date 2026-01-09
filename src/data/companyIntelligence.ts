// ============================================
// COMPANY INTELLIGENCE DATA
// Deep, detailed information for each company
// ============================================

import { NewsArticle, AIInsight } from '@/types';

export interface CompanyIntelligence {
  companyId: string;
  // Financial Data
  financials?: {
    revenue?: string;
    revenueGrowth?: string;
    employees?: string;
    founded?: string;
    fiscalYearEnd?: string;
    lastEarningsDate?: string;
    nextEarningsDate?: string;
    quarterlyRevenue?: { quarter: string; amount: string; yoy: string }[];
  };
  // Stock Data
  stockData?: {
    price: number;
    change: number;
    changePercent: number;
    high52Week: number;
    low52Week: number;
    volume: string;
    avgVolume: string;
    marketCap: string;
    peRatio?: number;
    dividend?: string;
  };
  // Key Contacts
  contacts?: {
    name: string;
    title: string;
    department?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    notes?: string;
  }[];
  // Recent Activity
  recentActivity?: {
    date: string;
    type: 'meeting' | 'call' | 'email' | 'order' | 'rfq' | 'visit';
    description: string;
    outcome?: string;
  }[];
  // AI Insights specific to this company
  insights: AIInsight[];
  // News articles specific to this company
  articles: NewsArticle[];
  // Competitive Intelligence
  competitors?: string[];
  // SWOT Analysis
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  // Lupton Relationship
  luptonRelationship?: {
    accountSince?: string;
    totalRevenue?: string;
    lastOrderDate?: string;
    primaryProducts?: string[];
    growthPotential?: 'high' | 'medium' | 'low';
    relationshipHealth?: 'excellent' | 'good' | 'fair' | 'at-risk';
    notes?: string;
  };
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================
// NORTHROP GRUMMAN INTELLIGENCE
// ============================================
const northropGrummanIntelligence: CompanyIntelligence = {
  companyId: 'northrop-grumman',
  financials: {
    revenue: '$39.3B',
    revenueGrowth: '+4.2%',
    employees: '95,000',
    founded: '1939',
    fiscalYearEnd: 'December',
    lastEarningsDate: '2025-10-24',
    nextEarningsDate: '2026-01-28',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', amount: '$10.2B', yoy: '+5.1%' },
      { quarter: 'Q3 2025', amount: '$9.8B', yoy: '+3.8%' },
      { quarter: 'Q2 2025', amount: '$9.6B', yoy: '+4.5%' },
      { quarter: 'Q1 2025', amount: '$9.7B', yoy: '+3.2%' },
    ],
  },
  stockData: {
    price: 478.33,
    change: -3.21,
    changePercent: -0.67,
    high52Week: 525.00,
    low52Week: 420.15,
    volume: '1.2M',
    avgVolume: '980K',
    marketCap: '$72.8B',
    peRatio: 18.5,
    dividend: '1.52%',
  },
  contacts: [
    {
      name: 'Michael Chen',
      title: 'VP Supply Chain',
      department: 'Procurement',
      email: 'm.chen@northropgrumman.com',
      notes: 'Primary contact for component sourcing. Met at AUSA 2024.',
    },
    {
      name: 'Sarah Williams',
      title: 'Director of Supplier Quality',
      department: 'Quality Assurance',
      email: 's.williams@northropgrumman.com',
      notes: 'Handles supplier certifications and audits.',
    },
    {
      name: 'Robert Martinez',
      title: 'Program Manager - B-21',
      department: 'Aeronautics',
      notes: 'Key decision maker for B-21 Raider program components.',
    },
  ],
  recentActivity: [
    {
      date: '2025-01-05',
      type: 'meeting',
      description: 'Quarterly business review with procurement team',
      outcome: 'Discussed 2026 forecast, potential 15% volume increase',
    },
    {
      date: '2024-12-15',
      type: 'rfq',
      description: 'RFQ received for precision machined components - B-21 program',
      outcome: 'Quote submitted $2.3M, awaiting response',
    },
    {
      date: '2024-11-20',
      type: 'visit',
      description: 'Plant tour at Palmdale facility',
      outcome: 'Identified 3 new product opportunities',
    },
  ],
  insights: [
    {
      id: generateId(),
      type: 'opportunity',
      title: 'B-21 Raider Production Ramp-Up',
      description: 'Northrop is accelerating B-21 production with 5 aircraft now in final assembly. This creates significant demand for precision components and assemblies. Lupton should position for Tier 2 supplier opportunities.',
      confidence: 85,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['northrop-grumman'],
      actionItems: ['Schedule meeting with B-21 program office', 'Prepare capability presentation for precision machining'],
      createdAt: '2025-01-08T10:00:00Z',
    },
    {
      id: generateId(),
      type: 'trend',
      title: 'Autonomous Systems Investment',
      description: 'Northrop is investing heavily in autonomous systems and AI integration. Their recent acquisition of Scaled Composites positions them for next-gen unmanned platforms.',
      confidence: 78,
      relatedSectors: ['military-aerospace', 'robotics-automation'],
      relatedCompanies: ['northrop-grumman'],
      createdAt: '2025-01-06T14:30:00Z',
    },
    {
      id: generateId(),
      type: 'risk',
      title: 'Supply Chain Diversification Mandate',
      description: 'Pentagon is pushing for supply chain diversification. Northrop may be required to qualify additional suppliers, creating both opportunity and competitive pressure.',
      confidence: 72,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['northrop-grumman'],
      createdAt: '2025-01-04T09:15:00Z',
    },
  ],
  articles: [
    {
      id: 'ng-article-1',
      title: 'Northrop Grumman Wins $1.4B Space Force Contract for Missile Warning Satellites',
      summary: 'The U.S. Space Force awarded Northrop Grumman a $1.4 billion contract to develop next-generation missile warning satellites. This expands their space systems portfolio and signals continued government investment in space-based defense.',
      source: 'Defense News',
      sourceUrl: 'https://www.defensenews.com',
      url: '/article/ng-article-1',
      publishedAt: '2025-01-08T08:00:00Z',
      categories: ['government-contracts'],
      sectors: ['military-aerospace'],
      companies: ['northrop-grumman'],
      sentiment: 'positive',
      relevanceScore: 95,
      isBreaking: false,
      readTime: 4,
    },
    {
      id: 'ng-article-2',
      title: 'B-21 Raider Enters Full-Rate Production Phase',
      summary: 'The Air Force has authorized full-rate production of the B-21 Raider stealth bomber. Northrop Grumman expects to deliver 100+ aircraft over the next decade, creating sustained demand for components and assemblies.',
      source: 'Aviation Week',
      sourceUrl: 'https://aviationweek.com',
      url: '/article/ng-article-2',
      publishedAt: '2025-01-06T12:00:00Z',
      categories: ['expansion'],
      sectors: ['military-aerospace'],
      companies: ['northrop-grumman'],
      sentiment: 'positive',
      relevanceScore: 92,
      isBreaking: true,
      readTime: 5,
    },
    {
      id: 'ng-article-3',
      title: 'Northrop Grumman Q4 Earnings Beat Estimates, Raises 2026 Guidance',
      summary: 'Northrop Grumman reported Q4 revenue of $10.2B, beating analyst estimates by 3%. The company raised full-year 2026 guidance citing strong defense spending and backlog growth to $84B.',
      source: 'Reuters',
      sourceUrl: 'https://www.reuters.com',
      url: '/article/ng-article-3',
      publishedAt: '2025-01-05T16:30:00Z',
      categories: ['earnings'],
      sectors: ['military-aerospace'],
      companies: ['northrop-grumman'],
      sentiment: 'positive',
      relevanceScore: 88,
      isBreaking: false,
      readTime: 3,
    },
    {
      id: 'ng-article-4',
      title: 'Northrop Expands Palmdale Manufacturing Facility',
      summary: 'Northrop Grumman announced a $500M expansion of its Palmdale, California manufacturing facility to support increased B-21 and autonomous systems production. The expansion will add 1,500 jobs.',
      source: 'Los Angeles Times',
      sourceUrl: 'https://www.latimes.com',
      url: '/article/ng-article-4',
      publishedAt: '2025-01-03T10:00:00Z',
      categories: ['expansion', 'capex'],
      sectors: ['military-aerospace'],
      companies: ['northrop-grumman'],
      sentiment: 'positive',
      relevanceScore: 90,
      isBreaking: false,
      readTime: 4,
    },
  ],
  competitors: ['lockheed-martin', 'boeing', 'raytheon', 'general-dynamics', 'l3harris'],
  swot: {
    strengths: [
      'Leading position in stealth bomber technology (B-21)',
      'Strong space systems portfolio',
      'Diversified defense portfolio',
      '$84B backlog provides revenue visibility',
    ],
    weaknesses: [
      'Heavy dependence on U.S. government contracts',
      'Limited commercial aerospace exposure',
      'Supply chain constraints in specialized materials',
    ],
    opportunities: [
      'B-21 production ramp creates component demand',
      'Space Force budget increases',
      'Autonomous systems growth',
      'International defense sales expansion',
    ],
    threats: [
      'Defense budget uncertainty',
      'Competitor pricing pressure',
      'Skilled labor shortages',
      'Supply chain diversification mandates',
    ],
  },
  luptonRelationship: {
    accountSince: '2018',
    totalRevenue: '$4.2M',
    lastOrderDate: '2024-12-10',
    primaryProducts: ['Precision machined components', 'Rubber seals', 'Thermal management'],
    growthPotential: 'high',
    relationshipHealth: 'excellent',
    notes: 'Key strategic account. Strong relationships with procurement and engineering. B-21 program represents significant growth opportunity.',
  },
};

// ============================================
// LOCKHEED MARTIN INTELLIGENCE
// ============================================
const lockheedMartinIntelligence: CompanyIntelligence = {
  companyId: 'lockheed-martin',
  financials: {
    revenue: '$67.6B',
    revenueGrowth: '+6.1%',
    employees: '116,000',
    founded: '1926',
    fiscalYearEnd: 'December',
    lastEarningsDate: '2025-10-22',
    nextEarningsDate: '2026-01-25',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', amount: '$18.1B', yoy: '+7.2%' },
      { quarter: 'Q3 2025', amount: '$16.9B', yoy: '+5.8%' },
      { quarter: 'Q2 2025', amount: '$16.4B', yoy: '+6.3%' },
      { quarter: 'Q1 2025', amount: '$16.2B', yoy: '+5.1%' },
    ],
  },
  stockData: {
    price: 485.20,
    change: 8.52,
    changePercent: 1.78,
    high52Week: 512.00,
    low52Week: 410.25,
    volume: '1.8M',
    avgVolume: '1.5M',
    marketCap: '$118.5B',
    peRatio: 17.2,
    dividend: '2.65%',
  },
  contacts: [
    {
      name: 'Jennifer Thompson',
      title: 'Senior Director, Supply Chain',
      department: 'Global Supply Chain',
      email: 'j.thompson@lmco.com',
      notes: 'Decision maker for F-35 supply chain. Very responsive.',
    },
    {
      name: 'David Park',
      title: 'VP Manufacturing Operations',
      department: 'Aeronautics',
      notes: 'Oversees Fort Worth F-35 production. Met at supplier conference.',
    },
    {
      name: 'Amanda Rodriguez',
      title: 'Commodity Manager',
      department: 'Procurement',
      email: 'a.rodriguez@lmco.com',
      notes: 'Handles rubber and polymer components. Good relationship.',
    },
  ],
  recentActivity: [
    {
      date: '2025-01-07',
      type: 'order',
      description: 'PO received for F-35 thermal management components',
      outcome: '$850K order, delivery Q2 2025',
    },
    {
      date: '2024-12-20',
      type: 'meeting',
      description: 'Annual supplier review at Fort Worth facility',
      outcome: 'Rated "Preferred Supplier", invited to bid on new programs',
    },
    {
      date: '2024-11-15',
      type: 'rfq',
      description: 'RFQ for new Texas facility equipment',
      outcome: 'Quote submitted, decision expected Q1 2025',
    },
  ],
  insights: [
    {
      id: generateId(),
      type: 'opportunity',
      title: '$800M Fort Worth Facility Expansion',
      description: 'Lockheed announced a major manufacturing expansion in Fort Worth, Texas. This creates significant opportunities for equipment, automation, and component suppliers. Lupton should engage early in the facility planning process.',
      confidence: 92,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['lockheed-martin'],
      actionItems: ['Contact facility planning team', 'Prepare automation solutions presentation'],
      createdAt: '2025-01-08T11:00:00Z',
    },
    {
      id: generateId(),
      type: 'trend',
      title: 'F-35 Production Rate Increase',
      description: 'Lockheed is targeting 156 F-35 deliveries in 2026, up from 148 in 2025. This sustained production increase drives component demand across the supply chain.',
      confidence: 88,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['lockheed-martin'],
      createdAt: '2025-01-05T09:00:00Z',
    },
    {
      id: generateId(),
      type: 'opportunity',
      title: 'Hypersonic Weapons Development',
      description: 'Lockheed is leading several hypersonic weapons programs. These advanced systems require specialized thermal management and precision components - areas where Lupton has strong capabilities.',
      confidence: 75,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['lockheed-martin'],
      createdAt: '2025-01-03T14:00:00Z',
    },
  ],
  articles: [
    {
      id: 'lmt-article-1',
      title: 'Lockheed Martin Announces $800M Texas Manufacturing Expansion',
      summary: 'Lockheed Martin will invest $800 million to expand its Fort Worth manufacturing facility, creating 2,000 new jobs. The expansion supports F-35 production increases and next-generation fighter development.',
      source: 'Reuters',
      sourceUrl: 'https://www.reuters.com',
      url: '/article/lmt-article-1',
      publishedAt: '2025-01-08T09:00:00Z',
      categories: ['expansion', 'capex'],
      sectors: ['military-aerospace'],
      companies: ['lockheed-martin'],
      sentiment: 'positive',
      relevanceScore: 96,
      isBreaking: true,
      readTime: 4,
    },
    {
      id: 'lmt-article-2',
      title: 'F-35 Program Hits 1,000 Aircraft Delivery Milestone',
      summary: 'Lockheed Martin delivered its 1,000th F-35 fighter jet, marking a major milestone for the program. The company expects to ramp production to 156 aircraft annually by 2026.',
      source: 'Aviation Week',
      sourceUrl: 'https://aviationweek.com',
      url: '/article/lmt-article-2',
      publishedAt: '2025-01-06T11:00:00Z',
      categories: ['product-launch'],
      sectors: ['military-aerospace'],
      companies: ['lockheed-martin'],
      sentiment: 'positive',
      relevanceScore: 89,
      isBreaking: false,
      readTime: 5,
    },
    {
      id: 'lmt-article-3',
      title: 'Lockheed Wins $2.1B Contract for Hypersonic Missiles',
      summary: 'The U.S. Army awarded Lockheed Martin a $2.1 billion contract for Long-Range Hypersonic Weapon (LRHW) production. This accelerates the hypersonic weapons program timeline.',
      source: 'Defense News',
      sourceUrl: 'https://www.defensenews.com',
      url: '/article/lmt-article-3',
      publishedAt: '2025-01-04T14:00:00Z',
      categories: ['government-contracts'],
      sectors: ['military-aerospace'],
      companies: ['lockheed-martin'],
      sentiment: 'positive',
      relevanceScore: 91,
      isBreaking: false,
      readTime: 4,
    },
  ],
  competitors: ['northrop-grumman', 'boeing', 'raytheon', 'general-dynamics'],
  swot: {
    strengths: [
      'F-35 program dominance',
      'Largest defense contractor globally',
      'Strong government relationships',
      'Diversified portfolio across air, space, and missiles',
    ],
    weaknesses: [
      'F-35 cost overruns and delays historically',
      'Heavy U.S. government dependence',
      'Complex supply chain management',
    ],
    opportunities: [
      'Fort Worth expansion creates supplier opportunities',
      'Hypersonic weapons development',
      'International F-35 sales growth',
      'Space systems expansion',
    ],
    threats: [
      'Budget sequestration risk',
      'Program cancellation risk',
      'Competitor next-gen fighter programs',
    ],
  },
  luptonRelationship: {
    accountSince: '2015',
    totalRevenue: '$6.8M',
    lastOrderDate: '2025-01-07',
    primaryProducts: ['Thermal management systems', 'Precision machined parts', 'Rubber seals'],
    growthPotential: 'high',
    relationshipHealth: 'excellent',
    notes: 'Rated "Preferred Supplier". Strong relationship with Fort Worth procurement. Texas expansion represents major growth opportunity.',
  },
};

// ============================================
// NVIDIA INTELLIGENCE
// ============================================
const nvidiaIntelligence: CompanyIntelligence = {
  companyId: 'nvidia',
  financials: {
    revenue: '$96.3B',
    revenueGrowth: '+122%',
    employees: '29,600',
    founded: '1993',
    fiscalYearEnd: 'January',
    lastEarningsDate: '2025-11-20',
    nextEarningsDate: '2026-02-26',
    quarterlyRevenue: [
      { quarter: 'Q3 FY26', amount: '$35.1B', yoy: '+94%' },
      { quarter: 'Q2 FY26', amount: '$30.0B', yoy: '+122%' },
      { quarter: 'Q1 FY26', amount: '$26.0B', yoy: '+262%' },
      { quarter: 'Q4 FY25', amount: '$22.1B', yoy: '+265%' },
    ],
  },
  stockData: {
    price: 875.50,
    change: 23.45,
    changePercent: 2.75,
    high52Week: 974.00,
    low52Week: 473.20,
    volume: '45.2M',
    avgVolume: '38.5M',
    marketCap: '$2.15T',
    peRatio: 65.2,
    dividend: '0.03%',
  },
  contacts: [
    {
      name: 'Kevin Liu',
      title: 'Director of Datacenter Operations',
      department: 'Infrastructure',
      notes: 'Oversees GPU cooling and thermal management. Key contact for cooling solutions.',
    },
    {
      name: 'Patricia Hernandez',
      title: 'VP Supply Chain',
      department: 'Global Operations',
      notes: 'Decision maker for component sourcing. Very focused on quality.',
    },
  ],
  recentActivity: [
    {
      date: '2025-01-06',
      type: 'meeting',
      description: 'Technical review of cooling solutions for H200 GPUs',
      outcome: 'Positive feedback, requested prototype samples',
    },
    {
      date: '2024-12-01',
      type: 'rfq',
      description: 'RFQ for thermal interface materials',
      outcome: 'Quote submitted, competing against 3 suppliers',
    },
  ],
  insights: [
    {
      id: generateId(),
      type: 'opportunity',
      title: '$2.5B Pentagon AI Contract',
      description: 'NVIDIA secured a landmark $2.5B Department of Defense contract for AI defense systems. This opens new opportunities for specialized cooling and enclosure solutions for military-grade GPU deployments.',
      confidence: 95,
      relatedSectors: ['datacenter', 'military-aerospace'],
      relatedCompanies: ['nvidia'],
      actionItems: ['Explore defense-grade cooling solutions', 'Contact NVIDIA defense division'],
      createdAt: '2025-01-09T08:00:00Z',
    },
    {
      id: generateId(),
      type: 'trend',
      title: 'Blackwell GPU Architecture Launch',
      description: 'NVIDIA\'s next-generation Blackwell GPUs will require advanced cooling solutions due to increased power consumption. This creates opportunities for thermal management suppliers.',
      confidence: 88,
      relatedSectors: ['datacenter'],
      relatedCompanies: ['nvidia'],
      createdAt: '2025-01-07T10:00:00Z',
    },
  ],
  articles: [
    {
      id: 'nvda-article-1',
      title: 'NVIDIA Wins $2.5B Pentagon Contract for AI Defense Systems',
      summary: 'The Department of Defense awarded NVIDIA a $2.5 billion contract to develop AI-powered defense systems. This marks NVIDIA\'s largest government contract and signals the military\'s commitment to AI integration.',
      source: 'Bloomberg',
      sourceUrl: 'https://www.bloomberg.com',
      url: '/article/nvda-article-1',
      publishedAt: '2025-01-09T06:00:00Z',
      categories: ['government-contracts'],
      sectors: ['datacenter', 'military-aerospace'],
      companies: ['nvidia'],
      sentiment: 'positive',
      relevanceScore: 98,
      isBreaking: true,
      readTime: 5,
    },
    {
      id: 'nvda-article-2',
      title: 'NVIDIA Announces Blackwell Ultra GPUs with 2x Performance',
      summary: 'NVIDIA unveiled the Blackwell Ultra GPU architecture at CES 2026, promising 2x performance improvement for AI workloads. The new chips will require advanced cooling solutions.',
      source: 'The Verge',
      sourceUrl: 'https://www.theverge.com',
      url: '/article/nvda-article-2',
      publishedAt: '2025-01-07T09:00:00Z',
      categories: ['product-launch'],
      sectors: ['datacenter'],
      companies: ['nvidia'],
      sentiment: 'positive',
      relevanceScore: 90,
      isBreaking: false,
      readTime: 6,
    },
  ],
  competitors: ['amd', 'intel', 'google-tpu', 'amazon-inferentia'],
  swot: {
    strengths: [
      'Dominant AI/ML GPU market position',
      'CUDA ecosystem lock-in',
      'Strong datacenter growth',
      'Leading-edge technology',
    ],
    weaknesses: [
      'High valuation expectations',
      'Supply constraints',
      'Customer concentration risk',
    ],
    opportunities: [
      'Defense AI applications',
      'Automotive autonomous driving',
      'Edge AI deployment',
      'Robotics integration',
    ],
    threats: [
      'AMD competition intensifying',
      'Custom AI chips from hyperscalers',
      'Geopolitical supply chain risks',
    ],
  },
  luptonRelationship: {
    accountSince: '2022',
    totalRevenue: '$1.8M',
    lastOrderDate: '2024-12-15',
    primaryProducts: ['Thermal interface materials', 'Cooling solutions', 'Custom enclosures'],
    growthPotential: 'high',
    relationshipHealth: 'good',
    notes: 'Growing relationship. Pentagon contract opens defense opportunities. Need to strengthen technical engagement.',
  },
};

// ============================================
// PACCAR INTELLIGENCE
// ============================================
const paccarIntelligence: CompanyIntelligence = {
  companyId: 'paccar',
  financials: {
    revenue: '$35.1B',
    revenueGrowth: '+8.2%',
    employees: '32,000',
    founded: '1905',
    fiscalYearEnd: 'December',
    lastEarningsDate: '2025-10-22',
    nextEarningsDate: '2026-01-28',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', amount: '$8.2B', yoy: '+9.1%' },
      { quarter: 'Q3 2025', amount: '$8.9B', yoy: '+7.8%' },
      { quarter: 'Q2 2025', amount: '$9.1B', yoy: '+8.5%' },
      { quarter: 'Q1 2025', amount: '$8.9B', yoy: '+7.2%' },
    ],
  },
  stockData: {
    price: 112.75,
    change: 4.25,
    changePercent: 3.92,
    high52Week: 118.50,
    low52Week: 85.20,
    volume: '2.8M',
    avgVolume: '2.2M',
    marketCap: '$58.9B',
    peRatio: 12.8,
    dividend: '1.15%',
  },
  contacts: [
    {
      name: 'Thomas Anderson',
      title: 'Director of Procurement',
      department: 'Supply Chain',
      email: 't.anderson@paccar.com',
      notes: 'Primary contact for Kenworth components. Very detail-oriented.',
    },
    {
      name: 'Michelle Park',
      title: 'EV Program Manager',
      department: 'Electric Vehicles',
      notes: 'Leading Peterbilt EV initiative. Key contact for EV components.',
    },
  ],
  recentActivity: [
    {
      date: '2025-01-08',
      type: 'order',
      description: 'Blanket PO for 2026 Kenworth components',
      outcome: '$2.1M annual contract signed',
    },
    {
      date: '2024-12-10',
      type: 'meeting',
      description: 'EV component requirements review',
      outcome: 'Identified 5 new product opportunities for electric trucks',
    },
  ],
  insights: [
    {
      id: generateId(),
      type: 'opportunity',
      title: 'Record Q4 Earnings Signal Strong Demand',
      description: 'PACCAR reported record Q4 revenue of $8.2B with raised 2026 guidance. Strong Kenworth and Peterbilt demand creates sustained component opportunities.',
      confidence: 90,
      relatedSectors: ['heavy-trucks'],
      relatedCompanies: ['paccar'],
      actionItems: ['Increase inventory for Kenworth programs', 'Propose volume pricing'],
      createdAt: '2025-01-08T12:00:00Z',
    },
    {
      id: generateId(),
      type: 'trend',
      title: 'Electric Truck Transition Accelerating',
      description: 'PACCAR is accelerating EV truck development with new Peterbilt and Kenworth electric models. This creates opportunities for battery thermal management and EV-specific components.',
      confidence: 82,
      relatedSectors: ['heavy-trucks'],
      relatedCompanies: ['paccar'],
      createdAt: '2025-01-05T14:00:00Z',
    },
  ],
  articles: [
    {
      id: 'pcar-article-1',
      title: 'PACCAR Reports Record Q4 Revenue, Raises 2026 Guidance',
      summary: 'PACCAR reported record Q4 revenue of $8.2 billion, beating analyst estimates. Strong demand for Kenworth and Peterbilt trucks drove results. The company raised full-year 2026 guidance.',
      source: 'Reuters',
      sourceUrl: 'https://www.reuters.com',
      url: '/article/pcar-article-1',
      publishedAt: '2025-01-08T16:00:00Z',
      categories: ['earnings'],
      sectors: ['heavy-trucks'],
      companies: ['paccar'],
      sentiment: 'positive',
      relevanceScore: 94,
      isBreaking: true,
      readTime: 4,
    },
    {
      id: 'pcar-article-2',
      title: 'Peterbilt Unveils Next-Generation Electric Truck Platform',
      summary: 'Peterbilt announced its next-generation electric truck platform with 500-mile range and fast charging capability. Production begins Q3 2026.',
      source: 'Transport Topics',
      sourceUrl: 'https://www.ttnews.com',
      url: '/article/pcar-article-2',
      publishedAt: '2025-01-05T10:00:00Z',
      categories: ['product-launch'],
      sectors: ['heavy-trucks'],
      companies: ['paccar'],
      sentiment: 'positive',
      relevanceScore: 87,
      isBreaking: false,
      readTime: 5,
    },
  ],
  competitors: ['daimler-truck', 'volvo-trucks', 'navistar', 'freightliner'],
  swot: {
    strengths: [
      'Premium brand positioning (Kenworth, Peterbilt)',
      'Strong dealer network',
      'Financial services arm',
      'Quality reputation',
    ],
    weaknesses: [
      'Smaller scale than Daimler',
      'Limited international presence',
      'EV transition investment needs',
    ],
    opportunities: [
      'Electric truck market growth',
      'Fleet modernization demand',
      'Autonomous trucking development',
      'Aftermarket parts growth',
    ],
    threats: [
      'Economic cycle sensitivity',
      'EV competition from startups',
      'Emission regulation costs',
    ],
  },
  luptonRelationship: {
    accountSince: '2012',
    totalRevenue: '$8.5M',
    lastOrderDate: '2025-01-08',
    primaryProducts: ['Rubber components', 'Seals', 'Thermal management', 'Precision parts'],
    growthPotential: 'high',
    relationshipHealth: 'excellent',
    notes: 'Long-standing strategic account. Strong relationships across Kenworth and Peterbilt. EV transition creates new opportunities.',
  },
};

// ============================================
// MEDTRONIC INTELLIGENCE
// ============================================
const medtronicIntelligence: CompanyIntelligence = {
  companyId: 'medtronic',
  financials: {
    revenue: '$32.4B',
    revenueGrowth: '+4.8%',
    employees: '95,000',
    founded: '1949',
    fiscalYearEnd: 'April',
    lastEarningsDate: '2025-11-19',
    nextEarningsDate: '2026-02-18',
    quarterlyRevenue: [
      { quarter: 'Q2 FY26', amount: '$8.4B', yoy: '+5.2%' },
      { quarter: 'Q1 FY26', amount: '$7.9B', yoy: '+4.5%' },
      { quarter: 'Q4 FY25', amount: '$8.6B', yoy: '+5.8%' },
      { quarter: 'Q3 FY25', amount: '$7.8B', yoy: '+4.1%' },
    ],
  },
  stockData: {
    price: 88.40,
    change: -2.14,
    changePercent: -2.37,
    high52Week: 95.50,
    low52Week: 75.80,
    volume: '8.5M',
    avgVolume: '6.2M',
    marketCap: '$116.8B',
    peRatio: 28.5,
    dividend: '3.12%',
  },
  contacts: [
    {
      name: 'Dr. James Wilson',
      title: 'VP R&D',
      department: 'Research & Development',
      notes: 'Key contact for new product development. PhD in biomedical engineering.',
    },
    {
      name: 'Linda Chen',
      title: 'Director of Supplier Quality',
      department: 'Quality Assurance',
      email: 'l.chen@medtronic.com',
      notes: 'Handles supplier certifications. Very thorough on quality requirements.',
    },
  ],
  recentActivity: [
    {
      date: '2025-01-06',
      type: 'call',
      description: 'Discussion about CEO transition impact on procurement',
      outcome: 'No immediate changes expected, monitoring situation',
    },
    {
      date: '2024-12-05',
      type: 'rfq',
      description: 'RFQ for precision components - new surgical robot',
      outcome: 'Quote submitted, awaiting technical review',
    },
  ],
  insights: [
    {
      id: generateId(),
      type: 'risk',
      title: 'CEO Transition Creates Uncertainty',
      description: 'CEO Geoffrey Martha is stepping down with CFO Karen Parkhill as interim chief. This leadership transition may impact strategic decisions and procurement priorities. Monitor for organizational changes.',
      confidence: 85,
      relatedSectors: ['medical-scientific'],
      relatedCompanies: ['medtronic'],
      actionItems: ['Schedule check-in with key contacts', 'Monitor for strategy changes'],
      createdAt: '2025-01-08T09:00:00Z',
    },
    {
      id: generateId(),
      type: 'opportunity',
      title: 'Surgical Robotics Expansion',
      description: 'Medtronic is expanding its Hugo surgical robot platform. This creates opportunities for precision components and assemblies in the growing surgical robotics market.',
      confidence: 78,
      relatedSectors: ['medical-scientific', 'robotics-automation'],
      relatedCompanies: ['medtronic'],
      createdAt: '2025-01-04T11:00:00Z',
    },
  ],
  articles: [
    {
      id: 'mdt-article-1',
      title: 'Medtronic CEO Geoffrey Martha to Step Down',
      summary: 'Medtronic announced that CEO Geoffrey Martha will step down, with CFO Karen Parkhill serving as interim chief. The company has begun a search for a permanent replacement.',
      source: 'Wall Street Journal',
      sourceUrl: 'https://www.wsj.com',
      url: '/article/mdt-article-1',
      publishedAt: '2025-01-08T07:00:00Z',
      categories: ['executive-moves'],
      sectors: ['medical-scientific'],
      companies: ['medtronic'],
      sentiment: 'negative',
      relevanceScore: 92,
      isBreaking: true,
      readTime: 4,
    },
    {
      id: 'mdt-article-2',
      title: 'Medtronic Expands Hugo Surgical Robot to 50 New Hospitals',
      summary: 'Medtronic announced partnerships with 50 new hospitals to deploy its Hugo surgical robot system, accelerating its competition with Intuitive Surgical.',
      source: 'MedTech Dive',
      sourceUrl: 'https://www.medtechdive.com',
      url: '/article/mdt-article-2',
      publishedAt: '2025-01-03T12:00:00Z',
      categories: ['expansion'],
      sectors: ['medical-scientific', 'robotics-automation'],
      companies: ['medtronic'],
      sentiment: 'positive',
      relevanceScore: 85,
      isBreaking: false,
      readTime: 5,
    },
  ],
  competitors: ['johnson-johnson', 'abbott', 'boston-scientific', 'stryker', 'intuitive-surgical'],
  swot: {
    strengths: [
      'Diversified medical device portfolio',
      'Strong R&D capabilities',
      'Global distribution network',
      'Regulatory expertise',
    ],
    weaknesses: [
      'CEO transition uncertainty',
      'Slower growth vs. competitors',
      'Complex organizational structure',
    ],
    opportunities: [
      'Surgical robotics growth',
      'Diabetes management technology',
      'Emerging markets expansion',
      'AI-powered diagnostics',
    ],
    threats: [
      'Leadership uncertainty',
      'Competitive pressure in robotics',
      'Regulatory challenges',
      'Pricing pressure from healthcare systems',
    ],
  },
  luptonRelationship: {
    accountSince: '2016',
    totalRevenue: '$3.2M',
    lastOrderDate: '2024-11-20',
    primaryProducts: ['Precision medical components', 'Rubber seals', 'Custom assemblies'],
    growthPotential: 'medium',
    relationshipHealth: 'good',
    notes: 'Solid account with growth potential in surgical robotics. CEO transition requires monitoring. Strong quality relationship.',
  },
};

// ============================================
// SPACEX INTELLIGENCE
// ============================================
const spacexIntelligence: CompanyIntelligence = {
  companyId: 'spacex',
  financials: {
    revenue: '$13.5B (est.)',
    revenueGrowth: '+35%',
    employees: '13,000',
    founded: '2002',
    fiscalYearEnd: 'December',
  },
  contacts: [
    {
      name: 'Brian Mitchell',
      title: 'Director of Supply Chain',
      department: 'Operations',
      notes: 'Key contact for Starship components. Very fast-paced environment.',
    },
    {
      name: 'Sarah Kim',
      title: 'Procurement Manager',
      department: 'Starlink Division',
      notes: 'Handles Starlink satellite components. High volume, cost-sensitive.',
    },
  ],
  recentActivity: [
    {
      date: '2025-01-05',
      type: 'rfq',
      description: 'RFQ for thermal protection components - Starship',
      outcome: 'Quote submitted, fast turnaround required',
    },
    {
      date: '2024-12-15',
      type: 'visit',
      description: 'Tour of Starbase facility in Boca Chica',
      outcome: 'Identified opportunities in thermal management and seals',
    },
  ],
  insights: [
    {
      id: generateId(),
      type: 'opportunity',
      title: 'Starship Production Ramp',
      description: 'SpaceX is ramping Starship production with plans for weekly launches by 2027. This creates massive demand for thermal protection, seals, and precision components.',
      confidence: 88,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['spacex'],
      actionItems: ['Increase capacity for SpaceX programs', 'Develop heat-resistant materials'],
      createdAt: '2025-01-07T10:00:00Z',
    },
    {
      id: generateId(),
      type: 'trend',
      title: 'Starlink Satellite Constellation Growth',
      description: 'Starlink is deploying 40+ satellites per week. This high-volume production creates opportunities for standardized components at scale.',
      confidence: 92,
      relatedSectors: ['military-aerospace'],
      relatedCompanies: ['spacex'],
      createdAt: '2025-01-04T14:00:00Z',
    },
  ],
  articles: [
    {
      id: 'spacex-article-1',
      title: 'SpaceX Achieves 100th Successful Falcon 9 Landing',
      summary: 'SpaceX marked its 100th successful Falcon 9 booster landing, demonstrating the maturity of its reusable rocket technology. The company now targets weekly Starship launches.',
      source: 'Space News',
      sourceUrl: 'https://spacenews.com',
      url: '/article/spacex-article-1',
      publishedAt: '2025-01-07T08:00:00Z',
      categories: ['product-launch'],
      sectors: ['military-aerospace'],
      companies: ['spacex'],
      sentiment: 'positive',
      relevanceScore: 88,
      isBreaking: false,
      readTime: 4,
    },
    {
      id: 'spacex-article-2',
      title: 'Starlink Reaches 5 Million Subscribers Globally',
      summary: 'SpaceX\'s Starlink satellite internet service has reached 5 million subscribers across 70 countries, generating an estimated $6 billion in annual revenue.',
      source: 'CNBC',
      sourceUrl: 'https://www.cnbc.com',
      url: '/article/spacex-article-2',
      publishedAt: '2025-01-05T11:00:00Z',
      categories: ['earnings'],
      sectors: ['military-aerospace'],
      companies: ['spacex'],
      sentiment: 'positive',
      relevanceScore: 85,
      isBreaking: false,
      readTime: 5,
    },
  ],
  competitors: ['blue-origin', 'rocket-lab', 'united-launch-alliance', 'relativity-space'],
  swot: {
    strengths: [
      'Reusable rocket technology leadership',
      'Vertical integration',
      'Rapid iteration capability',
      'Starlink revenue stream',
    ],
    weaknesses: [
      'Private company - limited financial transparency',
      'Dependence on Elon Musk',
      'Regulatory challenges',
    ],
    opportunities: [
      'Starship production ramp',
      'Government launch contracts',
      'Starlink global expansion',
      'Mars mission development',
    ],
    threats: [
      'Competition from Blue Origin',
      'Regulatory delays',
      'Technical setbacks',
    ],
  },
  luptonRelationship: {
    accountSince: '2021',
    totalRevenue: '$2.5M',
    lastOrderDate: '2024-12-20',
    primaryProducts: ['Thermal protection', 'Seals', 'Precision components'],
    growthPotential: 'high',
    relationshipHealth: 'good',
    notes: 'Fast-growing account with significant potential. Requires quick turnaround and flexibility. Starship program is key growth driver.',
  },
};

// ============================================
// EXPORT ALL INTELLIGENCE DATA
// ============================================
export const COMPANY_INTELLIGENCE: Record<string, CompanyIntelligence> = {
  'northrop-grumman': northropGrummanIntelligence,
  'lockheed-martin': lockheedMartinIntelligence,
  'nvidia': nvidiaIntelligence,
  'paccar': paccarIntelligence,
  'medtronic': medtronicIntelligence,
  'spacex': spacexIntelligence,
};

// Helper function to get intelligence for a company
export function getCompanyIntelligence(companyId: string): CompanyIntelligence | null {
  return COMPANY_INTELLIGENCE[companyId] || null;
}

// Helper to get all articles for a company
export function getCompanyArticles(companyId: string): NewsArticle[] {
  const intel = COMPANY_INTELLIGENCE[companyId];
  return intel?.articles || [];
}

// Helper to get all insights for a company
export function getCompanyInsights(companyId: string): AIInsight[] {
  const intel = COMPANY_INTELLIGENCE[companyId];
  return intel?.insights || [];
}
