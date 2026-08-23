import React from 'react';

/**
 * Phonological Syllable Token Types based on Early Grade Reading (EGR) principles
 */
export type SyllableType = 
  | 'sukoon'       // المقطع الساكن (حرف متحرك + حرف ساكن) e.g., مَسْـ / أَبْـ / يَلْـ
  | 'madd_alif'    // مد بالألف (مفتوح + ألف) e.g., بَا / قَا / سَا
  | 'madd_waw'     // مد بالواو (مضموم + واو) e.g., نُو / طُو / قُو
  | 'madd_ya'      // مد بالياء (مكسور + ياء) e.g., رِي / سِي / قِي
  | 'shaddah'      // المقطع المشدد e.g., رَبَّ / عَلَّـ
  | 'lam_qamari'   // اللام القمرية e.g., الْـ
  | 'lam_shamsi'   // اللام الشمسية e.g., الشَّـ
  | 'tanween'      // التنوين e.g., ـٌ / ـٍ / ـً
  | 'short_vowel'; // حركة قصيرة مفردة e.g., فَـ / تَـ / حَـ

export interface SyllableToken {
  text: string;
  type: SyllableType;
  label: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  arcColor: string;
}

/**
 * Parses an Arabic word or phrase into phonological segments with EGR classification
 */
export function parseArabicSyllables(word: string): SyllableToken[] {
  if (!word || typeof word !== 'string') return [];

  const tokens: SyllableToken[] = [];
  const chars = Array.from(word.trim());
  let i = 0;

  while (i < chars.length) {
    // 1. Check for Lam Qamariyyah or Shamsiyyah at word start (الْـ or الشَّـ)
    if (
      (chars[i] === 'ا' || chars[i] === 'أ' || chars[i] === 'إ') && 
      i + 1 < chars.length && 
      chars[i + 1] === 'ل'
    ) {
      // Check next diacritic or next letter
      let lamSegment = chars[i] + chars[i + 1];
      let cursor = i + 2;
      
      // If Sukoon on Lam -> Lam Qamariyyah (الْـ)
      if (cursor < chars.length && chars[cursor] === '\u0652') { // sukoon
        lamSegment += chars[cursor];
        cursor++;
        tokens.push({
          text: lamSegment,
          type: 'lam_qamari',
          label: 'لام قمرية (مقطع ساكن)',
          colorClass: 'text-teal-900',
          borderClass: 'border-teal-400',
          bgClass: 'bg-teal-50',
          arcColor: '#0d9488'
        });
        i = cursor;
        continue;
      }
      
      // If next consonant has Shaddah -> Lam Shamsiyyah (الشَّـ)
      let nextLetter = '';
      let isShamsi = false;
      let tempCursor = cursor;
      while (tempCursor < chars.length && !isArabicLetter(chars[tempCursor])) {
        tempCursor++;
      }
      if (tempCursor < chars.length) {
        nextLetter = chars[tempCursor];
        if (tempCursor + 1 < chars.length && chars[tempCursor + 1] === '\u0651') { // shaddah
          isShamsi = true;
          // Capture up to shaddah + diacritic
          let end = tempCursor + 2;
          if (end < chars.length && isDiacritic(chars[end]) && chars[end] !== '\u0651') {
            end++;
          }
          lamSegment = chars.slice(i, end).join('');
          tokens.push({
            text: lamSegment,
            type: 'lam_shamsi',
            label: 'لام شمسية (مقطع مشدد)',
            colorClass: 'text-amber-900',
            borderClass: 'border-amber-400',
            bgClass: 'bg-amber-50',
            arcColor: '#d97706'
          });
          i = end;
          continue;
        }
      }
    }

    // 2. Identify standard letter + optional diacritics
    let start = i;
    let mainLetter = chars[i];
    i++;
    
    // Accumulate immediate diacritics on main letter
    while (i < chars.length && isDiacritic(chars[i])) {
      i++;
    }

    let segmentText = chars.slice(start, i).join('');

    // 3. Check for Shaddah on this segment
    if (segmentText.includes('\u0651')) {
      tokens.push({
        text: segmentText,
        type: 'shaddah',
        label: 'مقطع مشدد',
        colorClass: 'text-purple-900',
        borderClass: 'border-purple-400',
        bgClass: 'bg-purple-50',
        arcColor: '#9333ea'
      });
      continue;
    }

    // 4. Check for Tanween
    if (
      segmentText.includes('\u064B') || // Fathatan
      segmentText.includes('\u064C') || // Dammatan
      segmentText.includes('\u064D')    // Kasratan
    ) {
      // Check if followed by Alif of tanween (ـاً / ا)
      if (i < chars.length && (chars[i] === 'ا' || chars[i] === 'ى')) {
        segmentText += chars[i];
        i++;
      }
      tokens.push({
        text: segmentText,
        type: 'tanween',
        label: 'مقطع تنوين',
        colorClass: 'text-indigo-900',
        borderClass: 'border-indigo-400',
        bgClass: 'bg-indigo-50',
        arcColor: '#6366f1'
      });
      continue;
    }

    // 5. Check if next letter has Sukoon (المقطع الساكن)
    if (i < chars.length) {
      let nextLetterStart = i;
      let nextLetter = chars[i];
      let nextEnd = i + 1;
      
      // check diacritics of next letter
      while (nextEnd < chars.length && isDiacritic(chars[nextEnd])) {
        nextEnd++;
      }
      
      let nextSegment = chars.slice(nextLetterStart, nextEnd).join('');
      
      if (nextSegment.includes('\u0652')) { // Sukoon \u0652
        // It's a Sukoon syllable (مقطع ساكن)
        segmentText += nextSegment;
        i = nextEnd;
        tokens.push({
          text: segmentText,
          type: 'sukoon',
          label: 'مقطع ساكن (صوت واحد)',
          colorClass: 'text-emerald-950',
          borderClass: 'border-emerald-500',
          bgClass: 'bg-emerald-100/70',
          arcColor: '#059669'
        });
        continue;
      }

      // 6. Check for Madd (مد بالألف / مد بالواو / مد بالياء)
      if (
        (nextLetter === 'ا' || nextLetter === 'ى' || nextLetter === 'و' || nextLetter === 'ي') &&
        !nextSegment.includes('\u0652') && // Not carrying sukoon
        !nextSegment.includes('\u064E') && // Not carrying fatha
        !nextSegment.includes('\u064F') && // Not carrying damma
        !nextSegment.includes('\u0650')    // Not carrying kasra
      ) {
        // Madd Alif: preceded by Fatha
        if ((nextLetter === 'ا' || nextLetter === 'ى') && segmentText.includes('\u064E')) {
          segmentText += nextSegment;
          i = nextEnd;
          tokens.push({
            text: segmentText,
            type: 'madd_alif',
            label: 'مد بالألف (صوت طويل)',
            colorClass: 'text-rose-950',
            borderClass: 'border-rose-400',
            bgClass: 'bg-rose-50',
            arcColor: '#e11d48'
          });
          continue;
        }

        // Madd Waw: preceded by Damma
        if (nextLetter === 'و' && segmentText.includes('\u064F')) {
          segmentText += nextSegment;
          i = nextEnd;
          tokens.push({
            text: segmentText,
            type: 'madd_waw',
            label: 'مد بالواو (صوت طويل)',
            colorClass: 'text-amber-950',
            borderClass: 'border-amber-400',
            bgClass: 'bg-amber-50',
            arcColor: '#d97706'
          });
          continue;
        }

        // Madd Ya: preceded by Kasra
        if ((nextLetter === 'ي' || nextLetter === 'ى') && segmentText.includes('\u0650')) {
          segmentText += nextSegment;
          i = nextEnd;
          tokens.push({
            text: segmentText,
            type: 'madd_ya',
            label: 'مد بالياء (صوت طويل)',
            colorClass: 'text-blue-950',
            borderClass: 'border-blue-400',
            bgClass: 'bg-blue-50',
            arcColor: '#2563eb'
          });
          continue;
        }
      }
    }

    // 7. Default: Short Vowel Syllable (حركة قصيرة مفردة)
    tokens.push({
      text: segmentText,
      type: 'short_vowel',
      label: 'صوت قصير',
      colorClass: 'text-slate-900',
      borderClass: 'border-slate-300',
      bgClass: 'bg-slate-50',
      arcColor: '#64748b'
    });
  }

  return tokens;
}

function isDiacritic(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0x064B && code <= 0x065F;
}

function isArabicLetter(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x0621 && code <= 0x064A) || (code >= 0x0671 && code <= 0x06D3);
}

/**
 * Visual Syllable Highlighting Component with Bottom Arcs (نهج القراءة المبكر)
 */
interface SyllableHighlighterProps {
  text: string;
  showArcs?: boolean;
  colorCoded?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  onClickSyllable?: (token: SyllableToken) => void;
}

export const SyllableHighlighter: React.FC<SyllableHighlighterProps> = ({
  text,
  showArcs = true,
  colorCoded = true,
  size = 'lg',
  className = '',
  onClickSyllable
}) => {
  // If the string contains multiple words, split by space and render each
  const words = text.split(/(\s+)/);

  return (
    <span className={`inline-flex flex-wrap items-end justify-center gap-1.5 leading-normal ${className}`} dir="rtl">
      {words.map((chunk, wIdx) => {
        if (/^\s+$/.test(chunk)) {
          return <span key={wIdx} className="w-1.5"> </span>;
        }

        const tokens = parseArabicSyllables(chunk);

        return (
          <span key={wIdx} className="inline-flex items-end gap-0.5 px-1 py-0.5 rounded-lg">
            {tokens.map((token, tIdx) => {
              const hasSpecialStructure = token.type !== 'short_vowel';

              return (
                <span
                  key={tIdx}
                  onClick={() => onClickSyllable && onClickSyllable(token)}
                  className={`relative inline-flex flex-col items-center group transition ${
                    onClickSyllable ? 'cursor-pointer hover:scale-105' : ''
                  }`}
                  title={`${token.label}: ${token.text}`}
                >
                  {/* Syllable Text */}
                  <span
                    className={`px-1 py-0.5 rounded font-amiri font-black transition ${
                      colorCoded && hasSpecialStructure
                        ? `${token.colorClass} ${token.bgClass} shadow-2xs border-b-2 ${token.borderClass}`
                        : 'text-slate-900'
                    }`}
                  >
                    {token.text}
                  </span>

                  {/* Visual Bottom Arc (قوس المقطع الصوتي السفلي ⏝) */}
                  {showArcs && (
                    <span 
                      className="w-full flex justify-center items-center h-1.5 -mt-0.5 select-none pointer-events-none"
                      style={{ color: token.arcColor }}
                    >
                      {token.type === 'sukoon' ? (
                        <svg className="w-full h-2" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1C7 7 17 7 23 1" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      ) : token.type.startsWith('madd') ? (
                        <svg className="w-full h-2" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1C7 6 17 6 23 1" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 1" />
                        </svg>
                      ) : token.type === 'shaddah' ? (
                        <svg className="w-full h-2" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4C5 1 9 7 12 4C15 1 19 7 23 4" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                      )}
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Syllable Legend Guide for EGR (دليل رموز وألوان المقاطع الصوتية)
 */
export const SyllableLegendGuide: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`bg-white border border-emerald-200 rounded-2xl p-3 shadow-2xs ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-1.5 text-emerald-950 font-black mb-2">
        <span className="text-base">🌈</span>
        <span>دليل الترميز الصوتي المقطعي (نهج القراءة المبكر EGR):</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-950 border border-emerald-300 px-2 py-1 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>المقطع الساكن (أَبْـ) ⏝</span>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50 text-rose-950 border border-rose-300 px-2 py-1 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span>صوت المد الطويل (بَا) ⏝</span>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-50 text-purple-950 border border-purple-300 px-2 py-1 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          <span>المقطع المشدد (رَبَّ) 〰️</span>
        </div>
        <div className="flex items-center gap-1.5 bg-teal-50 text-teal-950 border border-teal-300 px-2 py-1 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
          <span>اللام القمرية (الْـ) ⏝</span>
        </div>
      </div>
    </div>
  );
};
