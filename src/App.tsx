import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  getStoredChapters,
  saveStoredChapters,
  getStoredSources,
  saveStoredSources,
  getStoredTasks,
  saveStoredTasks,
  getStoredSettings,
  saveStoredSettings,
  getStoredProgress,
  saveStoredProgress,
  getStoredQuotes,
  saveStoredQuotes,
} from './utils/storage';
import {
  Chapter,
  StudySource,
  Task,
  ExamSettings,
  ChapterProgress,
  ChapterResourceLink,
  PracticeQuestion,
  MotivationalQuote,
} from './types';
import { DEFAULT_CHAPTERS } from './data/defaultData';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { MotivationalCard } from './components/MotivationalCard';
import { TodaysTasks } from './components/TodaysTasks';
import { ChapterManager } from './components/ChapterManager';
import { SourceProgressTracker } from './components/SourceProgressTracker';
import { AddChapterModal } from './components/AddChapterModal';
import { AddSourceModal } from './components/AddSourceModal';
import { AddResourceModal } from './components/AddResourceModal';
import { AddQuestionModal } from './components/AddQuestionModal';
import { DaysLeftModal } from './components/DaysLeftModal';
import { PomodoroTimer } from './components/PomodoroTimer';
import { ExportImportModal } from './components/ExportImportModal';
import { GeminiChatBox } from './components/GeminiChatBox';
import { triggerStudyConfetti, triggerBigCelebration } from './utils/confetti';

// Apple-style scroll reveal variant
const appleSectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export default function App() {
  // Core states loaded from localStorage
  const [chapters, setChapters] = useState<Chapter[]>(getStoredChapters);
  const [sources, setSources] = useState<StudySource[]>(getStoredSources);
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks);
  const [settings, setSettings] = useState<ExamSettings>(getStoredSettings);
  const [progress, setProgress] = useState<ChapterProgress[]>(getStoredProgress);
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(getStoredQuotes);

  // Modals state
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDaysModalOpen, setIsDaysModalOpen] = useState(false);

  // Chapter sub-modals (Resource link & Practice question)
  const [activeChapterForResource, setActiveChapterForResource] = useState<Chapter | null>(null);
  const [activeChapterForQuestion, setActiveChapterForQuestion] = useState<Chapter | null>(null);

  // Highlighted chapter when navigating from chapter section to matrix
  const [highlightedChapterId, setHighlightedChapterId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredChapters(chapters);
  }, [chapters]);

  useEffect(() => {
    saveStoredSources(sources);
  }, [sources]);

  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveStoredQuotes(quotes);
  }, [quotes]);

  // Reload all data after JSON import
  const handleDataReload = () => {
    setChapters(getStoredChapters());
    setSources(getStoredSources());
    setTasks(getStoredTasks());
    setSettings(getStoredSettings());
    setProgress(getStoredProgress());
    setQuotes(getStoredQuotes());
  };

  // ----------------------------------------------------
  // Task Handlers
  // ----------------------------------------------------
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const completed = !t.completed;
          return {
            ...t,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleClearCompletedTasks = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // ----------------------------------------------------
  // Quote Handlers
  // ----------------------------------------------------
  const handleAddQuote = (newQuoteData: Omit<MotivationalQuote, 'id'>) => {
    const quoteItem: MotivationalQuote = {
      ...newQuoteData,
      id: `q-${Date.now()}`,
    };
    setQuotes((prev) => [quoteItem, ...prev]);
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  // ----------------------------------------------------
  // Chapter Handlers
  // ----------------------------------------------------
  const handleSaveChapter = (chapterData: Partial<Chapter>) => {
    if (chapterData.id) {
      setChapters((prev) =>
        prev.map((ch) => (ch.id === chapterData.id ? ({ ...ch, ...chapterData } as Chapter) : ch))
      );
    } else {
      const newChapter: Chapter = {
        id: `ch-${Date.now()}`,
        code: chapterData.code || 'IFRS',
        name: chapterData.name || 'New Chapter',
        category: chapterData.category || 'Assets & Tangibles',
        examWeight: chapterData.examWeight || 'high',
        notes: chapterData.notes || '',
        targetDate: chapterData.targetDate,
        order: chapters.length + 1,
        resourceLinks: [],
        practiceQuestions: [],
      };
      setChapters((prev) => [...prev, newChapter]);
      triggerStudyConfetti(0.4);
    }
    setEditingChapter(null);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
      setProgress((prev) => prev.filter((p) => p.chapterId !== chapterId));
    }
  };

  const handleResetChaptersToDefault = () => {
    if (window.confirm('Reset all chapters and practice questions to standard ACCA FR syllabus defaults?')) {
      setChapters(DEFAULT_CHAPTERS);
      triggerStudyConfetti(0.4);
    }
  };

  const handleQuickAddTaskForChapter = (chapter: Chapter) => {
    handleAddTask({
      title: `Study ${chapter.code}: ${chapter.name}`,
      chapterId: chapter.id,
      estimatedMinutes: 45,
      priority: chapter.examWeight === 'high' ? 'high' : 'medium',
      completed: false,
    });
    const elem = document.getElementById('todays-tasks');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToMatrixForChapter = (chapterId: string) => {
    setHighlightedChapterId(chapterId);
    const elem = document.getElementById(`matrix-ch-${chapterId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      document.getElementById('source-progress')?.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setHighlightedChapterId(null);
    }, 2500);
  };

  // ----------------------------------------------------
  // Chapter Sub-features: Resource Links & Practice Questions
  // ----------------------------------------------------
  const handleToggleResourceLink = (chapterId: string, resourceId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          const updatedLinks = (ch.resourceLinks || []).map((link) => {
            if (link.id === resourceId) {
              const completed = !link.completed;
              return {
                ...link,
                completed,
                completedAt: completed ? new Date().toISOString() : undefined,
              };
            }
            return link;
          });
          return { ...ch, resourceLinks: updatedLinks };
        }
        return ch;
      })
    );
  };

  const handleDeleteResourceLink = (chapterId: string, resourceId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            resourceLinks: (ch.resourceLinks || []).filter((r) => r.id !== resourceId),
          };
        }
        return ch;
      })
    );
  };

  const handleAddResourceToChapter = (
    resource: Omit<ChapterResourceLink, 'id' | 'completed'>
  ) => {
    if (!activeChapterForResource) return;
    const newLink: ChapterResourceLink = {
      ...resource,
      id: `link-${Date.now()}`,
      completed: false,
    };

    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === activeChapterForResource.id) {
          return {
            ...ch,
            resourceLinks: [...(ch.resourceLinks || []), newLink],
          };
        }
        return ch;
      })
    );

    triggerStudyConfetti(0.5);
    setActiveChapterForResource(null);
  };

  const handleTogglePracticeQuestion = (chapterId: string, questionId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          const updatedQuestions = (ch.practiceQuestions || []).map((q) => {
            if (q.id === questionId) {
              const completed = !q.completed;
              return {
                ...q,
                completed,
                completedAt: completed ? new Date().toISOString() : undefined,
              };
            }
            return q;
          });
          return { ...ch, practiceQuestions: updatedQuestions };
        }
        return ch;
      })
    );
  };

  const handleDeletePracticeQuestion = (chapterId: string, questionId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            practiceQuestions: (ch.practiceQuestions || []).filter((q) => q.id !== questionId),
          };
        }
        return ch;
      })
    );
  };

  const handleAddQuestionToChapter = (
    question: Omit<PracticeQuestion, 'id' | 'completed'>
  ) => {
    if (!activeChapterForQuestion) return;
    const newQuestion: PracticeQuestion = {
      ...question,
      id: `q-${Date.now()}`,
      completed: false,
    };

    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === activeChapterForQuestion.id) {
          return {
            ...ch,
            practiceQuestions: [...(ch.practiceQuestions || []), newQuestion],
          };
        }
        return ch;
      })
    );

    triggerStudyConfetti(0.5);
    setActiveChapterForQuestion(null);
  };

  // ----------------------------------------------------
  // Source Progress Handlers (Books & Websites Matrix)
  // ----------------------------------------------------
  const handleUpdateProgress = (newRecord: ChapterProgress) => {
    setProgress((prev) => {
      const idx = prev.findIndex(
        (p) => p.chapterId === newRecord.chapterId && p.sourceId === newRecord.sourceId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newRecord;
        return copy;
      }
      return [...prev, newRecord];
    });
  };

  const handleAddSource = (sourceData: Omit<StudySource, 'id'>) => {
    const newSource: StudySource = {
      ...sourceData,
      id: `src-${Date.now()}`,
      isDefault: false,
    };
    setSources((prev) => [...prev, newSource]);
    triggerStudyConfetti(0.5);
  };

  const handleDeleteSource = (sourceId: string) => {
    if (window.confirm('Delete this study resource and all associated progress?')) {
      setSources((prev) => prev.filter((s) => s.id !== sourceId));
      setProgress((prev) => prev.filter((p) => p.sourceId !== sourceId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Apple-style sticky blur header */}
      <Header
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenDaysModal={() => setIsDaysModalOpen(true)}
        isTimerRunning={false}
        timerSecondsLeft={25 * 60}
      />

      {/* Main Container with smooth scrolling sections */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* SECTION: Overview & Countdown Dashboard */}
        <motion.div
          variants={appleSectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <StatsOverview
            chapters={chapters}
            sources={sources}
            progress={progress}
            tasks={tasks}
            settings={settings}
            onUpdateSettings={setSettings}
            onOpenDaysModal={() => setIsDaysModalOpen(true)}
          />
        </motion.div>

        {/* SECTION: Motivational Quote & Study Ambience Image Card */}
        <motion.div
          variants={appleSectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <MotivationalCard
            quotes={quotes}
            onAddQuote={handleAddQuote}
            onDeleteQuote={handleDeleteQuote}
            selectedWallpaperIndex={settings.selectedBackgroundIndex || 0}
            onSelectWallpaper={(idx) =>
              setSettings((prev) => ({ ...prev, selectedBackgroundIndex: idx }))
            }
            customWallpaperUrl={settings.customImageUrl}
            onSetCustomWallpaperUrl={(url) =>
              setSettings((prev) => ({ ...prev, customImageUrl: url }))
            }
          />
        </motion.div>

        {/* SECTION 1: TODAY'S TASKS (Positioned at the TOP of the chapter section) */}
        <motion.div
          variants={appleSectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <TodaysTasks
            tasks={tasks}
            chapters={chapters}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onClearCompletedTasks={handleClearCompletedTasks}
            onStartFocusTimer={(chapterId) => {
              setIsTimerOpen(true);
            }}
          />
        </motion.div>

        {/* SECTION 2: ACCA FR CHAPTERS (Full control to add chapter name, edit, delete, organize) */}
        <motion.div
          variants={appleSectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <ChapterManager
            chapters={chapters}
            sources={sources}
            progress={progress}
            onOpenAddModal={() => {
              setEditingChapter(null);
              setIsAddChapterOpen(true);
            }}
            onEditChapter={(ch) => {
              setEditingChapter(ch);
              setIsAddChapterOpen(true);
            }}
            onDeleteChapter={handleDeleteChapter}
            onResetToDefaults={handleResetChaptersToDefault}
            onQuickAddTaskForChapter={handleQuickAddTaskForChapter}
            onScrollToMatrixForChapter={handleScrollToMatrixForChapter}
            onToggleResourceLink={handleToggleResourceLink}
            onDeleteResourceLink={handleDeleteResourceLink}
            onTogglePracticeQuestion={handleTogglePracticeQuestion}
            onDeletePracticeQuestion={handleDeletePracticeQuestion}
            onOpenAddResourceModal={(ch) => setActiveChapterForResource(ch)}
            onOpenAddQuestionModal={(ch) => setActiveChapterForQuestion(ch)}
          />
        </motion.div>

        {/* SECTION 3: MULTI-RESOURCE PROGRESS ON DIFFERENT WEBSITES & BOOKS (Positioned just at the down site of all chapter names) */}
        <motion.div
          variants={appleSectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <SourceProgressTracker
            chapters={chapters}
            sources={sources}
            progress={progress}
            onOpenAddSourceModal={() => setIsAddSourceOpen(true)}
            onDeleteSource={handleDeleteSource}
            onUpdateProgress={handleUpdateProgress}
            highlightedChapterId={highlightedChapterId}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ACCA FR (Financial Reporting) Dedicated Revision &amp; Practice Workspace</span>
          <span>Prepared for ACCA Examination Excellence · Real-time auto-saving</span>
        </div>
      </footer>

      {/* Floating Gemini Chat Box (Fixed & Tested) */}
      <GeminiChatBox chapters={chapters} />

      {/* Modals */}
      <AddChapterModal
        isOpen={isAddChapterOpen}
        onClose={() => {
          setIsAddChapterOpen(false);
          setEditingChapter(null);
        }}
        onSaveChapter={handleSaveChapter}
        editingChapter={editingChapter}
      />

      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAddSource={handleAddSource}
      />

      <AddResourceModal
        isOpen={!!activeChapterForResource}
        chapterName={activeChapterForResource ? `${activeChapterForResource.code} - ${activeChapterForResource.name}` : ''}
        onClose={() => setActiveChapterForResource(null)}
        onAddResource={handleAddResourceToChapter}
      />

      <AddQuestionModal
        isOpen={!!activeChapterForQuestion}
        chapterName={activeChapterForQuestion ? `${activeChapterForQuestion.code} - ${activeChapterForQuestion.name}` : ''}
        onClose={() => setActiveChapterForQuestion(null)}
        onAddQuestion={handleAddQuestionToChapter}
      />

      <DaysLeftModal
        isOpen={isDaysModalOpen}
        onClose={() => setIsDaysModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <PomodoroTimer
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        chapters={chapters}
        onTaskCompletedFromTimer={(chapterId) => {
          if (chapterId) {
            const ch = chapters.find((c) => c.id === chapterId);
            if (ch) {
              handleAddTask({
                title: `Finished 25m Focus Session on ${ch.code}`,
                chapterId: ch.id,
                estimatedMinutes: 25,
                priority: 'medium',
                completed: true,
              });
            }
          }
        }}
      />

      <ExportImportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onDataReload={handleDataReload}
      />
    </div>
  );
}
