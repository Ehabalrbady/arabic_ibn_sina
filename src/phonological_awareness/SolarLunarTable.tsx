import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeftRight, 
  Check, 
  X, 
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Award, Trophy } from 'lucide-react';
import { playArabicAudio } from '../speech_and_multimedia/audio';
import { sfx } from '../speech_and_multimedia/soundEffects';
import { ColoredArabicText, getWordIllustration } from './harakatHelper';
import { VisualRewardModal } from './VisualRewardModal';
import { FloatingRewardBadge, FloatingRewardItem } from './FloatingRewardBadge';

export interface SolarLunarItem {
  id: string;
  word: string;
  category: 'شمسية' | 'قمرية';
  rawLetter?: string;
  hint?: string;
}

interface SolarLunarTableProps {
  initialItems?: { word: string; category: string }[];
  title?: string;
  description?: string;
  coloredHarakat?: boolean;
  onComplete?: (score: number, total: number) => void;
}

// 14 Lunar letters mnemonic: "ابغ حجك وخف عقيمه"
export const LUNAR_LETTERS = ['أ', 'ب', 'غ', 'ح', 'ج', 'ك', 'و', 'خ', 'ف', 'ع', 'ق', 'ي', 'م', 'هـ', 'ه'];
// 14 Solar letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن
export const SOLAR_LETTERS = ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'];

// Default comprehensive dataset for Solar/Lunar Lam exercises
export const DEFAULT_SOLAR_LUNAR_ITEMS: { word: string; category: 'شمسية' | 'قمرية' }[] = [
  { word: 'الشَّمْسُ', category: 'شمسية' },
  { word: 'الْقَمَرُ', category: 'قمرية' },
  { word: 'التَّمْرُ', category: 'شمسية' },
  { word: 'الْبَيْتُ', category: 'قمرية' },
  { word: 'الثَّوْبُ', category: 'شمسية' },
  { word: 'الْجَمَلُ', category: 'قمرية' },
  { word: 'الدَّفْتَرُ', category: 'شمسية' },
  { word: 'الْحَبْلُ', category: 'قمرية' },
  { word: 'الرَّجُلُ', category: 'شمسية' },
  { word: 'الْكِتَابُ', category: 'قمرية' },
  { word: 'الزَّرَافَةُ', category: 'شمسية' },
  { word: 'الْمَاءُ', category: 'قمرية' },
  { word: 'الطَّبِيبُ', category: 'شمسية' },
  { word: 'الْعَصِيرُ', category: 'قمرية' },
  { word: 'النَّاسُ', category: 'شمسية' },
  { word: 'الْهَدِيَّةُ', category: 'قمرية' }
];

export const SolarLunarTable: React.FC<SolarLunarTableProps> = ({
  initialItems,
  title = 'جدول فرز اللام الشمسية واللام القمرية',
  description = 'اسحب الكلمات أو اضغط على أزرار التصنيف لفرزها في العمود الصحيح (شمسية بالبرتقالي / قمرية بالسماوي):',
  coloredHarakat = true,
  onComplete
}) => {
  // Normalize items
  const itemsList: SolarLunarItem[] = useMemo(() => {
    const raw = initialItems && initialItems.length > 0 ? initialItems : DEFAULT_SOLAR_LUNAR_ITEMS;
    return raw.map((item, idx) => {
      // Clean display word if format is "أَسَد -> الأَسَد"
      let displayWord = item.word;
      if (item.word.includes('->')) {
        const parts = item.word.split('->');
        displayWord = (parts[1] || parts[0]).trim();
      }
      return {
        id: `item-${idx}-${item.word}`,
        word: displayWord,
        category: (item.category === 'شمسية' || item.category.includes('شمس')) ? 'شمسية' : 'قمرية',
        hint: item.category
      };
    });
  }, [initialItems]);

  // Placements state: mapping item ID to 'solar' | 'lunar' | null
  const [placements, setPlacements] = useState<Record<string, 'شمسية' | 'قمرية'>>({});
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<'شمسية' | 'قمرية' | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [floatingReward, setFloatingReward] = useState<FloatingRewardItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unplaced' | 'placed'>('all');

  // Reset when initial items change
  useEffect(() => {
    setPlacements({});
    setFeedbackMsg(null);
    setHasCelebrated(false);
    setShowRewardModal(false);
    setFloatingReward(null);
  }, [initialItems]);

  // Classified lists
  const unplacedItems = useMemo(() => {
    return itemsList.filter(item => !placements[item.id]);
  }, [itemsList, placements]);

  const solarPlacedItems = useMemo(() => {
    return itemsList.filter(item => placements[item.id] === 'شمسية');
  }, [itemsList, placements]);

  const lunarPlacedItems = useMemo(() => {
    return itemsList.filter(item => placements[item.id] === 'قمرية');
  }, [itemsList, placements]);

  // Calculate stats
  const totalCount = itemsList.length;
  const placedCount = Object.keys(placements).length;
  const correctCount = itemsList.filter(item => placements[item.id] === item.category).length;
  const progressPercent = Math.round((placedCount / totalCount) * 100);

  // Check completion & trigger visual reward
  useEffect(() => {
    if (placedCount === totalCount && totalCount > 0) {
      if (correctCount === totalCount && !hasCelebrated) {
        setHasCelebrated(true);
        // Trigger rewards modal
        setShowRewardModal(true);
        setFeedbackMsg({
          text: '🎉 رائع جداً! تم تصنيف جميع الكلمات الشمسية والقمرية بشكل صحيح ١٠٠٪!',
          type: 'success'
        });
        onComplete?.(correctCount, totalCount);
      }
    }
  }, [placedCount, totalCount, correctCount, hasCelebrated, onComplete]);

  // Action: Place item directly
  const handlePlaceWord = (item: SolarLunarItem, targetCategory: 'شمسية' | 'قمرية') => {
    playArabicAudio(item.word);
    const isCorrect = item.category === targetCategory;

    setPlacements(prev => ({
      ...prev,
      [item.id]: targetCategory
    }));

    if (isCorrect) {
      // Play cheerful audio chime
      sfx.playCorrectChime();

      // Show micro floating reward
      setFloatingReward({
        id: `${item.id}-${Date.now()}`,
        text: targetCategory === 'شمسية' ? 'ممتاز! لام شمسية ☀️ (+1⭐)' : 'أحسنت! لام قمرية 🌙 (+1⭐)',
        emoji: targetCategory === 'شمسية' ? '☀️' : '🌙',
        type: targetCategory === 'شمسية' ? 'solar' : 'lunar'
      });

      // Auto-clear floating reward
      setTimeout(() => {
        setFloatingReward(null);
      }, 1600);

      setFeedbackMsg({
        text: `✓ ممتاز! كلمة (${item.word}) تحوي لاماً ${targetCategory === 'شمسية' ? 'شمسية ☀️' : 'قمرية 🌙'}.`,
        type: 'success'
      });
    } else {
      sfx.playPop(350, 0.12);
      setFeedbackMsg({
        text: `💡 تنبيه: كلمة (${item.word}) هي لام ${item.category === 'شمسية' ? 'شمسية ☀️' : 'قمرية 🌙'}. تم إضافتها للتصحيح.`,
        type: 'error'
      });
    }
  };

  // Action: Remove from table back to bank
  const handleRemovePlacement = (itemId: string) => {
    setPlacements(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setFeedbackMsg(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, item: SolarLunarItem) => {
    setDraggedItemId(item.id);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverZone(null);
  };

  const handleDragOver = (e: React.DragEvent, zone: 'شمسية' | 'قمرية') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverZone !== zone) {
      setDragOverZone(zone);
    }
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = (e: React.DragEvent, targetCategory: 'شمسية' | 'قمرية') => {
    e.preventDefault();
    setDragOverZone(null);
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    const item = itemsList.find(i => i.id === itemId);
    if (item) {
      handlePlaceWord(item, targetCategory);
    }
    setDraggedItemId(null);
  };

  // Auto-solve for teachers
  const handleAutoSolve = () => {
    const solved: Record<string, 'شمسية' | 'قمرية'> = {};
    itemsList.forEach(item => {
      solved[item.id] = item.category;
    });
    setPlacements(solved);
    setFeedbackMsg({
      text: '✨ تم إظهار الحل النموذجي لجميع الكلمات الشمسية والقمرية.',
      type: 'info'
    });
  };

  // Reset table
  const handleReset = () => {
    setPlacements({});
    setFeedbackMsg(null);
    setHasCelebrated(false);
  };

  return (
    <div id="solar-lunar-table-wrapper" className="space-y-4">
      {/* Header & Control Banner */}
      <div className="bg-linear-to-r from-amber-500/10 via-slate-50 to-sky-500/10 border-2 border-slate-300 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-2xs z-10">
                <Sun className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-2xs">
                <Moon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{title}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold">
                  تفاعلي بالسحب والإفلات 🎯
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {description}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowRuleModal(!showRuleModal)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>القاعدة الذهبية</span>
            </button>
            <button
              onClick={handleAutoSolve}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="كشف الحل النموذجي للمعلم"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>الحل النموذجي</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 text-slate-600 hover:text-rose-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="إعادة التعيين والبدء من جديد"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة البدء</span>
            </button>
          </div>
        </div>

        {/* Progress and Stats Bar */}
        <div className="bg-white/80 border border-slate-200/90 rounded-2xl p-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">التقدم الإجمالي:</span>
              <span className="font-black text-slate-900">{placedCount} / {totalCount} كلمة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>الشمسية: {solarPlacedItems.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sky-700 font-bold flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-sky-500" />
                <span>القمرية: {lunarPlacedItems.length}</span>
              </span>
            </div>
          </div>

          {/* Mini Progress Line */}
          <div className="w-36 sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div 
              className="bg-linear-to-r from-amber-500 to-sky-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Rule Explanation Banner (Collapsible) */}
        {showRuleModal && (
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 space-y-2.5 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="font-black text-xs text-amber-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" />
                <span>قاعدة التمييز بين اللام الشمسية واللام القمرية</span>
              </span>
              <button 
                onClick={() => setShowRuleModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕ إغلاق
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1">
                <div className="font-black text-amber-900 flex items-center gap-1 text-sm">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>اللام الشمسية ( ١٤ حرفاً ):</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  تُكتب ولا تُنطق، ويكون الحرف الذي يليها <strong>مشدداً ( ّ )</strong>:
                </p>
                <div className="bg-white p-1.5 rounded-lg border border-amber-200 font-bold text-amber-950 font-amiri text-center text-sm">
                  ( ت ، ث ، د ، ذ ، ر ، ز ، س ، ش ، ص ، ض ، ط ، ظ ، ل ، ن )
                </div>
                <span className="text-[11px] text-slate-500 block">مثال: الشَّمْسُ ، التَّمْرُ ، الرَّجُلُ</span>
              </div>

              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 space-y-1">
                <div className="font-black text-sky-900 flex items-center gap-1 text-sm">
                  <Moon className="w-4 h-4 text-sky-600" />
                  <span>اللام القمرية ( ١٤ حرفاً ):</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  تُكتب وتُنطق، وتكون اللام <strong>ساكنة ( ْ )</strong>، مجمعة في عبارة:
                </p>
                <div className="bg-white p-1.5 rounded-lg border border-sky-200 font-black text-sky-950 font-amiri text-center text-sm">
                  « ابْغِ حَجَّكَ وَخَفْ عَقِيمَهُ »
                </div>
                <span className="text-[11px] text-slate-500 block">مثال: الْقَمَرُ ، الْبَيْتُ ، الْكِتَابُ</span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Message Bar */}
        {feedbackMsg && (
          <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-200 ${
            feedbackMsg.type === 'success' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' :
            feedbackMsg.type === 'error' ? 'bg-rose-100 text-rose-950 border border-rose-300' :
            'bg-sky-100 text-sky-950 border border-sky-300'
          }`}>
            <span>{feedbackMsg.text}</span>
            <button 
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-500 hover:text-slate-800 font-black cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. UNCLASSIFIED WORD BANK POOL (بنك الكلمات المتاحة للسحب والفرز) */}
      {/* ========================================================================= */}
      {unplacedItems.length > 0 && (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                {unplacedItems.length}
              </span>
              <h4 className="font-black text-sm text-slate-900">
                بنك الكلمات المتاحة للفرز (اسحب الكلمة أو اضغط على الزر لتصنيفها):
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              💡 اضغط أيقونة 🔊 لسماع النطق واكتشاف اللام
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {unplacedItems.map(item => {
              const hint = getWordIllustration(item.word);
              return (
                <div
                  key={item.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  className="bg-[#FCFAF7] border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-2.5 sm:p-3 transition-all duration-200 flex flex-col justify-between gap-2 shadow-2xs group hover:scale-[1.02] cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base select-none">
                      {hint ? hint.emoji : '📝'}
                    </span>
                    <button
                      onClick={() => playArabicAudio(item.word)}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition cursor-pointer"
                      title="استمع للكلمة"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-center py-1">
                    <span className="text-lg sm:text-xl font-black font-amiri text-slate-900">
                      <ColoredArabicText text={item.word} enableColoredHarakat={coloredHarakat} />
                    </span>
                  </div>

                  {/* Quick-Action Touch Sorting Buttons */}
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200/70">
                    <button
                      onClick={() => handlePlaceWord(item, 'شمسية')}
                      className="py-1 px-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                      title="تصنيف لام شمسية (برتقالي)"
                    >
                      <Sun className="w-3 h-3" />
                      <span>شمسية</span>
                    </button>
                    <button
                      onClick={() => handlePlaceWord(item, 'قمرية')}
                      className="py-1 px-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-black transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                      title="تصنيف لام قمرية (سماوي)"
                    >
                      <Moon className="w-3 h-3" />
                      <span>قمرية</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SPLIT TABLE: SOLAR (ORANGE) VS LUNAR (CYAN) DIVIDED CONTAINERS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* RIGHT COLUMN: SOLAR (اللام الشمسية - برتقالي) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'شمسية')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'شمسية')}
          className={`border-2 rounded-3xl p-4 sm:p-5 transition-all duration-200 flex flex-col space-y-3 ${
            dragOverZone === 'شمسية'
              ? 'bg-amber-100/90 border-amber-500 ring-4 ring-amber-300 scale-[1.01]'
              : 'bg-linear-to-b from-amber-50/70 to-orange-50/40 border-amber-300 shadow-2xs'
          }`}
        >
          {/* Solar Box Header */}
          <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-2xs">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-base text-amber-950 flex items-center gap-1.5">
                  <span>اللام الشمسية</span>
                  <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    اللون البرتقالي
                  </span>
                </h4>
                <span className="text-[11px] text-amber-800 font-medium">
                  تُكتب ولا تُنطق • الحرف بعدها مشدد ( ّ )
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 font-black text-xs shadow-2xs">
              {solarPlacedItems.length} كلمات
            </span>
          </div>

          {/* Solar Drop Target Area / Placed Words List */}
          <div className="flex-1 min-h-[220px] bg-white/80 border-2 border-dashed border-amber-300 rounded-2xl p-3 space-y-2">
            {solarPlacedItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-amber-700/70 space-y-2">
                <Sun className="w-8 h-8 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold">
                  اسحب الكلمات التي تحوي لاماً شمسية هنا
                </span>
                <span className="text-[10px] text-slate-400">
                  (مثل: الشَّمْس، التَّمْر، الصَّابُون، النَّاس)
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {solarPlacedItems.map(item => {
                  const isCorrect = item.category === 'شمسية';
                  const hint = getWordIllustration(item.word);
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border-2 transition flex items-center justify-between gap-2 ${
                        isCorrect
                          ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-2xs'
                          : 'bg-rose-50 border-rose-400 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">{hint ? hint.emoji : '☀️'}</span>
                        <div>
                          <span className="text-base font-black font-amiri block">
                            <ColoredArabicText text={item.word} enableColoredHarakat={coloredHarakat} />
                          </span>
                          {!isCorrect && (
                            <span className="text-[9px] text-rose-600 font-bold block">
                              ⚠️ هذه الكلمة قمرية وليست شمسية
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playArabicAudio(item.word)}
                          className="p-1 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                          title="استمع للكلمة"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemovePlacement(item.id)}
                          className="p-1 rounded-lg bg-white border border-amber-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition cursor-pointer"
                          title="إرجاع لبنك الكلمات"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* LEFT COLUMN: LUNAR (اللام القمرية - سماوي) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'قمرية')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'قمرية')}
          className={`border-2 rounded-3xl p-4 sm:p-5 transition-all duration-200 flex flex-col space-y-3 ${
            dragOverZone === 'قمرية'
              ? 'bg-sky-100/90 border-sky-500 ring-4 ring-sky-300 scale-[1.01]'
              : 'bg-linear-to-b from-sky-50/70 to-cyan-50/40 border-sky-300 shadow-2xs'
          }`}
        >
          {/* Lunar Box Header */}
          <div className="flex items-center justify-between border-b-2 border-sky-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-2xs">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-base text-sky-950 flex items-center gap-1.5">
                  <span>اللام القمرية</span>
                  <span className="text-xs bg-sky-600 text-white px-2 py-0.5 rounded-full font-bold">
                    اللون السماوي
                  </span>
                </h4>
                <span className="text-[11px] text-sky-800 font-medium">
                  تُكتب وتُنطق ساكنة ( ْ ) • «ابغِ حجك وخف عقيمه»
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-white border border-sky-300 text-sky-900 font-black text-xs shadow-2xs">
              {lunarPlacedItems.length} كلمات
            </span>
          </div>

          {/* Lunar Drop Target Area / Placed Words List */}
          <div className="flex-1 min-h-[220px] bg-white/80 border-2 border-dashed border-sky-300 rounded-2xl p-3 space-y-2">
            {lunarPlacedItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-sky-700/70 space-y-2">
                <Moon className="w-8 h-8 text-sky-400 animate-pulse" />
                <span className="text-xs font-bold">
                  اسحب الكلمات التي تحوي لاماً قمرية هنا
                </span>
                <span className="text-[10px] text-slate-400">
                  (مثل: الْقَمَر، الْبَيْت، الْكِتَاب، الْمَعْلَم)
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lunarPlacedItems.map(item => {
                  const isCorrect = item.category === 'قمرية';
                  const hint = getWordIllustration(item.word);
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border-2 transition flex items-center justify-between gap-2 ${
                        isCorrect
                          ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-2xs'
                          : 'bg-rose-50 border-rose-400 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">{hint ? hint.emoji : '🌙'}</span>
                        <div>
                          <span className="text-base font-black font-amiri block">
                            <ColoredArabicText text={item.word} enableColoredHarakat={coloredHarakat} />
                          </span>
                          {!isCorrect && (
                            <span className="text-[9px] text-rose-600 font-bold block">
                              ⚠️ هذه الكلمة شمسية وليست قمرية
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playArabicAudio(item.word)}
                          className="p-1 rounded-lg bg-white border border-sky-300 text-sky-800 hover:bg-sky-100 transition cursor-pointer"
                          title="استمع للكلمة"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemovePlacement(item.id)}
                          className="p-1 rounded-lg bg-white border border-sky-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition cursor-pointer"
                          title="إرجاع لبنك الكلمات"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Completion Banner */}
      {placedCount === totalCount && totalCount > 0 && (
        <div className="bg-linear-to-r from-amber-500/20 via-emerald-500/20 to-sky-500/20 border-2 border-emerald-500 rounded-3xl p-4 text-center space-y-3 shadow-xs animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2 text-emerald-950 font-black text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تم تصنيف جميع الكلمات بنجاح! النتيجة: ({correctCount} / {totalCount})</span>
          </div>
          <p className="text-xs text-slate-700 font-medium">
            تذكر دائماً: اللام الشمسية تُدغم مع الحرف المشدد وتُلوّن بالبرتقالي، بينما اللام القمرية تُنطق ساكنة وتُلوّن بالسماوي!
          </p>
          <div className="pt-1">
            <button
              onClick={() => setShowRewardModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition transform hover:scale-105 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-950" />
              <span>عرض وسام التكريم والنجوم ⭐</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Micro-Reward Notification */}
      <FloatingRewardBadge reward={floatingReward} />

      {/* Visual Reward & Celebration Modal */}
      <VisualRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onRetry={handleReset}
        category="solar_lunar"
        title="🎉 بطل تصنيف اللام الشمسية واللام القمرية!"
        subtitle="أداء متميز في التمييز بين الحروف الشمسية والقمرية"
        score={correctCount}
        total={totalCount}
        badgeName="وسام الإتقان الشمسي والقمري"
      />
    </div>
  );
};
