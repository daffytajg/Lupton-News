'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SECTORS } from '@/data/sectors';
import {
  Plus,
  Trash2,
  Search,
  Building2,
  Factory,
  Users,
  Briefcase,
  X,
  Save,
  AlertCircle,
  Check,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Company {
  id: string;
  externalId: string;
  name: string;
  shortName?: string;
  type: string;
  website?: string;
  logo?: string;
  stockTicker?: string;
  stockExchange?: string;
  headquarters?: string;
  description?: string;
  searchIdentifiers: string[];
  sectors: string[];
  keyContacts: { name: string; title: string; email?: string }[];
  assignmentId?: string;
  role?: string;
  isPrimary?: boolean;
  isInUserList?: boolean;
}

const COMPANY_TYPES = [
  { value: 'MANUFACTURER', label: 'Manufacturer / Principal', icon: Factory, color: 'purple' },
  { value: 'CUSTOMER', label: 'Customer / OEM', icon: Building2, color: 'green' },
  { value: 'PRINCIPAL', label: 'Principal', icon: Briefcase, color: 'purple' },
  { value: 'OEM', label: 'OEM', icon: Users, color: 'blue' },
];

export default function MyCompaniesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // New company form
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    type: 'CUSTOMER',
    website: '',
    logo: '',
    stockTicker: '',
    headquarters: '',
    description: '',
    sectors: [] as string[],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/my-companies');
    }
  }, [status, router]);

  // Load user's companies
  useEffect(() => {
    if (session?.user) {
      fetchCompanies();
    }
  }, [session]);

  // Filter companies
  useEffect(() => {
    let filtered = companies;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.shortName?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }

    if (sectorFilter) {
      filtered = filtered.filter((c) => c.sectors.includes(sectorFilter));
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, typeFilter, sectorFilter]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/companies');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load companies');
      }
      
      if (data.companies) {
        setCompanies(data.companies);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCompanies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.companies) {
        setSearchResults(data.companies);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const addExistingCompany = async (companyId: string) => {
    try {
      const response = await fetch('/api/user/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add company');
      }

      setSuccess('Company added to your list!');
      setIsAddModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchCompanies();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const addNewCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/user/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create company');
      }

      setSuccess('Company created and added to your list!');
      setIsAddModalOpen(false);
      setShowNewCompanyForm(false);
      setFormData({
        name: '',
        shortName: '',
        type: 'CUSTOMER',
        website: '',
        logo: '',
        stockTicker: '',
        headquarters: '',
        description: '',
        sectors: [],
      });
      fetchCompanies();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeCompany = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/user/companies?assignmentId=${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove company');
      }

      setSuccess('Company removed from your list');
      setDeleteConfirm(null);
      fetchCompanies();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleSector = (sectorId: string) => {
    setFormData((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sectorId)
        ? prev.sectors.filter((s) => s !== sectorId)
        : [...prev.sectors, sectorId],
    }));
  };

  const getTypeInfo = (type: string) => {
    return COMPANY_TYPES.find((t) => t.value === type) || COMPANY_TYPES[1];
  };

  // Generate logo URL from website domain
  const getLogoUrl = (company: Company) => {
    if (company.logo) return company.logo;
    if (company.website) {
      try {
        const domain = new URL(company.website).hostname.replace('www.', '');
        return `https://logo.clearbit.com/${domain}`;
      } catch {
        return null;
      }
    }
    return null;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lupton-blue" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <main className="flex-1 lg:ml-72 p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="text-lupton-blue" />
                My Companies
              </h1>
              <p className="text-gray-500 mt-1">
                Manage the companies you're tracking • {companies.length} companies
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-lupton-blue text-white rounded-lg hover:bg-lupton-navy transition-colors"
            >
              <Plus size={18} />
              Add Company
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <Check size={18} />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search your companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              >
                <option value="">All Types</option>
                {COMPANY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Sector Filter */}
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              >
                <option value="">All Sectors</option>
                {SECTORS.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.icon} {sector.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Companies Grid */}
          {filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {companies.length === 0 ? 'No companies yet' : 'No matching companies'}
              </h3>
              <p className="text-gray-500 mb-4">
                {companies.length === 0
                  ? 'Start by adding companies you want to track'
                  : 'Try adjusting your filters'}
              </p>
              {companies.length === 0 && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-lupton-blue text-white rounded-lg hover:bg-lupton-navy transition-colors"
                >
                  <Plus size={18} />
                  Add Your First Company
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => {
                const typeInfo = getTypeInfo(company.type);
                const logoUrl = getLogoUrl(company);
                const TypeIcon = typeInfo.icon;

                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {logoUrl ? (
                            <Image
                              src={logoUrl}
                              alt={company.name}
                              width={40}
                              height={40}
                              className="object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <span className={`text-xl font-bold text-gray-400 ${logoUrl ? 'hidden' : ''}`}>
                            {company.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{company.name}</h3>
                          <div className="flex items-center gap-2">
                            {company.stockTicker && (
                              <span className="text-xs text-gray-500">{company.stockTicker}</span>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1
                              ${typeInfo.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                              ${typeInfo.color === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
                              ${typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                            `}>
                              <TypeIcon size={12} />
                              {typeInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(company.assignmentId || company.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Sectors */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {company.sectors.map((sectorId) => {
                        const sector = SECTORS.find((s) => s.id === sectorId);
                        return sector ? (
                          <span key={sectorId} className="text-xs text-gray-500">
                            {sector.icon} {sector.shortName}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Website */}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-lupton-blue hover:underline"
                      >
                        Visit Website
                        <ExternalLink size={12} />
                      </a>
                    )}

                    {/* Delete Confirmation */}
                    {deleteConfirm === (company.assignmentId || company.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">Remove from your list?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeCompany(company.assignmentId || company.id)}
                            className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {showNewCompanyForm ? 'Create New Company' : 'Add Company'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setShowNewCompanyForm(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {!showNewCompanyForm ? (
                <>
                  {/* Search existing companies */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search existing companies
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search by name or ticker..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchCompanies(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Search Results */}
                  {searching && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-lupton-blue" />
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                      {searchResults.map((company) => (
                        <div
                          key={company.id}
                          className="p-3 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{company.name}</p>
                            <p className="text-sm text-gray-500">
                              {company.stockTicker && `${company.stockTicker} • `}
                              {getTypeInfo(company.type).label}
                            </p>
                          </div>
                          {company.isInUserList ? (
                            <span className="text-sm text-green-600 flex items-center gap-1">
                              <Check size={16} />
                              Added
                            </span>
                          ) : (
                            <button
                              onClick={() => addExistingCompany(company.id)}
                              className="px-3 py-1.5 bg-lupton-blue text-white text-sm rounded-lg hover:bg-lupton-navy"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery && !searching && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 mb-4">No companies found</p>
                  )}

                  {/* Create new company option */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Can't find the company you're looking for?
                    </p>
                    <button
                      onClick={() => setShowNewCompanyForm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-lupton-blue text-lupton-blue rounded-lg hover:bg-lupton-blue/5"
                    >
                      <Plus size={18} />
                      Create New Company
                    </button>
                  </div>
                </>
              ) : (
                /* New Company Form */
                <form onSubmit={addNewCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        {COMPANY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Ticker
                      </label>
                      <input
                        type="text"
                        value={formData.stockTicker}
                        onChange={(e) => setFormData({ ...formData, stockTicker: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                        placeholder="e.g., TSLA"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sectors
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SECTORS.map((sector) => (
                        <button
                          key={sector.id}
                          type="button"
                          onClick={() => toggleSector(sector.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            formData.sectors.includes(sector.id)
                              ? 'bg-lupton-blue text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {sector.icon} {sector.shortName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewCompanyForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-lupton-blue text-white rounded-lg hover:bg-lupton-navy flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Create & Add
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
