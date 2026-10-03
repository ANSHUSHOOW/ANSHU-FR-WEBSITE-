import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, BookCheck, HelpCircle, Edit3, Calendar } from 'lucide-react';
import { Chapter, ChapterProgress, StudySource, Task, ExamSettings } from '../types';

interface StatsOverviewProps {
  chapters: Chapter[];
  sources: StudySource[];
  progress: ChapterProgress[];
  tasks: Task[];
  settings: ExamSettings;
  onUpdateSettings: (settings: ExamSettings) => void;
  onOpenDaysModal?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  chapters,
  sources,
  progress,
  tasks,
  settings,
  onUpdateSettings,
  onOpenDaysModal,
}) => {
  const [isEditingExamDate, setIsEditingExamDate] = useState(false);
  const [tempExamDate, setTempExamDate] = useState(settings.examDate);

  // Calculations
  const totalChapters = chapters.length;

  // Theory progress: A chapter is considered theory complete if completed in AT LEAST ONE source (or all)
  const chaptersWithTheoryDone = chapters.filter((ch) =>
    progress.some((p) => p.chapterId === ch.id && p.theoryCompleted)
  ).length;

  // Question progress: A chapter has questions completed if at least one source questions is marked done
  const chaptersWithQuestionsDone = chapters.filter((ch) =>
    progress.some((p) => p.chapterId === ch.id && p.questionsCompleted)
  ).length;

  // Total dual check marks across all chapter x source pairs
  const totalPairs = totalChapters * (sources.length || 1);
  const totalTheoryTicks = progress.filter((p) => p.theoryCompleted).length;
  const totalQuestionTicks = progress.filter((p) => p.questionsCompleted).length;
  const overallCoveragePercent = totalPairs > 0 
    ? Math.round(((totalTheoryTicks + totalQuestionTicks) / (totalPairs * 2)) * 100) 
    : 0;

  // Today's tasks
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Days left to exam
  const examDate = new Date(settings.examDate);
  const now = new Date();
  const diffTime = examDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleSaveExamDate = () => {
    if (tempExamDate) {
      onUpdateSettings({ ...settings, examDate: tempExamDate });
    }
    setIsEditingExamDate(false);
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Exam Banner */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            ACCA FR Exam Readiness Dashboard
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Financial Reporting (FR) Paper
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track daily study objectives, master standard by standard, and verify questions across books and CBE platforms.
          </p>
        </div>

        {/* Exam Countdown & Edit Target Date */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Target Exam Date</span>
                {onOpenDaysModal && (
                  <button
                    onClick={onOpenDaysModal}
                    className="text-emerald-400 hover:underline text-[11px] font-medium ml-1"
                    title="Configure days left or milestones"
                  >
                    Edit Days Left
                  </button>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-200">
                  {new Date(settings.examDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-xs font-bold tabular-nums text-emerald-400">
                  ({daysLeft} days left)
                </span>
              </div>
            </div>
          </div>

          {onOpenDaysModal && (
            <button
              onClick={onOpenDaysModal}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/25"
            >
              <span>+ Set Days Left / Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* 1. Today's Tasks */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Today's Tasks</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-white">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-500">/ {totalTasks} done</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${taskProgressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>Progress</span>
            <span className="tabular-nums font-semibold text-emerald-400">{taskProgressPercent}%</span>
          </div>
        </div>

        {/* 2. Theory Chapters Covered */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Theory Read</span>
            <BookCheck className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-white">
              {chaptersWithTheoryDone}
            </span>
            <span className="text-xs text-slate-500">/ {totalChapters} chapters</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${totalChapters > 0 ? (chaptersWithTheoryDone / totalChapters) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>Syllabus Read</span>
            <span className="tabular-nums font-semibold text-teal-400">
              {totalChapters > 0 ? Math.round((chaptersWithTheoryDone / totalChapters) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 3. Questions Solved */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Questions Practiced</span>
            <HelpCircle className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-white">
              {chaptersWithQuestionsDone}
            </span>
            <span className="text-xs text-slate-500">/ {totalChapters} chapters</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${totalChapters > 0 ? (chaptersWithQuestionsDone / totalChapters) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>Kit Questions</span>
            <span className="tabular-nums font-semibold text-cyan-400">
              {totalChapters > 0 ? Math.round((chaptersWithQuestionsDone / totalChapters) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* 4. Multi-Source Coverage */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Overall Coverage</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-white">
              {overallCoveragePercent}%
            </span>
            <span className="text-xs text-slate-500">across {sources.length} sources</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${overallCoveragePercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>{totalTheoryTicks + totalQuestionTicks} total ticks</span>
            <span className="tabular-nums font-semibold text-indigo-400">
              {totalPairs * 2} targets
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
