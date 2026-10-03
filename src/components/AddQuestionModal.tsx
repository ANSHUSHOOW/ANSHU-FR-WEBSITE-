import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Award } from 'lucide-react';
import { PracticeQuestion } from '../types';

interface AddQuestionModalProps {
  isOpen: boolean;
  chapterName: string;
  onClose: () => void;
  onAddQuestion: (question: Omit<PracticeQuestion, 'id' | 'completed'>) => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  chapterName,
  onClose,
  onAddQuestion,
}) => {
  const [title, setTitle] = useState('');
  const [sourceName, setSourceName] = useState('Kaplan Exam Kit');
  const [examSection, setExamSection] = useState<PracticeQuestion['examSection']>('Section B (OT Case)');
  const [marks, setMarks] = useState<number>(10);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddQuestion({
      title: title.trim(),
      sourceName: sourceName.trim() || undefined,
      examSection,
      marks: Number(marks) || 10,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onClose();
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
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Add Practice Question</h3>
                <p className="text-xs text-slate-400 line-clamp-1">For {chapterName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Question Title */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Question Name &amp; Scenario *
              </label>
              <input
                type="text"
                placeholder="e.g. Q18: Paladin & Sub Co - Consolidated Balance Sheet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Source Name & Exam Section */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-300">Source / Kit</label>
                <input
                  type="text"
                  placeholder="e.g. Kaplan Kit, BPP Kit, CBE"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Exam Section</label>
                <select
                  value={examSection}
                  onChange={(e) => setExamSection(e.target.value as PracticeQuestion['examSection'])}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Section A (MCQ)">Section A (MCQ - 2 marks)</option>
                  <option value="Section B (OT Case)">Section B (Case - 10 marks)</option>
                  <option value="Section C (Constructed Response)">Section C (Constructed - 20 marks)</option>
                </select>
              </div>
            </div>

            {/* Marks */}
            <div>
              <label className="text-xs font-medium text-slate-300">Marks Allocated</label>
              <input
                type="number"
                min={1}
                max={50}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-slate-300">Key Points / Hints</label>
              <input
                type="text"
                placeholder="e.g. Watch out for NCI at fair value and mid-year timing"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Add Practice Question
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
