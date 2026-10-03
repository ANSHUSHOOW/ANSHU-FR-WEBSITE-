import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, X, Bell, BellOff, CheckCircle } from 'lucide-react';
import { triggerStudyConfetti } from '../utils/confetti';
import { Chapter } from '../types';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onTaskCompletedFromTimer?: (chapterId?: string) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  chapters,
  onTaskCompletedFromTimer,
}) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');

  // Switch modes
  const handleModeChange = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    let duration = 25 * 60;
    if (newMode === 'shortBreak') duration = 5 * 60;
    if (newMode === 'longBreak') duration = 15 * 60;
    setTotalSeconds(duration);
    setSecondsLeft(duration);
  };

  // Play audio chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext fallback
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      playChime();
      triggerStudyConfetti(0.5);
      if (mode === 'focus' && onTaskCompletedFromTimer) {
        onTaskCompletedFromTimer(selectedChapterId || undefined);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, mode]);

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  // Format time MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const progressRatio = (totalSeconds - secondsLeft) / totalSeconds;
  const strokeDashoffset = 565.48 * (1 - progressRatio); // 2 * PI * 90

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
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">Focus Study Timer</span>
              <span className="text-xs text-slate-400">Pomodoro Technique</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                title={soundEnabled ? 'Mute sound chime' : 'Enable sound chime'}
              >
                {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4 text-slate-500" />}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="mt-4 flex rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => handleModeChange('focus')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === 'focus'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === 'shortBreak'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === 'longBreak'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Chapter association */}
          <div className="mt-3">
            <label className="text-xs text-slate-400">Current Chapter Target:</label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">General ACCA FR Review / Question Kit</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.code} - {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timer Display with Circular Progress SVG */}
          <div className="relative my-6 flex items-center justify-center">
            <svg className="h-56 w-56 -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800/80"
              />
              {/* Progress animated circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={
                  mode === 'focus'
                    ? 'text-emerald-500 transition-all duration-500'
                    : mode === 'shortBreak'
                    ? 'text-teal-400 transition-all duration-500'
                    : 'text-cyan-400 transition-all duration-500'
                }
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-5xl font-extrabold tracking-tight tabular-nums text-white">
                {formattedTime}
              </span>
              <span className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                {isRunning ? (mode === 'focus' ? 'Deep Focus Session' : 'Resting & Recharging') : 'Paused'}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={toggleStartPause}
              className={`flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-slate-950 shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
                  : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 fill-slate-950" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-slate-950" />
                  <span>Start Studying</span>
                </>
              )}
            </button>

            {/* Manual complete button */}
            <button
              onClick={() => {
                setSecondsLeft(0);
                setIsRunning(false);
                playChime();
                triggerStudyConfetti(0.5);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:border-emerald-500 hover:text-emerald-400"
              title="Finish Session Now"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
