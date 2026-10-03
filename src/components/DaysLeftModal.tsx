import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  Plus,
  Check,
  Trash2,
  Sparkles,
  Target,
  ArrowRight,
} from 'lucide-react';
import { ExamSettings, StudyMilestone } from '../types';
import { triggerStudyConfetti } from '../utils/confetti';

interface DaysLeftModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ExamSettings;
  onUpdateSettings: (settings: ExamSettings) => void;
}

export const DaysLeftModal: React.FC<DaysLeftModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  // Current days left calculation
  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const initialDays = calculateDaysLeft(settings.examDate);

  const [inputDaysLeft, setInputDaysLeft] = useState<number>(initialDays);
  const [selectedDate, setSelectedDate] = useState<string>(settings.examDate);
  const [mode, setMode] = useState<'days' | 'date'>('days');

  // New milestone form
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDays, setNewMilestoneDays] = useState(20);

  if (!isOpen) return null;

  // When user enters days left directly, update the target date
  const handleDaysChange = (days: number) => {
    setInputDaysLeft(days);
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setSelectedDate(futureDate.toISOString().split('T')[0]);
  };

  // When user picks date, update days left
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setInputDaysLeft(calculateDaysLeft(dateStr));
  };

  // Apply standard ACCA Session presets
  const applyPresetSession = (monthName: string, year: number, day: number = 7) => {
    const monthIndex = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].findIndex(
      (m) => monthName.toLowerCase().startsWith(m.toLowerCase())
    );
    const d = new Date(year, monthIndex, day);
    const dateStr = d.toISOString().split('T')[0];
    handleDateChange(dateStr);
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      ...settings,
      examDate: selectedDate,
    });
    triggerStudyConfetti(0.4);
    onClose();
  };

  // Milestone toggling
  const handleToggleMilestone = (milestoneId: string) => {
    const updated = (settings.milestones || []).map((m) => {
      if (m.id === milestoneId) {
        const completed = !m.completed;
        if (completed) triggerStudyConfetti(0.5);
        return { ...m, completed };
      }
      return m;
    });
    onUpdateSettings({ ...settings, milestones: updated });
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    const updated = (settings.milestones || []).filter((m) => m.id !== milestoneId);
    onUpdateSettings({ ...settings, milestones: updated });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newMilestone: StudyMilestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      daysRemainingTarget: Number(newMilestoneDays) || 15,
      completed: false,
    };

    onUpdateSettings({
      ...settings,
      milestones: [...(settings.milestones || []), newMilestone],
    });

    setNewMilestoneTitle('');
    triggerStudyConfetti(0.3);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Target Exam &amp; Days Left</h3>
                <p className="text-xs text-slate-400">
                  Configure countdown days and milestone checkpoints
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Mode Switcher */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setMode('days')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  mode === 'days'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Set by Days Left
              </button>
              <button
                type="button"
                onClick={() => setMode('date')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  mode === 'date'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Set by Calendar Date
              </button>
            </div>

            {/* Input according to mode */}
            {mode === 'days' ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <label className="text-xs font-medium text-slate-300">
                  How many days left until your FR Exam / Mock?
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={inputDaysLeft}
                    onChange={(e) => handleDaysChange(Number(e.target.value))}
                    className="w-28 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xl font-bold font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="text-xs text-slate-400">
                    <div>Days remaining until target date:</div>
                    <div className="font-semibold text-slate-200">
                      {new Date(selectedDate).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick day buttons */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[15, 30, 45, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDaysChange(d)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-mono font-medium transition-colors ${
                        inputDaysLeft === d
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <label className="text-xs font-medium text-slate-300">
                  Select Target Exam Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
                <div className="mt-2 text-xs font-mono text-emerald-400">
                  {inputDaysLeft} days left from today
                </div>
              </div>
            )}

            {/* Official ACCA Sitting Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-400">
                Official ACCA Exam Session Presets:
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => applyPresetSession('Jun', 2026, 8)}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-center text-xs hover:border-emerald-500 transition-colors"
                >
                  <div className="font-bold text-white">June Sitting</div>
                  <div className="text-[10px] text-slate-400">Early June</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSession('Sep', 2026, 7)}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-center text-xs hover:border-emerald-500 transition-colors"
                >
                  <div className="font-bold text-white">Sept Sitting</div>
                  <div className="text-[10px] text-slate-400">Early Sept</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSession('Dec', 2026, 7)}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-center text-xs hover:border-emerald-500 transition-colors"
                >
                  <div className="font-bold text-white">Dec Sitting</div>
                  <div className="text-[10px] text-slate-400">Early Dec</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSession('Mar', 2027, 8)}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-center text-xs hover:border-emerald-500 transition-colors"
                >
                  <div className="font-bold text-white">March Sitting</div>
                  <div className="text-[10px] text-slate-400">Early March</div>
                </button>
              </div>
            </div>

            {/* Milestone Checkpoints Section */}
            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Revision Milestones by Days Left
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {(settings.milestones || []).filter((m) => m.completed).length}/{(settings.milestones || []).length} Reached
                </span>
              </div>

              {/* Milestones list */}
              <div className="mt-2.5 space-y-1.5">
                {(settings.milestones || []).map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between gap-2.5 rounded-lg border p-2 text-xs transition-all ${
                      m.completed
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-400'
                        : 'border-slate-800 bg-slate-950/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleMilestone(m.id)}
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                          m.completed
                            ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {m.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <span className={m.completed ? 'line-through text-slate-500' : 'font-medium'}>
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                        @{m.daysRemainingTarget}d left
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Milestone Form */}
              <form onSubmit={handleAddMilestone} className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Complete 5 mock exams on CBE platform..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={newMilestoneDays}
                  onChange={(e) => setNewMilestoneDays(Number(e.target.value))}
                  className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-mono text-center text-white focus:border-emerald-500 focus:outline-none"
                  title="Target days remaining"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  + Add
                </button>
              </form>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Save Exam Countdown ({inputDaysLeft} Days Left)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
