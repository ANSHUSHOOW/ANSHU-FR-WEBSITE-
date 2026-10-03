import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Book,
  Globe,
  Plus,
  Check,
  CheckCircle2,
  Circle,
  HelpCircle,
  ExternalLink,
  Trash2,
  Sparkles,
  LayoutGrid,
  ListFilter,
  Search,
  Star,
  Award,
  BookOpenCheck,
  Percent,
} from 'lucide-react';
import { Chapter, StudySource, ChapterProgress } from '../types';
import { triggerStudyConfetti, triggerBigCelebration } from '../utils/confetti';

interface SourceProgressTrackerProps {
  chapters: Chapter[];
  sources: StudySource[];
  progress: ChapterProgress[];
  onOpenAddSourceModal: () => void;
  onDeleteSource: (sourceId: string) => void;
  onUpdateProgress: (newProgressRecord: ChapterProgress) => void;
  onBatchUpdateSource?: (sourceId: string, type: 'theory' | 'questions', value: boolean) => void;
  highlightedChapterId?: string | null;
}

export const SourceProgressTracker: React.FC<SourceProgressTrackerProps> = ({
  chapters,
  sources,
  progress,
  onOpenAddSourceModal,
  onDeleteSource,
  onUpdateProgress,
  onBatchUpdateSource,
  highlightedChapterId,
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [activeSourceId, setActiveSourceId] = useState<string>(sources[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'need-theory' | 'need-questions' | 'completed'>('all');
  const [editingScoreKey, setEditingScoreKey] = useState<string | null>(null);
  const [tempScore, setTempScore] = useState('');

  // Active source object
  const currentSource = sources.find((s) => s.id === activeSourceId) || sources[0];

  // Helper to find progress record
  const getRecord = (chapterId: string, sourceId: string): ChapterProgress => {
    const found = progress.find((p) => p.chapterId === chapterId && p.sourceId === sourceId);
    return (
      found || {
        chapterId,
        sourceId,
        theoryCompleted: false,
        questionsCompleted: false,
      }
    );
  };

  // Toggle theory
  const handleToggleTheory = (chapterId: string, sourceId: string) => {
    const existing = getRecord(chapterId, sourceId);
    const updated: ChapterProgress = {
      ...existing,
      theoryCompleted: !existing.theoryCompleted,
      theoryCompletedAt: !existing.theoryCompleted ? new Date().toISOString() : undefined,
    };
    if (!existing.theoryCompleted) {
      triggerStudyConfetti(0.65);
    }
    onUpdateProgress(updated);
  };

  // Toggle questions
  const handleToggleQuestions = (chapterId: string, sourceId: string) => {
    const existing = getRecord(chapterId, sourceId);
    const willBeCompleted = !existing.questionsCompleted;
    const updated: ChapterProgress = {
      ...existing,
      questionsCompleted: willBeCompleted,
      questionsCompletedAt: willBeCompleted ? new Date().toISOString() : undefined,
    };
    if (willBeCompleted) {
      if (existing.theoryCompleted) {
        // Both theory and questions done for this chapter! Big celebration
        triggerBigCelebration();
      } else {
        triggerStudyConfetti(0.65);
      }
    }
    onUpdateProgress(updated);
  };

  // Update confidence
  const handleSetConfidence = (chapterId: string, sourceId: string, conf: 1 | 2 | 3 | 4 | 5) => {
    const existing = getRecord(chapterId, sourceId);
    onUpdateProgress({
      ...existing,
      confidence: existing.confidence === conf ? undefined : conf,
    });
  };

  // Save score
  const handleSaveScore = (chapterId: string, sourceId: string) => {
    const existing = getRecord(chapterId, sourceId);
    onUpdateProgress({
      ...existing,
      score: tempScore.trim() || undefined,
    });
    setEditingScoreKey(null);
    setTempScore('');
  };

  // Filter chapters
  const filteredChapters = chapters.filter((ch) => {
    const matchesQuery =
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (viewMode === 'cards' && currentSource) {
      const rec = getRecord(ch.id, currentSource.id);
      if (filterMode === 'need-theory') return !rec.theoryCompleted;
      if (filterMode === 'need-questions') return rec.theoryCompleted && !rec.questionsCompleted;
      if (filterMode === 'completed') return rec.theoryCompleted && rec.questionsCompleted;
    }

    return true;
  });

  return (
    <section id="source-progress" className="mb-14">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        {/* Section Top Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <BookOpenCheck className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Multi-Resource Progress (Books &amp; Websites)
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Tick off chapter theory as you complete reading, then tick questions solved right after.
            </p>
          </div>

          {/* Controls: View Mode & Add Source */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher: Matrix vs Detailed Cards */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Master Matrix</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" />
                <span>Resource Tabs</span>
              </button>
            </div>

            {/* Add Book or Website button */}
            <button
              onClick={onOpenAddSourceModal}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3.5 py-1.5 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/25 hover:border-cyan-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book / Website</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter chapters (e.g. IAS 16, Consolidation)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 pl-8 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Quick Legend / Guide */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-teal-500/40 bg-teal-500/20 text-[10px] font-bold text-teal-300">
                ✓
              </span>
              <span>1st: Chapter Theory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
                ✓
              </span>
              <span>2nd: Kit Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded border border-emerald-500 bg-emerald-500 text-[10px] font-bold text-slate-950">
                ★
              </span>
              <span>Both Mastered</span>
            </div>
          </div>
        </div>

        {/* VIEW 1: MASTER MATRIX GRID VIEW */}
        {viewMode === 'matrix' && (
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                  <th className="sticky left-0 z-20 bg-slate-900 px-4 py-3 font-semibold min-w-[220px]">
                    ACCA FR Chapter
                  </th>
                  {sources.map((source) => (
                    <th
                      key={source.id}
                      className="px-4 py-3 font-semibold text-center min-w-[170px] border-l border-slate-800"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          {source.type === 'book' ? (
                            <Book className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Globe className="h-3.5 w-3.5 text-cyan-400" />
                          )}
                          <span>{source.name}</span>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-cyan-300"
                              title="Open website link"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <span className="text-[10px] font-normal text-slate-400">
                          [Theory] &nbsp;·&nbsp; [Questions]
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredChapters.map((chapter) => {
                  const isHighlighted = highlightedChapterId === chapter.id;

                  return (
                    <tr
                      key={chapter.id}
                      id={`matrix-ch-${chapter.id}`}
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-emerald-500/10 ring-1 ring-emerald-500'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Chapter Column */}
                      <td className="sticky left-0 z-10 bg-slate-950 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-emerald-400 shrink-0">
                            {chapter.code}
                          </span>
                          <span className="font-medium text-slate-200 line-clamp-1">
                            {chapter.name}
                          </span>
                        </div>
                      </td>

                      {/* Source Columns */}
                      {sources.map((source) => {
                        const rec = getRecord(chapter.id, source.id);
                        const bothDone = rec.theoryCompleted && rec.questionsCompleted;

                        return (
                          <td
                            key={source.id}
                            className={`border-l border-slate-800/80 px-3 py-2 text-center transition-colors ${
                              bothDone ? 'bg-emerald-950/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {/* 1. Theory Tick */}
                              <button
                                type="button"
                                onClick={() => handleToggleTheory(chapter.id, source.id)}
                                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-all ${
                                  rec.theoryCompleted
                                    ? 'border-teal-500 bg-teal-500/20 text-teal-300 shadow-sm'
                                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-teal-500/50 hover:text-slate-200'
                                }`}
                                title="Click to tick Chapter Theory Complete"
                              >
                                <span className="font-bold">
                                  {rec.theoryCompleted ? '✓' : '○'}
                                </span>
                                <span>Read</span>
                              </button>

                              {/* 2. Questions Tick (just after that) */}
                              <button
                                type="button"
                                onClick={() => handleToggleQuestions(chapter.id, source.id)}
                                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-all ${
                                  rec.questionsCompleted
                                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm'
                                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-cyan-500/50 hover:text-slate-200'
                                }`}
                                title="Click to tick Questions Solved"
                              >
                                <span className="font-bold">
                                  {rec.questionsCompleted ? '✓' : '○'}
                                </span>
                                <span>Quest</span>
                              </button>
                            </div>

                            {/* Score or Note indicator if present */}
                            {rec.score && (
                              <div className="mt-1 text-[10px] font-mono font-semibold text-emerald-400">
                                Score: {rec.score}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 2: DETAILED RESOURCE TAB VIEW */}
        {viewMode === 'cards' && (
          <div className="mt-5">
            {/* Resource Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              {sources.map((source) => {
                const isActive = source.id === currentSource?.id;
                const sourceProgress = progress.filter((p) => p.sourceId === source.id);
                const theoryDone = sourceProgress.filter((p) => p.theoryCompleted).length;
                const questionsDone = sourceProgress.filter((p) => p.questionsCompleted).length;

                return (
                  <button
                    key={source.id}
                    onClick={() => setActiveSourceId(source.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {source.type === 'book' ? (
                      <Book className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Globe className="h-4 w-4 text-cyan-400" />
                    )}
                    <span>{source.name}</span>
                    <span className="rounded bg-slate-950 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                      {questionsDone}/{chapters.length} Qs
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Current Source Info & Filter Bar */}
            {currentSource && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{currentSource.name}</h3>
                    {currentSource.url && (
                      <a
                        href={currentSource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {!currentSource.isDefault && (
                      <button
                        onClick={() => onDeleteSource(currentSource.id)}
                        className="text-xs text-rose-400 hover:underline ml-2"
                      >
                        Delete Source
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {currentSource.description || 'Track chapter reading and question practice for this resource.'}
                  </p>
                </div>

                {/* Sub-filters for cards */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`rounded-lg px-2.5 py-1 ${
                      filterMode === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                    }`}
                  >
                    All Chapters
                  </button>
                  <button
                    onClick={() => setFilterMode('need-theory')}
                    className={`rounded-lg px-2.5 py-1 ${
                      filterMode === 'need-theory' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                    }`}
                  >
                    Need Theory
                  </button>
                  <button
                    onClick={() => setFilterMode('need-questions')}
                    className={`rounded-lg px-2.5 py-1 ${
                      filterMode === 'need-questions' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                    }`}
                  >
                    Need Questions
                  </button>
                  <button
                    onClick={() => setFilterMode('completed')}
                    className={`rounded-lg px-2.5 py-1 ${
                      filterMode === 'completed' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                    }`}
                  >
                    Both Done
                  </button>
                </div>
              </div>
            )}

            {/* Chapter Cards List for Selected Source */}
            <div className="mt-4 space-y-2.5">
              {filteredChapters.map((chapter) => {
                const rec = getRecord(chapter.id, currentSource.id);
                const scoreKey = `${chapter.id}_${currentSource.id}`;
                const isEditingScore = editingScoreKey === scoreKey;

                return (
                  <div
                    key={chapter.id}
                    className={`flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                      rec.theoryCompleted && rec.questionsCompleted
                        ? 'border-emerald-500/30 bg-emerald-950/15'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    {/* Chapter Info */}
                    <div className="flex items-start gap-3 sm:items-center">
                      <span className="flex h-7 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 font-mono text-xs font-bold text-emerald-400">
                        {chapter.code}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{chapter.name}</h4>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                          <span>{chapter.category}</span>
                          <span>·</span>
                          <span>{chapter.examWeight.toUpperCase()} Weight</span>
                        </div>
                      </div>
                    </div>

                    {/* Dual Checkboxes & Performance Input */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* 1. Chapter Theory Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleTheory(chapter.id, currentSource.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          rec.theoryCompleted
                            ? 'border-teal-500 bg-teal-500/20 text-teal-300 shadow-sm'
                            : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-teal-500/50 hover:text-slate-200'
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            rec.theoryCompleted
                              ? 'border-teal-400 bg-teal-400 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {rec.theoryCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>Chapter Complete</span>
                      </button>

                      {/* 2. Questions Checkbox (can tick just after that) */}
                      <button
                        type="button"
                        onClick={() => handleToggleQuestions(chapter.id, currentSource.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          rec.questionsCompleted
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm'
                            : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-cyan-500/50 hover:text-slate-200'
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            rec.questionsCompleted
                              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {rec.questionsCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>Questions Solved</span>
                      </button>

                      {/* Score Input / Display */}
                      {isEditingScore ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="e.g. 85% or 17/20"
                            value={tempScore}
                            onChange={(e) => setTempScore(e.target.value)}
                            className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white focus:border-cyan-500 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveScore(chapter.id, currentSource.id)}
                            className="rounded-lg bg-cyan-500 px-2 py-1 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingScoreKey(scoreKey);
                            setTempScore(rec.score || '');
                          }}
                          className={`rounded-lg border px-2 py-1 text-xs font-mono transition-colors ${
                            rec.score
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold'
                              : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                          }`}
                          title="Click to record question accuracy or score"
                        >
                          {rec.score ? `Score: ${rec.score}` : '+ Score'}
                        </button>
                      )}

                      {/* Confidence Stars */}
                      <div className="flex items-center gap-0.5">
                        {([1, 2, 3, 4, 5] as const).map((star) => (
                          <button
                            key={star}
                            onClick={() => handleSetConfidence(chapter.id, currentSource.id, star)}
                            className={`p-1 transition-colors ${
                              (rec.confidence || 0) >= star
                                ? 'text-amber-400'
                                : 'text-slate-700 hover:text-amber-400/50'
                            }`}
                            title={`Confidence: ${star}/5`}
                          >
                            <Star className="h-3.5 w-3.5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
