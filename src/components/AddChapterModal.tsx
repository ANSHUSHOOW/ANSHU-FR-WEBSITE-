import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookPlus, Sparkles } from 'lucide-react';
import { Chapter, SyllabusCategory } from '../types';

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveChapter: (chapter: Partial<Chapter>) => void;
  editingChapter?: Chapter | null;
}

const CATEGORIES: SyllabusCategory[] = [
  'Framework & Ethics',
  'Assets & Tangibles',
  'Intangibles & Impairment',
  'Leases & Revenue',
  'Liabilities & Provisions',
  'Financial Instruments',
  'Tax & Reporting',
  'Group Accounts (Consolidation)',
  'Analysis & Interpretation',
];

export const AddChapterModal: React.FC<AddChapterModalProps> = ({
  isOpen,
  onClose,
  onSaveChapter,
  editingChapter,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SyllabusCategory>('Assets & Tangibles');
  const [examWeight, setExamWeight] = useState<'high' | 'medium' | 'normal'>('high');
  const [notes, setNotes] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    if (editingChapter) {
      setCode(editingChapter.code);
      setName(editingChapter.name);
      setCategory(editingChapter.category);
      setExamWeight(editingChapter.examWeight);
      setNotes(editingChapter.notes || '');
      setTargetDate(editingChapter.targetDate || '');
    } else {
      setCode('');
      setName('');
      setCategory('Assets & Tangibles');
      setExamWeight('high');
      setNotes('');
      setTargetDate('');
    }
  }, [editingChapter, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveChapter({
      id: editingChapter ? editingChapter.id : undefined,
      code: code.trim() || 'FR Topic',
      name: name.trim(),
      category,
      examWeight,
      notes: notes.trim(),
      targetDate: targetDate || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

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
                <BookPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingChapter ? 'Edit Chapter Name & Syllabus Standard' : 'Add New ACCA FR Chapter'}
                </h3>
                <p className="text-xs text-slate-400">
                  Manage syllabus standards, exam weight, and target study dates
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Standard Code */}
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-slate-300">
                  Standard / Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. IAS 16, IFRS 15"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Full Chapter Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-300">
                  Chapter Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Property, Plant and Equipment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                ACCA FR Syllabus Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SyllabusCategory)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Weight & Target Date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Exam Priority / Weight
                </label>
                <select
                  value={examWeight}
                  onChange={(e) => setExamWeight(e.target.value as 'high' | 'medium' | 'normal')}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="high">High Yield (Guaranteed in Section B/C)</option>
                  <option value="medium">Medium Yield (Common in Section A/B)</option>
                  <option value="normal">Standard / Theory Focus</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes / Key Formulas */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Key Exam Points / Formulas / Workings
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Workings 1-5 for consolidation, PIRATE criteria for IAS 38, ROU asset = PV of payments + initial direct costs..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                {editingChapter ? 'Update Chapter' : 'Add Chapter'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
