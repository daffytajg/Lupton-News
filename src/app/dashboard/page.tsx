'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  Building2,
  Newspaper,
  Target,
  Zap,
  ChevronRight,
  Clock,
  Users,
  DollarSign,
  Globe,
  Sparkles,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

// Executive Dashboard Component
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [timeOfDay, setTimeOfDay] = useState<string>('');

  useEffect(() => {
    // Set time of day on client side to avoid hydration mismatch
    setTimeOfDay(getTimeOfDay());
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
    setIsLoading(false);
  };

  if (status === 'loading' || isLoading) {
    return <DashboardSkeleton />;
  }

  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Lupton Intelligence</h1>
                <p className="text-sm text-slate-400">Executive Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search news, companies..."
                  className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              {/* User */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{(user as any)?.role || 'Sales'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-semibold">{firstName[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Good {timeOfDay || 'day'}, {firstName}
          </h2>
          <p className="text-slate-400">
            Here's what's happening across your accounts and industries today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Breaking News"
            value="12"
            change="+3 from yesterday"
            trend="up"
            icon={<Zap className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Active Alerts"
            value="5"
            change="2 high priority"
            trend="neutral"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="amber"
          />
          <StatCard
            title="New Opportunities"
            value="8"
            change="+2 this week"
            trend="up"
            icon={<Target className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            title="Tracked Companies"
            value="38"
            change="All sectors"
            trend="neutral"
            icon={<Building2 className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range === '24h' ? 'Today' : range === '7d' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            {['all', 'datacenter', 'military-aerospace', 'heavy-trucks', 'medical-scientific', 'robotics-automation'].map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSector === sector
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sector === 'all' ? 'All Sectors' : formatSectorName(sector)}
              </button>
            ))}
          </div>
          
          <button
            onClick={loadDashboardData}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* AI Briefing */}
          <div className="col-span-12 lg:col-span-8">
            <AIBriefingCard />
          </div>

          {/* Priority Alerts */}
          <div className="col-span-12 lg:col-span-4">
            <PriorityAlertsCard />
          </div>

          {/* News Feed */}
          <div className="col-span-12 lg:col-span-8">
            <NewsFeedCard sector={selectedSector} />
          </div>

          {/* Insights Panel */}
          <div className="col-span-12 lg:col-span-4">
            <InsightsCard />
          </div>

          {/* Company Watchlist */}
          <div className="col-span-12 lg:col-span-6">
            <CompanyWatchlistCard />
          </div>

          {/* Opportunities */}
          <div className="col-span-12 lg:col-span-6">
            <OpportunitiesCard />
          </div>

          {/* Industry Trends */}
          <div className="col-span-12">
            <IndustryTrendsCard />
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, change, trend, icon, color }: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'purple';
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  };
  
  const iconColors = {
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-xl bg-white/10 ${iconColors[color]}`}>
          {icon}
        </div>
        {trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
        {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-400" />}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-xs text-slate-500 mt-2">{change}</p>
    </div>
  );
}

function AIBriefingCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-indigo-500/20">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Morning Briefing</h3>
          <p className="text-sm text-slate-400">Generated just now</p>
        </div>
      </div>
      
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-white">Key Developments:</strong> NVIDIA announced a major datacenter expansion 
          in Texas, signaling continued AI infrastructure growth. This directly impacts your datacenter accounts 
          and presents an opportunity for thermal management solutions.
        </p>
        <p className="text-slate-300 leading-relaxed mt-3">
          <strong className="text-white">Action Required:</strong> The Department of Defense released new 
          procurement guidelines affecting your military & aerospace principals. Review the updated requirements 
          and coordinate with Lockheed Martin and RTX contacts.
        </p>
        <p className="text-slate-300 leading-relaxed mt-3">
          <strong className="text-white">Market Watch:</strong> Heavy truck orders are up 12% month-over-month, 
          with PACCAR and Daimler both reporting strong demand. Consider proactive outreach to fleet operators 
          in your territory.
        </p>
      </div>
      
      <button className="mt-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
        <span className="text-sm font-medium">View Full Analysis</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function PriorityAlertsCard() {
  const alerts = [
    { type: 'urgent', title: 'Boeing C-Suite Change', company: 'Boeing', time: '2h ago' },
    { type: 'high', title: 'DoD Contract Award', company: 'Lockheed Martin', time: '4h ago' },
    { type: 'high', title: 'Earnings Beat', company: 'NVIDIA', time: '6h ago' },
    { type: 'medium', title: 'New Facility Announced', company: 'Tesla', time: '8h ago' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Priority Alerts</h3>
        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.type === 'urgent' ? 'bg-red-500' :
                alert.type === 'high' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{alert.title}</p>
                <p className="text-xs text-slate-400">{alert.company}</p>
              </div>
              <span className="text-xs text-slate-500">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full py-2 text-center text-sm text-slate-400 hover:text-white transition-colors">
        View All Alerts
      </button>
    </div>
  );
}

function NewsFeedCard({ sector }: { sector: string }) {
  const news = [
    {
      title: 'NVIDIA Announces $10B Datacenter Investment in Texas',
      source: 'Reuters',
      time: '1h ago',
      relevance: 95,
      sentiment: 'positive',
      companies: ['NVIDIA', 'AWS'],
      category: 'expansion',
    },
    {
      title: 'Pentagon Awards $2.5B Contract for Next-Gen Fighter Systems',
      source: 'Defense News',
      time: '3h ago',
      relevance: 88,
      sentiment: 'positive',
      companies: ['Lockheed Martin', 'RTX'],
      category: 'government-contracts',
    },
    {
      title: 'PACCAR Reports Record Q4 Truck Orders',
      source: 'Bloomberg',
      time: '5h ago',
      relevance: 82,
      sentiment: 'positive',
      companies: ['PACCAR'],
      category: 'quarterly-filings',
    },
    {
      title: 'FDA Approves New Surgical Robot from Intuitive',
      source: 'MedTech Dive',
      time: '6h ago',
      relevance: 79,
      sentiment: 'positive',
      companies: ['Intuitive Surgical'],
      category: 'product-launch',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Latest Intelligence</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {news.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-1 h-full rounded-full ${
                item.sentiment === 'positive' ? 'bg-emerald-500' :
                item.sentiment === 'negative' ? 'bg-red-500' : 'bg-slate-500'
              }`} />
              <div className="flex-1">
                <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-400">{item.source}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{item.time}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {item.relevance}% relevant
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {item.companies.map((company, j) => (
                    <span
                      key={j}
                      className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded-full"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full py-3 text-center text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors">
        Load More News
      </button>
    </div>
  );
}

function InsightsCard() {
  const insights = [
    { type: 'opportunity', title: 'New datacenter project in Phoenix presents cooling solution opportunity', confidence: 87 },
    { type: 'risk', title: 'Supply chain disruption may affect Q2 deliveries to aerospace clients', confidence: 72 },
    { type: 'trend', title: 'Electric truck adoption accelerating faster than projected', confidence: 91 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-purple-500/20">
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5">
            <div className="flex items-start gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                insight.type === 'opportunity' ? 'bg-emerald-500/20 text-emerald-400' :
                insight.type === 'risk' ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {insight.type}
              </span>
              <span className="text-xs text-slate-500">{insight.confidence}% confidence</span>
            </div>
            <p className="text-sm text-slate-300">{insight.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyWatchlistCard() {
  const companies = [
    { name: 'NVIDIA', ticker: 'NVDA', change: '+2.4%', sentiment: 'positive', alerts: 3 },
    { name: 'Lockheed Martin', ticker: 'LMT', change: '+0.8%', sentiment: 'positive', alerts: 2 },
    { name: 'PACCAR', ticker: 'PCAR', change: '-0.3%', sentiment: 'neutral', alerts: 1 },
    { name: 'Medtronic', ticker: 'MDT', change: '+1.2%', sentiment: 'positive', alerts: 0 },
    { name: 'ABB', ticker: 'ABB', change: '+0.5%', sentiment: 'neutral', alerts: 1 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Company Watchlist</h3>
        <button className="text-sm text-blue-400 hover:text-blue-300">Manage</button>
      </div>
      
      <div className="space-y-2">
        {companies.map((company, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{company.ticker.slice(0, 2)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{company.name}</p>
                <p className="text-xs text-slate-400">{company.ticker}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {company.alerts > 0 && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                  {company.alerts} alerts
                </span>
              )}
              <span className={`text-sm font-medium ${
                company.change.startsWith('+') ? 'text-emerald-400' :
                company.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'
              }`}>
                {company.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpportunitiesCard() {
  const opportunities = [
    {
      title: 'New Datacenter Build - Phoenix',
      company: 'Microsoft Azure',
      value: '$2.5M potential',
      priority: 'high',
      action: 'Schedule meeting with procurement',
    },
    {
      title: 'Fleet Expansion - J.B. Hunt',
      company: 'J.B. Hunt Transport',
      value: '$800K potential',
      priority: 'medium',
      action: 'Send updated product catalog',
    },
    {
      title: 'Lab Equipment Upgrade',
      company: 'Mayo Clinic',
      value: '$1.2M potential',
      priority: 'high',
      action: 'Prepare technical proposal',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-emerald-500/20">
          <Target className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Active Opportunities</h3>
      </div>
      
      <div className="space-y-3">
        {opportunities.map((opp, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-white">{opp.title}</h4>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                opp.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {opp.priority}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{opp.company}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-400 font-medium">{opp.value}</span>
              <span className="text-xs text-slate-500">{opp.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustryTrendsCard() {
  const sectors = [
    { name: 'Datacenter', trend: 'up', change: '+15%', articles: 24, sentiment: 0.72 },
    { name: 'Military & Aerospace', trend: 'up', change: '+8%', articles: 18, sentiment: 0.65 },
    { name: 'Heavy Trucks', trend: 'up', change: '+12%', articles: 12, sentiment: 0.58 },
    { name: 'Medical & Scientific', trend: 'neutral', change: '+3%', articles: 15, sentiment: 0.61 },
    { name: 'Robotics & Automation', trend: 'up', change: '+22%', articles: 21, sentiment: 0.78 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Industry Trends</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <PieChart className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {sectors.map((sector, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white">{sector.name}</h4>
              {sector.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <Activity className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className={`text-2xl font-bold mb-1 ${
              sector.trend === 'up' ? 'text-emerald-400' : 'text-slate-300'
            }`}>
              {sector.change}
            </p>
            <p className="text-xs text-slate-500">News activity this week</p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{sector.articles} articles</span>
                <span className={`${
                  sector.sentiment > 0.6 ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {Math.round(sector.sentiment * 100)}% positive
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">L</span>
        </div>
        <p className="text-slate-400">Loading your intelligence dashboard...</p>
      </div>
    </div>
  );
}

// Utility functions
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function formatSectorName(sector: string): string {
  return sector
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
