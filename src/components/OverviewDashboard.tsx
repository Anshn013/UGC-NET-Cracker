import React from 'react';
import { ArrowRight, BookOpen, Calculator, CheckCircle2, Target } from 'lucide-react';
import { SYLLABUS_UNITS } from '../data/syllabusData';
import { QUESTION_BANK } from '../data/questionBank';
import { FLASHCARDS } from '../data/revisionVaultData';
import { AppView, StudyState } from '../types/economics';

interface OverviewDashboardProps {
  studyState: StudyState;
  onUpdateTargets: (paper1: number, paper2: number) => void;
  onNavigate: (view: AppView) => void;
  onPracticeUnit: (unitNumber: number) => void;
  onInspectUnitSyllabus: (unitNumber: number) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  studyState,
  onUpdateTargets,
  onNavigate,
  onPracticeUnit,
  onInspectUnitSyllabus,
}) => {
  const totalTopics = SYLLABUS_UNITS.reduce((acc, u) => acc + u.topics.length, 0);
  const masteredTopics = SYLLABUS_UNITS.reduce(
    (acc, u) =>
      acc +
      u.topics.filter((t) => studyState.topicMastery[t.id] === 'mastered').length,
    0
  );
  const revisedTopics = SYLLABUS_UNITS.reduce(
    (acc, u) =>
      acc +
      u.topics.filter((t) => studyState.topicMastery[t.id] === 'revised').length,
    0
  );

  const totalAttempts = studyState.mockHistory.length;
  const totalQuestionsAnswered = studyState.mockHistory.reduce(
    (acc, m) => acc + m.attempted,
    0
  );
  const totalCorrect = studyState.mockHistory.reduce(
    (acc, m) => acc + m.correct,
    0
  );
  const avgAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
      : null;

  // Aggregate unit-wise accuracy from mock history
  const unitStats: Record<number, { total: number; correct: number }> = {};
  for (const result of studyState.mockHistory) {
    for (const [unitStr, stats] of Object.entries(result.unitBreakdown)) {
      const unitNum = Number(unitStr);
      if (!unitStats[unitNum]) {
        unitStats[unitNum] = { total: 0, correct: 0 };
      }
      unitStats[unitNum].total += stats.total;
      unitStats[unitNum].correct += stats.correct;
    }
  }

  const combinedTarget = studyState.paper1Target + studyState.paper2Target;
  const jrfBenchmark = 216; // ~72% benchmark for General/UR JRF Economics
  const targetStatus =
    combinedTarget >= jrfBenchmark
      ? 'On JRF Cut-off Pace'
      : combinedTarget >= 186
        ? 'Assistant Professor Range'
        : 'Below Historical Cut-off';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Study Header + Target Score Planner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-500">
              UGC NET JRF · Subject Code 01 · Economics Preparation Workbench
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
              Structured mastery across all ten Economics units.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Crack the NTA JRF cut-off by combining active NTA-pattern mock drills (Assertion–Reason, Chronology, Match Lists, Numericals) with interactive economic model curves and high-yield chronology recall.
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-200 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('mock')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Launch Full Mock Arena
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('models')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              Explore Interactive Curves
            </button>
            <button
              type="button"
              onClick={() => onNavigate('syllabus')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Revision Vault
            </button>
          </div>
        </div>

        {/* JRF 300-Mark Score Planner */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">
                  JRF 300-Mark Target Planner
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  150 Questions · +2 Marks each · Zero Negative Marking
                </p>
              </div>
              <Target className="w-5 h-5 text-blue-700 shrink-0" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="p1-target" className="font-medium text-slate-700">
                    Paper 1 (Teaching & Research Aptitude)
                  </label>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {studyState.paper1Target} / 100 ({studyState.paper1Target / 2} Qs)
                  </span>
                </div>
                <input
                  id="p1-target"
                  type="range"
                  min={40}
                  max={96}
                  step={2}
                  value={studyState.paper1Target}
                  onChange={(e) =>
                    onUpdateTargets(Number(e.target.value), studyState.paper2Target)
                  }
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="p2-target" className="font-medium text-slate-700">
                    Paper 2 (Economics Code 01)
                  </label>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {studyState.paper2Target} / 200 ({studyState.paper2Target / 2} Qs)
                  </span>
                </div>
                <input
                  id="p2-target"
                  type="range"
                  min={90}
                  max={190}
                  step={2}
                  value={studyState.paper2Target}
                  onChange={(e) =>
                    onUpdateTargets(studyState.paper1Target, Number(e.target.value))
                  }
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500">Projected Total Score</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{targetStatus}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                {combinedTarget}
              </span>
              <span className="font-mono text-sm text-slate-500"> / 300</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Readiness Metrics Row */}
      <section aria-label="Study Readiness Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Syllabus Topics Mastered</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-2">
            {masteredTopics} <span className="text-sm font-normal text-slate-500">/ {totalTopics}</span>
          </p>
          <p className="text-xs text-slate-600 mt-1 tabular-nums">
            {revisedTopics} additional topics marked revised
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Mock Accuracy</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-2">
            {avgAccuracy !== null ? `${avgAccuracy}%` : '—'}
          </p>
          <p className="text-xs text-slate-600 mt-1 tabular-nums">
            {totalAttempts > 0
              ? `${totalCorrect} correct across ${totalQuestionsAnswered} attempted`
              : 'Complete a drill to compute accuracy'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Practice Bank Coverage</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-2">
            {QUESTION_BANK.length} <span className="text-sm font-normal text-slate-500">NTA Qs</span>
          </p>
          <p className="text-xs text-slate-600 mt-1 tabular-nums">
            {studyState.bookmarkedQuestions.length} bookmarked for revision
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Active-Recall Flashcards</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-2">
            {studyState.masteredFlashcards.length}{' '}
            <span className="text-sm font-normal text-slate-500">/ {FLASHCARDS.length}</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Core theorems & paradoxes retained
          </p>
        </div>
      </section>

      {/* 10-Unit Readiness Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              10-Unit Economics Syllabus & Diagnostic Matrix
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Expected NTA weightage per 100-question Paper 2, topic progress, and unit-level drill shortcuts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('syllabus')}
            className="text-sm font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Full Tracker →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Unit</th>
                <th className="py-3 px-4">Expected Share</th>
                <th className="py-3 px-4">Topics Mastered</th>
                <th className="py-3 px-4">Mock Accuracy</th>
                <th className="py-3 px-4 hidden lg:table-cell">Standard Texts</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {SYLLABUS_UNITS.map((unit) => {
                const unitTotal = unit.topics.length;
                const unitMastered = unit.topics.filter(
                  (t) => studyState.topicMastery[t.id] === 'mastered'
                ).length;
                const unitRevised = unit.topics.filter(
                  (t) => studyState.topicMastery[t.id] === 'revised'
                ).length;
                const stats = unitStats[unit.unitNumber];
                const unitAcc =
                  stats && stats.total > 0
                    ? Math.round((stats.correct / stats.total) * 100)
                    : null;

                return (
                  <tr key={unit.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-slate-900">
                        Unit {unit.unitNumber}. {unit.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {unit.expectedQuestions}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs tabular-nums whitespace-nowrap">
                      <span className="text-slate-900 font-medium">
                        {unitMastered}/{unitTotal}
                      </span>
                      {unitRevised > 0 && (
                        <span className="text-slate-500"> · {unitRevised} rev</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs tabular-nums whitespace-nowrap">
                      {unitAcc !== null ? (
                        <span
                          className={
                            unitAcc >= 70
                              ? 'text-emerald-700 font-medium'
                              : unitAcc >= 50
                                ? 'text-amber-700 font-medium'
                                : 'text-red-700 font-medium'
                          }
                        >
                          {unitAcc}% ({stats.correct}/{stats.total})
                        </span>
                      ) : (
                        <span className="text-slate-400">Untested</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 hidden lg:table-cell">
                      {unit.coreReference}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onInspectUnitSyllabus(unit.unitNumber)}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Topics
                        </button>
                        <button
                          type="button"
                          onClick={() => onPracticeUnit(unit.unitNumber)}
                          className="text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
                        >
                          Drill Unit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Mock History & NTA Strategy */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Recent Mock Test Log
          </h2>
          {studyState.mockHistory.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm text-slate-600">
                No mock sessions recorded yet.
              </p>
              <p className="text-xs text-slate-500">
                Take a timed test or unit drill in the Mock Arena to generate your performance baseline.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-200">
              {studyState.mockHistory.slice(0, 5).map((attempt) => {
                const pct = Math.round((attempt.score / attempt.maxScore) * 100);
                const mins = Math.floor(attempt.timeSpentSeconds / 60);
                const secs = attempt.timeSpentSeconds % 60;
                return (
                  <div
                    key={attempt.id}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {attempt.unitFilter === 'all'
                          ? 'Mixed All-Units Set'
                          : `Unit ${attempt.unitFilter} Focused Drill`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(attempt.dateISO).toLocaleDateString()} ·{' '}
                        {attempt.mode === 'exam' ? 'Timed Exam' : 'Practice Mode'} ·{' '}
                        {mins}m {secs}s
                      </p>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <p className="font-semibold text-slate-900">
                        {attempt.score} / {attempt.maxScore}
                      </p>
                      <p className="text-xs text-slate-500">
                        {attempt.correct}/{attempt.totalQuestions} correct ({pct}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            High-Yield JRF Execution Rules
          </h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900 font-medium">Attempt all 150 questions:</strong>{' '}
                There is zero negative marking in UGC NET. Never leave Assertion–Reason or Match List questions blank.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900 font-medium">Eliminate via Match Lists:</strong>{' '}
                Locking just 1–2 pairs in NTA List-I/List-II questions eliminates 75% of options immediately.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900 font-medium">Master Econometrics & Math:</strong>{' '}
                Units 3 and 4 yield ~20 predictable numericals and theorem checks that separate JRF from NET cut-offs.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
