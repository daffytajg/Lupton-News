import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sector, NewsCategory, User, NotificationPreferences } from '@/types';

interface UserState {
  // User info
  user: User | null;
  setUser: (user: User | null) => void;

  // Followed companies
  followedCompanies: string[];
  toggleFollowCompany: (companyId: string) => void;
  isFollowingCompany: (companyId: string) => boolean;

  // Followed sectors
  followedSectors: Sector[];
  toggleFollowSector: (sector: Sector) => void;
  isFollowingSector: (sector: Sector) => boolean;

  // Notification preferences
  notificationCategories: NewsCategory[];
  toggleNotificationCategory: (category: NewsCategory) => void;
  isNotificationCategoryEnabled: (category: NewsCategory) => boolean;

  // Alert priority threshold
  alertPriorityThreshold: 'critical' | 'high' | 'medium' | 'all';
  setAlertPriorityThreshold: (threshold: 'critical' | 'high' | 'medium' | 'all') => void;

  // Email digest settings
  emailDigestEnabled: boolean;
  emailDigestFrequency: 'daily' | 'twice-daily' | 'weekly';
  emailDigestTime: string;
  setEmailDigestEnabled: (enabled: boolean) => void;
  setEmailDigestFrequency: (frequency: 'daily' | 'twice-daily' | 'weekly') => void;
  setEmailDigestTime: (time: string) => void;

  // Read articles
  readArticles: string[];
  markArticleAsRead: (articleId: string) => void;
  isArticleRead: (articleId: string) => boolean;

  // Saved articles
  savedArticles: string[];
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;

  // Dismissed insights
  dismissedInsights: string[];
  dismissInsight: (insightId: string) => void;
  isInsightDismissed: (insightId: string) => boolean;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      // User
      user: {
        id: 'user-1',
        name: 'Alan Lupton II',
        email: 'alan@luptons.com',
        role: 'admin',
        assignedCompanies: ['nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'],
        assignedSectors: ['datacenter', 'military-aerospace'],
        notifications: {
          email: {
            enabled: true,
            frequency: 'daily',
            dailySummaryTime: '08:00',
            categories: ['government-contracts', 'mergers-acquisitions', 'c-suite', 'quarterly-filings'],
          },
          push: {
            enabled: true,
            breakingOnly: false,
            categories: ['government-contracts', 'mergers-acquisitions', 'c-suite'],
          },
        },
      },
      setUser: (user) => set({ user }),

      // Followed companies
      followedCompanies: ['nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'],
      toggleFollowCompany: (companyId) =>
        set((state) => ({
          followedCompanies: state.followedCompanies.includes(companyId)
            ? state.followedCompanies.filter((id) => id !== companyId)
            : [...state.followedCompanies, companyId],
        })),
      isFollowingCompany: (companyId) => get().followedCompanies.includes(companyId),

      // Followed sectors
      followedSectors: ['datacenter', 'military-aerospace'] as Sector[],
      toggleFollowSector: (sector) =>
        set((state) => ({
          followedSectors: state.followedSectors.includes(sector)
            ? state.followedSectors.filter((s) => s !== sector)
            : [...state.followedSectors, sector],
        })),
      isFollowingSector: (sector) => get().followedSectors.includes(sector),

      // Notification categories
      notificationCategories: [
        'government-contracts',
        'mergers-acquisitions',
        'c-suite',
        'quarterly-filings',
        'new-construction',
        'permits',
      ] as NewsCategory[],
      toggleNotificationCategory: (category) =>
        set((state) => ({
          notificationCategories: state.notificationCategories.includes(category)
            ? state.notificationCategories.filter((c) => c !== category)
            : [...state.notificationCategories, category],
        })),
      isNotificationCategoryEnabled: (category) => get().notificationCategories.includes(category),

      // Alert priority
      alertPriorityThreshold: 'high',
      setAlertPriorityThreshold: (threshold) => set({ alertPriorityThreshold: threshold }),

      // Email digest
      emailDigestEnabled: true,
      emailDigestFrequency: 'daily',
      emailDigestTime: '08:00',
      setEmailDigestEnabled: (enabled) => set({ emailDigestEnabled: enabled }),
      setEmailDigestFrequency: (frequency) => set({ emailDigestFrequency: frequency }),
      setEmailDigestTime: (time) => set({ emailDigestTime: time }),

      // Read articles
      readArticles: [],
      markArticleAsRead: (articleId) =>
        set((state) => ({
          readArticles: state.readArticles.includes(articleId)
            ? state.readArticles
            : [...state.readArticles, articleId],
        })),
      isArticleRead: (articleId) => get().readArticles.includes(articleId),

      // Saved articles
      savedArticles: [],
      toggleSaveArticle: (articleId) =>
        set((state) => ({
          savedArticles: state.savedArticles.includes(articleId)
            ? state.savedArticles.filter((id) => id !== articleId)
            : [...state.savedArticles, articleId],
        })),
      isArticleSaved: (articleId) => get().savedArticles.includes(articleId),

      // Dismissed insights
      dismissedInsights: [],
      dismissInsight: (insightId) =>
        set((state) => ({
          dismissedInsights: [...state.dismissedInsights, insightId],
        })),
      isInsightDismissed: (insightId) => get().dismissedInsights.includes(insightId),
    }),
    {
      name: 'lupton-news-storage',
      partialize: (state) => ({
        followedCompanies: state.followedCompanies,
        followedSectors: state.followedSectors,
        notificationCategories: state.notificationCategories,
        alertPriorityThreshold: state.alertPriorityThreshold,
        emailDigestEnabled: state.emailDigestEnabled,
        emailDigestFrequency: state.emailDigestFrequency,
        emailDigestTime: state.emailDigestTime,
        readArticles: state.readArticles,
        savedArticles: state.savedArticles,
        dismissedInsights: state.dismissedInsights,
      }),
    }
  )
);

// Selectors for better performance
export const selectFollowedCompanies = (state: UserState) => state.followedCompanies;
export const selectFollowedSectors = (state: UserState) => state.followedSectors;
export const selectUser = (state: UserState) => state.user;
