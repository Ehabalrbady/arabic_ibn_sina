import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playArabicAudio } from '../utils/audio';

interface DictationSet {
  id: string;
  name: string;
  unit: string;
  words: string[];
}

const DICTATION_SETS: DictationSet[] = [
  {
    id: 'letters',
    name: 'الحروف بالحركات الثلاث (ص 9)',
    unit: 'الحروف الهجائية',
    words: ['أُ', 'بِ', 'تَ', 'ثُ', 'جِ', 'حَ', 'خُ', 'دِ', 'ذَ', 'رُ', 'سَ', 'شُ', 'صِ', 'ضَ', 'طُ', 'عَ', 'فِ', 'قَ', 'كَ', 'لِ', 'مَ', 'نُ']
  },
  {
    id: 'open_words',
    name: 'كلمات ثلاثية مفتوحة (ص 23)',
    unit: 'قراءة الكلمات',
    words: ['قَرَأَ', 'كَتَبَ', 'جَلَسَ', 'زَرَعَ', 'أَكَلَ', 'رَفَعَ', 'فَتَحَ', 'سَجَدَ', 'رَسَمَ', 'وَقَفَ', 'خَرَجَ', 'حَمَلَ']
  },
  {
    id: 'kasra_words',
    name: 'كلمات تحوي كسرة (ص 31)',
    unit: 'قراءة الكلمات',
    words: ['شَرِبَ', 'سَمِعَ', 'فَرِحَ', 'لَعِبَ', 'عَلِمَ', 'ضَحِكَ', 'حَفِظَ', 'رَكِبَ', 'غَضِبَ', 'فَهِمَ', 'نَدِمَ', 'سَلِمَ']
  },
  {
    id: 'damma_words',
    name: 'كلمات تحوي ضمة (ص 39)',
    unit: 'قراءة الكلمات',
    words: ['كُتِبَ', 'قُرِئَ', 'رُسِمَ', 'زُرِعَ', 'طُلِبَ', 'خُلِقَ', 'جُمِعَ', 'حُمِلَ', 'سُئِلَ', 'وُعِدَ', 'ذُكِرَ', 'عُلِمَ']
  },
  {
    id: 'sukun_words',
    name: 'المقطع الساكن (ص 48)',
    unit: 'المقطع الساكن',
    words: ['مَدْرَسَة', 'مَسْجِد', 'دَفْتَر', 'مَكْتَب', 'أَحْمَد', 'أَصْفَر', 'يَشْرَب', 'تَطْبَخ', 'يَكْتُب', 'غُصْن', 'عِطْر', 'قُفْل']
  },
  {
    id: 'alif_madd',
    name: 'المد بالألف (ص 58)',
    unit: 'المد وحروفه',
    words: ['قَامَ', 'نَامَ', 'عَادَ', 'شَارِع', 'كِتَاب', 'سَمَاء', 'طَائِر', 'سَالِم', 'صَادِق', 'عَامِل']
  },
  {
    id: 'waw_madd',
    name: 'المد بالواو (ص 65)',
    unit: 'المد وحروفه',
    words: ['رَسُول', 'يَدْعُو', 'صَبُور', 'شَكُور', 'يَزُور', 'سَعُود', 'زُهُور', 'طُيُور', 'يَقُول', 'يَصُوم']
  },
  {
    id: 'ya_madd',
    name: 'المد بالياء (ص 72)',
    unit: 'المد وحروفه',
    words: ['سَعِيد', 'طَبِيب', 'حَدِيد', 'وَطَنِي', 'تِلْمِيذ', 'أَمِير', 'كَبِير', 'صَغِير', 'نَظِيف', 'حَلِيب']
  },
  {
    id: 'tanween',
    name: 'التنوين بأنواعه (ص 91)',
    unit: 'التنوين',
    words: ['وَلَدٌ', 'وَلَداً', 'وَلَدٍ', 'كِتَابٌ', 'كِتَاباً', 'كِتَابٍ', 'سَمَاءٌ', 'سَمَاءً', 'سَمَاءٍ']
  },
  {
    id: 'shaddah',
    name: 'الشدة والحرف المشدد (ص 98)',
    unit: 'الشدة',
    words: ['مُعَلِّم', 'سَيَّارَة', 'تُفَّاح', 'رُمَّان', 'قِطَّة', 'مَكَّة', 'دَرَّاجَة', 'مُدَرِّب']
  },
  {
    id: 'ta_ha',
    name: 'التاء المفتوحة والمربوطة والهاء (ص 120)',
    unit: 'التاءات والهاء',
    words: ['بِنْت', 'مَدْرَسَة', 'وَجْه', 'سَيَّارَة', 'زَيْت', 'فَوَاكِه', 'شَجَرَة', 'حُوت', 'مِيَاه', 'قِصَّة']
  }
];

export const DictationLab: React.FC = () => {
  const [selectedSetId, setSelectedSetId] = useState<string>('open_words');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; target: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentSet = DICTATION_SETS.find(s => s.id === selectedSetId) || DICTATION_SETS[0];
  const targetWord = currentSet.words[currentIndex];

  const handlePlayAudio = () => {
    playArabicAudio(targetWord);
  };

  const handleCheck = () => {
    if (!userInput.trim()) return;

    // Normalize comparison by trimming whitespace
    const cleanUser = userInput.trim();
    const cleanTarget = targetWord.trim();

    // Tolerant comparison (allows matching with or without some tashkeel marks if core letters match)
    const stripTashkeel = (s: string) => s.replace(/[ًٌٍَُِّْ]/g, '');
    const isStrictMatch = cleanUser === cleanTarget;
    const isLooseMatch = stripTashkeel(cleanUser) === stripTashkeel(cleanTarget);

    if (isStrictMatch || isLooseMatch) {
      setScore(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        message: '✨ إجابة صحيحة وممتازة! أحسنت صنعاً.',
        target: cleanTarget
      });
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      setFeedback({
        isCorrect: false,
        message: `❌ إجابة تحتاج تصويب. الكلمة الصحيحة هي: (${cleanTarget})`,
        target: cleanTarget
      });
    }
  };

  const handleNext = () => {
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
    const nextIdx = (currentIndex + 1) % currentSet.words.length;
    setCurrentIndex(nextIdx);
    playArabicAudio(currentSet.words[nextIdx]);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserInput('');
    setFeedback(null);
    setScore(0);
    setShowHint(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-md border-2 border-amber-400/40">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
              🎧
            </div>
            <div>
              <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                المعمل الإملائي الذكي
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-cairo text-white">
                معمل الإملاء السمعي الفوري
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-cairo">
            <span>النتيجة الحالية:</span>
            <span className="font-black text-amber-300 text-sm">{score} نقطة</span>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          استمع للكلمة بوضوح ثم اكتبها في الصندوق واضغط تحقق. يحتوي المعمل على كافة التدريبات الإملائية المذكورة في المذكرة.
        </p>
      </div>

      {/* Set Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-amber-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-600 block">اختر الدرس أو قائمة التدريب الإملائي:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {DICTATION_SETS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSetId(s.id);
                setCurrentIndex(0);
                setUserInput('');
                setFeedback(null);
              }}
              className={`p-2.5 rounded-xl border text-right font-cairo transition text-xs flex flex-col justify-between ${
                selectedSetId === s.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-amber-400 bg-slate-50/50 text-slate-700'
              }`}
            >
              <span className="truncate">{s.name}</span>
              <span className="text-[10px] text-slate-400 mt-1">{s.words.length} كلمات</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Dictation Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6 text-center">
        <div className="flex items-center justify-between text-xs text-slate-500 font-cairo">
          <span>الكلمة {currentIndex + 1} من {currentSet.words.length}</span>
          <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
            {currentSet.unit}
          </span>
        </div>

        {/* Audio Button */}
        <div className="py-4">
          <button
            onClick={handlePlayAudio}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-tr from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white flex flex-col items-center justify-center mx-auto shadow-lg hover:scale-105 transition group cursor-pointer border-4 border-amber-300"
            title="اضغط للاستماع للكلمة"
          >
            <Volume2 className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-110 transition animate-pulse" />
            <span className="text-[11px] font-bold mt-1 font-cairo">استمع الآن</span>
          </button>
          <p className="text-xs text-slate-400 mt-3 font-cairo">
            اضغط الدائرة لسماع الكلمة، ثم اكتب ما تسمعه في الأسفل
          </p>
        </div>

        {/* Input Box */}
        <div className="max-w-md mx-auto space-y-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="اكتب الكلمة هنا..."
            className="w-full text-center text-2xl sm:text-3xl font-black font-cairo py-3 px-4 border-2 border-amber-300 focus:border-emerald-600 rounded-2xl outline-hidden shadow-inner bg-[#FCFAF7]"
            autoFocus
          />

          {/* Feedback Display */}
          {feedback && (
            <div className={`p-4 rounded-2xl font-cairo text-sm font-bold flex items-center justify-center gap-2 ${
              feedback.isCorrect 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-bold font-cairo">
              💡 مساعدة: الكلمة تبدأ بحرف [{targetWord.charAt(0)}] وعدد حروفها {targetWord.length}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          <button
            onClick={handleCheck}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-cairo rounded-xl text-sm transition shadow-sm"
          >
            ✅ تحقق من الإملاء
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold font-cairo rounded-xl text-sm transition shadow-sm flex items-center gap-1"
          >
            <span>الكلمة التالية</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowHint(true)}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-cairo rounded-xl text-xs transition border border-slate-200"
          >
            💡 تلميح
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs transition border border-slate-200"
            title="إعادة ضبط التمرين"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
