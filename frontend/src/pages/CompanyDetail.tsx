import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BarChart2 } from 'lucide-react';
import { api } from '../utils/api';

interface Pattern {
  id: string;
  name: string;
  slug: string;
  isPrimary: boolean;
}

interface Problem {
  id: string;
  title: string;
  leetcodeUrl: string;
  leetcodeProblemNumber: number | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  frequencyScore: number;
  patterns: Pattern[];
}

interface CompanyDetailData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  problems: Problem[];
}

export const CompanyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CompanyDetailData | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await api(`/companies/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch company details');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load company details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400">Loading company details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 text-center">
        <div className="glass-panel rounded-2xl p-8 border border-red-500/10 bg-red-500/5">
          <p className="text-sm font-semibold text-red-400 mb-4">{error || 'Company not found'}</p>
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  const filteredProblems = data.problems.filter((p) => {
    if (activeDifficulty === 'ALL') return true;
    return p.difficulty === activeDifficulty;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HARD':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E2E8F0] relative overflow-hidden py-12 px-6">
      {/* Background blobs */}
      <div className="absolute top-[15%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back Link */}
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
        </Link>

        {/* Company Header Card */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600/10 to-indigo-600/10 border border-brand-500/20 flex items-center justify-center font-bold text-2xl font-outfit text-brand-400 shadow-md">
              {data.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
                {data.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                <BarChart2 className="w-3.5 h-3.5 text-brand-400" />
                Target preparation with interview frequency statistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 md:text-right border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div>
              <div className="text-2xl font-bold text-white font-outfit">{data.problems.length}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Total Problems</div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setActiveDifficulty(difficulty)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeDifficulty === difficulty
                    ? 'bg-brand-600 border-brand-500 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredProblems.length} of {data.problems.length} questions
          </div>
        </div>

        {/* Problems List Table */}
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          {filteredProblems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium text-sm">
              No problems found matching this difficulty level.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-900 border-b border-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Problem</th>
                    <th className="py-4 px-6 text-center">Difficulty</th>
                    <th className="py-4 px-6">Patterns Mapped</th>
                    <th className="py-4 px-6">Interview Frequency</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredProblems.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Title */}
                      <td className="py-4 px-6 min-w-[200px]">
                        <Link
                          to={`/problems/${p.id}`}
                          className="font-semibold text-slate-200 group-hover:text-brand-400 transition-colors font-outfit"
                        >
                          {p.title}
                        </Link>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border inline-block ${getDifficultyColor(p.difficulty)}`}>
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Patterns */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {p.patterns.map((pp) => (
                            <Link
                              key={pp.id}
                              to={`/patterns/${pp.slug}`}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-slate-400 hover:border-brand-500/30 hover:text-brand-400 transition-all"
                            >
                              {pp.name}
                            </Link>
                          ))}
                        </div>
                      </td>

                      {/* Frequency Score Bar */}
                      <td className="py-4 px-6 min-w-[180px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold font-mono">
                            <span>Score: {p.frequencyScore.toFixed(1)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-brand-600 to-brand-500 rounded-full"
                              style={{ width: `${p.frequencyScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Action Links */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/problems/${p.id}`}
                            className="text-xs font-bold text-slate-400 hover:text-brand-400 transition-colors"
                          >
                            Details
                          </Link>
                          <a
                            href={p.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-white transition-colors"
                            title="Open on LeetCode"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
