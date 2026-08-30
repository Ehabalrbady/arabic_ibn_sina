import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Trophy, 
  Award, 
  Crown, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Puzzle, 
  Flame,
  Rocket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../speech_and_multimedia/soundEffects';

export type RewardCategory = 'solar_lunar' | 'syllables' | 'spelling' | 'reading' | 'general';

export interface VisualRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  category?: RewardCategory;
  title?: string;
  subtitle?: string;
  score?: number;
  total?: number;
  badgeName?: string;
  customPraise?: string;
}

const PRAISE_MESSAGES: Record<RewardCategory, string[]> = {
  solar_lunar: [
    'ما شاء الله! أتقنت التمييز بين اللام الشمسية واللام القمرية باحترافية تامة ☀️🌙',
    'رائع جداً! أصبحت خبيراً في الحروف الشمسية والقمرية وحرف الشدة والسكون 🌟',
    'إنجاز مبهر! عقلك النيّر يسطع كالشمس ويضيء كالقمر ✨'
  ],
  syllables: [
    'أحسنت يا عبقري! أتقنت التحليل والتركيب المقطعي الصوتي ببراعة 🧩',
    'بطل التقطيع المقطعي! تفكيك الكلمات وإعادة بنائها أصبح لعبتك المفضلة 🎯',
    'ما شاء الله! مهاراتك الصوتية تزداد قوة يوماً بعد يوم 🚀'
  ],
  spelling: [
    'فارس الهجاء الأول! كتابة وتتبع الكلمات متقن بنسبة ١٠٠٪ ✍️',
    'تبارك الرحمن! خطك جميل وإدراكك للحركات دقيق جداً 🏅',
    'ممتاز يا مبدع! رحلة إتقان اللغة العربية تسير بخطى واثقة 🏆'
  ],
  reading: [
    'قراءة فصيحة وسلسة بمخارج حروف نقية ومتقنة 📖',
    'أداء قرائي متميز ومبهر! فصاحة وانسيابية عالية 🌟',
    'أحسنت يا بطل القراءة! نطق سليم وتعبير واثق 🎯'
  ],
  general: [
    'ما شاء الله! إنجاز رائع ومتميز يا بطل المستقبل 🌟',
    'أداء استثنائي يستحق وسام التميز والافتخار 🏆',
    'أحسنت صنعاً! كل تمرين تقطعه يقربك من قمة الإتقان 🚀'
  ]
};

export const VisualRewardModal: React.FC<VisualRewardModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  category = 'general',
  title,
  subtitle,
  score = 10,
  total = 10,
  badgeName,
  customPraise
}) => {
  const [starsLit, setStarsLit] = useState<number>(0);
  const [soundActive, setSoundActive] = useState<boolean>(sfx.isEnabled());
  const [praiseText, setPraiseText] = useState<string>('');

  // Calculate percentage & stars (1, 2, or 3 stars)
  const percentage = total > 0 ? Math.round((score / total) * 100) : 100;
  const targetStars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : 1;

  useEffect(() => {
    if (isOpen) {
      setStarsLit(0);
      
      // Select random praise or use custom
      if (customPraise) {
        setPraiseText(customPraise);
      } else {
        const list = PRAISE_MESSAGES[category] || PRAISE_MESSAGES.general;
        const randomPraise = list[Math.floor(Math.random() * list.length)];
        setPraiseText(randomPraise);
      }

      // 1. Play grand celebration fanfare
      sfx.playCelebrationFanfare();

      // 2. Confetti explosion
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#F59E0B', '#10B981', '#0EA5E9', '#EC4899', '#8B5CF6']
        });
      } catch (e) {}

      // 3. Stagger star lighting animations with audio pops
      const timer1 = setTimeout(() => {
        setStarsLit(1);
        sfx.playStarPop(1.0);
      }, 350);

      const timer2 = setTimeout(() => {
        if (targetStars >= 2) {
          setStarsLit(2);
          sfx.playStarPop(1.25);
        }
      }, 700);

      const timer3 = setTimeout(() => {
        if (targetStars >= 3) {
          setStarsLit(3);
          sfx.playStarPop(1.55);
        }
      }, 1050);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, category, customPraise, targetStars]);

  if (!isOpen) return null;

  const defaultBadgeName = badgeName || (
    category === 'solar_lunar' ? 'وسام بطل اللام الشمسية والقمرية' :
    category === 'syllables' ? 'وسام خبير التقطيع والتركيب المقطعي' :
    category === 'spelling' ? 'وسام فارس الهجاء والإملاء' :
    'وسام الإتقان والتميز'
  );

  const defaultTitle = title || (
    category === 'solar_lunar' ? '🎉 إنجاز رائع في تصنيف اللام الشمسية والقمرية!' :
    category === 'syllables' ? '🎉 أحسنت صنعاً في التحليل والتركيب الصوتي!' :
    '🎉 مبارك! أكملت النشاط بنجاح باهر!'
  );

  const toggleSound = () => {
    const next = sfx.toggle();
    setSoundActive(next);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-4 border-amber-300 font-cairo space-y-5 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Background Ambient Aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        
        {/* Sound toggle & close header */}
        <div className="flex items-center justify-between relative z-10">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition cursor-pointer text-xs font-bold flex items-center gap-1"
            title={soundActive ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="text-[11px]">{soundActive ? 'الصوت مفعّل' : 'مكتوم'}</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>مكافأة الإتقان</span>
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Big Central Animated Badge with Category Icons */}
        <div className="relative flex items-center justify-center pt-2">
          {/* Glowing Badge Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-tr from-amber-500 via-amber-400 to-yellow-300 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[22px] bg-white flex flex-col items-center justify-center relative overflow-hidden border-2 border-amber-200">
              
              {category === 'solar_lunar' ? (
                <div className="flex items-center justify-center -space-x-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs z-10 animate-bounce">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Moon className="w-6 h-6" />
                  </div>
                </div>
              ) : category === 'syllables' ? (
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Puzzle className="w-8 h-8" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <Trophy className="w-8 h-8 text-amber-100" />
                  </div>
                </div>
              )}

              <span className="text-[10px] font-black text-amber-900 mt-1">
                {percentage}% إتقان
              </span>
            </div>
          </div>

          {/* Floating Accents */}
          <div className="absolute -top-1 -right-2 text-2xl animate-spin-slow">✨</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">👑</div>
        </div>

        {/* Three Animated Golden Stars */}
        <div className="flex items-center justify-center gap-3 py-1">
          {[1, 2, 3].map((starIdx) => {
            const isLit = starsLit >= starIdx;
            return (
              <div
                key={starIdx}
                className={`transform transition-all duration-300 ${
                  isLit 
                    ? 'scale-125 text-amber-400 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)] rotate-0' 
                    : 'scale-90 text-slate-200 opacity-40 -rotate-12'
                } ${starIdx === 2 ? 'mb-2' : ''}`}
              >
                <Star
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${isLit ? 'fill-amber-400 text-amber-500' : 'fill-slate-100 text-slate-300'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Title & Badge Details */}
        <div className="space-y-2">
          <div className="inline-block bg-emerald-100 text-emerald-950 font-black text-xs px-3 py-1 rounded-full border border-emerald-300">
            🏅 {defaultBadgeName}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {defaultTitle}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-bold">{subtitle}</p>
          )}
        </div>

        {/* Warm Encouragement Phrase */}
        <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm font-bold text-amber-950 leading-relaxed shadow-2xs">
          {praiseText}
        </div>

        {/* Accuracy and Results Pill */}
        <div className="flex items-center justify-around bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>النتيجة:</span>
            <span className="font-black text-slate-900">{score} / {total}</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>نسبة النجاح:</span>
            <span className="font-black text-emerald-700">{percentage}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {onRetry && (
            <button
              onClick={() => {
                sfx.playPop();
                onRetry();
                onClose();
              }}
              className="py-3 px-4 rounded-xl bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التدريب 🔄</span>
            </button>
          )}
          <button
            onClick={() => {
              sfx.playPop();
              onClose();
            }}
            className={`py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] ${
              !onRetry ? 'sm:col-span-2' : ''
            }`}
          >
            <span>متابعة الدرس يا بطل! 🚀</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
