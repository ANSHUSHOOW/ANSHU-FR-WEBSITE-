import { Chapter, StudySource, Task, ExamSettings, ChapterProgress, MotivationalQuote } from '../types';
import {
  DEFAULT_CHAPTERS,
  DEFAULT_SOURCES,
  DEFAULT_TASKS,
  DEFAULT_EXAM_SETTINGS,
  DEFAULT_PROGRESS,
  DEFAULT_QUOTES,
} from '../data/defaultData';

const STORAGE_KEYS = {
  CHAPTERS: 'acca_fr_chapters_v1',
  SOURCES: 'acca_fr_sources_v1',
  TASKS: 'acca_fr_tasks_v1',
  SETTINGS: 'acca_fr_settings_v1',
  PROGRESS: 'acca_fr_progress_v1',
  QUOTES: 'acca_fr_quotes_v1',
};

export const getStoredQuotes = (): MotivationalQuote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (!raw) return DEFAULT_QUOTES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUOTES;
  }
};

export const saveStoredQuotes = (quotes: MotivationalQuote[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save quotes', err);
  }
};

export const getStoredChapters = (): Chapter[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
    if (!raw) return DEFAULT_CHAPTERS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CHAPTERS;
  }
};

export const saveStoredChapters = (chapters: Chapter[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  } catch (err) {
    console.error('Failed to save chapters', err);
  }
};

export const getStoredSources = (): StudySource[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOURCES);
    if (!raw) return DEFAULT_SOURCES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SOURCES;
  }
};

export const saveStoredSources = (sources: StudySource[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
  } catch (err) {
    console.error('Failed to save sources', err);
  }
};

export const getStoredTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return DEFAULT_TASKS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
};

export const saveStoredTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
};

export const getStoredSettings = (): ExamSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_EXAM_SETTINGS;
    const settings = JSON.parse(raw) as ExamSettings;

    // Check study streak
    const today = new Date().toISOString().split('T')[0];
    if (settings.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (settings.lastActiveDate === yesterday) {
        settings.studyStreak += 1;
      } else {
        // Gap of > 1 day
        settings.studyStreak = 1;
      }
      settings.lastActiveDate = today;
      saveStoredSettings(settings);
    }
    return settings;
  } catch {
    return DEFAULT_EXAM_SETTINGS;
  }
};

export const saveStoredSettings = (settings: ExamSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

export const getStoredProgress = (): ChapterProgress[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return DEFAULT_PROGRESS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROGRESS;
  }
};

export const saveStoredProgress = (progress: ChapterProgress[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress', err);
  }
};

export interface ExportData {
  version: number;
  exportedAt: string;
  chapters: Chapter[];
  sources: StudySource[];
  tasks: Task[];
  settings: ExamSettings;
  progress: ChapterProgress[];
}

export const exportAllStudyData = (): ExportData => {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    chapters: getStoredChapters(),
    sources: getStoredSources(),
    tasks: getStoredTasks(),
    settings: getStoredSettings(),
    progress: getStoredProgress(),
  };
};

export const importAllStudyData = (data: ExportData) => {
  if (data.chapters) saveStoredChapters(data.chapters);
  if (data.sources) saveStoredSources(data.sources);
  if (data.tasks) saveStoredTasks(data.tasks);
  if (data.settings) saveStoredSettings(data.settings);
  if (data.progress) saveStoredProgress(data.progress);
};
