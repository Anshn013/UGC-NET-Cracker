import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { QUESTION_BANK } from '../data/questionBank';
import { PAPER1_QUESTION_BANK } from '../data/paper1QuestionBank';
import { SYLLABUS_UNITS } from '../data/syllabusData';
import { MockResult, Question, QuestionFormat } from '../types/economics';

interface MockArenaProps {
  initialUnitFilter: number | 'all';
  bookmarkedQuestions: string[];
  onToggleBookmark: (questionId: string) => void;
  onSaveResult: (result: MockResult) => void;
}

type ArenaStage = 'setup' | 'active' | 'results';
type TestMode = 'exam' | 'practice';
type PaperSelection = 'paper2' | 'paper1';

const PAPER1_UNIT_LABELS: Record<number, string> = {
  1: 'Teaching Aptitude',
  2: 'Research Aptitude',
  3: 'Comprehension',
  4: 'Communication',
  5: 'Mathematical Reasoning and Aptitude',
  6: 'Logical Reasoning',
  7: 'Data Interpretation',
  8: 'Information and Communication Technology (ICT)',
  9: 'People, Development and Environment',
  10: 'Higher Education System',
};

const FORMAT_FILTERS: (QuestionFormat | 'all' | 'bookmarked')[] = [
  'all',
  'Concept MCQ',
  'Assertion & Reason',
  'Statement I & II',
  'Match List',
  'Chronology',
  'Numerical',
  'bookmarked',
];

export const MockArena: React.FC<MockArenaProps> = ({
  initialUnitFilter,
  bookmarkedQuestions,
  onToggleBookmark,
  onSaveResult,
}) => {
  const [paper, setPaper] = useState<PaperSelection>('paper2');
  const [stage, setStage] = useState<ArenaStage>('setup');
  const [unitFilter, setUnitFilter] = useState<number | 'all'>(initialUnitFilter);
  const [formatFilter, setFormatFilter] = useState<
    QuestionFormat | 'all' | 'bookmarked'
  >('all');
  const [mode, setMode] = useState<TestMode>('practice');
  const [questionCountLimit, setQuestionCountLimit] = useState<number>(15);

  // Active test state
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checkedPractice, setCheckedPractice] = useState<Record<string, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastResult, setLastResult] = useState<MockResult | null>(null);

  useEffect(() => {
    setUnitFilter(initialUnitFilter);
  }, [initialUnitFilter]);

  const activeBank = paper === 'paper1' ? PAPER1_QUESTION_BANK : QUESTION_BANK;

  const getUnitName = (unitNum: number) => {
    if (paper === 'paper1') {
      return PAPER1_UNIT_LABELS[unitNum] ?? `Paper 1 Unit ${unitNum}`;
    }
    return SYLLABUS_UNITS.find((u) => u.unitNumber === unitNum)?.title ?? `Unit ${unitNum}`;
  };

  const filteredPool = useMemo(() => {
    return activeBank.filter((q) => {
      if (unitFilter !== 'all' && q.unitNumber !== unitFilter) return false;
      if (formatFilter === 'bookmarked') {
        return bookmarkedQuestions.includes(q.id);
      }
      if (formatFilter !== 'all' && q.format !== formatFilter) return false;
      return true;
    });
  }, [activeBank, unitFilter, formatFilter, bookmarkedQuestions]);

  // Timer tick when active
  useEffect(() => {
    if (stage !== 'active') return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (mode === 'exam') {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [stage, mode]);

  // Auto-submit if exam timer hits 0
  useEffect(() => {
    if (
      stage === 'active' &&
      mode === 'exam' &&
      secondsLeft === 0 &&
      sessionQuestions.length > 0 &&
      elapsedSeconds > 1
    ) {
      handleSubmitTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, stage, mode]);

  const handleStartSession = () => {
    if (filteredPool.length === 0) return;
    const limit =
      questionCountLimit === 0
        ? filteredPool.length
        : Math.min(questionCountLimit, filteredPool.length);
    const poolCopy = [...filteredPool].sort(() => Math.random() - 0.5);
    const chosen = poolCopy.slice(0, limit);

    setSessionQuestions(chosen);
    setCurrentIdx(0);
    setAnswers({});
    setCheckedPractice({});
    setMarkedForReview({});
    setVisited({ [chosen[0].id]: true });
    setElapsedSeconds(0);
    setSecondsLeft(chosen.length * 72);
    setLastResult(null);
    setStage('active');
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= sessionQuestions.length) return;
    const q = sessionQuestions[index];
    setCurrentIdx(index);
    setVisited((prev) => ({ ...prev, [q.id]: true }));
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (mode === 'practice' && checkedPractice[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleClearResponse = (qId: string) => {
    if (mode === 'practice' && checkedPractice[qId]) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleToggleReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = () => {
    let correct = 0;
    let attempted = 0;
    const unitBreakdown: Record<number, { total: number; correct: number }> = {};

    for (const q of sessionQuestions) {
      if (!unitBreakdown[q.unitNumber]) {
        unitBreakdown[q.unitNumber] = { total: 0, correct: 0 };
      }
      unitBreakdown[q.unitNumber].total += 1;

      const selected = answers[q.id];
      if (selected !== undefined) {
        attempted += 1;
        if (selected === q.correctIndex) {
          correct += 1;
          unitBreakdown[q.unitNumber].correct += 1;
        }
      }
    }

    const result: MockResult = {
      id: `mock-${Date.now()}`,
      dateISO: new Date().toISOString(),
      mode,
      unitFilter,
      totalQuestions: sessionQuestions.length,
      attempted,
      correct,
      score: correct * 2,
      maxScore: sessionQuestions.length * 2,
      timeSpentSeconds: elapsedSeconds,
      unitBreakdown,
    };

    setLastResult(result);
    onSaveResult(result);
    setStage('results');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (stage === 'setup') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500">
            {paper === 'paper1'
              ? 'Paper 1 · General Paper on Teaching & Research Aptitude · NTA CBT Pattern'
              : 'Paper 2 · Economics (Code 01) · NTA CBT Pattern'}
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Mock Test & PYQ Practice Arena
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Switch between UGC NET Paper 1 and Paper 2 Economics, filter by unit and question archetype, and practice with instant explanations.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-7">
          {/* Paper Switcher */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">0. Select Exam Paper</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setPaper('paper2');
                  setUnitFilter('all');
                }}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  paper === 'paper2'
                    ? 'border-blue-700 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <p className="font-medium text-slate-900">Paper 2: Economics (Code 01)</p>
                <p className="text-xs text-slate-600 mt-1">
                  Micro, Macro, Econometrics, Mathematical Econ, International, Public, Money & Banking, Growth, Environment & Indian Economy.
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaper('paper1');
                  setUnitFilter('all');
                }}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  paper === 'paper1'
                    ? 'border-blue-700 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <p className="font-medium text-slate-900">Paper 1: General Aptitude</p>
                <p className="text-xs text-slate-600 mt-1">
                  Teaching, Research, Comprehension, Communication, Math & Logical Reasoning, DI, ICT, Environment & Higher Education.
                </p>
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">1. Select Session Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  mode === 'practice'
                    ? 'border-blue-700 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <p className="font-medium text-slate-900">Practice & Explain Mode</p>
                <p className="text-xs text-slate-600 mt-1">
                  Check each answer immediately with detailed explanations and exam tips.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMode('exam')}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  mode === 'exam'
                    ? 'border-blue-700 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <p className="font-medium text-slate-900">Timed NTA Exam Simulation</p>
                <p className="text-xs text-slate-600 mt-1">
                  Countdown timer, NTA question palette, and post-submission unit score breakdown.
                </p>
              </button>
            </div>
          </div>

          {/* Unit Selection */}
          <div className="space-y-3">
            <label htmlFor="unit-select" className="block text-sm font-semibold text-slate-900">
              2. Filter by Syllabus Unit
            </label>
            <select
              id="unit-select"
              value={unitFilter}
              onChange={(e) =>
                setUnitFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full sm:w-96 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
            >
              <option value="all">All 10 Units (Comprehensive Mix)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((uNum) => (
                <option key={uNum} value={uNum}>
                  Unit {uNum}: {getUnitName(uNum)}
                </option>
              ))}
            </select>
          </div>

          {/* Question Format Filter */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">3. Question Archetype</p>
            <div className="flex flex-wrap gap-2">
              {FORMAT_FILTERS.map((fmt) => {
                const active = formatFilter === fmt;
                const label =
                  fmt === 'all'
                    ? 'All Formats'
                    : fmt === 'bookmarked'
                      ? `Bookmarked (${bookmarkedQuestions.length})`
                      : fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormatFilter(fmt)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">4. Question Count</p>
            <div className="flex flex-wrap items-center gap-2">
              {[10, 15, 25, 0].map((cnt) => {
                const active = questionCountLimit === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCountLimit(cnt)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cnt === 0 ? `All Matching (${filteredPool.length})` : `${cnt} Questions`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Launch Bar */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-slate-600 font-mono tabular-nums">
              {filteredPool.length} matching questions available in {paper === 'paper1' ? 'Paper 1' : 'Paper 2'} bank
            </p>
            <button
              type="button"
              disabled={filteredPool.length === 0}
              onClick={handleStartSession}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results' && lastResult) {
    const accuracy =
      lastResult.attempted > 0
        ? Math.round((lastResult.correct / lastResult.attempted) * 100)
        : 0;
    const scorePct = Math.round((lastResult.score / lastResult.maxScore) * 100);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {paper === 'paper1' ? 'Paper 1 · General Aptitude' : 'Paper 2 · Economics'} · Session Complete ·{' '}
              {lastResult.mode === 'exam' ? 'Timed NTA Exam' : 'Practice Mode'}
            </p>
            <h1 className="font-display text-3xl font-semibold text-slate-900 mt-1">
              Performance Diagnostic
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setStage('setup')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Configure New Drill
          </button>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-500">Total Score (+2 / 0)</p>
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1">
              {lastResult.score} / {lastResult.maxScore}
            </p>
            <p className="text-xs text-slate-600 mt-1 tabular-nums">{scorePct}% of maximum</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-500">Questions Correct</p>
            <p className="font-mono text-2xl font-semibold text-emerald-700 tabular-nums mt-1">
              {lastResult.correct} / {lastResult.totalQuestions}
            </p>
            <p className="text-xs text-slate-600 mt-1 tabular-nums">
              {lastResult.attempted} attempted
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-500">Attempt Accuracy</p>
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1">
              {accuracy}%
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {scorePct >= 72 ? 'JRF Percentile Zone' : 'Keep drilling weak units'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-500">Time Elapsed</p>
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1">
              {formatTimer(lastResult.timeSpentSeconds)}
            </p>
            <p className="text-xs text-slate-600 mt-1 tabular-nums">
              Avg {Math.round(lastResult.timeSpentSeconds / lastResult.totalQuestions)}s / Q
            </p>
          </div>
        </div>

        {/* Unit Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Unit-Wise Accuracy Breakdown
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {Object.entries(lastResult.unitBreakdown).map(([unitNumStr, stats]) => {
              const unitNum = Number(unitNumStr);
              const pct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div
                  key={unitNum}
                  className="px-6 py-3.5 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="font-medium text-slate-900">
                    Unit {unitNum}. {getUnitName(unitNum)}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-slate-700">
                    {stats.correct} / {stats.total} correct ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Answer Review */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Detailed Question-by-Question Review
          </h2>
          {sessionQuestions.map((q, idx) => {
            const chosen = answers[q.id];
            const isCorrect = chosen === q.correctIndex;
            const isUnattempted = chosen === undefined;
            const isBookmarked = bookmarkedQuestions.includes(q.id);

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      Q{idx + 1} · Unit {q.unitNumber}: {q.unitTitle} · {q.format} · {q.difficulty}
                    </p>
                    <p className="text-base font-medium text-slate-900">{q.prompt}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    {isUnattempted ? (
                      <span className="text-xs font-medium text-slate-500">Unattempted</span>
                    ) : isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+2)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
                        <XCircle className="w-4 h-4" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                {q.subItems && q.subItems.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-sm text-slate-700">
                    {q.subItems.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                  {q.options.map((opt, optIdx) => {
                    const isRightOpt = optIdx === q.correctIndex;
                    const isUserOpt = optIdx === chosen;
                    let cls = 'border-slate-200 bg-white text-slate-700';
                    if (isRightOpt) {
                      cls = 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium';
                    } else if (isUserOpt && !isRightOpt) {
                      cls = 'border-red-500 bg-red-50/70 text-red-900';
                    }
                    return (
                      <div key={optIdx} className={`p-3 rounded-lg border ${cls}`}>
                        <span className="font-mono text-xs mr-2">
                          ({String.fromCharCode(65 + optIdx)})
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Explanation:</strong> {q.explanation}
                  </p>
                  <p className="text-blue-900 bg-blue-50/60 border border-blue-100 rounded-lg px-3.5 py-2 text-xs">
                    <strong>Exam Note:</strong> {q.examTip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE SESSION STAGE
  const currentQ = sessionQuestions[currentIdx];
  const selectedOpt = answers[currentQ.id];
  const isPracticeChecked = mode === 'practice' && checkedPractice[currentQ.id];
  const isMarked = Boolean(markedForReview[currentQ.id]);
  const isBookmarked = bookmarkedQuestions.includes(currentQ.id);

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Session Control Strip */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm">
          <span className="font-medium text-slate-900">
            Question {currentIdx + 1} of {sessionQuestions.length}
          </span>
          <span className="text-slate-400 mx-2">·</span>
          <span className="text-slate-600">
            {paper === 'paper1' ? 'Paper 1' : 'Paper 2'} · Unit {currentQ.unitNumber}: {currentQ.unitTitle}
          </span>
          <span className="text-slate-400 mx-2">·</span>
          <span className="text-slate-600">{currentQ.format}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-slate-900 tabular-nums">
            <Clock className="w-4 h-4 text-slate-500" />
            {mode === 'exam' ? formatTimer(secondsLeft) : formatTimer(elapsedSeconds)}
          </div>
          <button
            type="button"
            onClick={handleSubmitTest}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Finish & Score
          </button>
        </div>
      </div>

      {/* Main Two-Column CBT Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Question Stage */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-medium text-slate-900 leading-relaxed">
              {currentQ.prompt}
            </h2>
            <button
              type="button"
              onClick={() => onToggleBookmark(currentQ.id)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
              className={`p-2 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {currentQ.subItems && currentQ.subItems.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm text-slate-800">
              {currentQ.subItems.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {/* Options */}
          <div className="space-y-3" role="radiogroup" aria-label="Answer Options">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;

              let optStyle =
                'border-slate-200 bg-white hover:border-slate-300 text-slate-800';
              if (isPracticeChecked) {
                if (isCorrectOpt) {
                  optStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
                } else if (isSelected && !isCorrectOpt) {
                  optStyle = 'border-red-500 bg-red-50 text-red-900';
                }
              } else if (isSelected) {
                optStyle = 'border-blue-700 bg-blue-50/70 text-blue-950 font-medium';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${optStyle}`}
                >
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Practice Explanation */}
          {isPracticeChecked && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {selectedOpt === currentQ.correctIndex ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer (+2 Marks)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-red-700">
                    <XCircle className="w-4 h-4" /> Incorrect — Correct option is (
                    {String.fromCharCode(65 + currentQ.correctIndex)})
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentQ.explanation}
              </p>
              <p className="text-xs text-blue-900 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5">
                <strong>Exam Tip:</strong> {currentQ.examTip}
              </p>
            </div>
          )}

          {/* Bottom Navigation Actions */}
          <div className="pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleReview(currentQ.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  isMarked
                    ? 'bg-amber-50 border-amber-400 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {isMarked ? 'Marked for Review' : 'Mark for Review'}
              </button>
              <button
                type="button"
                onClick={() => handleClearResponse(currentQ.id)}
                disabled={selectedOpt === undefined || Boolean(isPracticeChecked)}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              {mode === 'practice' && !isPracticeChecked && (
                <button
                  type="button"
                  disabled={selectedOpt === undefined}
                  onClick={() =>
                    setCheckedPractice((prev) => ({ ...prev, [currentQ.id]: true }))
                  }
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:bg-slate-300 transition-colors cursor-pointer"
                >
                  Check Answer
                </button>
              )}

              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => goToQuestion(currentIdx - 1)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              {currentIdx < sessionQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToQuestion(currentIdx + 1)}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right NTA Question Palette */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Question Palette</h3>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {answeredCount}/{sessionQuestions.length} answered
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {sessionQuestions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAns = answers[q.id] !== undefined;
              const isRev = Boolean(markedForReview[q.id]);
              const isVis = Boolean(visited[q.id]);

              let btnCls = 'bg-white border-slate-200 text-slate-700';
              if (isRev) {
                btnCls = 'bg-amber-100 border-amber-400 text-amber-900';
              } else if (isAns) {
                btnCls = 'bg-emerald-600 border-emerald-600 text-white';
              } else if (isVis) {
                btnCls = 'bg-slate-100 border-slate-300 text-slate-700';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goToQuestion(idx)}
                  className={`h-10 rounded-lg border font-mono text-xs font-medium tabular-nums transition-colors cursor-pointer ${btnCls} ${
                    isCurrent ? 'ring-2 ring-blue-700 ring-offset-1' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block shrink-0" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400 inline-block shrink-0" />
              <span>Marked Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block shrink-0" />
              <span>Visited Only</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white border border-slate-200 inline-block shrink-0" />
              <span>Not Visited</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};