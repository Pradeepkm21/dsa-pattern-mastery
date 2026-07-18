import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { BookOpen, AlertCircle, ChevronRight, Zap, Layers } from 'lucide-react';

interface PatternGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

interface Pattern {
  id: string;
  name: string;
  slug: string;
  triggerCue: string;
  coreIdea: string;
  timeComplexity: string;
  spaceComplexity: string;
  displayOrder: number;
  patternGroup?: PatternGroup;
}

export const PatternLibrary: React.FC = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await api('/patterns');
        if (!response.ok) {
          throw new Error('Failed to load patterns');
        }
        const data = await response.json();
        setPatterns(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, []);

  // Group extraction helper
  const groupsMap = new Map<string, PatternGroup>();
  patterns.forEach((pat) => {
    if (pat.patternGroup) {
      groupsMap.set(pat.patternGroup.slug, pat.patternGroup);
    }
  });
  const groupsList = Array.from(groupsMap.values()).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // Compute activeGroupSlug from searchParams or fallback to first group's slug
  const groupParam = searchParams.get('group');
  const activeGroupSlug = groupParam || (groupsList.length > 0 ? groupsList[0].slug : '');

  const activeGroup = groupsList.find((g) => g.slug === activeGroupSlug) || null;

  // Filter patterns by active group
  const filteredPatterns = patterns
    .filter((pat) => pat.patternGroup?.slug === activeGroupSlug)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Opening concept vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-[#080C14] flex flex-col justify-center items-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Error Loading Patterns</h3>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => { setLoading(true); }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] bg-grid-pattern relative">
      <div className="glow-blob w-[500px] h-[500px] bg-brand-600/10 top-0 left-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold tracking-wider uppercase">
            <BookOpen className="w-4 h-4" />
            {activeGroup ? `${activeGroup.name} Data Structure` : 'Data Structure Concepts'}
          </div>
          <h1 className="text-4xl font-extrabold text-white font-outfit">Pattern Library</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed mt-1">
            {activeGroup 
              ? activeGroup.description 
              : 'A comprehensive compendium of critical coding patterns. Browse core ideas, complexities, and trigger cues.'
            }
          </p>
        </div>

        {/* Group Filter Tabs */}
        {groupsList.length > 1 && (
          <div className="flex flex-nowrap border-b border-white/5 gap-6 mb-8 overflow-x-auto scrollbar-none touch-pan-x">
            {groupsList.map((group) => {
              const isActive = group.slug === activeGroupSlug;
              return (
                <button
                  key={group.id}
                  onClick={() => setSearchParams({ group: group.slug })}
                  className={`pb-4 px-1 text-sm font-semibold transition-all relative whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'text-brand-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                  {group.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid List */}
        {filteredPatterns.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/5 rounded-2xl">
            <p className="text-slate-400">No patterns found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatterns.map((pat) => (
              <div
                key={pat.id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-white/5 shadow-xl relative overflow-hidden group"
              >
                <div className="space-y-4">
                  {/* Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="bg-brand-600/10 p-2.5 rounded-xl border border-brand-500/20 text-brand-400 font-mono text-xs font-bold">
                      Pattern {pat.displayOrder}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded font-mono border border-slate-700/50">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Time: {pat.timeComplexity}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-brand-400 transition-all font-outfit">
                      {pat.name}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {pat.coreIdea}
                    </p>
                  </div>

                  {/* Trigger Cues */}
                  <div className="bg-dark-900/50 border border-white/5 rounded-xl p-3">
                    <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Trigger Cue
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic leading-normal">
                      "{pat.triggerCue}"
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 font-medium">
                    Space Complexity: <span className="text-slate-400 font-semibold">{pat.spaceComplexity}</span>
                  </div>
                  <Link
                    to={`/patterns/${pat.slug}`}
                    className="text-xs text-brand-400 font-semibold hover:text-brand-300 transition-all inline-flex items-center gap-0.5 group-hover:gap-1"
                  >
                    Explore Concept
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
