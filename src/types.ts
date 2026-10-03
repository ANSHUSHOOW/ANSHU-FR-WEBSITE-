export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  chapterId?: string;
  estimatedMinutes?: number;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export type SyllabusCategory =
  | 'Framework & Ethics'
  | 'Assets & Tangibles'
  | 'Intangibles & Impairment'
  | 'Leases & Revenue'
  | 'Liabilities & Provisions'
  | 'Financial Instruments'
  | 'Tax & Reporting'
  | 'Group Accounts (Consolidation)'
  | 'Analysis & Interpretation';

export interface ChapterResourceLink {
  id: string;
  title: string;
  type: 'book' | 'website' | 'video' | 'article' | 'other';
  url?: string;
  pageOrChapterRef?: string;
  completed: boolean;
  completedAt?: string;
}

export interface PracticeQuestion {
  id: string;
  title: string;
  sourceName?: string;
  examSection?: 'Section A (MCQ)' | 'Section B (OT Case)' | 'Section C (Constructed Response)';
  marks?: number;
  completed: boolean;
  completedAt?: string;
  score?: string;
  notes?: string;
}

export interface Chapter {
  id: string;
  code: string;
  name: string;
  category: SyllabusCategory;
  examWeight: 'high' | 'medium' | 'normal';
  targetDate?: string;
  notes?: string;
  order: number;
  resourceLinks: ChapterResourceLink[];
  practiceQuestions: PracticeQuestion[];
}

export type SourceType = 'book' | 'website' | 'other';

export interface StudySource {
  id: string;
  name: string;
  type: SourceType;
  color: string;
  url?: string;
  description?: string;
  isDefault?: boolean;
}

export interface ChapterProgress {
  chapterId: string;
  sourceId: string;
  theoryCompleted: boolean;
  theoryCompletedAt?: string;
  questionsCompleted: boolean;
  questionsCompletedAt?: string;
  score?: string;
  confidence?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string;
  tag?: string;
  imageUrl?: string;
}

export interface StudyMilestone {
  id: string;
  title: string;
  daysRemainingTarget: number; // e.g. at 30 days left
  completed: boolean;
}

export interface ExamSettings {
  examName: string;
  examDate: string; // YYYY-MM-DD
  dailyGoalHours: number;
  studyStreak: number;
  lastActiveDate: string;
  selectedBackgroundIndex?: number;
  customImageUrl?: string;
  milestones?: StudyMilestone[];
}
