import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCw,
  Search,
} from 'lucide-react';
import { SYLLABUS_UNITS } from '../data/syllabusData';
import {
  CHRONOLOGY_ITEMS,
  FLASHCARDS,
  FORMULA_CARDS,
} from '../data/revisionVaultData';
import { MasteryStatus, StudyState } from '../types/economics';

interface SyllabusVaultProps {
  studyState: StudyState;
  initialUnit: number;
  onSetTopicMastery: (topicId: string, status: MasteryStatus) => void;
  onSetTopicNote: (topicId: string, note: string) => void;
  onToggleFlashcardMastered: (cardId: string) => void;
  onPracticeUnit: (unitNumber: number) => void;
}

type VaultTab = 'syllabus' | 'chronology' | 'formulas' | 'flashcards';

export const SyllabusVault: React.FC<SyllabusVaultProps> = ({
  studyState,
  initialUnit,
  onSetTopicMastery,
  onSetTopicNote,
  onToggleFlashcardMastered,
  onPracticeUnit,
}) => {
  const [activeTab, setActiveTab] = useState<VaultTab>('syllabus');
  const [selectedUnit, setSelectedUnit] = useState<number>(initialUnit);
  const [searchQuery, setSearchQuery] = useState('');
  const [chronCategory, setChronCategory] = useState<string>('all');

  useEffect(() => {
    setSelectedUnit(initialUnit);
    setActiveTab('syllabus');
  }, [initialUnit]);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const activeUnitObj = useMemo(
    () => SYLLABUS_UNITS.find((u) => u.unitNumber === selectedUnit) || SYLLABUS_UNITS[0],
    [selectedUnit]
  );

  const filteredChronology = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CHRONOLOGY_ITEMS.filter((item) => {
      if (chronCategory !== 'all' && item.category !== chronCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.authorOrChair.toLowerCase().includes(q) ||
        item.keyTakeaway.toLowerCase().includes(q) ||
        String(item.year).includes(q)
      );
    });
  }, [chronCategory, searchQuery]);

  const filteredFormulas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FORMULA_CARDS.filter((f) => {
      if (!q) return true;
      return (
        f.title.toLowerCase().includes(q) ||
        f.unitName.toLowerCase().includes(q) ||
        f.meaning.toLowerCase().includes(q) ||
        f.formula.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const currentCard = FLASHCARDS[cardIndex] || FLASHCARDS[0];
  const isCardMastered = studyState.masteredFlashcards.includes(currentCard.id);

  const nextStatus = (current: MasteryStatus): MasteryStatus => {
    if (current === 'not_started') return 'revised';
    if (current === 'revised') return 'mastered';
    return 'not_started';
  };

  const statusLabel = (s: MasteryStatus) => {
    if (s === 'mastered') return 'Mastered';
    if (s === 'revised') return 'Revised';
    return 'Not Started';
  };

  const statusButtonStyle = (s: MasteryStatus) => {
    if (s === 'mastered') {
      return 'bg-emerald-50 border-emerald-300 text-emerald-800';
    }
    if (s === 'revised') {
      return 'bg-blue-50 border-blue-300 text-blue-800';
    }
    return 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header + Vault Sub-navigation */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            UGC NET Economics (Code 01) · Complete Curriculum & Active Recall
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Syllabus Tracker & Revision Vault
          </h1>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/70 rounded-xl">
          {(
            [
              { id: 'syllabus', label: '10-Unit Syllabus' },
              { id: 'chronology', label: 'Chronologies & Committees' },
              { id: 'formulas', label: 'Formulas & Tests' },
              { id: 'flashcards', label: 'Recall Flashcards' },
            ] as { id: VaultTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: 10-UNIT SYLLABUS TRACKER */}
      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Unit Rail */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
            {SYLLABUS_UNITS.map((unit) => {
              const isSelected = unit.unitNumber === selectedUnit;
              const masteredCount = unit.topics.filter(
                (t) => studyState.topicMastery[t.id] === 'mastered'
              ).length;
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnit(unit.unitNumber)}
                  className={`w-full text-left px-5 py-3.5 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isSelected ? 'text-blue-800' : 'text-slate-900'
                      }`}
                    >
                      Unit {unit.unitNumber}. {unit.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {unit.expectedQuestions} · {unit.coreReference}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-slate-600 tabular-nums shrink-0">
                    {masteredCount}/{unit.topics.length}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Right Unit Topic Checklist */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900">
                  Unit {activeUnitObj.unitNumber}: {activeUnitObj.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Expected Share: {activeUnitObj.expectedQuestions} · Core Books: {activeUnitObj.coreReference}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPracticeUnit(activeUnitObj.unitNumber)}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Drill Unit {activeUnitObj.unitNumber} Qs
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {activeUnitObj.topics.map((topic) => {
                const status = studyState.topicMastery[topic.id] || 'not_started';
                const note = studyState.topicNotes[topic.id] || '';
                return (
                  <div key={topic.id} className="p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {topic.title}
                          </h3>
                          {topic.highYield && (
                            <span className="text-xs font-medium text-amber-700">
                              · High-Yield NTA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {topic.subtopics.join(' · ')}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onSetTopicMastery(topic.id, nextStatus(status))
                        }
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${statusButtonStyle(
                          status
                        )}`}
                      >
                        {statusLabel(status)}
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => onSetTopicNote(topic.id, e.target.value)}
                        placeholder="Add personal revision note, formula reminder, or book page ref..."
                        aria-label={`Revision note for ${topic.title}`}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHRONOLOGIES & COMMITTEES */}
      {activeTab === 'chronology' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search book, economist, year, committee..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'all',
                'Classic Books & Theories',
                'Indian Committees',
                'Policy & Acts',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setChronCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    chronCategory === cat
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                  <th className="py-3 px-6">Year</th>
                  <th className="py-3 px-4">Work / Committee / Act</th>
                  <th className="py-3 px-4">Economist / Chair</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-6">NTA Exam Takeaway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredChronology.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6 font-mono font-semibold text-blue-800 tabular-nums whitespace-nowrap">
                      {item.year}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {item.authorOrChair}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                      Unit {item.unitNumber}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-600 leading-relaxed">
                      {item.keyTakeaway}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FORMULAS & ECONOMETRIC TESTS */}
      {activeTab === 'formulas' && (
        <div className="space-y-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter formulas (e.g., Slutsky, Durbin, Solow)..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFormulas.map((fm) => (
              <div
                key={fm.id}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
              >
                <div>
                  <p className="text-xs text-slate-500">
                    Unit {fm.unitNumber} · {fm.unitName}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-slate-900 mt-0.5">
                    {fm.title}
                  </h3>
                </div>
                <div className="bg-slate-900 text-slate-50 font-mono text-xs sm:text-sm px-4 py-3 rounded-lg overflow-x-auto">
                  {fm.formula}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{fm.meaning}</p>
                <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2 leading-relaxed">
                  <strong>NTA Trap:</strong> {fm.examTrap}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE RECALL FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-mono tabular-nums">
              Card {cardIndex + 1} of {FLASHCARDS.length} · Unit {currentCard.unitNumber}
            </span>
            <span className="font-mono tabular-nums">
              {studyState.masteredFlashcards.length} / {FLASHCARDS.length} retained
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[280px] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {isFlipped ? 'Answer & Theorem Breakdown' : 'Active Recall Prompt'}
                </span>
                {isCardMastered && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Retained
                  </span>
                )}
              </div>

              {!isFlipped ? (
                <p className="font-display text-xl sm:text-2xl font-medium text-slate-900 leading-snug">
                  {currentCard.front}
                </p>
              ) : (
                <p className="text-base text-slate-800 leading-relaxed">
                  {currentCard.back}
                </p>
              )}

              {!isFlipped && showHint && (
                <p className="text-xs text-blue-800 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2">
                  Hint: {currentCard.hint}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isFlipped && (
                  <button
                    type="button"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  {isFlipped ? 'Show Prompt' : 'Reveal Answer'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => onToggleFlashcardMastered(currentCard.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  isCardMastered
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isCardMastered ? 'Marked Retained' : 'Mark Retained'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setCardIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
                setIsFlipped(false);
                setShowHint(false);
              }}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Card
            </button>
            <button
              type="button"
              onClick={() => {
                setCardIndex((prev) => (prev + 1) % FLASHCARDS.length);
                setIsFlipped(false);
                setShowHint(false);
              }}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Next Card
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
