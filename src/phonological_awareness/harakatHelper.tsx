import React from 'react';

/**
 * Harakat (Diacritics) Color Mapping Scheme for Early Grade Reading (EGR)
 * - Fatha ( َ ): Vibrant Amber/Red -> Warm open vowel
 * - Kasra ( ِ ): Brilliant Blue/Sky -> Low descending vowel
 * - Damma ( ُ ): Emerald/Green -> Rounded forward vowel
 * - Sukoon ( ْ ): Slate/Teal -> Silent stoppage
 * - Shaddah ( ّ ): Purple/Magenta -> Doubled consonant
 * - Tanween ( ً ٍ ٌ ): Vibrant Orange/Indigo/Rose
 */

export interface WordVisualHint {
  emoji: string;
  category: string;
  hintText: string;
  bgGradient: string;
}

// Arabic words to visual illustrations and pedagogical hints
export const WORD_ILLUSTRATIONS_MAP: Record<string, WordVisualHint> = {
  'رَسُول': { emoji: '📜', category: 'هداية وتعليم', hintText: 'رَسُولُ اللَّهِ ﷺ (مَدٌّ بِالْوَاو: رَ - سُو - ل)', bgGradient: 'from-amber-50 to-emerald-50' },
  'رَسُولُ': { emoji: '📜', category: 'هداية وتعليم', hintText: 'رَسُولُ اللَّهِ ﷺ (مَدٌّ بِالْوَاو: رَ - سُو - لُ)', bgGradient: 'from-amber-50 to-emerald-50' },
  'رَسُولٌ': { emoji: '📜', category: 'هداية وتعليم', hintText: 'رَسُولُ اللَّهِ ﷺ (مَدٌّ بِالْوَاو: رَ - سُو - لٌ)', bgGradient: 'from-amber-50 to-emerald-50' },
  'رَسُولاً': { emoji: '📜', category: 'هداية وتعليم', hintText: 'رَسُولاً (تَنْوِينُ فَتْح: رَ - سُو - لًا)', bgGradient: 'from-amber-50 to-emerald-50' },
  'كِتَاب': { emoji: '📖', category: 'أدوات', hintText: 'كِـ - تَا - ب (مد بالألف)', bgGradient: 'from-blue-50 to-indigo-50' },
  'كِتَابٌ': { emoji: '📖', category: 'أدوات', hintText: 'كِـ - تَا - بٌ (مد بالألف وتنوين)', bgGradient: 'from-blue-50 to-indigo-50' },
  'قَلَم': { emoji: '✏️', category: 'أدوات', hintText: 'قَـ - لَـ - م (حركات قصيرة)', bgGradient: 'from-amber-50 to-yellow-50' },
  'قَلَمٌ': { emoji: '✏️', category: 'أدوات', hintText: 'قَـ - لَـ - مٌ (تنوين ضم)', bgGradient: 'from-amber-50 to-yellow-50' },
  'شَمْس': { emoji: '☀️', category: 'طبيعة', hintText: 'شَمْـ - س (مقطع ساكن)', bgGradient: 'from-amber-50 to-orange-50' },
  'الشَّمْس': { emoji: '☀️', category: 'طبيعة', hintText: 'الشَّـ - مْـ - س (لام شمسية مشددة)', bgGradient: 'from-amber-50 to-orange-50' },
  'قَمَر': { emoji: '🌙', category: 'طبيعة', hintText: 'قَـ - مَـ - ر (حركات مفتوحة)', bgGradient: 'from-sky-50 to-indigo-50' },
  'الْقَمَر': { emoji: '🌙', category: 'طبيعة', hintText: 'الْـ - قَـ - مَـ - ر (لام قمرية ساكنة)', bgGradient: 'from-teal-50 to-sky-50' },
  'مَسْجِد': { emoji: '🕌', category: 'أماكن', hintText: 'مَسْـ - جِـ - د (مقطع ساكن)', bgGradient: 'from-emerald-50 to-teal-50' },
  'بَيْت': { emoji: '🏠', category: 'أماكن', hintText: 'بَيْـ - ت (مقطع لين ساكن)', bgGradient: 'from-amber-50 to-yellow-50' },
  'سَمَك': { emoji: '🐟', category: 'كائنات', hintText: 'سَـ - مَـ - ك (حركات مفتوحة)', bgGradient: 'from-sky-50 to-blue-50' },
  'سَمَكَة': { emoji: '🐟', category: 'كائنات', hintText: 'سَـ - مَـ - كَـ - ة (تاء مربوطة)', bgGradient: 'from-sky-50 to-cyan-50' },
  'جَمَل': { emoji: '🐪', category: 'حيوانات', hintText: 'جَـ - مَـ - ل (سفينة الصحراء)', bgGradient: 'from-amber-50 to-yellow-50' },
  'زَهْرَة': { emoji: '🌸', category: 'نبات', hintText: 'زَهْـ - رَ - ة (مقطع ساكن وتاء مربوطة)', bgGradient: 'from-rose-50 to-pink-50' },
  'عَسَل': { emoji: '🍯', category: 'غذاء', hintText: 'عَـ - سَـ - ل (حركات مفتوحة)', bgGradient: 'from-amber-50 to-yellow-50' },
  'شَجَرَة': { emoji: '🌳', category: 'طبيعة', hintText: 'شَـ - جَـ - رَ - ة', bgGradient: 'from-emerald-50 to-green-50' },
  'عُصْفُور': { emoji: '🕊️', category: 'طيور', hintText: 'عُصْـ - فُو - ر (ساكن ومد واو)', bgGradient: 'from-sky-50 to-blue-50' },
  'حَلِيب': { emoji: '🥛', category: 'غذاء', hintText: 'حَـ - لِي - ب (مد بالياء)', bgGradient: 'from-slate-50 to-sky-50' },
  'مَاء': { emoji: '💧', category: 'طبيعة', hintText: 'مَـ - اء (مد بالألف وهمزة)', bgGradient: 'from-sky-50 to-blue-50' },
  'تُفَّاح': { emoji: '🍎', category: 'فواكه', hintText: 'تُفْـ - فَا - ح (مقطع مشدد ومد)', bgGradient: 'from-rose-50 to-red-50' },
  'سَيَّارَة': { emoji: '🚗', category: 'وسائل', hintText: 'سَيْـ - يَا - رَ - ة (مشدد ومد)', bgGradient: 'from-blue-50 to-indigo-50' },
  'طَائِرَة': { emoji: '✈️', category: 'وسائل', hintText: 'طَـ - ا - ئِـ - رَ - ة (مد وهمزة)', bgGradient: 'from-sky-50 to-indigo-50' },
  'أَسَد': { emoji: '🦁', category: 'حيوانات', hintText: 'أَ - سَـ - د', bgGradient: 'from-amber-50 to-yellow-50' },
  'فِيل': { emoji: '🐘', category: 'حيوانات', hintText: 'فِي - ل (مد بالياء)', bgGradient: 'from-slate-50 to-blue-50' },
  'قِطّ': { emoji: '🐱', category: 'حيوانات', hintText: 'قِطْـ - طُ (مقطع مشدد)', bgGradient: 'from-amber-50 to-orange-50' },
  'بَاب': { emoji: '🚪', category: 'أدوات', hintText: 'بَا - ب (مد بالألف)', bgGradient: 'from-amber-50 to-stone-50' },
  'سَاعَة': { emoji: '⏰', category: 'أدوات', hintText: 'سَا - عَـ - ة (مد وتاء مربوطة)', bgGradient: 'from-rose-50 to-amber-50' },
  'نَجْم': { emoji: '⭐', category: 'فضاء', hintText: 'نَجْـ - م (مقطع ساكن)', bgGradient: 'from-amber-50 to-indigo-50' },
  'مَدْرَسَة': { emoji: '🏫', category: 'تعليم', hintText: 'مَدْ - رَ - سَ - ة (مقطع ساكن)', bgGradient: 'from-emerald-50 to-teal-50' },
  'حَدِيقَة': { emoji: '🏡', category: 'أماكن', hintText: 'حَـ - دِي - قَـ - ة (مد ياء)', bgGradient: 'from-emerald-50 to-green-50' },
  'نُور': { emoji: '💡', category: 'معاني', hintText: 'نُو - ر (مد بالواو)', bgGradient: 'from-amber-50 to-yellow-50' },
  'صَابُون': { emoji: '🧼', category: 'نظافة', hintText: 'صَا - بُو - ن (مد ألف ومد واو)', bgGradient: 'from-sky-50 to-blue-50' },
  'طَبِيب': { emoji: '🩺', category: 'مهن', hintText: 'طَـ - بِي - ب (مد بالياء)', bgGradient: 'from-teal-50 to-sky-50' },
  'مُعَلِّم': { emoji: '👨‍🏫', category: 'مهن', hintText: 'مُـ - عَلْـ - لِـ - م (مقطع مشدد)', bgGradient: 'from-blue-50 to-indigo-50' },
  'عَيْن': { emoji: '👁️', category: 'جسم', hintText: 'عَيْـ - ن (مقطع لين)', bgGradient: 'from-sky-50 to-blue-50' },
  'يَد': { emoji: '✋', category: 'جسم', hintText: 'يَـ - د (حركات قصيرة)', bgGradient: 'from-amber-50 to-yellow-50' },
  'قَلْب': { emoji: '❤️', category: 'جسم', hintText: 'قَلْـ - ب (مقطع ساكن)', bgGradient: 'from-rose-50 to-red-50' },
  'طَيْر': { emoji: '🕊️', category: 'طيور', hintText: 'طَيْـ - ر (مقطع لين)', bgGradient: 'from-sky-50 to-cyan-50' },
  'وَرْد': { emoji: '🌹', category: 'نبات', hintText: 'وَرْ - د (مقطع ساكن)', bgGradient: 'from-rose-50 to-pink-50' },
  'حَبْل': { emoji: '🪢', category: 'أدوات', hintText: 'حَبْـ - ل (مقطع ساكن)', bgGradient: 'from-amber-50 to-stone-50' },
  'فَم': { emoji: '👄', category: 'جسم', hintText: 'فَـ - م (حركات قصيرة)', bgGradient: 'from-rose-50 to-pink-50' },
  'خُبْز': { emoji: '🍞', category: 'غذاء', hintText: 'خُبْـ - ز (مقطع ساكن)', bgGradient: 'from-amber-50 to-yellow-50' },
  'تَمْر': { emoji: '🌴', category: 'غذاء', hintText: 'تَمْـ - ر (مقطع ساكن)', bgGradient: 'from-amber-50 to-stone-50' },
  'مَوْز': { emoji: '🍌', category: 'فواكه', hintText: 'مَوْ - ز (مقطع لين)', bgGradient: 'from-amber-50 to-yellow-50' },
  'عِنَب': { emoji: '🍇', category: 'فواكه', hintText: 'عِـ - نَـ - ب (كسرة وفتحة)', bgGradient: 'from-purple-50 to-indigo-50' },
  'رُمَّان': { emoji: '🫐', category: 'فواكه', hintText: 'رُمْـ - مَا - ن (مشدد ومد)', bgGradient: 'from-rose-50 to-purple-50' }
};

export function cleanArabicDiacritics(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

export function getWordIllustration(text: string): WordVisualHint | null {
  if (!text) return null;
  const direct = WORD_ILLUSTRATIONS_MAP[text.trim()];
  if (direct) return direct;
  
  const cleaned = cleanArabicDiacritics(text);
  if (WORD_ILLUSTRATIONS_MAP[cleaned]) {
    return WORD_ILLUSTRATIONS_MAP[cleaned];
  }

  for (const key of Object.keys(WORD_ILLUSTRATIONS_MAP)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return WORD_ILLUSTRATIONS_MAP[key];
    }
  }

  return null;
}

export function getDiacriticColorClass(diacriticChar: string): string {
  switch (diacriticChar) {
    case '\u064E': // Fatha َ
      return 'text-amber-600 font-black';
    case '\u0650': // Kasra ِ
      return 'text-sky-600 font-black';
    case '\u064F': // Damma ُ
      return 'text-emerald-600 font-black';
    case '\u0652': // Sukoon ْ
      return 'text-teal-700 font-black';
    case '\u0651': // Shaddah ّ
      return 'text-purple-600 font-black';
    case '\u064B': // Tanween Fath ً
      return 'text-orange-600 font-black';
    case '\u064C': // Tanween Damm ٌ
      return 'text-rose-600 font-black';
    case '\u064D': // Tanween Kasr ٍ
      return 'text-indigo-600 font-black';
    case '\u0670': // Dagger Alif ٰ
      return 'text-rose-600 font-black';
    default:
      return 'text-slate-800';
  }
}

interface ColoredArabicTextProps {
  text: string;
  className?: string;
  enableColoredHarakat?: boolean;
}

export const ColoredArabicText: React.FC<ColoredArabicTextProps> = ({
  text,
  className = '',
  enableColoredHarakat = true
}) => {
  if (!text) return null;
  if (!enableColoredHarakat) {
    return <span className={`font-amiri ${className}`}>{text}</span>;
  }

  const chars: string[] = Array.from(text);
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < chars.length) {
    const char: string = chars[i];
    const code = char.charCodeAt(0);
    const isDiacritic = code >= 0x064B && code <= 0x065F;

    if (!isDiacritic) {
      let diacritics = '';
      let nextIdx = i + 1;
      while (nextIdx < chars.length && (chars[nextIdx] as string).charCodeAt(0) >= 0x064B && (chars[nextIdx] as string).charCodeAt(0) <= 0x065F) {
        diacritics += chars[nextIdx];
        nextIdx++;
      }

      if (diacritics.length > 0) {
        const primaryDiacritic = diacritics[0];
        const colorClass = getDiacriticColorClass(primaryDiacritic);
        
        elements.push(
          <span key={i} className="inline-block relative">
            <span className="text-slate-950">{char}</span>
            <span className={`inline ${colorClass}`}>{diacritics}</span>
          </span>
        );
      } else {
        elements.push(<span key={i} className="text-slate-950">{char}</span>);
      }
      i = nextIdx;
    } else {
      const colorClass = getDiacriticColorClass(char);
      elements.push(<span key={i} className={colorClass}>{char}</span>);
      i++;
    }
  }

  return (
    <span className={`font-amiri inline-block ${className}`} dir="rtl">
      {elements}
    </span>
  );
};
