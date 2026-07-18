import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';

interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  problemCount: number;
}

export const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api('/companies');
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load companies list. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to generate a beautiful gradient based on the company name
  const getGradientClass = (name: string) => {
    const gradients = [
      'from-blue-600/10 to-indigo-600/10 border-blue-500/20 text-blue-400',
      'from-purple-600/10 to-pink-600/10 border-purple-500/20 text-purple-400',
      'from-emerald-600/10 to-teal-600/10 border-emerald-500/20 text-emerald-400',
      'from-amber-600/10 to-orange-600/10 border-amber-500/20 text-amber-400',
      'from-cyan-600/10 to-sky-600/10 border-cyan-500/20 text-cyan-400',
      'from-rose-600/10 to-red-600/10 border-rose-500/20 text-rose-400'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E2E8F0] relative overflow-hidden py-12 px-6">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center md:text-left border-b border-white/5 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-outfit tracking-tight">
                Company Interview Preparation
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Prepare for top tech roles by practicing DSA questions filtered by target employers and sorted by real interview frequency.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-medium shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">Loading companies data...</p>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-8 text-center max-w-md mx-auto border border-red-500/10 bg-red-500/5">
            <p className="text-sm font-semibold text-red-400">{error}</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto border border-white/5">
            <Building2 className="w-10 h-10 text-slate-500 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-400">No companies found matching "{searchQuery}"</p>
          </div>
        ) : (
          /* Grid list of companies */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCompanies.map((c) => {
              const gradientClass = getGradientClass(c.name);
              return (
                <Link
                  key={c.id}
                  to={`/companies/${c.slug}`}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group flex flex-col justify-between"
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/0 via-brand-600/0 to-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Circle Icon Badge */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-outfit border bg-gradient-to-br flex-shrink-0 ${gradientClass}`}>
                      {c.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-md font-bold text-white group-hover:text-brand-400 transition-colors font-outfit truncate">
                        {c.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-300">{c.problemCount}</span> problems
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-semibold group-hover:text-brand-400 transition-colors">
                    <span>Practice Questions</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
