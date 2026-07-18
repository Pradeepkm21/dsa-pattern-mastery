import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { 
  ArrowLeft, 
  AlertCircle, 
  Code, 
  Bookmark, 
  Info, 
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  leetcodeUrl: string;
  leetcodeProblemNumber: number | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  descriptionShort: string | null;
  isPrimary: boolean;
  progress: {
    status: string;
    confidenceLevel: number | null;
    lastReviewedAt: string | null;
    nextReviewAt: string | null;
    reviewCount: number;
  };
  allPatterns: Array<{ id: string; name: string; slug: string; isPrimary: boolean }>;
  companies?: Array<{ companyName: string; companySlug: string; frequencyScore: number; timeframe: string }>;
}

interface PatternDetail {
  id: string;
  name: string;
  slug: string;
  triggerCue: string;
  coreIdea: string;
  whyItWorks: string;
  codeSkeleton: string;
  timeComplexity: string;
  spaceComplexity: string;
  commonMistake: string;
  comparisonNotes: string | null;
  displayOrder: number;
  problems: Problem[];
}

export const PatternDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pattern, setPattern] = useState<PatternDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [companiesList, setCompaniesList] = useState<Array<{ id: string; name: string; slug: string; problemCount: number }>>([]);
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/patterns');
    }
  };

  useEffect(() => {
    const fetchPatternDetails = async () => {
      if (!slug) return;
      try {
        const [patternRes, companiesRes] = await Promise.all([
          api(`/patterns/${slug}`),
          api('/companies')
        ]);
        if (!patternRes.ok) {
          throw new Error('Failed to load pattern details');
        }
        if (!companiesRes.ok) {
          throw new Error('Failed to load companies list');
        }
        const patternData = await patternRes.json();
        const companiesData = await companiesRes.json();
        setPattern(patternData);
        setCompaniesList(companiesData);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatternDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Extracting pattern blueprints...</p>
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Error Loading Concept</h3>
          <p className="text-sm text-slate-400 mb-4">{error || 'Concept not found'}</p>
          <a
            href="/patterns"
            onClick={handleBack}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            Back to Library
          </a>
        </div>
      </div>
    );
  }

  const getProcessedProblems = () => {
    if (!pattern) return [];
    
    // Only show hand-curated core problems on the Pattern Detail page
    const curatedProblems = pattern.problems.filter(p => p.leetcodeProblemNumber !== null);

    if (selectedCompany === 'all') {
      return curatedProblems;
    }

    return [...curatedProblems].sort((a, b) => {
      const aCompany = a.companies?.find(c => c.companySlug === selectedCompany);
      const bCompany = b.companies?.find(c => c.companySlug === selectedCompany);

      const aScore = aCompany ? aCompany.frequencyScore : -1;
      const bScore = bCompany ? bCompany.frequencyScore : -1;

      return bScore - aScore;
    });
  };

  const processedProblems = getProcessedProblems();

  return (
    <div className="min-h-screen bg-[#080C14] bg-grid-pattern relative pb-16">
      <div className="glow-blob w-[500px] h-[500px] bg-brand-600/10 top-0 left-10"></div>
      <div className="glow-blob w-[500px] h-[500px] bg-indigo-500/10 bottom-0 right-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Back Link */}
        <a
          href="/patterns"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-all mb-6 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-all" />
          Back to Pattern Library
        </a>

        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 mb-8 gap-4">
          <div className="space-y-2">
            <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1 rounded-full font-semibold font-mono">
              Pattern #{pattern.displayOrder}
            </span>
            <h1 className="text-4xl font-extrabold text-white font-outfit">{pattern.name}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-dark-900 border border-white/5 rounded-xl px-4 py-2 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Time</div>
              <div className="text-sm font-bold text-white font-mono">{pattern.timeComplexity}</div>
            </div>
            <div className="bg-dark-900 border border-white/5 rounded-xl px-4 py-2 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Space</div>
              <div className="text-sm font-bold text-white font-mono">{pattern.spaceComplexity}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details: 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Idea */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="bg-brand-600/15 p-2 rounded-xl border border-brand-500/20 text-brand-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-outfit">Core Intuition</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{pattern.coreIdea}</p>
                </div>
              </div>
            </div>

            {/* Why It Works — THE MOST IMPORTANT SECTION */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/5 rounded-full filter blur-xl"></div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-outfit">Deep Mechanics (Why it Works)</h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{pattern.whyItWorks}</p>
                </div>
              </div>
            </div>

            {/* Trigger Cue */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-amber-500">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-outfit">How to Recognize This Pattern</h3>
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{pattern.triggerCue}"</p>
                </div>
              </div>
            </div>

            {/* Code Skeleton */}
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl w-full max-w-full">
              <div className="bg-dark-900 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Code Skeleton (TypeScript)</span>
                </div>
              </div>
              <pre className="bg-dark-900/40 p-6 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed w-full max-w-full">
                <code>{pattern.codeSkeleton}</code>
              </pre>
            </div>

            {/* Common Mistakes */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl bg-red-950/10 border-red-500/10">
              <div className="flex items-start gap-3">
                <div className="bg-red-500/10 p-2 rounded-xl border border-red-500/20 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-outfit">Common Mistakes / Pitfalls</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{pattern.commonMistake}</p>
                </div>
              </div>
            </div>

            {/* Comparison Notes */}
            {pattern.comparisonNotes && (
              <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-700/20 p-2 rounded-xl border border-slate-600/30 text-slate-300">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white font-outfit">Comparison Notes</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{pattern.comparisonNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Problems List (1 Column) */}
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-brand-400" />
                <h2 className="text-2xl font-bold text-white font-outfit">Linked Problems</h2>
              </div>

              {/* Company Filter Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Filter by Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full py-2.5 px-3 bg-dark-900 border border-white/10 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer shadow-inner"
                >
                  <option value="all">All Companies</option>
                  {companiesList.map((comp) => (
                    <option key={comp.slug} value={comp.slug}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {processedProblems.map((prob) => {
                const activeCompanyDetails = selectedCompany !== 'all' 
                  ? prob.companies?.find(c => c.companySlug === selectedCompany)
                  : null;

                return (
                  <div
                    key={prob.id}
                    className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col justify-between gap-3 shadow-md hover:border-brand-500/25 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/problems/${prob.id}`}
                            className="text-sm font-bold text-white hover:text-brand-400 transition-all font-outfit leading-snug line-clamp-1"
                          >
                            {prob.leetcodeProblemNumber && `#${prob.leetcodeProblemNumber} `}
                            {prob.title}
                          </Link>
                          {activeCompanyDetails && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-brand-400 font-bold font-mono">
                              <span>Score: {activeCompanyDetails.frequencyScore.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono flex-shrink-0 ${
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

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {prob.descriptionShort || 'No description added.'}
                      </p>

                      {/* Top 3 Companies Badges */}
                      {prob.companies && prob.companies.length > 0 && (
                        <div className="flex items-center gap-1 pt-1">
                          <span className="text-[9px] text-slate-500 font-semibold mr-1">Asked at:</span>
                          <div className="flex gap-1 flex-wrap">
                            {prob.companies.slice(0, 3).map((comp) => {
                              const shortLabel = comp.companyName.charAt(0);
                              return (
                                <Link
                                  key={comp.companySlug}
                                  to={`/companies/${comp.companySlug}`}
                                  className="w-5 h-5 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-[9.5px] font-bold text-slate-300 hover:border-brand-500/30 hover:text-brand-400 transition-all font-outfit"
                                  title={`${comp.companyName} (Score: ${comp.frequencyScore.toFixed(1)})`}
                                >
                                  {shortLabel}
                                </Link>
                              );
                            })}
                            {prob.companies.length > 3 && (
                              <span className="text-[9px] text-slate-500 font-medium self-center pl-0.5">
                                +{prob.companies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* All patterns badge tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prob.allPatterns.map((pat) => (
                          <span
                            key={pat.slug}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                              pat.slug === pattern.slug
                                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {pat.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between mt-1">
                      {/* Status Badge */}
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          prob.progress.status === 'CONFIDENT'
                            ? 'bg-emerald-500 shadow-md shadow-emerald-500/35'
                            : prob.progress.status === 'SOLVED'
                            ? 'bg-blue-500 shadow-md shadow-blue-500/35'
                            : prob.progress.status === 'ATTEMPTED'
                            ? 'bg-amber-500 shadow-md shadow-amber-500/35'
                            : 'bg-slate-700'
                        }`}></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {prob.progress.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-slate-300 transition-all p-1"
                          title="LeetCode Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          to={`/problems/${prob.id}`}
                          className="text-[11px] font-bold text-brand-400 hover:text-brand-300 transition-all flex items-center"
                        >
                          Track
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
