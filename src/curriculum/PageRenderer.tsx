import React, { useState, useEffect, useMemo } from 'react';
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
  Printer,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Palette,
  Columns,
  LayoutGrid,
  Gauge,
  ShieldCheck,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookPage, EvaluationSkill } from './types';
import { playArabicAudio, setAudioPrefetchContext } from '../speech_and_multimedia/audio';
import { sfx } from '../speech_and_multimedia/soundEffects';
import { InteractiveTracingBoard } from '../spelling_and_handwriting/InteractiveTracingBoard';
import { SyllableCutterModal } from '../spelling_and_handwriting/SyllableCutterModal';
import { IbnSinaLogo } from '../institutional_branding/IbnSinaLogo';
import { SchoolBranding, DEFAULT_BRANDING } from '../institutional_branding/schoolBranding';
import { SyllableHighlighter, SyllableLegendGuide } from '../phonological_awareness/syllableHighlighter';
import { ColoredArabicText, getWordIllustration } from '../phonological_awareness/harakatHelper';
import { SolarLunarTable } from '../phonological_awareness/SolarLunarTable';
import { processSmartContainment, getOptimizedGridCols, calculatePageLayoutDensity } from './smartContainment';

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
  page: rawPage,
  onPrevPage,
  onNextPage,
  onSelectPage,
  onOpenToc,
  onOpenPrint,
  skills,
  setSkills,
  branding = DEFAULT_BRANDING
}) => {
  const [smartContainment, setSmartContainment] = useState<boolean>(true);
  const [coloredHarakat, setColoredHarakat] = useState<boolean>(true);
  const [gridMode, setGridMode] = useState<'auto' | '1-col' | '2-col'>('auto');

  // Apply Smart Containment (Deduplication + Balance) if enabled
  const page = useMemo(() => {
    return smartContainment ? processSmartContainment(rawPage) : rawPage;
  }, [rawPage, smartContainment]);

  // Calculate dynamic density metrics for text, input boxes, and print overflow risk
  const density = useMemo(() => {
    return calculatePageLayoutDensity(page);
  }, [page]);

  // Determine active column mode (auto calculated vs manual override)
  const effectiveCols = useMemo(() => {
    if (gridMode === '1-col') return 1;
    if (gridMode === '2-col') return 2;
    return density.recommendedCols;
  }, [gridMode, density.recommendedCols]);

  const [selectedVowel, setSelectedVowel] = useState<'fatha' | 'kasra' | 'damma'>('fatha');
  const [showTracingPad, setShowTracingPad] = useState(false);
  const [tracingGuideWord, setTracingGuideWord] = useState<string>('');
  const [activeAnalysisModal, setActiveAnalysisModal] = useState<{ word: string; syllables: string[]; explanation?: string } | null>(null);

  // Visual Syllable Highlighting state
  const [highlightSyllables, setHighlightSyllables] = useState(true);
  const [showSyllableLegend, setShowSyllableLegend] = useState(false);

  // Picture blanks state for page 117
  const [pictureAnswers, setPictureAnswers] = useState<Record<number, string>>({});
  
  // Coloring state for page 118
  const [coloredItems, setColoredItems] = useState<Record<string, 'open_ta' | 'tied_ta' | 'ha'>>({});

  // Solar & Lunar Classification Lab Modal
  const [showSolarLunarModal, setShowSolarLunarModal] = useState<boolean>(false);

  useEffect(() => {
    // Extract words from page for prefetching
    const words: string[] = [];
    if (page.content?.gridItems) words.push(...page.content.gridItems);
    if (page.content?.dictationSuggestedWords) words.push(...page.content.dictationSuggestedWords);
    if (page.content?.analysisWords) words.push(...page.content.analysisWords.map(w => w.word));
    if (page.content?.connectExercises) {
      page.content.connectExercises.forEach(ex => {
        words.push(ex.separated);
        words.push(ex.combined);
      });
    }
    if (page.content?.sentences) words.push(...page.content.sentences);
    
    setAudioPrefetchContext(words);
  }, [page]);

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
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200/80 shadow-xs space-y-4">
        
        {/* Page Meta Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
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

          {/* Quick Attempts Badge & Tool Toggles on Top Right */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Smart Containment Toggle */}
            <button
              onClick={() => setSmartContainment(!smartContainment)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs cursor-pointer ${
                smartContainment 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title="تفعيل خاصية الاحتواء الذكي وتوزيع المساحات وحذف التكرار"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">الاحتواء الذكي {smartContainment ? 'مفعّل' : 'معطّل'}</span>
            </button>

            {/* Colored Harakat Toggle */}
            <button
              onClick={() => setColoredHarakat(!coloredHarakat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs cursor-pointer ${
                coloredHarakat 
                  ? 'bg-amber-50 text-amber-900 border-amber-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title="تلوين الحركات لتعزيز التمييز البصري للحركات القصيرة والطويلة"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">تلوين الحركات {coloredHarakat ? 'مفعّل' : 'معطّل'}</span>
            </button>

            {/* Solar & Lunar Interactive Lab Launcher */}
            {(page.unitId === 'lam' || (page.pageNumber >= 98 && page.pageNumber <= 111)) && (
              <button
                onClick={() => setShowSolarLunarModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-amber-500 to-sky-500 hover:from-amber-600 hover:to-sky-600 text-white text-xs font-black transition shadow-xs hover:scale-105 cursor-pointer"
                title="فتح مختبر فرز اللام الشمسية والقمرية التفاعلي"
              >
                <Sun className="w-3.5 h-3.5" />
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مختبر فرز (الشمسية والقمرية)</span>
              </button>
            )}

            {onOpenPrint && (
              <button
                onClick={onOpenPrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-2xs hover:scale-105 cursor-pointer"
                title="طباعة هذه الصفحة ورقة A4 كاملة"
              >
                <Printer className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">طباعة A4</span>
              </button>
            )}

            {associatedSkill && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
                <span className="text-[11px] text-slate-500 font-bold px-1 hidden sm:inline">
                  مؤشر الإتقان:
                </span>
                {[0, 1, 2, 3].map((attIdx) => {
                  const checked = associatedSkill.attempts[attIdx];
                  const labels = ['إتقان تام', 'متقدم', 'مقبول', 'علاجي'];
                  return (
                    <button
                      key={attIdx}
                      onClick={() => toggleAttempt(attIdx)}
                      className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-black transition cursor-pointer ${
                        checked
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-slate-300 border-slate-200 hover:border-amber-400'
                      }`}
                      title={`المحاولة ${attIdx + 1} (${labels[attIdx]})`}
                    >
                      {attIdx + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Goal & Procedure Box */}
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

        {/* Phonics Guidance Bar with Diacritics Color Key */}
        <div className="bg-linear-to-r from-emerald-50 to-amber-50 border-r-4 border-emerald-600 rounded-2xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-black text-emerald-950 flex items-center gap-1.5">
              <span>🔊 التوجيه الصوتي القرائي والتلوين الدلالي:</span>
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
                <span>🔤 {highlightSyllables ? 'المقاطع الصوتية مفعّلة' : 'تفعيل المقاطع'}</span>
              </button>

              <button
                onClick={() => setShowSyllableLegend(!showSyllableLegend)}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 cursor-pointer"
              >
                {showSyllableLegend ? 'إخفاء الدليل' : 'دليل الرموز ℹ️'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap text-[11px] bg-white/70 p-2 rounded-xl border border-emerald-200/60 font-medium">
            <span className="font-bold text-slate-800">مفتاح الحركات:</span>
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">الفتحة ( َ )</span>
            <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-md">الكسرة ( ِ )</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">الضمة ( ُ )</span>
            <span className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md">السكون ( ْ )</span>
            <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">الشدة ( ّ )</span>
          </div>

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

        {/* Dynamic Layout Density & Grid HUD Bar */}
        {page.pageType !== 'cover' && page.pageType !== 'toc' && page.pageType !== 'unit_cover' && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black">
                  <Gauge className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900">
                    <span>الشبكة التفاعلية وحساب الكثافة (Dynamic Layout Grid):</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      density.level === 'low' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                      density.level === 'balanced' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      density.level === 'dense' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      كثافة: {density.score}% ({density.levelLabel})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {density.summaryText}
                  </p>
                </div>
              </div>

              {/* 1-Col vs 2-Col Mode Switcher Buttons */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setGridMode('auto')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition flex items-center gap-1 cursor-pointer ${
                    gridMode === 'auto'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="توزيع تلقائي محسوب ذكياً حسب كثافة النصوص وخانات الإدخال"
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>تلقائي ({density.recommendedCols} عمود)</span>
                </button>
                <button
                  onClick={() => setGridMode('1-col')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition flex items-center gap-1 cursor-pointer ${
                    gridMode === '1-col'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="تنسيق عمود واحد رأسي واسع"
                >
                  <Columns className="w-3 h-3" />
                  <span>عمود واحد</span>
                </button>
                <button
                  onClick={() => setGridMode('2-col')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition flex items-center gap-1 cursor-pointer ${
                    gridMode === '2-col'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="تنسيق عمودين أفقي مضغوط لتوفير المساحة"
                >
                  <Columns className="w-3 h-3" />
                  <span>عمودان</span>
                </button>
              </div>
            </div>

            {/* Metrics Chips & A4 Print Safety Status */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] bg-white/80 p-2 rounded-xl border border-slate-200/70 font-medium">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-slate-600">
                  العناصر: <strong className="text-slate-900">{density.itemCount}</strong>
                </span>
                <span className="text-slate-600">
                  متوسط طول النص: <strong className="text-slate-900">{density.textDensity} حرف</strong>
                </span>
                <span className="text-slate-600">
                  خانات الكتابة: <strong className="text-slate-900">{density.inputBoxCount} خانة</strong>
                </span>
                <span className="text-slate-600">
                  الارتفاع التقديري: <strong className="text-slate-900">{density.totalPageHeightMm} مم / {density.a4HeightBudgetMm} مم</strong>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                {effectiveCols === 1 && density.overflowRisk ? (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>تنبيه: نمط العمود الواحد قد يتجاوز صفحة A4 عند الطباعة</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>آمن للطباعة A4 (بدون تدفق لصفحة ثانية)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE CONTENT RENDERING ACCORDING TO PAGE TYPE */}
        {/* ========================================================================= */}

        {/* COVER / INTRO PAGE */}
        {(page.pageType === 'cover' || page.pageType === 'intro' || page.pageType === 'conclusion') && (
          <div className="py-6 text-center space-y-6">
            <div className="flex justify-center">
              {page.pageNumber === 1 ? (
                <div className="bg-emerald-50/80 p-5 rounded-3xl border-2 border-amber-300 shadow-xs inline-flex flex-col items-center gap-2">
                  <IbnSinaLogo 
                    size="xl" 
                    showText={true} 
                    customLogoUrl={branding.logoUrl}
                    schoolName={branding.schoolName}
                    departmentName={branding.departmentName}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-emerald-700 to-teal-900 text-white flex items-center justify-center mx-auto text-3xl font-black shadow-md border-4 border-amber-300">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right max-w-3xl mx-auto pt-2">
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
          <div className="py-8 text-center space-y-4 bg-linear-to-b from-amber-50 to-transparent rounded-2xl p-6 border-2 border-amber-200/60">
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
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md inline-flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <span>بدء دروس الوحدة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LETTER VOWELS (PAGE 6) */}
        {page.pageType === 'letter_vowels' && (
          <div className="space-y-5">
            {/* Vowel Selector */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700 px-1">اختر حركة للتركيز:</span>
                <button
                  onClick={() => setSelectedVowel('fatha')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                    selectedVowel === 'fatha'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  الفتحة ( َ )
                </button>
                <button
                  onClick={() => setSelectedVowel('kasra')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                    selectedVowel === 'kasra'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  الكسرة ( ِ )
                </button>
                <button
                  onClick={() => setSelectedVowel('damma')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                    selectedVowel === 'damma'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  الضمة ( ُ )
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-bold">
                اضغط على أي حرف للاستماع لصوته المباشر 🔊
              </span>
            </div>

            {/* Letter Cards Grid with Colored Text */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {page.content?.gridItems?.map((itemGroup, idx) => {
                const parts = itemGroup.split(' ');
                const activeLetter = selectedVowel === 'fatha' ? parts[0] : selectedVowel === 'kasra' ? parts[1] : parts[2];
                return (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(activeLetter)}
                    className="p-3 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 hover:shadow-md hover:scale-105 transition flex flex-col items-center justify-center gap-1 group cursor-pointer"
                  >
                    <span className="text-3xl font-black font-amiri text-slate-900 group-hover:text-emerald-800 transition">
                      <ColoredArabicText text={activeLetter} enableColoredHarakat={coloredHarakat} />
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-700 flex items-center gap-0.5 font-bold">
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
            <p className="text-xs text-slate-600 font-bold">
              اضغط على أي حرف لسماع نطقه العشوائي السريع وتدريب الطالب على القراءة الفورية:
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {page.content?.gridItems?.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordClick(letter)}
                  className="p-3 rounded-2xl bg-[#FCFAF7] border-2 border-amber-200/80 hover:border-emerald-600 hover:bg-emerald-50 hover:scale-105 transition text-center group cursor-pointer"
                >
                  <span className="text-2xl font-black font-amiri text-slate-900 group-hover:text-emerald-950">
                    <ColoredArabicText text={letter} enableColoredHarakat={coloredHarakat} />
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">🔊</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TWO LETTERS & WORDS READING GRIDS WITH ADAPTIVE COLUMNS & VISUAL ICONS */}
        {(page.pageType === 'two_letters_reading' || page.pageType === 'words_reading' || page.pageType === 'madd_comparison') && (
          <div className="space-y-4">
            <div className={`grid ${getOptimizedGridCols(page.content?.gridItems?.length || 8)} gap-3`}>
              {page.content?.gridItems?.map((word, idx) => {
                const hint = getWordIllustration(word);
                return (
                  <div
                    key={idx}
                    className={`p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 hover:shadow-md transition flex flex-col items-center justify-between gap-1.5 group relative ${
                      hint ? `bg-linear-to-b ${hint.bgGradient}` : ''
                    }`}
                  >
                    {/* Visual Icon Badge if available */}
                    {hint && (
                      <span className="absolute top-2 left-2 text-base select-none" title={hint.hintText}>
                        {hint.emoji}
                      </span>
                    )}

                    <span 
                      onClick={() => handleWordClick(word)}
                      className="text-xl sm:text-2xl font-black font-amiri text-slate-900 tracking-wide cursor-pointer hover:text-emerald-800 hover:scale-105 transition py-1 text-center w-full"
                      title="اضغط للنطق"
                    >
                      {highlightSyllables ? (
                        <SyllableHighlighter text={word} showArcs={true} />
                      ) : (
                        <ColoredArabicText text={word} enableColoredHarakat={coloredHarakat} />
                      )}
                    </span>

                    <div className="flex items-center gap-1.5 w-full pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleWordClick(word)}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
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
                        className="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition cursor-pointer"
                        title="كتابة وتتبع"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONNECT & READ EXERCISES */}
        {page.pageType === 'connect_and_read' && (
          <div className="space-y-4">
            <div className={`grid ${effectiveCols === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
              {page.content?.connectExercises?.map((ex, idx) => {
                const hint = getWordIllustration(ex.combined);
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#FCFAF7] border-2 border-amber-200 flex items-center justify-between gap-3 group shadow-2xs relative"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-black font-amiri text-amber-950 bg-amber-100/90 px-2.5 py-1 rounded-xl border border-amber-300">
                        <ColoredArabicText text={ex.separated} enableColoredHarakat={coloredHarakat} />
                      </span>
                      <span className="text-slate-400 font-black">➜</span>
                      <span className="text-2xl font-black font-amiri text-emerald-950 flex items-center gap-1.5">
                        {hint && <span className="text-lg">{hint.emoji}</span>}
                        {highlightSyllables ? (
                          <SyllableHighlighter text={ex.combined} showArcs={true} />
                        ) : (
                          <ColoredArabicText text={ex.combined} enableColoredHarakat={coloredHarakat} />
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleWordClick(ex.combined)}
                        className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition cursor-pointer"
                        title="استماع"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setTracingGuideWord(ex.combined);
                          setShowTracingPad(true);
                        }}
                        className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition cursor-pointer"
                        title="كتابة"
                      >
                        <PenTool className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SYLLABLE ANALYSIS EXERCISES */}
        {page.pageType === 'analysis_syllables' && (
          <div className="space-y-4">
            <div className={`grid ${effectiveCols === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
              {page.content?.analysisWords?.map((item, idx) => {
                const hint = getWordIllustration(item.word);
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 transition flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xl font-black font-amiri text-slate-900 flex items-center gap-1.5">
                        {hint && <span className="text-lg">{hint.emoji}</span>}
                        {highlightSyllables ? (
                          <SyllableHighlighter text={item.word} showArcs={true} />
                        ) : (
                          <ColoredArabicText text={item.word} enableColoredHarakat={coloredHarakat} />
                        )}
                      </span>

                      {/* Syllable Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold ml-1">المقاطع:</span>
                        {item.syllables.map((syl, sIdx) => (
                          <span
                            key={sIdx}
                            onClick={() => {
                              sfx.playPop(550, 0.08);
                              playArabicAudio(syl);
                            }}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-950 border border-emerald-300 rounded-lg text-xs font-black cursor-pointer hover:bg-emerald-100 transition font-amiri"
                            title="اضغط للاستماع للمقطع"
                          >
                            <ColoredArabicText text={syl} enableColoredHarakat={coloredHarakat} />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          sfx.playPop(620, 0.08);
                          setActiveAnalysisModal(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-black transition flex items-center gap-1 cursor-pointer hover:scale-105 shadow-2xs"
                        title="افتح لوحة التفكيك والتركيب المقطعي"
                      >
                        <Scissors className="w-3.5 h-3.5 text-emerald-700" />
                        <span>تفكيك وتركيب 🧩</span>
                      </button>
                      <button
                        onClick={() => {
                          sfx.playPop(480, 0.08);
                          handleWordClick(item.word);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="نطق الكلمة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SENTENCES READING (DYNAMIC 1-COL OR 2-COL ACCORDING TO DENSITY SCORE) */}
        {page.pageType === 'sentences_reading' && (
          <div className="space-y-4">
            <div className={`grid ${effectiveCols === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'} gap-3.5`}>
              {page.content?.sentences?.map((sentence, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FCFAF7] border-2 border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs hover:border-emerald-500 transition"
                >
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-relaxed font-amiri flex-1">
                    {highlightSyllables ? (
                      <SyllableHighlighter text={sentence} showArcs={true} />
                    ) : (
                      <ColoredArabicText text={sentence} enableColoredHarakat={coloredHarakat} />
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => playArabicAudio(sentence)}
                      className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shrink-0 transition cursor-pointer hover:scale-105 shadow-xs"
                      title="نطق الجملة"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setTracingGuideWord(sentence);
                        setShowTracingPad(true);
                      }}
                      className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold shrink-0 transition cursor-pointer"
                      title="كتابة وتتبع الجملة"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WRITTEN TRACING LIST (DYNAMIC 1-COL OR 2-COL / 3-COL) */}
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
            <div className={`grid ${effectiveCols === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : (density.itemCount > 8 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2')} gap-3`}>
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
                        <ColoredArabicText text={item} enableColoredHarakat={coloredHarakat} />
                      </span>
                      <button
                        onClick={() => handleWordClick(item)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 font-bold cursor-pointer"
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

        {/* DICTATION BOARD */}
        {page.pageType === 'dictation_board' && (
          <div className="bg-[#FCFAF7] border-2 border-dashed border-amber-300 rounded-3xl p-6 text-center space-y-4 shadow-2xs">
            <span className="text-3xl">🎧</span>
            <h3 className="text-lg font-black text-slate-900">لوحة الإملاء التفاعلي</h3>
            
            <div className="flex items-center justify-center gap-2.5 flex-wrap max-w-2xl mx-auto py-2">
              {page.content?.dictationSuggestedWords?.map((w, idx) => {
                const hint = getWordIllustration(w);
                return (
                  <button
                    key={idx}
                    onClick={() => playArabicAudio(w)}
                    className="px-3.5 py-2 bg-white border-2 border-slate-200 hover:border-emerald-600 hover:scale-105 rounded-xl text-sm font-black text-slate-900 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    {hint && <span>{hint.emoji}</span>}
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span><ColoredArabicText text={w} enableColoredHarakat={coloredHarakat} /></span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              اضغط أي كلمة لسماع إملائها صوتياً وتدرب على كتابتها مباشرة على السبورة أو في كراستك.
            </p>
          </div>
        )}

        {/* RULE EXPLANATIONS & PAGE 59 RASUL SPOTLIGHT */}
        {(page.pageType === 'rule_explanation' || page.pageType === 'tanween_types' || page.pageType === 'ta_ha_rule' || page.pageType === 'lam_comparison') && (
          <div className="space-y-4">
            
            {/* Spotlight Card for Page 59: رسول */}
            {page.pageNumber === 59 && (
              <div className="bg-linear-to-r from-amber-50 via-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📜</span>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950 font-amiri">
                      التحليل الصوتي المقطعي لكلمة: ( رَسُولُ )
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-800 text-white font-bold px-3 py-1 rounded-full shadow-2xs">
                    مد بالواو (صوت طويل)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-white border-2 border-amber-200 p-3 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-xs text-slate-500 font-bold block">١. صوت قصير مفتوح</span>
                    <span className="text-3xl font-black font-amiri text-slate-900 block">رَ</span>
                    <button
                      onClick={() => playArabicAudio('رَ')}
                      className="text-[11px] text-emerald-700 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>نطق (رَ)</span>
                    </button>
                  </div>

                  <div className="bg-emerald-100/70 border-2 border-emerald-500 p-3 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs text-emerald-900 font-black block">٢. مقطع مد بالواو (صوت طويل)</span>
                    <span className="text-3xl font-black font-amiri text-emerald-950 block">سُو</span>
                    <button
                      onClick={() => playArabicAudio('سُو')}
                      className="text-[11px] text-emerald-900 font-black inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>نطق (سُو)</span>
                    </button>
                  </div>

                  <div className="bg-white border-2 border-amber-200 p-3 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-xs text-slate-500 font-bold block">٣. صوت قصير مضموم</span>
                    <span className="text-3xl font-black font-amiri text-slate-900 block">لُ</span>
                    <button
                      onClick={() => playArabicAudio('لُ')}
                      className="text-[11px] text-emerald-700 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>نطق (لُ)</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => playArabicAudio('رَسُولُ')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نطق الكلمة كاملة (رَسُولُ)</span>
                  </button>
                  <button
                    onClick={() => setActiveAnalysisModal({
                      word: 'رَسُولُ',
                      syllables: ['رَ', 'سُو', 'لُ'],
                      explanation: 'المد بالواو هو إطالة صوت الضمة على حرف السين (سُـ ➜ سُو)'
                    })}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>تفكيك وتركيب 🧩</span>
                  </button>
                </div>
              </div>
            )}

            {page.content?.ruleBoxes && (
              <div className={`grid ${effectiveCols === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'} gap-3.5`}>
                {page.content.ruleBoxes.map((box, idx) => (
                  <div key={idx} className="bg-[#FCFAF7] border-2 border-amber-200 rounded-2xl p-4 space-y-2">
                    <h4 className="font-black text-emerald-950 text-sm border-b border-amber-200 pb-1">
                      {box.title}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {box.body}
                    </p>
                    {box.example && (
                      <div className="bg-white p-2 rounded-xl border border-amber-300 text-center font-amiri font-black text-base text-slate-950">
                        أمثلة: <ColoredArabicText text={box.example} enableColoredHarakat={coloredHarakat} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PICTURE BLANKS EXERCISE (PAGE 117) */}
        {page.pageType === 'ta_ha_picture_blanks' && page.content?.pictureBlanks && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-600">
              اختر الحرف الأخير الصحيح لكل صورة ليكتمل المعنى الإملائي:
            </p>
            <div className={`grid ${effectiveCols === 1 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-3`}>
              {page.content.pictureBlanks.map((item) => {
                const answered = pictureAnswers[item.id];
                const isCorrect = answered === item.correct;
                return (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 transition text-center space-y-3 ${
                      answered 
                        ? isCorrect 
                          ? 'border-emerald-500 bg-emerald-50/50' 
                          : 'border-rose-400 bg-rose-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="text-3xl select-none">{item.imageEmoji}</div>
                    <div className="text-2xl font-black font-amiri text-slate-900">
                      {answered ? item.wordComplete : item.wordStart + '...'}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {item.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handlePictureChoice(item.id, opt, item.correct)}
                          className={`px-3 py-1.5 rounded-xl font-black text-sm transition cursor-pointer border ${
                            answered === opt
                              ? isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-rose-600 text-white border-rose-700'
                              : 'bg-slate-100 hover:bg-amber-100 text-slate-800 border-slate-300'
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

        {/* COLORING EXERCISE (PAGE 118) */}
        {page.pageType === 'ta_ha_coloring' && page.content?.colorItems && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <span className="text-amber-950">🎨 اختر نوع الحرف لتلوين الكلمة باللون الصحيح:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sky-800">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
                  تاء مفتوحة (ت)
                </span>
                <span className="flex items-center gap-1 text-emerald-800">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  تاء مربوطة (ة)
                </span>
                <span className="flex items-center gap-1 text-rose-800">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  هاء (هـ)
                </span>
              </div>
            </div>

            <div className={`grid ${effectiveCols === 1 ? 'grid-cols-2 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'} gap-3`}>
              {page.content.colorItems.map((item, idx) => {
                const chosen = coloredItems[item.word];
                let bgClass = 'bg-white border-slate-200';
                if (chosen === 'open_ta') bgClass = 'bg-sky-100 border-sky-400 text-sky-950';
                if (chosen === 'tied_ta') bgClass = 'bg-emerald-100 border-emerald-400 text-emerald-950';
                if (chosen === 'ha') bgClass = 'bg-rose-100 border-rose-400 text-rose-950';

                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-2xl border-2 transition text-center space-y-2 ${bgClass}`}
                  >
                    <span className="text-xl font-black font-amiri block">{item.word}</span>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleColorItem(item.word, 'open_ta')}
                        className="px-2 py-0.5 rounded-lg text-xs bg-sky-200 text-sky-900 font-bold hover:bg-sky-300 cursor-pointer"
                        title="تاء مفتوحة"
                      >
                        ت
                      </button>
                      <button
                        onClick={() => handleColorItem(item.word, 'tied_ta')}
                        className="px-2 py-0.5 rounded-lg text-xs bg-emerald-200 text-emerald-900 font-bold hover:bg-emerald-300 cursor-pointer"
                        title="تاء مربوطة"
                      >
                        ة
                      </button>
                      <button
                        onClick={() => handleColorItem(item.word, 'ha')}
                        className="px-2 py-0.5 rounded-lg text-xs bg-rose-200 text-rose-900 font-bold hover:bg-rose-300 cursor-pointer"
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

        {/* SOLAR & LUNAR LAM INTERACTIVE CLASSIFICATION TABLE */}
        {(page.pageType === 'lam_sorting' || (page.unitId === 'lam' && page.content?.sortingItems)) && (
          <SolarLunarTable
            initialItems={page.content?.sortingItems}
            title={page.title || 'جدول فرز اللام الشمسية واللام القمرية'}
            description={page.subtitle || 'اسحب الكلمات أو اضغط على أزرار التصنيف لفرزها في العمود الصحيح (شمسية بالبرتقالي / قمرية بالسماوي):'}
            coloredHarakat={coloredHarakat}
          />
        )}

      </div>

      {/* Floating or Modal Tracing Board */}
      {showTracingPad && (
        <InteractiveTracingBoard
          guideWord={tracingGuideWord}
          onClose={() => setShowTracingPad(false)}
        />
      )}

      {/* Syllable Cutter & Puzzle Modal */}
      {activeAnalysisModal && (
        <SyllableCutterModal
          word={activeAnalysisModal.word}
          syllables={activeAnalysisModal.syllables}
          explanation={activeAnalysisModal.explanation}
          onClose={() => setActiveAnalysisModal(null)}
        />
      )}

      {/* Solar & Lunar Lab Modal */}
      {showSolarLunarModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  مختبر فرز وتصنيف اللام الشمسية واللام القمرية
                </h3>
              </div>
              <button
                onClick={() => setShowSolarLunarModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-700 font-black text-slate-500 transition flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <SolarLunarTable
              initialItems={page.content?.sortingItems}
              coloredHarakat={coloredHarakat}
            />
          </div>
        </div>
      )}

    </div>
  );
};
