export type AppView = 'overview' | 'mock' | 'models' | 'syllabus';

export type MasteryStatus = 'not_started' | 'revised' | 'mastered';

export type QuestionFormat =
  | 'Concept MCQ'
  | 'Assertion & Reason'
  | 'Statement I & II'
  | 'Match List'
  | 'Chronology'
  | 'Numerical';

export interface SyllabusTopic {
  id: string;
  title: string;
  subtopics: string[];
  highYield: boolean;
}

export interface SyllabusUnit {
  unitNumber: number;
  id: string;
  title: string;
  shortTitle: string;
  expectedQuestions: string;
  coreReference: string;
  topics: SyllabusTopic[];
}

export interface Question {
  id: string;
  unitNumber: number;
  unitTitle: string;
  format: QuestionFormat;
  difficulty: 'Moderate' | 'JRF Cut-off' | 'Advanced';
  prompt: string;
  subItems?: string[];
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  examTip: string;
}

export interface MockResult {
  id: string;
  dateISO: string;
  mode: 'exam' | 'practice';
  unitFilter: number | 'all';
  totalQuestions: number;
  attempted: number;
  correct: number;
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  unitBreakdown: Record<number, { total: number; correct: number }>;
}

export interface ChronologyItem {
  id: string;
  year: number;
  title: string;
  authorOrChair: string;
  category: 'Classic Books & Theories' | 'Indian Committees' | 'Policy & Acts';
  unitNumber: number;
  keyTakeaway: string;
}

export interface FormulaCard {
  id: string;
  title: string;
  unitNumber: number;
  unitName: string;
  formula: string;
  meaning: string;
  examTrap: string;
}

export interface Flashcard {
  id: string;
  unitNumber: number;
  front: string;
  back: string;
  hint: string;
}

export interface StudyState {
  topicMastery: Record<string, MasteryStatus>;
  topicNotes: Record<string, string>;
  mockHistory: MockResult[];
  bookmarkedQuestions: string[];
  masteredFlashcards: string[];
  paper1Target: number;
  paper2Target: number;
}
