'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import {
  User,
  Bell,
  Mail,
  Building2,
  Shield,
  ChevronRight,
  Check,
  Save,
} from 'lucide-react';
import { SECTORS } from '@/data/sectors';
import { NEWS_CATEGORIES } from '@/data/sectors';
import { COMPANIES } from '@/data/companies';

type SettingsTab = 'profile' | 'notifications' | 'companies' | 'email' | 'security';

// Helper to get/set localStorage safely
const getStoredValue = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStoredValue = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

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
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    breakingNewsOnly: false,
    categories: ['government-contracts', 'mergers-acquisitions', 'c-suite', 'quarterly-filings'],
    sectors: ['datacenter', 'military-aerospace'],
    priority: 'high',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = getStoredValue('notificationSettings', null);
    if (stored) {
      setSettings(stored);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    setStoredValue('notificationSettings', settings);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

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

      {/* Test Notifications Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Your Notifications</h2>
        <p className="text-sm text-gray-500 mb-4">
          Send a test message to verify your notification settings are working correctly.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              // Use session email first, then fall back to localStorage
              const userEmail = session?.user?.email || getStoredValue('userProfile', { email: '' }).email;
              const userName = session?.user?.name || getStoredValue('userProfile', { fullName: '' }).fullName;
              if (!userEmail) {
                alert('Please log in or set your email in the Profile section first.');
                return;
              }
              try {
                const res = await fetch('/api/test-notifications', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'email', email: userEmail, name: userName }),
                });
                const data = await res.json();
                if (data.success) {
                  alert('Test email sent! Check your inbox.');
                } else {
                  alert('Failed to send: ' + (data.error || 'Unknown error'));
                }
              } catch (err) {
                alert('Failed to send test email');
              }
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
          >
            <Mail size={16} />
            Send Test Email
          </button>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        className={cn(
          "w-full md:w-auto px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2",
          saveStatus === 'saved' 
            ? "bg-green-600 text-white" 
            : "bg-lupton-blue text-white hover:bg-lupton-navy"
        )}
      >
        {saveStatus === 'saving' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <Check size={18} />
            Saved!
          </>
        ) : (
          <>
            <Save size={18} />
            Save Notification Settings
          </>
        )}
      </button>
    </div>
  );
}

function CompanySettings() {
  const [assignedCompanies, setAssignedCompanies] = useState([
    'nvidia', 'lockheed', 'paccar', 'medtronic', 'fanuc'
  ]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const stored = getStoredValue('assignedCompanies', null);
    if (stored) {
      setAssignedCompanies(stored);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    setStoredValue('assignedCompanies', assignedCompanies);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

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
                  onClick={() => setAssignedCompanies(assignedCompanies.filter((c) => c !== companyId))}
                  className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Add Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {COMPANIES.filter((c) => !assignedCompanies.includes(c.id))
              .slice(0, 20)
              .map((company) => (
                <button
                  key={company.id}
                  onClick={() => setAssignedCompanies([...assignedCompanies, company.id])}
                  className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-lupton-blue hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-500">{company.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm text-gray-700 truncate">{company.name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        className={cn(
          "w-full md:w-auto px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2",
          saveStatus === 'saved' 
            ? "bg-green-600 text-white" 
            : "bg-lupton-blue text-white hover:bg-lupton-navy"
        )}
      >
        {saveStatus === 'saving' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <Check size={18} />
            Saved!
          </>
        ) : (
          <>
            <Save size={18} />
            Save Company Settings
          </>
        )}
      </button>
    </div>
  );
}

function EmailDigestSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    frequency: 'daily',
    time: '07:00',
    includeAIInsights: true,
    includeStocks: true,
    includeSectorSummary: true,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const stored = getStoredValue('emailDigestSettings', null);
    if (stored) {
      setSettings(stored);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    setStoredValue('emailDigestSettings', settings);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Email Digest</h2>
            <p className="text-sm text-gray-500">
              Receive a summary of news and insights delivered to your inbox.
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.enabled}
            onChange={(v) => setSettings({ ...settings, enabled: v })}
          />
        </div>

        {settings.enabled && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Monday)</option>
                  <option value="both">Daily + Weekly Summary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time
                </label>
                <select
                  value={settings.time}
                  onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
                >
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Include in Digest</h3>
              <ToggleItem
                label="AI Insights"
                description="AI-generated predictions and analysis"
                enabled={settings.includeAIInsights}
                onChange={(v) => setSettings({ ...settings, includeAIInsights: v })}
              />
              <ToggleItem
                label="Sector Summary"
                description="Overview of news by industry sector"
                enabled={settings.includeSectorSummary}
                onChange={(v) => setSettings({ ...settings, includeSectorSummary: v })}
              />
              <ToggleItem
                label="Stock Movers"
                description="Significant stock movements for tracked companies"
                enabled={settings.includeStocks}
                onChange={(v) => setSettings({ ...settings, includeStocks: v })}
              />
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
            {settings.includeAIInsights && <p><strong>✨ AI Insights:</strong> 3 new predictions to review</p>}
            {settings.includeStocks && <p><strong>📈 Stock Movers:</strong> NVDA +2.75%, MDT -2.37%</p>}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saveStatus === 'saving'}
        className={cn(
          "w-full md:w-auto px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2",
          saveStatus === 'saved' 
            ? "bg-green-600 text-white" 
            : "bg-lupton-blue text-white hover:bg-lupton-navy"
        )}
      >
        {saveStatus === 'saving' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <Check size={18} />
            Saved!
          </>
        ) : (
          <>
            <Save size={18} />
            Save Email Settings
          </>
        )}
      </button>
    </div>
  );
}

function ProfileSettings() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    role: 'Sales',
    phone: '',
    title: '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load profile from session and localStorage on mount
  useEffect(() => {
    const stored = getStoredValue('userProfile', {
      fullName: session?.user?.name || '',
      email: session?.user?.email || '',
      role: 'Sales',
      phone: '',
      title: '',
    });
    // Override with session data if available
    if (session?.user) {
      stored.fullName = session.user.name || stored.fullName;
      stored.email = session.user.email || stored.email;
    }
    setProfile(stored);
    setStoredValue('userProfile', stored); // Sync localStorage with session
    setIsLoaded(true);
  }, [session]);

  const handleSave = () => {
    setSaveStatus('saving');
    setStoredValue('userProfile', profile);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              placeholder="e.g., Sales Manager"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Sales</option>
              <option>Viewer</option>
            </select>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={cn(
              "px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2",
              saveStatus === 'saved' 
                ? "bg-green-600 text-white" 
                : "bg-lupton-blue text-white hover:bg-lupton-navy"
            )}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check size={18} />
                Profile Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Update Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      setSaveStatus('error');
      setErrorMessage('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      setSaveStatus('error');
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    
    setSaveStatus('saving');
    // In a real app, this would call an API
    setTimeout(() => {
      setSaveStatus('saved');
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lupton-blue"
          />
        </div>
        
        {saveStatus === 'error' && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}
        
        <button 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={cn(
            "px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2",
            saveStatus === 'saved' 
              ? "bg-green-600 text-white" 
              : "bg-lupton-blue text-white hover:bg-lupton-navy"
          )}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check size={18} />
              Password Updated!
            </>
          ) : (
            <>
              <Save size={18} />
              Update Password
            </>
          )}
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
