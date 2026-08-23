import React, { useState } from 'react';
import { 
  Volume2, 
  ChevronRight, 
  ChevronLeft, 
  Scissors, 
  CheckCircle2, 
  Sparkles, 
  PenTool, 
  Layers, 
  Check, 
  X,
  HelpCircle,
  RotateCcw,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookPage, EvaluationSkill } from '../types/book';
import { playArabicAudio } from '../utils/audio';
import { InteractiveTracingBoard } from './InteractiveTracingBoard';
import { SyllableCutterModal } from './SyllableCutterModal';
import { IbnSinaLogo } from './IbnSinaLogo';
import { SchoolBranding, DEFAULT_BRANDING } from '../utils/schoolBranding';
import { SyllableHighlighter, SyllableLegendGuide } from '../utils/syllableHighlighter';

interface PageRendererProps {
  page: BookPage;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectPage: (pageNum: number) => void;
  onOpenToc: () => void;
  onOpenPrint?: () => void;
  skills: EvaluationSkill[];
  setSkills: React.Dispatch<React.SetStateAction<EvaluationSkill[]>>;
  branding?: SchoolBranding;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  onPrevPage,
  onNextPage,
  onSelectPage,
  onOpenToc,
  onOpenPrint,
  skills,
  setSkills,
  branding = DEFAULT_BRANDING
}) => {
  const [selectedVowel, setSelectedVowel] = useState<'fatha' | 'kasra' | 'damma'>('fatha');
  const [showTracingPad, setShowTracingPad] = useState(false);
  const [tracingGuideWord, setTracingGuideWord] = useState<string>('');
  const [activeAnalysisModal, setActiveAnalysisModal] = useState<{ word: string; syllables: string[]; explanation?: string } | null>(null);

  // EGR Visual Syllable Highlighting state
  const [highlightSyllables, setHighlightSyllables] = useState(true);
  const [showSyllableLegend, setShowSyllableLegend] = useState(false);

  // Picture blanks state for page 117
  const [pictureAnswers, setPictureAnswers] = useState<Record<number, string>>({});
  
  // Coloring state for page 118
  const [coloredItems, setColoredItems] = useState<Record<string, 'open_ta' | 'tied_ta' | 'ha'>>({});

  // Skill mapping
  const associatedSkill = skills.find(s => s.id === page.skillId);

  const toggleAttempt = (attemptIndex: number) => {
    if (!page.skillId) return;
    setSkills((prev) => {
      const updated = prev.map((s) => {
        if (s.id === page.skillId) {
          const newAttempts: [boolean, boolean, boolean, boolean] = [
            attemptIndex === 0 ? !s.attempts[0] : s.attempts[0],
            attemptIndex === 1 ? !s.attempts[1] : s.attempts[1],
            attemptIndex === 2 ? !s.attempts[2] : s.attempts[2],
            attemptIndex === 3 ? !s.attempts[3] : s.attempts[3],
          ];
          return { ...s, attempts: newAttempts };
        }
        return s;
      });
      localStorage.setItem('ibn_sinai_reading_skills', JSON.stringify(updated));
      return updated;
    });

    try {
      confetti({ particleCount: 25, spread: 50 });
    } catch (e) {}
  };

  const handleWordClick = (word: string) => {
    playArabicAudio(word);
    setTracingGuideWord(word);
  };

  const handlePictureChoice = (itemId: number, choice: string, correct: string) => {
    setPictureAnswers(prev => ({ ...prev, [itemId]: choice }));
    if (choice === correct) {
      try {
        confetti({ particleCount: 20, spread: 45 });
      } catch (e) {}
    }
  };

  const handleColorItem = (word: string, chosenType: 'open_ta' | 'tied_ta' | 'ha') => {
    setColoredItems(prev => ({ ...prev, [word]: chosenType }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-cairo">
      
      {/* Top Page Header / Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-200/80 shadow-xs space-y-4">
        
        {/* Page Meta Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {page.pageNumber}
            </span>
            <div>
              <span className="text-xs text-amber-800 font-bold block">
                {page.unitTitle}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {page.title}
              </h2>
            </div>
          </div>

          {/* Quick Attempts Badge & Print on Top Right */}
          <div className="flex items-center gap-2">
            {onOpenPrint && (
              <button
                onClick={onOpenPrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-2xs hover:scale-105"
                title="طباعة هذه الصفحة كورقة عمل A4"
              >
                <Printer className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">طباعة الصفحة A4</span>
              </button>
            )}

            {associatedSkill && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
                <span className="text-[11px] text-slate-500 font-bold px-1 hidden sm:inline">
                  أتقن من المحاولة:
                </span>
                {[0, 1, 2, 3].map((attIdx) => {
                  const checked = associatedSkill.attempts[attIdx];
                  return (
                    <button
                      key={attIdx}
                      onClick={() => toggleAttempt(attIdx)}
                      className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-black transition cursor-pointer ${
                        checked
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-slate-300 border-slate-200 hover:border-amber-400'
                      }`}
                      title={`المحاولة ${attIdx + 1}`}
                    >
                      {attIdx + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Goal & Procedure Box (as formatted in the book) */}
        {(page.goal || page.procedure) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {page.goal && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3">
                <span className="font-bold text-emerald-900 block mb-1">🎯 الهدف:</span>
                <p className="text-slate-700 leading-relaxed">{page.goal}</p>
              </div>
            )}
            {page.procedure && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3">
                <span className="font-bold text-amber-900 block mb-1">📋 الإجراء:</span>
                <p className="text-slate-700 leading-relaxed">{page.procedure}</p>
              </div>
            )}
          </div>
        )}

        {/* EGR Phonics Guidance Alert: Emphasize Sound over Letter Names */}
        <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-amber-50 border-r-4 border-emerald-600 rounded-2xl p-3 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-black text-emerald-950 flex items-center gap-1.5">
              <span>🔊 توجيه نهج القراءة المبكر (EGR) للمعلم وولي الأمر:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighlightSyllables(!highlightSyllables)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition flex items-center gap-1 cursor-pointer border ${
                  highlightSyllables 
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
                title="تفعيل تمييز المقاطع الصوتية بالألوان والأقواس السفلية ⏝"
              >
                <span>🌈 {highlightSyllables ? 'المقاطع الصوتية مفعّلة' : 'تفعيل المقاطع الصوتية'}</span>
              </button>

              <button
                onClick={() => setShowSyllableLegend(!showSyllableLegend)}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-amber-50"
              >
                {showSyllableLegend ? 'إخفاء الدليل' : 'دليل الرموز ℹ️'}
              </button>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
            💡 <strong>التأكيد على الصوت لا الحرف:</strong> احرص دائماً على نطق الأصوات بحركاتها (<strong>بَ، بِ، بُ</strong>) أو مقطعها الساكن دفعة واحدة (<strong>أَبْـ</strong>)، وتجنّب تماماً نطق أسماء الحروف المجردة (باء، ميم، سين) لتسريع الانتقال من التهجئة البطيئة إلى الطلاقة القرائية.
          </p>

          {showSyllableLegend && (
            <div className="pt-2">
              <SyllableLegendGuide compact={true} />
            </div>
          )}
        </div>

        {/* Rule Notice if any */}
        {page.ruleNotice && (
          <div className="bg-amber-100/70 border-r-4 border-amber-500 p-3 rounded-l-2xl text-xs text-amber-950 font-bold leading-relaxed">
            ⚠️ {page.ruleNotice}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE CONTENT RENDERING ACCORDING TO PAGE TYPE */}
        {/* ========================================================================= */}

        {/* COVER / INTRO PAGE */}
        {(page.pageType === 'cover' || page.pageType === 'intro' || page.pageType === 'conclusion') && (
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-center">
              {page.pageNumber === 1 ? (
                <div className="bg-emerald-50/80 p-5 rounded-3xl border-2 border-amber-300 shadow-sm inline-flex flex-col items-center gap-2">
                  <IbnSinaLogo 
                    size="xl" 
                    showText={true} 
                    customLogoUrl={branding.logoUrl}
                    schoolName={branding.schoolName}
                    departmentName={branding.departmentName}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-emerald-700 to-teal-900 text-white flex items-center justify-center mx-auto text-3xl font-black shadow-lg border-4 border-amber-300">
                  📖
                </div>
              )}
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {page.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                {page.content?.text}
              </p>
            </div>

            {page.content?.ruleBoxes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right max-w-3xl mx-auto pt-4">
                {page.content.ruleBoxes.map((box, bIdx) => (
                  <div key={bIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition">
                    <span className="font-black text-emerald-900 text-sm block mb-1">{box.title}</span>
                    <p className="text-xs text-slate-600 mb-2">{box.body}</p>
                    <span className="inline-block bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-bold">
                      أمثلة: {box.example}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TOC PAGE */}
        {page.pageType === 'toc' && page.content?.items && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.content.items.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={onOpenToc}
                  className="p-4 bg-[#FCFAF7] rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition"
                >
                  <span className="font-bold text-slate-800 text-sm">{item}</span>
                  <span className="text-xs bg-emerald-700 text-white px-2 py-1 rounded-lg font-bold">تصفح</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UNIT COVER */}
        {page.pageType === 'unit_cover' && (
          <div className="py-12 text-center space-y-4 bg-linear-to-b from-amber-50 to-transparent rounded-2xl p-6">
            <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
              {page.unitTitle}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              {page.title}
            </h3>
            {page.subtitle && (
              <p className="text-base text-slate-600 font-bold">{page.subtitle}</p>
            )}
            <div className="pt-4">
              <button
                onClick={onNextPage}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md inline-flex items-center gap-2"
              >
                <span>بدء دروس الوحدة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LETTER VOWELS (PAGE 6) */}
        {page.pageType === 'letter_vowels' && (
          <div className="space-y-6">
            {/* Vowel Selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl flex-wrap">
              <span className="text-xs font-bold text-slate-600 px-2">اختر صوت الحركة:</span>
              <button
                onClick={() => setSelectedVowel('fatha')}
                className={`px-4 py-1.5 rounded-xl font-bold text-sm transition ${
                  selectedVowel === 'fatha'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                الفتحة ( َ )
              </button>
              <button
                onClick={() => setSelectedVowel('kasra')}
                className={`px-4 py-1.5 rounded-xl font-bold text-sm transition ${
                  selectedVowel === 'kasra'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                الكسرة ( ِ )
              </button>
              <button
                onClick={() => setSelectedVowel('damma')}
                className={`px-4 py-1.5 rounded-xl font-bold text-sm transition ${
                  selectedVowel === 'damma'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                الضمة ( ُ )
              </button>
            </div>

            {/* Letter Cards Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
              {page.content?.gridItems?.map((itemGroup, idx) => {
                const parts = itemGroup.split(' ');
                const activeLetter = selectedVowel === 'fatha' ? parts[0] : selectedVowel === 'kasra' ? parts[1] : parts[2];
                return (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(activeLetter)}
                    className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 hover:shadow-md hover:scale-105 transition flex flex-col items-center justify-center gap-1 group cursor-pointer"
                  >
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-emerald-800 transition">
                      {activeLetter}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-700 flex items-center gap-0.5">
                      <Volume2 className="w-3 h-3" />
                      <span>نطق</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RANDOM LETTERS GRID (PAGE 7) */}
        {page.pageType === 'letter_random' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-bold">
              اضغط على أي حرف لسماع نطقه العشوائي السريع وتدريب الطالب على القراءة الفورية:
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {page.content?.gridItems?.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordClick(letter)}
                  className="p-3 rounded-2xl bg-[#FCFAF7] border-2 border-amber-200/80 hover:border-emerald-600 hover:bg-emerald-50 hover:scale-105 transition text-center group cursor-pointer"
                >
                  <span className="text-2xl font-black text-slate-900 group-hover:text-emerald-950">
                    {letter}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">🔊</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TWO LETTERS & WORDS READING GRIDS */}
        {(page.pageType === 'two_letters_reading' || page.pageType === 'words_reading' || page.pageType === 'madd_comparison') && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {page.content?.gridItems?.map((word, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 hover:shadow-md transition flex flex-col items-center justify-between gap-2 group"
                >
                  <span 
                    onClick={() => handleWordClick(word)}
                    className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide cursor-pointer hover:text-emerald-800 hover:scale-105 transition"
                    title="اضغط للنطق"
                  >
                    {highlightSyllables ? (
                      <SyllableHighlighter text={word} showArcs={true} colorCoded={true} />
                    ) : (
                      word
                    )}
                  </span>

                  <div className="flex items-center gap-1.5 w-full pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleWordClick(word)}
                      className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center justify-center gap-1"
                      title="استماع"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>نطق</span>
                    </button>
                    <button
                      onClick={() => {
                        setTracingGuideWord(word);
                        setShowTracingPad(true);
                      }}
                      className="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition"
                      title="كتابة وتتبع"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONNECT & READ EXERCISES */}
        {page.pageType === 'connect_and_read' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.content?.connectExercises?.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FCFAF7] border-2 border-amber-200 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
                      {ex.separated}
                    </span>
                    <span className="text-slate-400 font-black">➜</span>
                    <span className="text-2xl font-black text-emerald-950">
                      {highlightSyllables ? (
                        <SyllableHighlighter text={ex.combined} showArcs={true} />
                      ) : (
                        ex.combined
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleWordClick(ex.combined)}
                      className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition"
                      title="استماع"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setTracingGuideWord(ex.combined);
                        setShowTracingPad(true);
                      }}
                      className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition"
                      title="كتابة"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYLLABLE ANALYSIS EXERCISES */}
        {page.pageType === 'analysis_syllables' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.content?.analysisWords?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 transition flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <span className="text-xl font-black text-slate-900 block">
                      {highlightSyllables ? (
                        <SyllableHighlighter text={item.word} showArcs={true} />
                      ) : (
                        item.word
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.syllables.map((syl, sIdx) => (
                        <span
                          key={sIdx}
                          onClick={() => playArabicAudio(syl)}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-xs font-bold cursor-pointer hover:bg-emerald-100"
                        >
                          {syl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveAnalysisModal(item)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>تفكيك صوتي</span>
                    </button>
                    <button
                      onClick={() => handleWordClick(item.word)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SENTENCES READING */}
        {page.pageType === 'sentences_reading' && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              {page.content?.sentences?.map((sentence, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FCFAF7] border-2 border-amber-200/80 flex items-center justify-between gap-3"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {highlightSyllables ? (
                      <SyllableHighlighter text={sentence} showArcs={true} />
                    ) : (
                      sentence
                    )}
                  </span>
                  <button
                    onClick={() => playArabicAudio(sentence)}
                    className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shrink-0 transition"
                    title="نطق الجملة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WRITTEN TRACING LIST (3-STAGE: ORIGINAL -> DOTTED TRACE -> EMPTY WRITING) */}
        {page.pageType === 'written_tracing' && (
          <div className="space-y-4">
            {/* Guide Header Banner */}
            <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-950">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[11px]">✍️</span>
                <span>خطوات التدريب الثلاثية المعتمدة:</span>
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-slate-900 inline-block"></span>
                  <strong>١. النموذج الأصلي</strong>
                </span>
                <span className="text-slate-400">➜</span>
                <span className="flex items-center gap-1 text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  <strong>٢. مقطع منقط للتتبع</strong>
                </span>
                <span className="text-slate-400">➜</span>
                <span className="flex items-center gap-1 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                  <strong>٣. مقطع فارغ للكتابة</strong>
                </span>
              </div>
            </div>

            {/* 3-Step Tracing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {page.content?.gridItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl shadow-xs transition space-y-2"
                >
                  <div className="grid grid-cols-3 gap-2 items-stretch text-center">
                    {/* 1. Original Syllable / Model */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-between min-h-[78px]">
                      <span className="text-[10px] text-slate-500 font-bold">النموذج</span>
                      <span className="text-2xl font-black font-amiri text-slate-950">
                        {item}
                      </span>
                      <button
                        onClick={() => handleWordClick(item)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 font-bold"
                        title="استماع للنطق"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>نطق</span>
                      </button>
                    </div>

                    {/* 2. Dotted Traceable Syllable */}
                    <div
                      onClick={() => {
                        setTracingGuideWord(item);
                        setShowTracingPad(true);
                      }}
                      className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-100/60 rounded-xl p-2 flex flex-col items-center justify-between min-h-[78px] cursor-pointer transition group"
                      title="اضغط لتتبع المقطع على السبورة التفاعلية"
                    >
                      <span className="text-[10px] text-amber-700 font-bold group-hover:underline">تتبع منقط</span>
                      <span className="arabic-dotted-tracing text-2xl font-black group-hover:scale-105 transition">
                        {item}
                      </span>
                      <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5">
                        <PenTool className="w-2.5 h-2.5" />
                        <span>تتبع إلكتروني</span>
                      </span>
                    </div>

                    {/* 3. Empty Writing Slot */}
                    <div
                      onClick={() => {
                        setTracingGuideWord(item);
                        setShowTracingPad(true);
                      }}
                      className="border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 rounded-xl p-2 flex flex-col items-center justify-between min-h-[78px] cursor-pointer transition group"
                      title="اضغط للكتابة الحرة على السبورة"
                    >
                      <span className="text-[10px] text-slate-400 group-hover:text-emerald-700 font-bold">اكتب هنا</span>
                      <div className="w-full h-5 border-b-2 border-slate-400 border-dotted mt-2"></div>
                      <span className="text-[9px] text-slate-400 group-hover:text-emerald-600 font-bold">كتابة حرة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DICTATION BOARD QUICK LAUNCH */}
        {page.pageType === 'dictation_board' && (
          <div className="bg-[#FCFAF7] border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center space-y-4">
            <span className="text-3xl">🎧</span>
            <h3 className="text-lg font-bold text-slate-900">تدريب إملائي مقترح لهذه الصفحة</h3>
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-xl mx-auto">
              {page.content?.dictationSuggestedWords?.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => playArabicAudio(w)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 rounded-xl text-xs font-bold text-slate-800 transition flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-emerald-700" />
                  <span>{w}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              اضغط أي كلمة لسماع إملائها وقم بكتابتها في دفترك أو على السبورة التفاعلية بالأسفل.
            </p>
          </div>
        )}

        {/* TANWEEN & SHADDAH & RULE EXPLANATIONS */}
        {(page.pageType === 'rule_explanation' || page.pageType === 'tanween_types' || page.pageType === 'ta_ha_rule' || page.pageType === 'lam_comparison') && (
          <div className="space-y-4">
            {page.content?.ruleBoxes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {page.content.ruleBoxes.map((box, idx) => (
                  <div key={idx} className="bg-[#FCFAF7] p-5 rounded-2xl border-2 border-amber-200/80 space-y-2">
                    <span className="font-black text-emerald-900 text-sm block">{box.title}</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{box.body}</p>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-950">
                      💡 أمثلة: {box.example}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {page.content?.tableData && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-800">
                    <tr>
                      <th className="p-3">نوع الظاهرة</th>
                      <th className="p-3">أمثلة من الكتيب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {page.content.tableData.map((row: any, rIdx: number) => (
                      <tr key={rIdx}>
                        <td className="p-3 font-bold text-emerald-900">{row.type}</td>
                        <td className="p-3 font-bold text-slate-800">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SHADDAH / LAM SORTING TABLES */}
        {(page.pageType === 'shaddah_extraction' || page.pageType === 'shaddah_sorting' || page.pageType === 'lam_sorting' || page.pageType === 'madd_identification') && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {page.content?.sortingItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <span 
                    onClick={() => playArabicAudio(item.word.split('->')[0].trim())}
                    className="font-bold text-slate-900 text-sm cursor-pointer hover:text-emerald-800"
                  >
                    {item.word}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-lg">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PICTURE BLANKS (PAGE 117) */}
        {page.pageType === 'ta_ha_picture_blanks' && page.content?.pictureBlanks && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {page.content.pictureBlanks.map((item) => {
                const userChoice = pictureAnswers[item.id];
                const isCorrect = userChoice === item.correct;

                return (
                  <div
                    key={item.id}
                    className="bg-[#FCFAF7] border-2 border-amber-200/80 rounded-2xl p-4 text-center space-y-3"
                  >
                    <div className="text-4xl">{item.imageEmoji}</div>
                    
                    <div className="text-lg font-black text-slate-900 font-cairo">
                      {userChoice ? item.wordComplete : `${item.wordStart}....`}
                    </div>

                    <div className="flex items-center justify-center gap-1">
                      {item.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handlePictureChoice(item.id, opt, item.correct)}
                          className={`w-7 h-7 rounded-lg border font-bold text-xs transition ${
                            userChoice === opt
                              ? isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-rose-600 text-white border-rose-700'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TA & HA COLORING EXERCISE (PAGE 118) */}
        {page.pageType === 'ta_ha_coloring' && page.content?.colorItems && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span>دليل التلوين:</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-lg">🟩 تاء مفتوحة (أخضر)</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-900 rounded-lg">🟥 تاء مربوطة (أحمر)</span>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-900 rounded-lg">🟦 هاء (أزرق)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {page.content.colorItems.map((item, idx) => {
                const colored = coloredItems[item.word];
                let bgClass = 'bg-white border-slate-200 text-slate-800';
                if (colored === 'open_ta') bgClass = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black';
                else if (colored === 'tied_ta') bgClass = 'bg-rose-100 border-rose-400 text-rose-950 font-black';
                else if (colored === 'ha') bgClass = 'bg-sky-100 border-sky-400 text-sky-950 font-black';

                return (
                  <div key={idx} className={`p-3 rounded-2xl border-2 transition text-center space-y-1.5 ${bgClass}`}>
                    <span className="text-sm font-bold block">{item.word}</span>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleColorItem(item.word, 'open_ta')}
                        className="w-5 h-5 rounded-full bg-emerald-500 text-[9px] text-white font-bold"
                        title="تاء مفتوحة"
                      >
                        ت
                      </button>
                      <button
                        onClick={() => handleColorItem(item.word, 'tied_ta')}
                        className="w-5 h-5 rounded-full bg-rose-500 text-[9px] text-white font-bold"
                        title="تاء مربوطة"
                      >
                        ة
                      </button>
                      <button
                        onClick={() => handleColorItem(item.word, 'ha')}
                        className="w-5 h-5 rounded-full bg-sky-500 text-[9px] text-white font-bold"
                        title="هاء"
                      >
                        هـ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Embedded Handwriting / Tracing Pad Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowTracingPad(!showTracingPad)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs"
          >
            <PenTool className="w-4 h-4" />
            <span>{showTracingPad ? 'إخفاء سبورة التتبع' : 'فتح سبورة التتبع والكتابة'}</span>
          </button>

          {tracingGuideWord && (
            <span className="text-xs text-slate-500">
              النموذج الحالي للسبورة: <strong>{tracingGuideWord}</strong>
            </span>
          )}
        </div>

        {showTracingPad && (
          <InteractiveTracingBoard 
            guideText={tracingGuideWord || page.content?.gridItems?.[0] || 'كِتَابَة'} 
            title={`سبورة تتبع محتوى الصفحة ${page.pageNumber}`}
          />
        )}
      </div>

      {/* Bottom Page Navigation Controls */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200 flex items-center justify-between gap-2 shadow-xs no-print">
        <button
          onClick={onPrevPage}
          disabled={page.pageNumber <= 1}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-4 h-4" />
          <span>الصفحة السابقة (ص {page.pageNumber - 1})</span>
        </button>

        <button
          onClick={onOpenToc}
          className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition border border-amber-200 flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">الفهرس</span>
        </button>

        <button
          onClick={onNextPage}
          disabled={page.pageNumber >= 121}
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
        >
          <span>الصفحة التالية (ص {page.pageNumber + 1})</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Modal for Syllables Analysis */}
      {activeAnalysisModal && (
        <SyllableCutterModal
          word={activeAnalysisModal.word}
          syllables={activeAnalysisModal.syllables}
          explanation={activeAnalysisModal.explanation}
          onClose={() => setActiveAnalysisModal(null)}
        />
      )}
    </div>
  );
};
