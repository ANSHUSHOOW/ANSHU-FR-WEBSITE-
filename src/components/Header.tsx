import React from 'react';
import { Calendar, Clock, Flame, Download, Sparkles, BookOpen } from 'lucide-react';
import { ExamSettings } from '../types';

interface HeaderProps {
  settings: ExamSettings;
  onUpdateSettings: (settings: ExamSettings) => void;
  onOpenTimer: () => void;
  onOpenExport: () => void;
  onOpenDaysModal?: () => void;
  isTimerRunning: boolean;
  timerSecondsLeft: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenTimer,
  onOpenExport,
  onOpenDaysModal,
  isTimerRunning,
  timerSecondsLeft,
}) => {
  // Calculate days left to exam
  const examDate = new Date(settings.examDate);
  const now = new Date();
  const diffTime = examDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                ACCA FR <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Mastery Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">Financial Reporting Exam Preparation</p>
          </div>
        </div>

        {/* Zone 2: Navigation anchor links */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-400 md:flex">
          <a href="#todays-tasks" className="transition-colors hover:text-emerald-400">
            Today's Tasks
          </a>
          <a href="#fr-chapters" className="transition-colors hover:text-emerald-400">
            Syllabus Chapters
          </a>
          <a href="#source-progress" className="transition-colors hover:text-emerald-400">
            Books &amp; Platforms Matrix
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Study Streak */}
          <div
            title={`Current Study Streak: ${settings.studyStreak} days`}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-400 shadow-sm"
          >
            <Flame className="h-4 w-4 animate-pulse text-amber-400" />
            <span className="tabular-nums">{settings.studyStreak}d Streak</span>
          </div>

          {/* Exam Countdown (clickable to open Days Left Modal) */}
          <button
            onClick={onOpenDaysModal}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-500/20 hover:border-emerald-400"
            title="Click to change days left or target exam date"
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold tabular-nums text-emerald-400">{daysLeft}</span>
            <span className="hidden sm:inline">days left</span>
          </button>

          {/* Pomodoro Timer button */}
          <button
            onClick={onOpenTimer}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              isTimerRunning
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20 animate-pulse'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
            title="Open Focus Study Timer"
          >
            <Clock className={`h-3.5 w-3.5 ${isTimerRunning ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="tabular-nums font-mono font-semibold">
              {isTimerRunning ? formatTimer(timerSecondsLeft) : 'Focus Timer'}
            </span>
          </button>

          {/* Export / Backup button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            title="Backup & Export Study Data"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>
        </div>
      </div>
    </header>
  );
};
