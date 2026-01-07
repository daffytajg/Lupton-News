'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import {
  User,
  Bell,
  Mail,
  Building2,
  Shield,
  Palette,
  Globe,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { SECTORS } from '@/data/sectors';
import { NEWS_CATEGORIES } from '@/data/sectors';
import { COMPANIES } from '@/data/companies';

type SettingsTab = 'profile' | 'notifications' | 'companies' | 'email' | 'security';

export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'companies' as const, label: 'My Companies', icon: <Building2 size={18} /> },
    { id: 'email' as const, label: 'Email Digest', icon: <Mail size={18} /> },
    { id: 'security' as const, label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 lg:ml-72 p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">
              Manage your account preferences and notification settings.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="bg-white rounded-xl border border-gray-100 p-2 h-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-lupton-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                  <ChevronRight size={16} className="ml-auto opacity-50" />
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'companies' && <CompanySettings />}
              {activeTab === 'email' && <EmailDigestSettings />}
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'security' && <SecuritySettings />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    breakingNewsOnly: false,
    categories: ['government-contracts', 'mergers-acquisitions', 'c-suite', 'quarterly-filings'],
    sectors: ['datacenter', 'military-aerospace'],
    priority: 'high', // critical, high, medium, all
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h2>
        <div className="space-y-4">
          <ToggleItem
            label="Email Notifications"
            description="Receive alerts via email"
            enabled={settings.emailEnabled}
            onChange={(v) => setSettings({ ...settings, emailEnabled: v })}
          />
          <ToggleItem
            label="Push Notifications"
            description="Browser push notifications for breaking news"
            enabled={settings.pushEnabled}
            onChange={(v) => setSettings({ ...settings, pushEnabled: v })}
          />
          <ToggleItem
            label="SMS Alerts"
            description="Text messages for critical alerts only"
            enabled={settings.smsEnabled}
            onChange={(v) => setSettings({ ...settings, smsEnabled: v })}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Priority</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose the minimum priority level for alerts you want to receive.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['critical', 'high', 'medium', 'all'].map((level) => (
            <button
              key={level}
              onClick={() => setSettings({ ...settings, priority: level })}
              className={cn(
                'p-3 rounded-lg border text-sm font-medium capitalize transition-colors',
                settings.priority === level
                  ? 'bg-lupton-blue text-white border-lupton-blue'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-lupton-blue'
              )}
            >
              {level === 'all' ? 'All Alerts' : `${level} & Above`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">News Categories</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select which types of news you want to be alerted about.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {NEWS_CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                settings.categories.includes(cat.id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="checkbox"
                checked={settings.categories.includes(cat.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSettings({ ...settings, categories: [...settings.categories, cat.id] });
                  } else {
                    setSettings({
                      ...settings,
                      categories: settings.categories.filter((c) => c !== cat.id),
                    });
                  }
                }}
                className="sr-only"
              />
              <span className="text-lg">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              {settings.categories.includes(cat.id) && (
                <Check size={16} className="ml-auto text-blue-600" />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sector Alerts</h2>
        <p className="text-sm text-gray-500 mb-4">
          Get alerts for high-level industry news in these sectors.
        </p>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((sector) => (
            <button
              key={sector.id}
              onClick={() => {
                if (settings.sectors.includes(sector.id)) {
                  setSettings({
                    ...settings,
                    sectors: settings.sectors.filter((s) => s !== sector.id),
                  });
                } else {
                  setSettings({ ...settings, sectors: [...settings.sectors, sector.id] });
                }
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                settings.sectors.includes(sector.id)
                  ? `bg-gradient-to-r ${sector.gradient} text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <span>{sector.icon}</span>
              {sector.shortName}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full md:w-auto px-6 py-3 bg-lupton-blue text-white font-medium rounded-lg hover:bg-lupton-navy transition-colors">
        Save Notification Settings
      </button>
    </div>
  );
}

function CompanySettings() {
  const [assignedCompanies, setAssignedCompanies] = useState([
    'nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">My Assigned Companies</h2>
        <p className="text-sm text-gray-500 mb-4">
          You will receive priority alerts for news about these companies. These are typically your assigned accounts.
        </p>

        <div className="space-y-2 mb-6">
          {assignedCompanies.map((companyId) => {
            const company = COMPANIES.find((c) => c.id === companyId);
            if (!company) return null;
            return (
              <div
                key={company.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <span className="font-bold text-gray-600">{company.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500">
                      {company.sectors.join(', ')} • {company.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setAssignedCompanies(assignedCompanies.filter((c) => c !== companyId))
                  }
                  className="p-1 hover:bg-white rounded"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            );
          })}
        </div>

        <h3 className="font-medium text-gray-900 mb-3">Add Companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {COMPANIES.filter((c) => !assignedCompanies.includes(c.id)).map((company) => (
            <button
              key={company.id}
              onClick={() => setAssignedCompanies([...assignedCompanies, company.id])}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-lupton-blue hover:bg-blue-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="font-bold text-gray-500 text-sm">{company.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{company.name}</p>
                <p className="text-xs text-gray-500">{company.ticker || company.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button className="w-full md:w-auto px-6 py-3 bg-lupton-blue text-white font-medium rounded-lg hover:bg-lupton-navy transition-colors">
        Save Company Assignments
      </button>
    </div>
  );
}

function EmailDigestSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    frequency: 'daily',
    time: '08:00',
    includeSectors: true,
    includeCompanies: true,
    includeAI: true,
    includeStocks: true,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daily Email Digest</h2>
            <p className="text-sm text-gray-500 mt-1">
              Receive a comprehensive summary of all news and insights.
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.enabled}
            onChange={(v) => setSettings({ ...settings, enabled: v })}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Frequency
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['daily', 'twice-daily', 'weekly'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setSettings({ ...settings, frequency: freq })}
                    className={cn(
                      'p-3 rounded-lg border text-sm font-medium capitalize transition-colors',
                      settings.frequency === freq
                        ? 'bg-lupton-blue text-white border-lupton-blue'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-lupton-blue'
                    )}
                  >
                    {freq.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time
              </label>
              <select
                value={settings.time}
                onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
              >
                <option value="06:00">6:00 AM</option>
                <option value="07:00">7:00 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Include in Digest
              </label>
              <div className="space-y-3">
                <ToggleItem
                  label="Sector Highlights"
                  description="Top news from each of your followed sectors"
                  enabled={settings.includeSectors}
                  onChange={(v) => setSettings({ ...settings, includeSectors: v })}
                />
                <ToggleItem
                  label="Company Updates"
                  description="News about your assigned companies"
                  enabled={settings.includeCompanies}
                  onChange={(v) => setSettings({ ...settings, includeCompanies: v })}
                />
                <ToggleItem
                  label="AI Predictions & Insights"
                  description="AI-generated market predictions and trends"
                  enabled={settings.includeAI}
                  onChange={(v) => setSettings({ ...settings, includeAI: v })}
                />
                <ToggleItem
                  label="Stock Movers"
                  description="Significant stock movements for tracked companies"
                  enabled={settings.includeStocks}
                  onChange={(v) => setSettings({ ...settings, includeStocks: v })}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-medium text-gray-900 mb-4">Email Preview</h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-navy flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Lupton News Daily Digest</h4>
                <p className="text-sm text-gray-500">January 7, 2026</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>📰 Top Stories:</strong> 15 new articles across your sectors</p>
            <p><strong>🏢 Company Updates:</strong> 5 updates on your assigned companies</p>
            <p><strong>✨ AI Insights:</strong> 3 new predictions to review</p>
            <p><strong>📈 Stock Movers:</strong> NVDA +2.75%, MDT -2.37%</p>
          </div>
        </div>
      </div>

      <button className="w-full md:w-auto px-6 py-3 bg-lupton-blue text-white font-medium rounded-lg hover:bg-lupton-navy transition-colors">
        Save Email Settings
      </button>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            defaultValue="Alan Lupton II"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            defaultValue="alan@luptons.com"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue">
            <option>Admin</option>
            <option>Manager</option>
            <option>Sales</option>
            <option>Viewer</option>
          </select>
        </div>
        <button className="px-6 py-2 bg-lupton-blue text-white font-medium rounded-lg hover:bg-lupton-navy transition-colors">
          Update Profile
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <button className="px-6 py-2 bg-lupton-blue text-white font-medium rounded-lg hover:bg-lupton-navy transition-colors">
          Change Password
        </button>
      </div>
    </div>
  );
}

function ToggleItem({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors',
        enabled ? 'bg-lupton-blue' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
          enabled ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  );
}
