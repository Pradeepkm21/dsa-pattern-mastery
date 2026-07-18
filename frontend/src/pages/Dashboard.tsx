import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  TrendingDown, 
  BookOpen, 
  ChevronRight, 
  CalendarClock 
} from 'lucide-react';

interface PatternProgress {
  id: string;
  name: string;
  slug: string;
  totalProblems: number;
  solvedProblems: number;
  averageConfidence: number | null;
}

interface DashboardStats {
  totalProblemsCount: number;
  solvedProblemsCount: number;
  progressByPattern: PatternProgress[];
  weakestPatterns: PatternProgress[];
}

interface DueProblem {
  id: string;
  title: string;
  leetcodeUrl: string;
  leetcodeProblemNumber: number | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  descriptionShort: string | null;
  progress: {
    status: string;
    confidenceLevel: number | null;
    nextReviewAt: string | null;
    reviewCount: number;
  };
  patterns: Array<{ name: string; slug: string }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dueProblems, setDueProblems] = useState<DueProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [statsRes, dueRes] = await Promise.all([
        api('/revisions/dashboard'),
        api('/revisions/due'),
      ]);

      if (!statsRes.ok || !dueRes.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const statsData = await statsRes.json();
      const dueData = await dueRes.json();

      setStats(statsData);
      setDueProblems(dueData);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkReviewed = async (problemId: string) => {
    try {
      const res = await api(`/progress/${problemId}/review`, { method: 'POST' });
      if (res.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to review problem:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Assembling your dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchDashboardData(); }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const solvedPercentage = stats
    ? Math.round((stats.solvedProblemsCount / stats.totalProblemsCount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#080C14] bg-grid-pattern relative">
      <div className="glow-blob w-[500px] h-[500px] bg-brand-600/10 -top-40 -left-40"></div>
      <div className="glow-blob w-[500px] h-[500px] bg-indigo-500/10 bottom-0 right-0"></div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-4xl font-extrabold text-white font-outfit">DSA Mastery Hub</h1>
          <p className="text-slate-400">Track structural concepts, learn key insights, and stop repeating mistakes.</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Ring Card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl text-center sm:text-left">
            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-brand-500 transition-all duration-1000"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - solvedPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xl font-bold font-outfit text-white">{solvedPercentage}%</span>
            </div>
            <div className="flex flex-col justify-center min-h-[96px]">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</h3>
              <div className="text-2xl font-bold text-white mt-1 font-outfit">
                {stats?.solvedProblemsCount} / {stats?.totalProblemsCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">Total problems solved (Solved/Confident)</p>
            </div>
          </div>

          {/* Weakest Concept Card */}
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 shadow-xl">
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-500">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weakest Concept</h3>
              {stats && stats.weakestPatterns.length > 0 && stats.weakestPatterns[0].averageConfidence !== null ? (
                <>
                  <Link
                    to={`/patterns/${stats.weakestPatterns[0].slug}`}
                    className="text-lg font-bold text-white hover:text-brand-400 flex items-center gap-1 transition-all mt-1 font-outfit"
                  >
                    {stats.weakestPatterns[0].name}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-red-400 font-medium mt-1">
                    Avg Confidence: {stats.weakestPatterns[0].averageConfidence}/5
                  </p>
                </>
              ) : (
                <div className="text-slate-400 mt-1 text-sm font-medium">None attempted yet</div>
              )}
            </div>
          </div>

          {/* Due for Review count card */}
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-5 shadow-xl">
            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-amber-500">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Due for Review</h3>
              <div className="text-2xl font-bold text-white mt-1 font-outfit">
                {dueProblems.length}
              </div>
              <p className="text-xs text-slate-400 mt-1">Problems pending spaced repetition</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Middle: Due for Review Today Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-brand-400" />
                <h2 className="text-2xl font-bold text-white font-outfit">Due for Review Today</h2>
              </div>
              <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-1 rounded-full font-semibold font-mono">
                {dueProblems.length} Active
              </span>
            </div>

            {dueProblems.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 text-center flex flex-col items-center justify-center shadow-lg border border-white/5">
                <div className="bg-brand-600/10 p-4 rounded-full mb-4 text-brand-400 border border-brand-500/20">
                  <Flame className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-outfit">All caught up!</h3>
                <p className="text-slate-400 max-w-sm text-sm mt-1">
                  You have reviewed all your pending problems. Keep practicing and adding new concepts to trigger new schedules.
                </p>
                <Link
                  to="/patterns"
                  className="mt-6 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
                >
                  Browse Patterns
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {dueProblems.map((prob) => (
                  <div
                    key={prob.id}
                    className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between border border-white/5 hover:border-white/10 transition-all shadow-md gap-4"
                  >
                    <div className="space-y-2 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        {prob.leetcodeProblemNumber && (
                          <span className="text-xs text-slate-500 font-bold font-mono">
                            #{prob.leetcodeProblemNumber}
                          </span>
                        )}
                        <Link
                          to={`/problems/${prob.id}`}
                          className="text-base font-bold text-white hover:text-brand-400 transition-all"
                        >
                          {prob.title}
                        </Link>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            prob.difficulty === 'EASY'
                              ? 'bg-green-500/10 text-green-400'
                              : prob.difficulty === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {prob.descriptionShort || 'No description added yet.'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {prob.patterns.map((pat) => (
                          <Link
                            key={pat.slug}
                            to={`/patterns/${pat.slug}`}
                            className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/50 hover:bg-slate-700 hover:text-white transition-all font-mono"
                          >
                            {pat.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden md:block">
                        <div className="text-xs text-slate-400 font-semibold">
                          Confidence: {prob.progress.confidenceLevel || 'N/A'}/5
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Reviewed: {prob.progress.reviewCount} times
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/problems/${prob.id}`}
                          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-semibold transition-all"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleMarkReviewed(prob.id)}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-md shadow-brand-600/15"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Reviewed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Weakest Areas & Quick Link to patterns */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h2 className="text-2xl font-bold text-white font-outfit">Weak Areas</h2>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl">
              <p className="text-xs text-slate-400">
                Concepts sorted by your average self-reported confidence. Target these patterns to strengthen core knowledge.
              </p>

              {stats && stats.progressByPattern.filter(p => p.averageConfidence !== null).length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500 font-medium">
                  Attempt problems to populate your weak areas.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.weakestPatterns.slice(0, 5).map((pat) => (
                    <div
                      key={pat.id}
                      className="bg-dark-900/60 border border-white/5 rounded-xl p-3.5 flex items-center justify-between hover:border-brand-500/20 transition-all group"
                    >
                      <div className="space-y-1">
                        <Link
                          to={`/patterns/${pat.slug}`}
                          className="text-sm font-bold text-white group-hover:text-brand-400 transition-all font-outfit"
                        >
                          {pat.name}
                        </Link>
                        <div className="text-[10px] text-slate-400">
                          Solved: {pat.solvedProblems} / {pat.totalProblems}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                          (pat.averageConfidence ?? 0) <= 2
                            ? 'bg-red-500/10 text-red-400'
                            : (pat.averageConfidence ?? 0) <= 3.5
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {pat.averageConfidence ? `${pat.averageConfidence}/5` : 'N/A'}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1">Avg Confidence</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/patterns"
                className="w-full flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition-all mt-4"
              >
                <BookOpen className="w-3.5 h-3.5" />
                View All Patterns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
