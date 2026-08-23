import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Printer, 
  HelpCircle,
  ArrowLeftRight,
  Headphones,
  Award,
  BookOpen
} from 'lucide-react';
import { playArabicAudio, stopAudio } from '../utils/audio';
import { SyllableHighlighter } from '../utils/syllableHighlighter';
import { SchoolBranding } from '../utils/schoolBranding';

export interface MinimalPairItem {
  id: string;
  category: 'vowel_length' | 'similar_consonants';
  subCategory: string;
  contrastTitle: string;
  pairA: {
    word: string;
    typeLabel: string;
    soundDesc: string;
    meaningHint?: string;
  };
  pairB: {
    word: string;
    typeLabel: string;
    soundDesc: string;
    meaningHint?: string;
  };
  sentenceA?: string;
  sentenceB?: string;
  drillTip: string;
}

export const MINIMAL_PAIRS_DATABASE: MinimalPairItem[] = [
  // 1. Vowel Length Contrast (قصير vs طويل)
  {
    id: 'vl-1',
    category: 'vowel_length',
    subCategory: 'فتحة قصيرة مقابل مد بالألف',
    contrastTitle: 'قَلَّ ⟷ قَالَ',
    pairA: { word: 'قَلَّ', typeLabel: 'حركة قصيرة (فتحة)', soundDesc: 'صوت الفتحة خاطف وسريع (حركة واحدة)' },
    pairB: { word: 'قَالَ', typeLabel: 'مد بالألف (صوت طويل)', soundDesc: 'امتداد الصوت بمقدار حركتين (قَا...)' },
    sentenceA: 'قَلَّ الْمَاءُ فِي الْإِنَاءِ.',
    sentenceB: 'قَالَ الْوَلَدُ الصِّدْقَ.',
    drillTip: 'اضغط على الكلمة واستمع للفرق: في "قَلَّ" لا تمط الصوت، وفي "قَالَ" افتح فمك ومد الصوت حركتين.'
  },
  {
    id: 'vl-2',
    category: 'vowel_length',
    subCategory: 'فتحة قصيرة مقابل مد بالألف',
    contrastTitle: 'سَمَّ ⟷ سَامَ',
    pairA: { word: 'سَمَّ', typeLabel: 'حركة قصيرة (فتحة)', soundDesc: 'صوت الحرف سريع بلا مد' },
    pairB: { word: 'سَامَ', typeLabel: 'مد بالألف (صوت طويل)', soundDesc: 'صوت السين ممدود بالألف (سَا)' },
    sentenceA: 'سَمَّ الرَّجُلُ الطَّعَامَ.',
    sentenceB: 'سَامَ التَّاجِرُ الْبِضَاعَةَ.',
    drillTip: 'لاحظ كيف يتغير المعنى بالكامل بمجرد مد الصوت بحرف الألف!'
  },
  {
    id: 'vl-3',
    category: 'vowel_length',
    subCategory: 'فتحة قصيرة مقابل مد بالألف',
    contrastTitle: 'نَمَّ ⟷ نَامَ',
    pairA: { word: 'نَمَّ', typeLabel: 'حركة قصيرة', soundDesc: 'صوت النون قصير وخاطف' },
    pairB: { word: 'نَامَ', typeLabel: 'مد بالألف', soundDesc: 'صوت النون ممدود للأعلى (نَا)' },
    sentenceA: 'نَمَّ الشَّجَرُ وَكَبُرَ.',
    sentenceB: 'نَامَ الطِّفْلُ فِي سَرِيرِهِ.',
    drillTip: 'درّب أذنك على عزل الصوت الممدود من الصوت السريع.'
  },
  {
    id: 'vl-4',
    category: 'vowel_length',
    subCategory: 'ثلاثي مجرد مقابل اسم فاعل ممدود',
    contrastTitle: 'شَرِبَ ⟷ شَارِبَ',
    pairA: { word: 'شَرِبَ', typeLabel: 'حركات قصيرة متتابعة', soundDesc: 'ثلاث حركات قصيرة (شَـ رِ بَ)' },
    pairB: { word: 'شَارِبَ', typeLabel: 'مد بالألف في المقطع الأول', soundDesc: 'المقطع الأول ممدود (شَا) ثم (رِ بَ)' },
    sentenceA: 'شَرِبَ أَحْمَدُ الْحَلِيبَ.',
    sentenceB: 'أَنْتَ شَارِبٌ لِلْمَاءِ.',
    drillTip: 'عدّ النبضات الإيقاعية: شَرِبَ (3 نبضات متساوية)، شَارِبَ (نبضة طويلة تليها نبضتان).'
  },
  {
    id: 'vl-5',
    category: 'vowel_length',
    subCategory: 'ثلاثي مجرد مقابل اسم فاعل ممدود',
    contrastTitle: 'كَتَبَ ⟷ كَاتِبَ',
    pairA: { word: 'كَتَبَ', typeLabel: 'حركات قصيرة', soundDesc: 'كـَ تَـ بَ (سريعة متصلة)' },
    pairB: { word: 'كَاتِبَ', typeLabel: 'مد بالألف', soundDesc: 'كَا... تِـ بَ (مد صوتي)' },
    sentenceA: 'كَتَبَ التِّلْمِيذُ الدَّرْسَ.',
    sentenceB: 'مُحَمَّدٌ كَاتِبٌ مَاهِرٌ.',
    drillTip: 'افتح كفك مع الصوت الممدود واقبضه مع الحركات القصيرة.'
  },
  {
    id: 'vl-6',
    category: 'vowel_length',
    subCategory: 'ضمة قصيرة مقابل مد بالواو',
    contrastTitle: 'قُمْ ⟷ قُومْ',
    pairA: { word: 'قُمْ', typeLabel: 'ضمة قصيرة مع سكون', soundDesc: 'صوت القاف مضموم ومقطوع بالسكون فوراً' },
    pairB: { word: 'قُومْ', typeLabel: 'مد بالواو مع سكون', soundDesc: 'ضم الشفتين وإطالة صوت القاف بالواو (قُو...)' },
    sentenceA: 'قُمْ لِلْمُعَلِّمِ وَوَفِّهِ التَّبْجِيلَا.',
    sentenceB: 'قُومُوا إِلَى الصَّلَاةِ يَرْحَمْكُمُ اللَّهُ.',
    drillTip: 'ضم الشفتين للأمام في المد بالواو وأطل الصوت حركتين.'
  },
  {
    id: 'vl-7',
    category: 'vowel_length',
    subCategory: 'كسرة قصيرة مقابل مد بالياء',
    contrastTitle: 'سِرْ ⟷ سِيرْ',
    pairA: { word: 'سِرْ', typeLabel: 'كسرة قصيرة مع سكون', soundDesc: 'كسرة سريعة وخطف على الراء' },
    pairB: { word: 'سِيرْ', typeLabel: 'مد بالياء مع سكون', soundDesc: 'خفض الفك السفلي وإطالة صوت الياء (سِي...)' },
    sentenceA: 'سِرْ فِي طَرِيقِ النَّجَاحِ.',
    sentenceB: 'سِيرُوا فِي الْأَرْضِ فَانْظُرُوا.',
    drillTip: 'انتبه لخفض الفك السفلي عند نطق المد بالياء.'
  },

  // 2. Similar Consonants Contrast (الحروف المتقاربة صوتاً ومخرجاً)
  {
    id: 'sc-1',
    category: 'similar_consonants',
    subCategory: 'صوت السين المرقق ⟷ صوت الصاد المفخم',
    contrastTitle: 'سَارَ ⟷ صَارَ',
    pairA: { word: 'سَارَ', typeLabel: 'حرف السين (مرقق صافر)', soundDesc: 'صوت ناعم مرقق مع ابتسامة الشفتين (سَـ)' },
    pairB: { word: 'صَارَ', typeLabel: 'حرف الصاد (مفخم مطبق)', soundDesc: 'صوت ممتلئ غليظ يملأ الفم بتفخيم واستعلاء (صَـ)' },
    sentenceA: 'سَارَ الرَّجُلُ فِي الْحَدِيقَةِ (مَشَى).',
    sentenceB: 'صَارَ الْمَاءُ ثَلْجاً (تَحَوَّلَ).',
    drillTip: 'لا تخلط بين السين الرقيقة والصاد المفخمة؛ فخلطهما يغير المعنى تماماً!'
  },
  {
    id: 'sc-2',
    category: 'similar_consonants',
    subCategory: 'صوت السين المرقق ⟷ صوت الصاد المفخم',
    contrastTitle: 'سَيْف ⟷ صَيْف',
    pairA: { word: 'سَيْفٌ', typeLabel: 'سين مرققة', soundDesc: 'السَّيْف: السلاح المعروف' },
    pairB: { word: 'صَيْفٌ', typeLabel: 'صاد مفخمة', soundDesc: 'الصَّيْف: فصل الحرارة والحر' },
    sentenceA: 'حَمَلَ الْفَارِسُ سَيْفَهُ.',
    sentenceB: 'يَشْتَدُّ الْحَرُّ فِي فَصْلِ الصَّيْفِ.',
    drillTip: 'استمع لصوت الصفير الرقيق في (سَـ) مقابل الامتلاء والتفخيم في (صَـ).'
  },
  {
    id: 'sc-3',
    category: 'similar_consonants',
    subCategory: 'صوت التاء المرقق ⟷ صوت الطاء المفخم',
    contrastTitle: 'تِينَ ⟷ طِينَ',
    pairA: { word: 'تِينٌ', typeLabel: 'حرف التاء (مرقق مهموس)', soundDesc: 'صوت رقيق يخرج من طرف اللسان مع أصول الثنايا العليا' },
    pairB: { word: 'طِينٌ', typeLabel: 'حرف الطاء (مفخم مستعلٍ)', soundDesc: 'أقوى الحروف تفخيماً وإطباقاً' },
    sentenceA: 'أَكَلْتُ التِّينَ اللَّذِيذَ.',
    sentenceB: 'لَعِبَ الطِّفْلُ بِالطِّينِ الْمُبَلَّلِ.',
    drillTip: 'التاء رقيقة مهموسة، بينما الطاء قوية ومفخمة تمتلئ بها حجرة الفم.'
  },
  {
    id: 'sc-4',
    category: 'similar_consonants',
    subCategory: 'صوت التاء المرقق ⟷ صوت الطاء المفخم',
    contrastTitle: 'تَابَ ⟷ طَابَ',
    pairA: { word: 'تَابَ', typeLabel: 'تاء مرققة', soundDesc: 'تَابَ إِلَى اللَّهِ (رَجَعَ)' },
    pairB: { word: 'طَابَ', typeLabel: 'طاء مفخمة', soundDesc: 'طَابَ الطَّعَامُ (لَذَّ وَحَلَا)' },
    sentenceA: 'تَابَ الْمُذْنِبُ إِلَى رَبِّهِ.',
    sentenceB: 'طَابَ الْهَوَاءُ فِي الرَّبِيعِ.',
    drillTip: 'تدرب على نطق (تَا) ثم فخم لسانك لتنطق (طَا).'
  },
  {
    id: 'sc-5',
    category: 'similar_consonants',
    subCategory: 'الحروف اللثوية والصفيرية: ذال ⟷ زاي ⟷ ظاء',
    contrastTitle: 'ذَلَّ ⟷ زَلَّ ⟷ ظَلَّ',
    pairA: { word: 'ذَلَّ', typeLabel: 'ذال لثوية مرققة (أخرج لسانك)', soundDesc: 'إخراج طرف اللسان بين الأسنان بلطف' },
    pairB: { word: 'ظَلَّ', typeLabel: 'ظاء لثوية مفخمة', soundDesc: 'إخراج طرف اللسان مع تفخيم الصوت وامتلاء الفم' },
    sentenceA: 'ذَلَّ الْعَدُوُّ أَمَامَ الْحَقِّ.',
    sentenceB: 'ظَلَّ التِّلْمِيذُ يُذَاكِرُ دَرْسَهُ.',
    drillTip: 'أخرج طرف لسانك في (الذال والظاء)، واحبسه داخل الأسنان مع صوت الأزيز في (الزاي).'
  },
  {
    id: 'sc-6',
    category: 'similar_consonants',
    subCategory: 'صوت الكاف المرقق ⟷ صوت القاف المفخم اللهوي',
    contrastTitle: 'كَلْب ⟷ قَلْب',
    pairA: { word: 'كَلْبٌ', typeLabel: 'كاف مرققة مهموسة', soundDesc: 'تخرج من أقصى اللسان مع همس لطيف' },
    pairB: { word: 'قَلْبٌ', typeLabel: 'قاف مفخمة لهوية', soundDesc: 'تخرج من أقصى اللسان عند اللهاة بقوة وتفخيم' },
    sentenceA: 'نَبَحَ كَلْبُ الْحِرَاسَةِ.',
    sentenceB: 'يَنْبِضُ قَلْبُ الْمُؤْمِنِ بِالْإِيمَانِ.',
    drillTip: 'الخلط بين الكاف والقاف خطأ شائع جداً يغير المعاني، فرّق بين كَـ وقَـ دائماً.'
  },
  {
    id: 'sc-7',
    category: 'similar_consonants',
    subCategory: 'صوت الدال المرقق ⟷ صوت الضاد المفخم المستطيل',
    contrastTitle: 'دَلَّ ⟷ ضَلَّ',
    pairA: { word: 'دَلَّ', typeLabel: 'دال مرققة', soundDesc: 'دَلَّ صَدِيقَهُ عَلَى الْخَيْرِ (أَرْشَدَهُ)' },
    pairB: { word: 'ضَلَّ', typeLabel: 'ضاد مفخمة مستطيلة', soundDesc: 'ضَلَّ الطَّرِيقَ (تَاهَ وَانْحَرَفَ)' },
    sentenceA: 'دَلَّ الْمُعَلِّمُ طُلَّابَهُ عَلَى الْعِلْمِ.',
    sentenceB: 'ضَلَّ الْمُسَافِرُ فِي الصَّحْرَاءِ.',
    drillTip: 'صوت الضاد العربية يخرج من إحدى حافتي اللسان مع الأضراس العليا مع استطالة وتفخيم.'
  },
  {
    id: 'sc-8',
    category: 'similar_consonants',
    subCategory: 'صوت الثاء اللثوي ⟷ صوت السين الصفيري',
    contrastTitle: 'ثَارَ ⟷ سَارَ',
    pairA: { word: 'ثَارَ', typeLabel: 'ثاء لثوية (أخرج لسانك)', soundDesc: 'ثَارَ الْغُبَارُ فِي الْجَوِّ' },
    pairB: { word: 'سَارَ', typeLabel: 'سين صفيرية (احبس لسانك)', soundDesc: 'سَارَ الْقِطَارُ بِسُرْعَةٍ' },
    sentenceA: 'ثَارَ الْبُرْكَانُ بِشِدَّةٍ.',
    sentenceB: 'سَارَ التِّلْمِيذُ إِلَى مَدْرَسَتِهِ.',
    drillTip: 'تأكد من إخراج طرف اللسان مع حرف الثاء لتمييزه عن السين تماماً.'
  }
];

interface MinimalPairsLabProps {
  branding?: SchoolBranding;
  onNavigateToLesson?: (pageNum: number) => void;
}

export const MinimalPairsLab: React.FC<MinimalPairsLabProps> = ({ branding }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vowel_length' | 'similar_consonants'>('all');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  
  // Interactive Auditory Discrimination Quiz State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [targetWordChoice, setTargetWordChoice] = useState<'A' | 'B'>('A');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const filteredPairs = MINIMAL_PAIRS_DATABASE.filter(p => 
    activeCategory === 'all' || p.category === activeCategory
  );

  const handlePlayWord = (word: string, id: string) => {
    setActivePlayingId(id);
    playArabicAudio(word, {
      rate: 0.72,
      onEnd: () => setActivePlayingId(null)
    });
  };

  // Start new Auditory Quiz
  const startQuiz = () => {
    setIsQuizMode(true);
    setCurrentQuizIndex(0);
    setScore(0);
    setTotalAttempts(0);
    prepareQuizQuestion(0);
  };

  const prepareQuizQuestion = (idx: number) => {
    const pair = MINIMAL_PAIRS_DATABASE[idx % MINIMAL_PAIRS_DATABASE.length];
    const pick: 'A' | 'B' = Math.random() > 0.5 ? 'A' : 'B';
    setTargetWordChoice(pick);
    setQuizFeedback(null);
    
    // Play the target word automatically
    const targetWord = pick === 'A' ? pair.pairA.word : pair.pairB.word;
    setTimeout(() => {
      handlePlayWord(targetWord, `quiz-prompt-${idx}`);
    }, 300);
  };

  const handleSelectQuizAnswer = (choice: 'A' | 'B') => {
    if (quizFeedback !== null) return;

    setTotalAttempts(prev => prev + 1);
    if (choice === targetWordChoice) {
      setQuizFeedback('correct');
      setScore(prev => prev + 1);
      playArabicAudio('أحسنت! إجابة صحيحة وممتازة');
    } else {
      setQuizFeedback('wrong');
      playArabicAudio('حاول مرة أخرى وركز في الصوت');
    }
  };

  const handleNextQuizQuestion = () => {
    const nextIdx = (currentQuizIndex + 1) % MINIMAL_PAIRS_DATABASE.length;
    setCurrentQuizIndex(nextIdx);
    prepareQuizQuestion(nextIdx);
  };

  const currentQuizPair = MINIMAL_PAIRS_DATABASE[currentQuizIndex % MINIMAL_PAIRS_DATABASE.length];
  const targetWord = targetWordChoice === 'A' ? currentQuizPair.pairA.word : currentQuizPair.pairB.word;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
              <span>🎧 نهج القراءة المبكر (EGR)</span>
              <span>•</span>
              <span>الوعي الصوتي المتقدم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-amiri leading-tight">
              مختبر التمييز السمعي والبصري (Minimal Pairs Lab)
            </h2>
            <p className="text-sm text-teal-100 font-medium leading-relaxed">
              علاج جذري لأبرز أسباب الضعف القرائي: المقارنات الصوتية بين الحركات القصيرة والمدود الطويلة، والحروف المتقاربة صوتاً ومخرجاً وصفة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (isQuizMode) setIsQuizMode(false);
                else startQuiz();
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm shadow-md transition cursor-pointer ${
                isQuizMode 
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' 
                  : 'bg-white hover:bg-emerald-50 text-emerald-950'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>{isQuizMode ? 'العودة لجدول المقارنات' : '🎮 بدء اختبار التمييز السمعي'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-teal-800/80 hover:bg-teal-700 text-white border border-teal-500/50 px-4 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كراسة التمييز A4</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        {!isQuizMode && (
          <div className="mt-6 pt-4 border-t border-teal-700/60 flex flex-wrap items-center gap-2">
            <span className="text-xs text-teal-200 font-bold ml-2">نوع المقارنة الصوتية:</span>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCategory === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-teal-900/80 text-teal-200 hover:bg-teal-800'
              }`}
            >
              جميع التدريبات ({MINIMAL_PAIRS_DATABASE.length})
            </button>
            <button
              onClick={() => setActiveCategory('vowel_length')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCategory === 'vowel_length' ? 'bg-amber-400 text-slate-950' : 'bg-teal-900/80 text-teal-200 hover:bg-teal-800'
              }`}
            >
              ١. الحركات القصيرة ⟷ المدود الطويلة (قَالَ / قَلَّ)
            </button>
            <button
              onClick={() => setActiveCategory('similar_consonants')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCategory === 'similar_consonants' ? 'bg-amber-400 text-slate-950' : 'bg-teal-900/80 text-teal-200 hover:bg-teal-800'
              }`}
            >
              ٢. الحروف المتقاربة صوتاً ومخرجاً (س/ص ، ت/ط ، ذ/ز/ظ)
            </button>
          </div>
        )}
      </div>

      {/* QUIZ INTERACTIVE MODE */}
      {isQuizMode ? (
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-black text-slate-800 text-sm">اختبار التمييز السمعي النشط</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-black">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full">
                النتيجة: {score} / {totalAttempts}
              </span>
              <span className="text-slate-400">
                السؤال {currentQuizIndex + 1} من {MINIMAL_PAIRS_DATABASE.length}
              </span>
            </div>
          </div>

          <div className="space-y-3 py-2">
            <span className="text-xs font-bold text-slate-500 block">
              استمع للصوت الذي ينطقه المعلم، ثم اختر الكلمة المطابقة تماماً:
            </span>

            <button
              onClick={() => handlePlayWord(targetWord, 'quiz-repeat')}
              className="inline-flex items-center gap-3 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-6 py-3.5 rounded-2xl font-black text-base shadow-md hover:scale-105 transition cursor-pointer"
            >
              <Volume2 className="w-6 h-6 animate-bounce" />
              <span>اضغط هنا للاستماع للصوت 🔊</span>
            </button>
          </div>

          {/* Options A & B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
            {/* Option A */}
            <button
              onClick={() => handleSelectQuizAnswer('A')}
              disabled={quizFeedback !== null}
              className={`p-5 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                quizFeedback === null
                  ? 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 bg-slate-50'
                  : targetWordChoice === 'A'
                  ? 'border-emerald-600 bg-emerald-100 text-emerald-950'
                  : 'border-slate-200 bg-slate-100 opacity-60'
              }`}
            >
              <span className="text-xs font-black text-slate-400 block mb-1">الخيار (أ)</span>
              <span className="text-3xl font-black font-amiri text-slate-950">
                {currentQuizPair.pairA.word}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currentQuizPair.pairA.typeLabel}
              </span>
            </button>

            {/* Option B */}
            <button
              onClick={() => handleSelectQuizAnswer('B')}
              disabled={quizFeedback !== null}
              className={`p-5 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                quizFeedback === null
                  ? 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 bg-slate-50'
                  : targetWordChoice === 'B'
                  ? 'border-emerald-600 bg-emerald-100 text-emerald-950'
                  : 'border-slate-200 bg-slate-100 opacity-60'
              }`}
            >
              <span className="text-xs font-black text-slate-400 block mb-1">الخيار (ب)</span>
              <span className="text-3xl font-black font-amiri text-slate-950">
                {currentQuizPair.pairB.word}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currentQuizPair.pairB.typeLabel}
              </span>
            </button>
          </div>

          {/* Feedback & Next Button */}
          {quizFeedback && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-right ${
              quizFeedback === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2">
                {quizFeedback === 'correct' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="font-black block text-sm">
                    {quizFeedback === 'correct' ? 'ممتاز! تمييز سمعي دقيق وصحيح ⭐' : 'انتبه للفارق الصوتي الدقيق!'}
                  </span>
                  <p className="text-xs mt-0.5 opacity-90">
                    {currentQuizPair.drillTip}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextQuizQuestion}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shrink-0 transition cursor-pointer shadow-xs"
              >
                السؤال التالي ➜
              </button>
            </div>
          )}
        </div>
      ) : (
        /* COMPARATIVE PAIRS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPairs.map((pair) => (
            <div
              key={pair.id}
              className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-5 shadow-2xs transition flex flex-col justify-between gap-4"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {pair.subCategory}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {pair.contrastTitle}
                </span>
              </div>

              {/* Contrast Pair Boxes */}
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* Word A */}
                <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-3 flex flex-col justify-between gap-2 hover:bg-amber-50/50 transition">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      {pair.pairA.typeLabel}
                    </span>
                    <span className="text-3xl font-black font-amiri text-slate-950 block py-1">
                      {pair.pairA.word}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {pair.pairA.soundDesc}
                  </p>

                  <button
                    onClick={() => handlePlayWord(pair.pairA.word, `${pair.id}-a`)}
                    className="flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 hover:text-emerald-800 text-xs font-bold py-1.5 px-2.5 rounded-xl shadow-2xs transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>نطق الصوت</span>
                  </button>
                </div>

                {/* Word B */}
                <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-3 flex flex-col justify-between gap-2 hover:bg-amber-50/50 transition">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 block mb-1">
                      {pair.pairB.typeLabel}
                    </span>
                    <span className="text-3xl font-black font-amiri text-slate-950 block py-1">
                      {pair.pairB.word}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {pair.pairB.soundDesc}
                  </p>

                  <button
                    onClick={() => handlePlayWord(pair.pairB.word, `${pair.id}-b`)}
                    className="flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 hover:text-emerald-800 text-xs font-bold py-1.5 px-2.5 rounded-xl shadow-2xs transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>نطق الصوت</span>
                  </button>
                </div>
              </div>

              {/* Context Sentences */}
              {(pair.sentenceA || pair.sentenceB) && (
                <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-200/80">
                  <span className="font-black text-slate-700 block text-[11px]">
                    📖 الكلمتان في سياق الجملة:
                  </span>
                  {pair.sentenceA && (
                    <div className="flex items-center justify-between text-slate-800 font-amiri font-bold text-sm bg-white p-1.5 rounded-lg border border-slate-200">
                      <span>• {pair.sentenceA}</span>
                      <button 
                        onClick={() => handlePlayWord(pair.sentenceA!, `${pair.id}-sentA`)}
                        className="text-slate-400 hover:text-emerald-700 p-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {pair.sentenceB && (
                    <div className="flex items-center justify-between text-slate-800 font-amiri font-bold text-sm bg-white p-1.5 rounded-lg border border-slate-200">
                      <span>• {pair.sentenceB}</span>
                      <button 
                        onClick={() => handlePlayWord(pair.sentenceB!, `${pair.id}-sentB`)}
                        className="text-slate-400 hover:text-emerald-700 p-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Pedagogical Guidance Tip */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-2.5 text-[11px] text-amber-950 font-medium flex items-start gap-1.5">
                <span className="text-amber-700 shrink-0 font-black">💡 إرشاد المعلم:</span>
                <span>{pair.drillTip}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
