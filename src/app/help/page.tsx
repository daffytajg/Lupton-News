'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Mail,
  BookOpen,
  Search,
  Bell,
  Settings,
  Users,
  Newspaper,
  ChevronRight,
} from 'lucide-react';
import Header from '@/components/Header';

const FAQ_ITEMS = [
  {
    question: 'How does the news filtering work?',
    answer: 'Our AI analyzes incoming news articles and filters out irrelevant content (charity events, sports sponsorships) while prioritizing business-critical news like M&A activity, government contracts, earnings, and executive changes.',
  },
  {
    question: 'How often is news updated?',
    answer: 'News is fetched from Google News RSS feeds and cached for 1 hour. You can manually refresh by clicking the refresh button on the dashboard.',
  },
  {
    question: 'How do daily email digests work?',
    answer: 'Each user receives a personalized daily digest based on their assigned accounts and tagged companies. The AI curates the most relevant articles and ensures no duplicates from the previous 3 days.',
  },
  {
    question: 'Can I follow additional companies?',
    answer: 'Yes! In addition to your assigned accounts, you can tag additional companies to follow. Go to Settings > Companies to manage your followed companies.',
  },
  {
    question: 'What do the relevance scores mean?',
    answer: 'Relevance scores (0-100) indicate how important an article is to Lupton Associates. Scores above 80 are high priority, 60-80 are medium, and below 60 are low priority.',
  },
  {
    question: 'How does the AI Assistant work?',
    answer: 'The AI Assistant can answer questions about your customers, analyze news trends, and provide insights. Click the "AI Assistant" button in the bottom right to start a conversation.',
  },
];

const QUICK_LINKS = [
  { title: 'Dashboard', href: '/', icon: Newspaper, description: 'View latest news and insights' },
  { title: 'Companies', href: '/companies', icon: Users, description: 'Browse all tracked companies' },
  { title: 'Alerts', href: '/alerts', icon: Bell, description: 'Configure notifications' },
  { title: 'Settings', href: '/settings', icon: Settings, description: 'Manage preferences' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold">Help & Support</h1>
              <p className="text-blue-100 mt-1">
                Find answers to common questions and learn how to use Lupton News
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {FAQ_ITEMS.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Getting Started
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-400">
                  <li>
                    <strong className="text-gray-900 dark:text-white">View Your Dashboard</strong> - The home page shows the latest news relevant to your assigned accounts and followed companies.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Explore by Sector</strong> - Use the sidebar to filter news by industry sector (Datacenter, Heavy Trucks, Military & Aerospace, etc.).
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Check Company Pages</strong> - Click on any company to see all related news and details.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Configure Alerts</strong> - Set up notifications for breaking news and specific companies.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">Use the AI Assistant</strong> - Ask questions about your customers or industry trends.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                {QUICK_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <link.icon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {link.title}
                      </p>
                      <p className="text-xs text-gray-500">{link.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Need More Help?
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@luptons.com"
                  className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm font-medium">Email Support</span>
                </a>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Chat with AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Version Info */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>Lupton News v1.0.0</p>
              <p className="mt-1">Built by Joe Guadagnino</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
