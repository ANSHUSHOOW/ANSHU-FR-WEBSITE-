import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Zap,
  Filter,
  Layers,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Task, Chapter, Priority } from '../types';
import { triggerStudyConfetti } from '../utils/confetti';

interface TodaysTasksProps {
  tasks: Task[];
  chapters: Chapter[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onClearCompletedTasks: () => void;
  onStartFocusTimer: (chapterId?: string) => void;
}

const PRESET_TASKS = [
  { title: 'Solve 10 Section B MCQs on IAS 16 Depreciation & Revaluation', minutes: 30, priority: 'high' as Priority, chapterCode: 'IAS 16' },
  { title: 'Practice Workings 1-5 for Consolidated Statement of Financial Position', minutes: 60, priority: 'high' as Priority, chapterCode: 'IFRS 3 / 10' },
  { title: 'Review IFRS 15 5-step revenue recognition criteria', minutes: 25, priority: 'medium' as Priority, chapterCode: 'IFRS 15' },
  { title: 'Calculate and interpret Profitability & Liquidity ratios on CBE mock', minutes: 45, priority: 'high' as Priority, chapterCode: 'Ratios' },
  { title: 'Read Technical Article on Lease Accounting (IFRS 16)', minutes: 30, priority: 'medium' as Priority, chapterCode: 'IFRS 16' },
];

export const TodaysTasks: React.FC<TodaysTasksProps> = ({
  tasks,
  chapters,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompletedTasks,
  onStartFocusTimer,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [priority, setPriority] = useState<Priority>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      chapterId: selectedChapterId || undefined,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      priority,
      completed: false,
    });

    setNewTaskTitle('');
    setSelectedChapterId('');
  };

  const handleApplyPreset = (preset: typeof PRESET_TASKS[0]) => {
    const matchedChapter = chapters.find((c) => c.code.toLowerCase().includes(preset.chapterCode.toLowerCase()));
    onAddTask({
      title: preset.title,
      chapterId: matchedChapter?.id,
      estimatedMinutes: preset.minutes,
      priority: preset.priority,
      completed: false,
    });
    setIsPresetsOpen(false);
  };

  const handleTaskCheck = (taskId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      triggerStudyConfetti(0.4);
    }
    onToggleTask(taskId);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <section id="todays-tasks" className="mb-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Zap className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Today's Study Tasks
              </h2>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-400">
                {completedCount} / {totalCount} Done
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {todayFormatted} · Focus on key IFRS standards and exam kit questions
            </p>
          </div>

          {/* Controls: Filter & Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/60 p-0.5 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pending ({totalCount - completedCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>

            {/* Quick preset dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPresetsOpen(!isPresetsOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>FR Presets</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isPresetsOpen && (
                <div className="absolute right-0 z-20 mt-2 w-72 origin-top-right rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    High Yield ACCA FR Study Targets
                  </div>
                  <div className="mt-1 space-y-1">
                    {PRESET_TASKS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleApplyPreset(preset)}
                        className="w-full text-left rounded-lg p-2 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                      >
                        <p className="font-medium text-slate-200">{preset.title}</p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{preset.minutes} mins</span>
                          <span>·</span>
                          <span className="text-emerald-400">{preset.chapterCode}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear completed button */}
            {completedCount > 0 && (
              <button
                onClick={onClearCompletedTasks}
                className="rounded-lg border border-slate-800 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                Clear Done
              </button>
            )}
          </div>
        </div>

        {/* Add New Task Form */}
        <form onSubmit={handleCreateTask} className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
          {/* Title Input */}
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="e.g. Read IAS 37 restructuring provisions & solve 5 kit questions..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Link Chapter */}
          <div className="sm:col-span-3">
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Link Chapter (Optional)</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.code} - {ch.name.length > 28 ? ch.name.substring(0, 28) + '...' : ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time & Priority */}
          <div className="flex gap-2 sm:col-span-2">
            <select
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              className="w-1/2 rounded-xl border border-slate-700 bg-slate-950/80 px-2 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
              title="Estimated duration in minutes"
            >
              <option value={15}>15m</option>
              <option value={30}>30m</option>
              <option value={45}>45m</option>
              <option value={60}>60m</option>
              <option value={90}>90m</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-1/2 rounded-xl border border-slate-700 bg-slate-950/80 px-2 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
              title="Priority"
            >
              <option value="high">High</option>
              <option value="medium">Med</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="flex h-full w-full items-center justify-center rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-40"
              title="Add task"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="mt-4 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-500/40" />
                <p className="mt-2 text-sm font-medium text-slate-300">
                  {filter === 'completed'
                    ? 'No completed tasks yet. Tick a task when finished!'
                    : 'No pending study tasks! Add your goals for today above.'}
                </p>
                <p className="text-xs text-slate-500">
                  Consistency is key to clearing ACCA Financial Reporting on the first attempt.
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => {
                const linkedChapter = chapters.find((c) => c.id === task.chapterId);
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                      task.completed
                        ? 'border-slate-800/50 bg-slate-950/40 text-slate-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    {/* Checkbox & Details */}
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleTaskCheck(task.id, task.completed)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          task.completed
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                            : 'border-slate-700 bg-slate-950 hover:border-emerald-500'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="h-4 w-4" />}
                      </button>

                      <div className="min-w-0">
                        <span
                          className={`text-sm font-medium transition-all ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Badges / Metadata without pill sandwich */}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          {linkedChapter && (
                            <>
                              <span className="font-semibold text-emerald-400">
                                {linkedChapter.code}
                              </span>
                              <span>·</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="tabular-nums">{task.estimatedMinutes}m</span>
                          </span>
                          <span>·</span>
                          <span
                            className={
                              task.priority === 'high'
                                ? 'text-rose-400 font-medium'
                                : task.priority === 'medium'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }
                          >
                            {task.priority.toUpperCase()} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Launch timer & Delete */}
                    <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {!task.completed && (
                        <button
                          type="button"
                          onClick={() => onStartFocusTimer(task.chapterId)}
                          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                          title="Start timer for this task"
                        >
                          <Clock className="h-3 w-3" />
                          <span className="hidden sm:inline">Focus</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
