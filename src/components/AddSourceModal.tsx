import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Book, Sparkles, Plus } from 'lucide-react';
import { StudySource, SourceType } from '../types';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: Omit<StudySource, 'id'>) => void;
}

const COLOR_OPTIONS = [
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
  { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
  { id: 'indigo', label: 'Indigo Purple', bg: 'bg-indigo-500' },
  { id: 'amber', label: 'Amber Gold', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose Pink', bg: 'bg-rose-500' },
  { id: 'teal', label: 'Teal Cyan', bg: 'bg-teal-500' },
];

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<SourceType>('book');
  const [color, setColor] = useState('emerald');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSource({
      name: name.trim(),
      type,
      color,
      url: url.trim() || undefined,
      description: description.trim() || undefined,
    });

    setName('');
    setUrl('');
    setDescription('');
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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add Study Source</h3>
                <p className="text-xs text-slate-400">
                  Track progress across books, websites, or test banks
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

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Source Type Toggle */}
            <div>
              <label className="text-xs font-medium text-slate-300">Source Type</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('book')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                    type === 'book'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Book className="h-4 w-4" />
                  <span>Physical / E-Book</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('website')}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                    type === 'website'
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Online / Website</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Source Name *
              </label>
              <input
                type="text"
                placeholder={
                  type === 'book'
                    ? 'e.g. Kaplan Exam Kit, Becker Revision, Notes'
                    : 'e.g. Acowtancy Classroom, OpenTuition, Study Hub'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* URL (Optional for website) */}
            {type === 'website' && (
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://studyhub.accaglobal.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Description / Edition Notes
              </label>
              <input
                type="text"
                placeholder="e.g. 2025/2026 Exam Edition - Section A, B & C questions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Color Accent */}
            <div>
              <label className="text-xs font-medium text-slate-300">Color Accent</label>
              <div className="mt-1.5 flex items-center gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`h-7 w-7 rounded-full ${c.bg} transition-transform ${
                      color === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
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
                className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Add Source
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
