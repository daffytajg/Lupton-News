// User Preferences and Email Tracking for Lupton News
// Tracks user accounts, tagged companies, and sent articles to prevent duplicates

import { Sector } from '@/types';
import { SALES_TEAMS } from '@/data/companies';

// User preference types
export interface UserPreferences {
  id: string;
  email: string;
  name: string;
  role: 'sales' | 'manager' | 'executive';
  teamId?: string; // Links to SALES_TEAMS

  // Account assignments (auto-populated from team, can be customized)
  assignedCustomers: string[]; // Company IDs they're responsible for

  // User-tagged companies (additional companies they want to follow)
  taggedCompanies: string[];

  // Sector preferences
  followedSectors: Sector[];

  // Email preferences
  emailPreferences: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'realtime';
    deliveryTime: string; // e.g., "07:00" for 7 AM
    timezone: string; // e.g., "America/New_York"
    includeAISummary: boolean;
    includeStockData: boolean;
    minRelevanceScore: number; // Only include articles above this score
    breakingNewsAlerts: boolean;
  };

  // Tracking
  createdAt: string;
  updatedAt: string;
}

// Sent article tracking to prevent duplicates
export interface SentArticleRecord {
  userId: string;
  articleId: string;
  articleUrl: string; // URL hash for deduplication
  sentAt: string;
  digestDate: string; // YYYY-MM-DD format
}

// In-memory stores (in production, use a database like PostgreSQL, MongoDB, or Redis)
let userPreferencesStore: Map<string, UserPreferences> = new Map();
let sentArticlesStore: Map<string, SentArticleRecord[]> = new Map(); // keyed by userId

// Initialize default users based on sales teams
export function initializeDefaultUsers(): void {
  const defaultUsers: UserPreferences[] = [
    {
      id: 'user-john-walker',
      email: 'jwalker@luptons.com',
      name: 'John Walker',
      role: 'sales',
      teamId: 'team-john-walker',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-john-walker')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['heavy-trucks', 'robotics-automation'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-jennings-harley',
      email: 'jharley@luptons.com',
      name: 'Jennings Harley',
      role: 'sales',
      teamId: 'team-jennings-harley',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-jennings-harley')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['datacenter'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-mike-laney',
      email: 'mlaney@luptons.com',
      name: 'Mike Laney',
      role: 'sales',
      teamId: 'team-mike-laney',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-mike-laney')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['heavy-trucks', 'medical-scientific'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-chris-dunham',
      email: 'cdunham@luptons.com',
      name: 'Chris Dunham',
      role: 'sales',
      teamId: 'team-chris-dunham',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-chris-dunham')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['military-aerospace'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-greg-johnson',
      email: 'gjohnson@luptons.com',
      name: 'Greg Johnson',
      role: 'sales',
      teamId: 'team-greg-johnson',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-greg-johnson')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['military-aerospace'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-greg-hebert',
      email: 'ghebert@luptons.com',
      name: 'Greg Hebert',
      role: 'sales',
      teamId: 'team-greg-hebert',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-greg-hebert')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['military-aerospace'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-cass-roberts',
      email: 'croberts@luptons.com',
      name: 'Cass Roberts',
      role: 'sales',
      teamId: 'team-cass-roberts',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-cass-roberts')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['heavy-trucks', 'datacenter'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-cj-roberts',
      email: 'cjroberts@luptons.com',
      name: 'CJ Roberts',
      role: 'sales',
      teamId: 'team-cj-roberts',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-cj-roberts')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['medical-scientific'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-tom-osso',
      email: 'tosso@luptons.com',
      name: 'Tom Osso',
      role: 'sales',
      teamId: 'team-tom-osso',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-tom-osso')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['robotics-automation', 'datacenter'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-luke-hinkle',
      email: 'lhinkle@luptons.com',
      name: 'Luke Hinkle',
      role: 'sales',
      teamId: 'team-luke-hinkle',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-luke-hinkle')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['robotics-automation', 'military-aerospace'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-bobby-ramirez',
      email: 'bramirez@luptons.com',
      name: 'Bobby Ramirez',
      role: 'sales',
      teamId: 'team-bobby-ramirez',
      assignedCustomers: SALES_TEAMS.find(t => t.id === 'team-bobby-ramirez')?.assignedCustomers || [],
      taggedCompanies: [],
      followedSectors: ['robotics-automation'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '07:00',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 50,
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Executive/Manager user who sees everything
    {
      id: 'user-executive',
      email: 'alan@luptons.com',
      name: 'Alan Lupton',
      role: 'executive',
      assignedCustomers: [], // Executives see all companies
      taggedCompanies: [],
      followedSectors: ['datacenter', 'heavy-trucks', 'military-aerospace', 'robotics-automation', 'medical-scientific'],
      emailPreferences: {
        enabled: true,
        frequency: 'daily',
        deliveryTime: '06:30',
        timezone: 'America/New_York',
        includeAISummary: true,
        includeStockData: true,
        minRelevanceScore: 60, // Higher threshold for executives
        breakingNewsAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  defaultUsers.forEach(user => {
    userPreferencesStore.set(user.id, user);
  });
}

// Initialize on module load
initializeDefaultUsers();

// ===========================================
// User Preferences CRUD Operations
// ===========================================

export function getAllUsers(): UserPreferences[] {
  return Array.from(userPreferencesStore.values());
}

export function getUserById(userId: string): UserPreferences | undefined {
  return userPreferencesStore.get(userId);
}

export function getUserByEmail(email: string): UserPreferences | undefined {
  return Array.from(userPreferencesStore.values()).find(u => u.email === email);
}

export function getUsersWithEmailEnabled(): UserPreferences[] {
  return Array.from(userPreferencesStore.values()).filter(u => u.emailPreferences.enabled);
}

export function updateUserPreferences(userId: string, updates: Partial<UserPreferences>): UserPreferences | null {
  const user = userPreferencesStore.get(userId);
  if (!user) return null;

  const updated = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  userPreferencesStore.set(userId, updated);
  return updated;
}

export function addTaggedCompany(userId: string, companyId: string): boolean {
  const user = userPreferencesStore.get(userId);
  if (!user) return false;

  if (!user.taggedCompanies.includes(companyId)) {
    user.taggedCompanies.push(companyId);
    user.updatedAt = new Date().toISOString();
    userPreferencesStore.set(userId, user);
  }
  return true;
}

export function removeTaggedCompany(userId: string, companyId: string): boolean {
  const user = userPreferencesStore.get(userId);
  if (!user) return false;

  user.taggedCompanies = user.taggedCompanies.filter(c => c !== companyId);
  user.updatedAt = new Date().toISOString();
  userPreferencesStore.set(userId, user);
  return true;
}

// Get all companies a user should receive news about
export function getUserRelevantCompanies(userId: string): string[] {
  const user = userPreferencesStore.get(userId);
  if (!user) return [];

  // Combine assigned customers and tagged companies (deduplicated)
  const companies = new Set([
    ...user.assignedCustomers,
    ...user.taggedCompanies,
  ]);

  return Array.from(companies);
}

// ===========================================
// Article Deduplication
// ===========================================

// Generate a unique hash for an article (using URL)
function getArticleHash(articleUrl: string): string {
  // Simple hash for deduplication - in production, use a proper hash function
  let hash = 0;
  for (let i = 0; i < articleUrl.length; i++) {
    const char = articleUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Record that an article was sent to a user
export function recordSentArticle(userId: string, articleId: string, articleUrl: string): void {
  const today = new Date().toISOString().split('T')[0];

  if (!sentArticlesStore.has(userId)) {
    sentArticlesStore.set(userId, []);
  }

  const records = sentArticlesStore.get(userId)!;
  records.push({
    userId,
    articleId,
    articleUrl: getArticleHash(articleUrl),
    sentAt: new Date().toISOString(),
    digestDate: today,
  });

  // Keep only last 7 days of records to prevent memory bloat
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoff = sevenDaysAgo.toISOString().split('T')[0];

  sentArticlesStore.set(
    userId,
    records.filter(r => r.digestDate >= cutoff)
  );
}

// Check if an article was already sent to a user (within last N days)
export function wasArticleSent(userId: string, articleUrl: string, withinDays: number = 3): boolean {
  const records = sentArticlesStore.get(userId);
  if (!records || records.length === 0) return false;

  const articleHash = getArticleHash(articleUrl);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - withinDays);
  const cutoff = cutoffDate.toISOString().split('T')[0];

  return records.some(r =>
    r.articleUrl === articleHash && r.digestDate >= cutoff
  );
}

// Get articles that haven't been sent to a user yet
export function filterUnsentArticles<T extends { id: string; url: string }>(
  userId: string,
  articles: T[],
  withinDays: number = 3
): T[] {
  return articles.filter(article => !wasArticleSent(userId, article.url, withinDays));
}

// Record multiple articles as sent
export function recordSentArticles(userId: string, articles: Array<{ id: string; url: string }>): void {
  articles.forEach(article => {
    recordSentArticle(userId, article.id, article.url);
  });
}

// Get sent article stats for a user
export function getSentArticleStats(userId: string): { totalSent: number; lastDigestDate: string | null } {
  const records = sentArticlesStore.get(userId);
  if (!records || records.length === 0) {
    return { totalSent: 0, lastDigestDate: null };
  }

  const sortedRecords = [...records].sort((a, b) =>
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  return {
    totalSent: records.length,
    lastDigestDate: sortedRecords[0]?.digestDate || null,
  };
}

// Clear sent article history (for testing)
export function clearSentArticleHistory(userId?: string): void {
  if (userId) {
    sentArticlesStore.delete(userId);
  } else {
    sentArticlesStore.clear();
  }
}
