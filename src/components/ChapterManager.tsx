import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Link2,
  ExternalLink,
  Book,
  Globe,
  Video,
  FileText,
  HelpCircle,
  Award,
  Check,
} from 'lucide-react';
import { Chapter, ChapterProgress, SyllabusCategory, StudySource, ChapterResourceLink, PracticeQuestion } from '../types';
import { triggerStudyConfetti, triggerBigCelebration } from '../utils/confetti';

interface ChapterManagerProps {
  chapters: Chapter[];
  sources: StudySource[];
  progress: ChapterProgress[];
  onOpenAddModal: () => void;
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapterId: string) => void;
  onResetToDefaults: () => void;
  onQuickAddTaskForChapter: (chapter: Chapter) => void;
  onScrollToMatrixForChapter?: (chapterId: string) => void;
  onToggleResourceLink: (chapterId: string, resourceId: string) => void;
  onDeleteResourceLink: (chapterId: string, resourceId: string) => void;
  onTogglePracticeQuestion: (chapterId: string, questionId: string) => void;
  onDeletePracticeQuestion: (chapterId: string, questionId: string) => void;
  onOpenAddResourceModal: (chapter: Chapter) => void;
  onOpenAddQuestionModal: (chapter: Chapter) => void;
}

export const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  sources,
  progress,
  onOpenAddModal,
  onEditChapter,
  onDeleteChapter,
  onResetToDefaults,
  onQuickAddTaskForChapter,
  onScrollToMatrixForChapter,
  onToggleResourceLink,
  onDeleteResourceLink,
  onTogglePracticeQuestion,
  onDeletePracticeQuestion,
  onOpenAddResourceModal,
  onOpenAddQuestionModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(chapters[0]?.id || null);

  // Categories list from current chapters
  const categories = ['all', ...Array.from(new Set(chapters.map((c) => c.category)))];

  // Filtering
  const filteredChapters = chapters.filter((chapter) => {
    const matchesSearch =
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chapter.notes && chapter.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || chapter.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  const handleResourceCheck = (chapterId: string, res: ChapterResourceLink) => {
    if (!res.completed) {
      triggerStudyConfetti(0.6);
    }
    onToggleResourceLink(chapterId, res.id);
  };

  const handleQuestionCheck = (chapterId: string, q: PracticeQuestion) => {
    if (!q.completed) {
      triggerStudyConfetti(0.65);
    }
    onTogglePracticeQuestion(chapterId, q.id);
  };

  return (
    <section id="fr-chapters" className="mb-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
        {/* Section Top Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                ACCA FR Syllabus Chapters &amp; Question Practice
              </h2>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-300">
                {filteredChapters.length} of {chapters.length} Chapters
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Add chapter names, attach website &amp; book chapter links with ticks, and solve practice questions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onResetToDefaults}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              title="Reset chapters to official ACCA FR syllabus defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Chapter</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search standards (e.g. IAS 16, Leases)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Chips / Segmented tabs */}
          <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1 text-xs">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Areas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Grid / List */}
        <div className="mt-5 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredChapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center">
                <AlertCircle className="h-8 w-8 text-slate-600" />
                <p className="mt-2 text-sm text-slate-300">No chapters match your search or filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-2 text-xs text-emerald-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredChapters.map((chapter) => {
                const isExpanded = expandedChapterId === chapter.id;

                // Resource links and practice questions progress
                const resources = chapter.resourceLinks || [];
                const completedResources = resources.filter((r) => r.completed).length;

                const questions = chapter.practiceQuestions || [];
                const completedQuestions = questions.filter((q) => q.completed).length;

                const isChapterFullyPracticed =
                  questions.length > 0 && completedQuestions === questions.length;

                return (
                  <motion.div
                    key={chapter.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden rounded-xl border transition-all ${
                      isChapterFullyPracticed
                        ? 'border-emerald-500/40 bg-emerald-950/15'
                        : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Chapter Primary Header Row */}
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Left: Code, Name, Category */}
                      <div className="flex items-start gap-3 sm:items-center">
                        <span className="flex h-8 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-xs font-mono font-bold text-emerald-400">
                          {chapter.code}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">
                              {chapter.name}
                            </h3>
                            {isChapterFullyPracticed && (
                              <span title="All practice questions solved for this chapter!">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              </span>
                            )}
                          </div>

                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>{chapter.category}</span>
                            <span>·</span>
                            <span
                              className={
                                chapter.examWeight === 'high'
                                  ? 'font-medium text-amber-400'
                                  : chapter.examWeight === 'medium'
                                  ? 'text-teal-400'
                                  : 'text-slate-500'
                              }
                            >
                              {chapter.examWeight === 'high'
                                ? 'Section B/C High Weight'
                                : chapter.examWeight === 'medium'
                                ? 'Section A/B Common'
                                : 'Standard Weight'}
                            </span>
                            {chapter.targetDate && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar className="h-3 w-3" />
                                  Target: {chapter.targetDate}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Badges & Controls */}
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        {/* Links & Questions Count Indicators */}
                        <div className="flex items-center gap-2 text-xs">
                          {/* Book/Website links ticked */}
                          <div
                            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                              completedResources > 0
                                ? 'border-teal-500/30 bg-teal-500/10 text-teal-300'
                                : 'border-slate-800 bg-slate-950 text-slate-500'
                            }`}
                            title="Completed reading resources & links for this chapter"
                          >
                            <Link2 className="h-3 w-3" />
                            <span>Read:</span>
                            <span className="tabular-nums font-bold">
                              {completedResources}/{resources.length}
                            </span>
                          </div>

                          {/* Questions solved count */}
                          <div
                            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                              completedQuestions > 0
                                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                                : 'border-slate-800 bg-slate-950 text-slate-500'
                            }`}
                            title="Completed practice questions for this chapter"
                          >
                            <HelpCircle className="h-3 w-3" />
                            <span>Questions:</span>
                            <span className="tabular-nums font-bold">
                              {completedQuestions}/{questions.length}
                            </span>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onQuickAddTaskForChapter(chapter)}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                            title="Add a daily study task for this chapter"
                          >
                            + Today's Task
                          </button>

                          {/* Expand/Collapse Resources & Practice Questions */}
                          <button
                            type="button"
                            onClick={() => toggleExpand(chapter.id)}
                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                              isExpanded
                                ? 'bg-slate-800 text-emerald-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                            title={isExpanded ? 'Hide details' : 'View links & practice questions'}
                          >
                            <span>{isExpanded ? 'Collapse' : 'Study & Practice'}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => onEditChapter(chapter)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            title="Edit chapter name or details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => onDeleteChapter(chapter.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                            title="Delete chapter"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDABLE SUB-SECTION: RESOURCES & PRACTICE QUESTIONS */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-800 bg-slate-950/70 p-4 sm:p-5 space-y-5"
                      >
                        {/* Summary Notes if present */}
                        {chapter.notes && (
                          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              Key Standard Workings &amp; Exam Notes:
                            </span>
                            <p className="mt-1 text-xs text-slate-300 leading-relaxed font-mono">
                              {chapter.notes}
                            </p>
                          </div>
                        )}

                        {/* PART 1: RELEVANT WEBSITES & BOOK CHAPTERS SECTION WITH CHECKBOXES */}
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded bg-teal-500/15 text-teal-400">
                                <Link2 className="h-3.5 w-3.5" />
                              </span>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                                Relevant Websites &amp; Book Chapters ({completedResources}/{resources.length} Complete)
                              </h4>
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenAddResourceModal(chapter)}
                              className="flex items-center gap-1 rounded-lg border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[11px] font-semibold text-teal-300 hover:bg-teal-500/20 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Website / Book Link</span>
                            </button>
                          </div>

                          {/* List of Resource Links */}
                          <div className="mt-2.5 space-y-1.5">
                            {resources.length === 0 ? (
                              <p className="text-xs text-slate-500 italic py-2">
                                No links or book chapters added yet. Click "+ Add Website / Book Link" above to attach reading material.
                              </p>
                            ) : (
                              resources.map((res) => (
                                <div
                                  key={res.id}
                                  className={`flex items-center justify-between gap-3 rounded-lg border p-2.5 text-xs transition-all ${
                                    res.completed
                                      ? 'border-teal-500/30 bg-teal-950/15 text-slate-400'
                                      : 'border-slate-800 bg-slate-900/40 text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  {/* Checkbox & Details */}
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => handleResourceCheck(chapter.id, res)}
                                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                                        res.completed
                                          ? 'border-teal-400 bg-teal-400 text-slate-950 shadow-sm'
                                          : 'border-slate-600 bg-slate-950 hover:border-teal-400'
                                      }`}
                                      title={res.completed ? 'Mark incomplete' : 'Mark section/resource as completed'}
                                    >
                                      {res.completed && <Check className="h-3 w-3 stroke-[3]" />}
                                    </button>

                                    <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                                      {res.type === 'book' && <Book className="h-3.5 w-3.5 text-emerald-400" />}
                                      {res.type === 'website' && <Globe className="h-3.5 w-3.5 text-cyan-400" />}
                                      {res.type === 'video' && <Video className="h-3.5 w-3.5 text-amber-400" />}
                                      {res.type === 'article' && <FileText className="h-3.5 w-3.5 text-indigo-400" />}
                                    </div>

                                    <div className="min-w-0">
                                      <span className={res.completed ? 'line-through text-slate-500' : 'font-medium text-slate-200'}>
                                        {res.title}
                                      </span>
                                      {res.pageOrChapterRef && (
                                        <span className="ml-2 font-mono text-[11px] text-slate-400">
                                          ({res.pageOrChapterRef})
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Link Action & Delete */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    {res.url && (
                                      <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-cyan-400 hover:bg-slate-800 transition-colors"
                                      >
                                        <span>Open Link</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => onDeleteResourceLink(chapter.id, res.id)}
                                      className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                                      title="Remove resource link"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* PART 2: PRACTICE QUESTIONS SUB-SECTION WITH INDIVIDUAL CHECKBOXES */}
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/15 text-cyan-400">
                                <HelpCircle className="h-3.5 w-3.5" />
                              </span>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                                Practice Questions Sub-Section ({completedQuestions}/{questions.length} Solved)
                              </h4>
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenAddQuestionModal(chapter)}
                              className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Practice Question</span>
                            </button>
                          </div>

                          {/* List of Practice Questions */}
                          <div className="mt-2.5 space-y-2">
                            {questions.length === 0 ? (
                              <p className="text-xs text-slate-500 italic py-2">
                                No questions added for this chapter yet. Click "+ Add Practice Question" to track Kaplan, BPP, or CBE questions.
                              </p>
                            ) : (
                              questions.map((q) => (
                                <div
                                  key={q.id}
                                  className={`flex flex-col gap-2 rounded-xl border p-3 transition-all sm:flex-row sm:items-center sm:justify-between ${
                                    q.completed
                                      ? 'border-cyan-500/30 bg-cyan-950/15 text-slate-400'
                                      : 'border-slate-800 bg-slate-900/50 text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  {/* Left: Checkbox + Title + Metadata */}
                                  <div className="flex items-start gap-3 sm:items-center min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => handleQuestionCheck(chapter.id, q)}
                                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all mt-0.5 sm:mt-0 ${
                                        q.completed
                                          ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                                          : 'border-slate-600 bg-slate-950 hover:border-cyan-400'
                                      }`}
                                      title={q.completed ? 'Mark uncompleted' : 'Mark question as completed'}
                                    >
                                      {q.completed && <Check className="h-3 w-3 stroke-[3]" />}
                                    </button>

                                    <div className="min-w-0">
                                      <p className={`text-xs font-semibold ${q.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                        {q.title}
                                      </p>
                                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                        {q.sourceName && (
                                          <span className="font-medium text-emerald-400">
                                            {q.sourceName}
                                          </span>
                                        )}
                                        {q.examSection && (
                                          <>
                                            <span>·</span>
                                            <span className="text-cyan-300">{q.examSection}</span>
                                          </>
                                        )}
                                        {q.marks && (
                                          <>
                                            <span>·</span>
                                            <span className="tabular-nums font-mono">{q.marks} marks</span>
                                          </>
                                        )}
                                        {q.score && (
                                          <>
                                            <span>·</span>
                                            <span className="font-bold text-amber-400">Score: {q.score}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Actions */}
                                  <div className="flex items-center gap-1 justify-end shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => onDeletePracticeQuestion(chapter.id, q.id)}
                                      className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                                      title="Remove question"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
