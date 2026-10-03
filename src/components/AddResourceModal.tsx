import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link2, Book, Globe, Video, FileText } from 'lucide-react';
import { ChapterResourceLink } from '../types';

interface AddResourceModalProps {
  isOpen: boolean;
  chapterName: string;
  onClose: () => void;
  onAddResource: (resource: Omit<ChapterResourceLink, 'id' | 'completed'>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  chapterName,
  onClose,
  onAddResource,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ChapterResourceLink['type']>('website');
  const [url, setUrl] = useState('');
  const [pageOrChapterRef, setPageOrChapterRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddResource({
      title: title.trim(),
      type,
      url: url.trim() || undefined,
      pageOrChapterRef: pageOrChapterRef.trim() || undefined,
    });

    setTitle('');
    setUrl('');
    setPageOrChapterRef('');
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <Link2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Add Study Link / Book Ref</h3>
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
            {/* Resource Type */}
            <div>
              <label className="text-xs font-medium text-slate-300">Resource Type</label>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setType('book')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-[11px] font-medium transition-all ${
                    type === 'book'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Book className="h-4 w-4" />
                  <span>Book</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('website')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-[11px] font-medium transition-all ${
                    type === 'website'
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-[11px] font-medium transition-all ${
                    type === 'video'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('article')}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-[11px] font-medium transition-all ${
                    type === 'article'
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Article</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Resource Name / Title *
              </label>
              <input
                type="text"
                placeholder={
                  type === 'book'
                    ? 'e.g. Kaplan Study Text: Chapter 2 - Property, Plant & Equipment'
                    : 'e.g. ACCA Study Hub: IAS 16 Interactive Quiz & Notes'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Book Chapter / Page Reference */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                Book Chapter &amp; Page Reference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 4, pp. 85-112"
                value={pageOrChapterRef}
                onChange={(e) => setPageOrChapterRef(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="text-xs font-medium text-slate-300">
                URL / Web Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://studyhub.accaglobal.com or OpenTuition URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
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
                className="rounded-xl bg-teal-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-colors"
              >
                Save Resource Link
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
