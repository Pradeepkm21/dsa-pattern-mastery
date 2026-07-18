import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { 
  ArrowLeft, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  History, 
  MessageSquareWarning, 
  Edit3, 
  Eye, 
  CalendarClock,
  Sparkles,
  Building2
} from 'lucide-react';

interface Pattern {
  id: string;
  name: string;
  slug: string;
  isPrimary: boolean;
}

interface MistakeLog {
  timestamp: string;
  text: string;
}

interface ProblemDetail {
  id: string;
  title: string;
  leetcodeUrl: string;
  leetcodeProblemNumber: number | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  descriptionShort: string | null;
  patterns: Pattern[];
  companies?: Array<{ companyName: string; companySlug: string; frequencyScore: number; timeframe: string }>;
  progress: {
    status: string;
    confidenceLevel: number | null;
    dryRunNotes: string;
    whyNotes: string;
    mistakeLog: MistakeLog[] | string; // Can be parsed array or string
    freeNotes: string | null;
    lastReviewedAt: string | null;
    nextReviewAt: string | null;
    reviewCount: number;
  };
}

export const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [status, setStatus] = useState('NOT_STARTED');
  const [confidence, setConfidence] = useState(3);
  const [dryRunNotes, setDryRunNotes] = useState('');
  const [whyNotes, setWhyNotes] = useState('');
  const [newMistake, setNewMistake] = useState('');
  const [freeNotes, setFreeNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Action state feedbacks
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchProblemData = async () => {
    if (!id) return;
    try {
      const response = await api(`/problems/${id}`);
      if (!response.ok) {
        throw new Error('Problem not found');
      }
      const data = (await response.json()) as ProblemDetail;
      setProblem(data);
      
      // Initialize form values
      setStatus(data.progress.status);
      setConfidence(data.progress.confidenceLevel || 3);
      setDryRunNotes(data.progress.dryRunNotes);
      setWhyNotes(data.progress.whyNotes);
      setFreeNotes(data.progress.freeNotes || '');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemData();
  }, [id]);

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await api(`/progress/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          status,
          confidenceLevel: Number(confidence),
          dryRunNotes,
          whyNotes,
          freeNotes,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchProblemData();
      } else {
        throw new Error('Failed to save progress');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving progress');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMistake = async () => {
    if (!id || !newMistake.trim()) return;
    try {
      const response = await api(`/progress/${id}/mistake`, {
        method: 'POST',
        body: JSON.stringify({ text: newMistake }),
      });

      if (response.ok) {
        setNewMistake('');
        fetchProblemData();
      } else {
        throw new Error('Failed to log mistake');
      }
    } catch (err: any) {
      alert(err.message || 'Error logging mistake');
    }
  };

  const handleMarkReviewed = async () => {
    if (!id) return;
    try {
      const response = await api(`/progress/${id}/review`, { method: 'POST' });
      if (response.ok) {
        fetchProblemData();
      } else {
        throw new Error('Failed to review problem');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Opening workspace partition...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Error Opening Workspace</h3>
          <p className="text-sm text-slate-400 mb-4">{error || 'Problem not found'}</p>
          <Link
            to="/"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Parse mistake logs safely
  let parsedMistakes: MistakeLog[] = [];
  try {
    const raw = problem.progress.mistakeLog;
    if (Array.isArray(raw)) {
      parsedMistakes = raw as MistakeLog[];
    } else if (typeof raw === 'string') {
      parsedMistakes = JSON.parse(raw);
    }
  } catch (e) {
    parsedMistakes = [];
  }

  return (
    <div className="min-h-screen bg-[#080C14] bg-grid-pattern relative pb-16">
      <div className="glow-blob w-[500px] h-[500px] bg-brand-600/5 top-0 left-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Top Back navigation */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-all mb-6 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-all" />
          Back to Dashboard
        </Link>

        {/* Problem Title & Meta Info */}
        <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-white/5 pb-6 mb-8 gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              {problem.leetcodeProblemNumber && (
                <span className="text-slate-500 font-mono font-bold text-sm bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                  #{problem.leetcodeProblemNumber}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-white font-outfit">{problem.title}</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                  problem.difficulty === 'EASY'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : problem.difficulty === 'MEDIUM'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              {problem.descriptionShort || 'Add a custom problem restatement below to build your core intuition.'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Mapped Patterns:</span>
              {problem.patterns.map((pat) => (
                <Link
                  key={pat.slug}
                  to={`/patterns/${pat.slug}`}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                    pat.isPrimary
                      ? 'bg-brand-500/10 border-brand-500/30 text-brand-300'
                      : 'bg-slate-800/80 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {pat.name} {pat.isPrimary && '⭐️'}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Header Button and Review Date Status */}
          <div className="flex flex-col gap-3 min-w-[240px]">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md"
            >
              Solve on LeetCode
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="bg-dark-900 border border-white/5 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold"><CalendarClock className="w-3.5 h-3.5 text-brand-400" /> Next Review</span>
                <span className="font-mono text-slate-200">
                  {problem.progress.nextReviewAt
                    ? new Date(problem.progress.nextReviewAt).toLocaleDateString()
                    : 'Not scheduled'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Review Count</span>
                <span className="font-mono text-slate-200">{problem.progress.reviewCount}</span>
              </div>
              
              <button
                onClick={handleMarkReviewed}
                className="w-full mt-2 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Reviewed
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Side — Left/Middle (2 cols) */}
          <form onSubmit={handleSaveProgress} className="lg:col-span-2 space-y-6">
            
            {/* Status & Confidence Block */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  My Track Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 focus:border-brand-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="ATTEMPTED">Attempted</option>
                  <option value="SOLVED">Solved</option>
                  <option value="CONFIDENT">Confident</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex justify-between">
                  <span>Self-Confidence Level</span>
                  <span className="text-brand-400 font-bold">{confidence}/5</span>
                </label>
                <div className="flex items-center gap-4 py-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className="w-full h-1.5 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between w-full text-[10px] text-slate-500 font-mono hidden">
                    <span>1 (Weak)</span>
                    <span>5 (Solid)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dry Run Notes */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" /> Monospace Dry Run Tracebox
              </label>
              <p className="text-xs text-slate-500">
                Write down your manual trace of a small example here. Forces you to walk through the variables logic step-by-step.
              </p>
              <textarea
                value={dryRunNotes}
                onChange={(e) => setDryRunNotes(e.target.value)}
                rows={6}
                className="w-full bg-dark-900 border border-white/10 focus:border-brand-500 rounded-xl p-4 font-mono text-xs text-slate-300 outline-none transition-all placeholder-slate-600 leading-relaxed"
                placeholder="e.g. nums = [2, 0, 1, 3], target = 3&#10;L = 0, R = 3 -> sum = 5 (too big) -> R--&#10;L = 0, R = 2 -> sum = 3 (match) -> Return indices!"
              />
            </div>

            {/* Why Notes */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Intuition Check — "Why" does it work?
              </label>
              <p className="text-xs text-slate-500">
                Explain in your OWN words why this solution is mathematically correct before referencing the pattern explanation.
              </p>
              <textarea
                value={whyNotes}
                onChange={(e) => setWhyNotes(e.target.value)}
                rows={4}
                className="w-full bg-dark-900 border border-white/10 focus:border-brand-500 rounded-xl p-4 text-sm text-slate-300 outline-none transition-all placeholder-slate-600 leading-relaxed"
                placeholder="Write down the intuition: e.g. 'Since the array is sorted, scanning from both ends allows us to narrow the sum boundaries because left moves strictly increase sums...'"
              />
            </div>

            {/* Free Notes Tabbed Editor */}
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              <div className="bg-dark-900 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Freeform Markdown Notes</span>
                <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'edit'
                        ? 'bg-brand-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'preview'
                        ? 'bg-brand-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>
              </div>

              <div className="p-6 bg-dark-900/20">
                {activeTab === 'edit' ? (
                  <textarea
                    value={freeNotes}
                    onChange={(e) => setFreeNotes(e.target.value)}
                    rows={8}
                    className="w-full bg-dark-900 border border-white/10 focus:border-brand-500 rounded-xl p-4 text-sm text-slate-300 outline-none transition-all placeholder-slate-600 leading-relaxed"
                    placeholder="Write freeform markdown notes: use lists, bold text, or code highlights."
                  />
                ) : (
                  <div className="min-h-[160px] bg-dark-900/40 rounded-xl p-4 border border-white/5 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {freeNotes.trim() ? freeNotes : <span className="text-slate-600 italic">No notes written yet. Preview is empty.</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Block */}
            <div className="flex items-center justify-between">
              {saveSuccess ? (
                <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl font-medium animate-fade-in">
                  Progress saved successfully!
                </div>
              ) : (
                <div></div>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-brand-600/25 flex items-center justify-center disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Save Workspace Progress'
                )}
              </button>
            </div>
          </form>

          {/* Mistakes Append-only Log Sidebar (1 col) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-red-400" />
              <h2 className="text-2xl font-bold text-white font-outfit">Personal Mistakes</h2>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl">
              {/* Add Mistake Block */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Log New Mistake Entry
                </label>
                <textarea
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  rows={3}
                  className="w-full bg-dark-900 border border-white/10 focus:border-brand-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none transition-all leading-normal"
                  placeholder="e.g. 'Used dynamic array resize during the loops which led to memory limit exceeded.'"
                />
                <button
                  type="button"
                  onClick={handleAddMistake}
                  disabled={!newMistake.trim()}
                  className="w-full py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white text-xs font-bold rounded-lg transition-all"
                >
                  Append to Mistake Log
                </button>
              </div>

              {/* Mistake Log History list */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-2">
                  <History className="w-4 h-4 text-slate-500" />
                  Mistake Logs ({parsedMistakes.length})
                </div>

                {parsedMistakes.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-600 italic">
                    No mistakes logged for this problem yet. Track what triggers bugs so you can avoid them!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {parsedMistakes.map((log, idx) => (
                      <div
                        key={idx}
                        className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 space-y-1.5"
                      >
                        <p className="text-xs text-slate-200 leading-relaxed font-medium break-words">
                          {log.text}
                        </p>
                        <div className="text-[9px] text-slate-500 font-mono text-right">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Asked At Companies Sidebar Card */}
            {problem.companies && problem.companies.length > 0 && (
              <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Building2 className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">
                    Asked At Companies
                  </h3>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {problem.companies.map((comp) => (
                    <div
                      key={comp.companySlug}
                      className="flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <Link
                          to={`/companies/${comp.companySlug}`}
                          className="font-bold text-slate-300 hover:text-brand-400 transition-colors"
                        >
                          {comp.companyName}
                        </Link>
                        <span className="font-mono font-semibold text-brand-400">
                          {comp.frequencyScore.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-brand-500 rounded-full"
                          style={{ width: `${comp.frequencyScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
