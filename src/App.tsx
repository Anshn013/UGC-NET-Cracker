import { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MockArena } from './components/MockArena';
import { ModelLab } from './components/ModelLab';
import { SyllabusVault } from './components/SyllabusVault';
import { QUESTION_BANK } from './data/questionBank';
import { PAPER1_QUESTION_BANK } from './data/paper1QuestionBank';
import {
  AppView,
  MasteryStatus,
  MockResult,
  StudyState,
} from './types/economics';

const STORAGE_KEY = 'arthajrf_ugc_net_econ_v1';
const ENTERED_SESSION_KEY = 'arthajrf_welcome_dismissed_v1';

const DEFAULT_STATE: StudyState = {
  topicMastery: {},
  topicNotes: {},
  mockHistory: [],
  bookmarkedQuestions: [],
  masteredFlashcards: [],
  paper1Target: 74,
  paper2Target: 146,
};

function loadInitialState(): StudyState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(ENTERED_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [activeView, setActiveView] = useState<AppView>('overview');
  const [mockInitialUnit, setMockInitialUnit] = useState<number | 'all'>('all');
  const [syllabusInitialUnit, setSyllabusInitialUnit] = useState<number>(1);
  const [studyState, setStudyState] = useState<StudyState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(studyState));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [studyState]);

  const handleBegin = () => {
    setHasEntered(true);
    try {
      window.sessionStorage.setItem(ENTERED_SESSION_KEY, 'true');
    } catch {
      // Ignore storage errors cleanly
    }
  };

  const handleOpenWelcome = () => {
    setHasEntered(false);
    try {
      window.sessionStorage.removeItem(ENTERED_SESSION_KEY);
    } catch {
      // Ignore storage errors cleanly
    }
  };

  const handleUpdateTargets = (paper1Target: number, paper2Target: number) => {
    setStudyState((prev) => ({ ...prev, paper1Target, paper2Target }));
  };

  const handleSetTopicMastery = (topicId: string, status: MasteryStatus) => {
    setStudyState((prev) => ({
      ...prev,
      topicMastery: {
        ...prev.topicMastery,
        [topicId]: status,
      },
    }));
  };

  const handleSetTopicNote = (topicId: string, note: string) => {
    setStudyState((prev) => ({
      ...prev,
      topicNotes: {
        ...prev.topicNotes,
        [topicId]: note,
      },
    }));
  };

  const handleToggleBookmark = (questionId: string) => {
    setStudyState((prev) => {
      const exists = prev.bookmarkedQuestions.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestions: exists
          ? prev.bookmarkedQuestions.filter((id) => id !== questionId)
          : [...prev.bookmarkedQuestions, questionId],
      };
    });
  };

  const handleToggleFlashcardMastered = (cardId: string) => {
    setStudyState((prev) => {
      const exists = prev.masteredFlashcards.includes(cardId);
      return {
        ...prev,
        masteredFlashcards: exists
          ? prev.masteredFlashcards.filter((id) => id !== cardId)
          : [...prev.masteredFlashcards, cardId],
      };
    });
  };

  const handleSaveMockResult = (result: MockResult) => {
    setStudyState((prev) => ({
      ...prev,
      mockHistory: [result, ...prev.mockHistory].slice(0, 25),
    }));
  };

  const handlePracticeUnit = (unitNumber: number) => {
    setMockInitialUnit(unitNumber);
    setActiveView('mock');
  };

  const handleInspectUnitSyllabus = (unitNumber: number) => {
    setSyllabusInitialUnit(unitNumber);
    setActiveView('syllabus');
  };

  const handleQuickStartMock = () => {
    setMockInitialUnit('all');
    setActiveView('mock');
  };

  if (!hasEntered) {
    return (
      <WelcomeScreen
        onStart={handleBegin}
        paper1Count={PAPER1_QUESTION_BANK.length}
        paper2Count={QUESTION_BANK.length}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onNavigate={setActiveView}
        onQuickStartMock={handleQuickStartMock}
      />

      <main className="flex-1 pb-12">
        {activeView === 'overview' && (
          <OverviewDashboard
            studyState={studyState}
            onUpdateTargets={handleUpdateTargets}
            onNavigate={setActiveView}
            onPracticeUnit={handlePracticeUnit}
            onInspectUnitSyllabus={handleInspectUnitSyllabus}
          />
        )}

        {activeView === 'mock' && (
          <MockArena
            initialUnitFilter={mockInitialUnit}
            bookmarkedQuestions={studyState.bookmarkedQuestions}
            onToggleBookmark={handleToggleBookmark}
            onSaveResult={handleSaveMockResult}
          />
        )}

        {activeView === 'models' && <ModelLab />}

        {activeView === 'syllabus' && (
          <SyllabusVault
            studyState={studyState}
            initialUnit={syllabusInitialUnit}
            onSetTopicMastery={handleSetTopicMastery}
            onSetTopicNote={handleSetTopicNote}
            onToggleFlashcardMastered={handleToggleFlashcardMastered}
            onPracticeUnit={handlePracticeUnit}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            ArthaJRF · Created by <strong className="text-slate-700">Anshin Shan K</strong> · UGC NET Paper 1 & Economics
          </span>
          <button
            type="button"
            onClick={handleOpenWelcome}
            className="text-blue-700 hover:underline font-medium cursor-pointer"
          >
            Welcome & Creator Card
          </button>
        </div>
      </footer>
    </div>
  );
}