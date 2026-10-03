import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Quote,
  Shuffle,
  Plus,
  Image as ImageIcon,
  Check,
  X,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { MotivationalQuote } from '../types';
import { STUDY_WALLPAPERS } from '../data/defaultData';
import { triggerStudyConfetti } from '../utils/confetti';

interface MotivationalCardProps {
  quotes: MotivationalQuote[];
  onAddQuote: (quote: Omit<MotivationalQuote, 'id'>) => void;
  onDeleteQuote: (id: string) => void;
  selectedWallpaperIndex: number;
  onSelectWallpaper: (index: number) => void;
  customWallpaperUrl?: string;
  onSetCustomWallpaperUrl: (url: string) => void;
}

export const MotivationalCard: React.FC<MotivationalCardProps> = ({
  quotes,
  onAddQuote,
  onDeleteQuote,
  selectedWallpaperIndex,
  onSelectWallpaper,
  customWallpaperUrl,
  onSetCustomWallpaperUrl,
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [isWallpaperPickerOpen, setIsWallpaperPickerOpen] = useState(false);

  // New quote form state
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [newQuoteTag, setNewQuoteTag] = useState('ACCA Motivation');

  // Custom image input state
  const [tempImageUrl, setTempImageUrl] = useState(customWallpaperUrl || '');

  const activeQuote = quotes[currentQuoteIndex] || quotes[0] || {
    id: 'default',
    quote: 'Stay focused on your Financial Reporting goal. One standard at a time.',
    author: 'ACCA Community',
  };

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % (quotes.length || 1));
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    onAddQuote({
      quote: newQuoteText.trim(),
      author: newQuoteAuthor.trim() || 'Anonymous',
      tag: newQuoteTag.trim() || 'Study Focus',
    });

    setNewQuoteText('');
    setNewQuoteAuthor('');
    setIsAddQuoteOpen(false);
    triggerStudyConfetti(0.35);
  };

  const handleSaveCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    onSetCustomWallpaperUrl(tempImageUrl.trim());
    setIsWallpaperPickerOpen(false);
    triggerStudyConfetti(0.35);
  };

  // Determine current active background image
  let activeBgImage: string | null = null;
  if (customWallpaperUrl) {
    activeBgImage = customWallpaperUrl;
  } else if (STUDY_WALLPAPERS[selectedWallpaperIndex]) {
    activeBgImage = STUDY_WALLPAPERS[selectedWallpaperIndex].url;
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all">
      {/* Background Image with Apple-style smooth gradient scrim */}
      {activeBgImage ? (
        <div className="absolute inset-0 z-0">
          <img
            src={activeBgImage}
            alt="Study background"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center filter brightness-[0.38] contrast-[1.1] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      )}

      {/* Glassmorphic Content Container */}
      <div className="relative z-10 p-5 sm:p-7 backdrop-blur-sm">
        {/* Top Bar inside Card */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Quote className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Daily Study Inspiration &amp; Vision
            </span>
            {activeQuote.tag && (
              <>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">{activeQuote.tag}</span>
              </>
            )}
          </div>

          {/* Action buttons: Shuffle, Add Quote, Change Image */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNextQuote}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              title="Next quote"
            >
              <Shuffle className="h-3 w-3 text-cyan-400" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            <button
              onClick={() => setIsAddQuoteOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              title="Add your own motivational quote"
            >
              <Plus className="h-3 w-3 text-emerald-400" />
              <span>Add Quote</span>
            </button>

            <button
              onClick={() => setIsWallpaperPickerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              title="Change background image / mood"
            >
              <ImageIcon className="h-3 w-3 text-indigo-400" />
              <span className="hidden sm:inline">Theme Image</span>
            </button>
          </div>
        </div>

        {/* The Animated Quote Content */}
        <div className="my-4 min-h-[75px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuote.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="text-base font-semibold leading-relaxed text-slate-100 sm:text-lg italic font-serif">
                "{activeQuote.quote}"
              </blockquote>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span className="font-sans font-medium text-emerald-300 not-italic">
                  — {activeQuote.author}
                </span>

                {quotes.length > 1 && (
                  <span className="tabular-nums font-mono text-[11px] text-slate-400">
                    Quote {currentQuoteIndex + 1} of {quotes.length}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal 1: Add Custom Quote */}
      <AnimatePresence>
        {isAddQuoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddQuoteOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Add Motivational Quote</h3>
                <button
                  onClick={() => setIsAddQuoteOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuote} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300">Quote Text *</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Every day I practice I am one step closer to ACCA qualification..."
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-300">Author / Source</label>
                    <input
                      type="text"
                      placeholder="e.g. Future Affiliate"
                      value={newQuoteAuthor}
                      onChange={(e) => setNewQuoteAuthor(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">Tag / Theme</label>
                    <input
                      type="text"
                      placeholder="e.g. Revision Discipline"
                      value={newQuoteTag}
                      onChange={(e) => setNewQuoteTag(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddQuoteOpen(false)}
                    className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    Save Quote
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Change Background Image / Mood */}
      <AnimatePresence>
        {isWallpaperPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWallpaperPickerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Select Study Ambience &amp; Image</h3>
                  <p className="text-xs text-slate-400">Choose visual backdrop or provide a custom image URL</p>
                </div>
                <button
                  onClick={() => setIsWallpaperPickerOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Predefined Wallpapers */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-300">Curated Study Ambience:</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {STUDY_WALLPAPERS.map((wp, idx) => {
                    const isSelected = !customWallpaperUrl && selectedWallpaperIndex === idx;
                    return (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => {
                          onSetCustomWallpaperUrl('');
                          onSelectWallpaper(idx);
                        }}
                        className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                            : 'border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <img
                          src={wp.url}
                          alt={wp.name}
                          className="h-24 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-xs font-semibold text-white">{wp.name}</span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                              <Check className="h-3 w-3" /> Active
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL Form */}
              <form onSubmit={handleSaveCustomImage} className="mt-5 border-t border-slate-800 pt-4">
                <label className="text-xs font-semibold text-slate-300">Or Custom Image URL:</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/my-study-vision-board.jpg"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-400"
                  >
                    Apply URL
                  </button>
                </div>
                {customWallpaperUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      onSetCustomWallpaperUrl('');
                      setTempImageUrl('');
                    }}
                    className="mt-2 text-xs text-rose-400 hover:underline"
                  >
                    Reset to default background
                  </button>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
