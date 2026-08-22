import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { playArabicAudio } from '../utils/audio';

interface TestWord {
  word: string;
  type: 'open_ta' | 'tied_ta' | 'ha';
  stopPronunciation: string;
  connectedPronunciation: string;
  correctLetter: string;
  ruleExplanation: string;
  exampleSentence: string;
}

const PRESET_TEST_WORDS: TestWord[] = [
  {
    word: 'مَدْرَسَة',
    type: 'tied_ta',
    stopPronunciation: 'مَدْرَسَهْ (تُنطق هاء)',
    connectedPronunciation: 'مَدْرَسَةُ الْعِلْمِ (تُنطق تاء)',
    correctLetter: 'ـة / ة (تاء مربوطة)',
    ruleExplanation: 'نُطقت عند الوقف (هاء) وعند الوصل (تاء) ➜ إذن هي تاء مربوطة قطعيّاً!',
    exampleSentence: 'ذَهَبْتُ إِلَى مَدْرَسَةٍ جَمِيلَةٍ.'
  },
  {
    word: 'بِنْت',
    type: 'open_ta',
    stopPronunciation: 'بِنْتْ (تُنطق تاء)',
    connectedPronunciation: 'بِنْتُ الصَّالِحِ (تُنطق تاء)',
    correctLetter: 'ـت / ت (تاء مفتوحة)',
    ruleExplanation: 'نُطقت عند الوقف (تاء) وعند الوصل (تاء) ➜ إذن هي تاء مفتوحة أصيلة!',
    exampleSentence: 'هَذِهِ بِنْتٌ مُؤَدَّبَةٌ.'
  },
  {
    word: 'وَجْه',
    type: 'ha',
    stopPronunciation: 'وَجْهْ (تُنطق هاء)',
    connectedPronunciation: 'وَجْهُ الإِنْسَانِ (تُنطق هاء)',
    correctLetter: 'ـه / ه (هاء أصلية)',
    ruleExplanation: 'نُطقت عند الوقف (هاء) وعند الوصل (هاء) ➜ إذن هي هاء وليست تاء!',
    exampleSentence: 'غَسَلَ الطِّفْلُ وَجْهَهُ بِالْمَاءِ.'
  },
  {
    word: 'سَيَّارَة',
    type: 'tied_ta',
    stopPronunciation: 'سَيَّارَهْ (تُنطق هاء)',
    connectedPronunciation: 'سَيَّارَةُ الإِسْعَافِ (تُنطق تاء)',
    correctLetter: 'ـة / ة (تاء مربوطة)',
    ruleExplanation: 'نُطقت عند الوقف (هاء) وعند الوصل (تاء) ➜ تاء مربوطة.',
    exampleSentence: 'رَكِبْتُ سَيَّارَةً سَرِيعَةً.'
  },
  {
    word: 'بَيْت',
    type: 'open_ta',
    stopPronunciation: 'بَيْتْ (تُنطق تاء)',
    connectedPronunciation: 'بَيْتُ اللَّهِ (تُنطق تاء)',
    correctLetter: 'ـت / ت (تاء مفتوحة)',
    ruleExplanation: 'نُطقت (تاء) في الحالتين ➜ تاء مفتوحة.',
    exampleSentence: 'زُرْتُ بَيْتاً وَاسِعاً.'
  },
  {
    word: 'مِيَاه',
    type: 'ha',
    stopPronunciation: 'مِيَاهْ (تُنطق هاء)',
    connectedPronunciation: 'مِيَاهُ الْبَحْرِ (تُنطق هاء)',
    correctLetter: 'ـه / ه (هاء)',
    ruleExplanation: 'نُطقت (هاء) في الحالتين ➜ هاء.',
    exampleSentence: 'مِيَاهُ الأَمْطَارِ نَقِيَّةٌ.'
  },
  {
    word: 'حُوت',
    type: 'open_ta',
    stopPronunciation: 'حُوتْ (تُنطق تاء)',
    connectedPronunciation: 'حُوتُ الْبَحْرِ (تُنطق تاء)',
    correctLetter: 'ـت / ت (تاء مفتوحة)',
    ruleExplanation: 'نُطقت (تاء) في الحالتين ➜ تاء مفتوحة.',
    exampleSentence: 'شَاهَدْتُ حُوتاً ضَخْماً.'
  },
  {
    word: 'فَوَاكِه',
    type: 'ha',
    stopPronunciation: 'فَوَاكِهْ (تُنطق هاء)',
    connectedPronunciation: 'فَوَاكِهُ الصَّيْفِ (تُنطق هاء)',
    correctLetter: 'ـه / ه (هاء)',
    ruleExplanation: 'نُطقت (هاء) في الحالتين ➜ هاء وليست تاء.',
    exampleSentence: 'أَكَلْتُ فَوَاكِهَ لَذِيذَةً.'
  }
];

export const SukoonTestTool: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<TestWord>(PRESET_TEST_WORDS[0]);
  const [customWord, setCustomWord] = useState('');
  const [customResult, setCustomResult] = useState<{ stop: string; connect: string; letter: string } | null>(null);

  const handleCustomTest = (typeChoice: 'open' | 'tied' | 'ha') => {
    if (!customWord.trim()) return;
    if (typeChoice === 'tied') {
      setCustomResult({
        stop: `${customWord}ْ (صوت الهاء)`,
        connect: `${customWord}ُ (صوت التاء)`,
        letter: 'تاء مربوطة ( ة / ـة )'
      });
    } else if (typeChoice === 'open') {
      setCustomResult({
        stop: `${customWord}ْ (صوت التاء)`,
        connect: `${customWord}ُ (صوت التاء)`,
        letter: 'تاء مفتوحة ( ت )'
      });
    } else {
      setCustomResult({
        stop: `${customWord}ْ (صوت الهاء)`,
        connect: `${customWord}ُ (صوت الهاء)`,
        letter: 'هـاء ( هـ / ـه )'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border-2 border-amber-400/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
            ✨
          </div>
          <div>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
              الوحدة 9 — ص 113 في الكتيب
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-cairo text-white">
              القاعدة الذهبية: اختبار السكون والوصل للتاء والهاء
            </h2>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          أكبر خطأ إملائي يقع فيه الطلاب هو الخلط بين (التاء المربوطة، التاء المفتوحة، والهاء). 
          الحل السحري هو نطق الكلمة مرتين: <strong>مرة بالسكون (الوقف)</strong>، و<strong>مرة بالحركة (الوصل)</strong>.
        </p>

        {/* Rule Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-cairo">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="font-bold text-emerald-400 block mb-1">التاء المفتوحة ( ت ):</span>
            <span>تُنطق عند الوقف (تْ) وعند الوصل (تُ) ➜ تاء في الحالتين.</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-400 block mb-1">التاء المربوطة ( ة ):</span>
            <span>تُنطق عند الوقف (هـْ) وعند الوصل (تُ) ➜ تتغير هاء ⟷ تاء.</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="font-bold text-sky-400 block mb-1">الهاء ( ه ):</span>
            <span>تُنطق عند الوقف (هـْ) وعند الوصل (هـُ) ➜ هاء في الحالتين.</span>
          </div>
        </div>
      </div>

      {/* Preset Word Selector */}
      <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs space-y-4">
        <h3 className="font-bold font-cairo text-slate-800 text-base flex items-center gap-2">
          <span>🎯</span>
          <span>اختر كلمة من كلمات الكتاب لتجربة الاختبار الصوتي العملي:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_TEST_WORDS.map((item) => (
            <button
              key={item.word}
              onClick={() => setSelectedWord(item)}
              className={`p-3 rounded-xl border-2 font-bold font-cairo text-sm transition text-center flex flex-col items-center gap-1 ${
                selectedWord.word === item.word
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                  : 'border-slate-200 hover:border-amber-400 bg-slate-50/50 text-slate-700'
              }`}
            >
              <span className="text-lg">{item.word}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {item.type === 'tied_ta' ? 'تاء مربوطة' : item.type === 'open_ta' ? 'تاء مفتوحة' : 'هاء'}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Word Diagnostic Panel */}
        <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 mt-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-xs text-amber-400 font-bold block">الكلمة المختارة للفحص:</span>
              <span className="text-3xl font-black font-cairo text-white">{selectedWord.word}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playArabicAudio(selectedWord.word)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>استمع للكلمة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-cairo">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-amber-300 font-bold block mb-1">1. اختبار الوقف (بالسكون):</span>
              <p className="text-sm font-bold text-white mb-2">{selectedWord.stopPronunciation}</p>
              <button
                onClick={() => playArabicAudio(selectedWord.word)}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold"
              >
                🔊 نطق الوقف
              </button>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-emerald-300 font-bold block mb-1">2. اختبار الوصل (بالحركة):</span>
              <p className="text-sm font-bold text-white mb-2">{selectedWord.connectedPronunciation}</p>
              <button
                onClick={() => playArabicAudio(selectedWord.exampleSentence)}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold"
              >
                🔊 نطق في جملة
              </button>
            </div>
          </div>

          {/* Diagnostic Result */}
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-400 block">النتيجة والتعليل النحوي:</span>
              <p className="text-sm font-bold text-white mt-0.5">{selectedWord.ruleExplanation}</p>
              <div className="mt-2 inline-block bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
                الحرف الصحيح: {selectedWord.correctLetter}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Practice: Test Any Custom Word */}
      <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs space-y-4">
        <h3 className="font-bold font-cairo text-slate-800 text-base flex items-center gap-2">
          <span>🧪</span>
          <span>جرب اختبار السكون على أي كلمة جديدة:</span>
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            placeholder="اكتب كلمة هنا (مثال: حديقة، شجرة، زيت...)"
            className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-2 text-center text-base font-bold font-cairo focus:border-emerald-600 outline-hidden"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleCustomTest('tied')}
            className="flex-1 min-w-[120px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs transition"
          >
            نطقت هاء عند الوقف و تاء بالوصل ➜ (ة)
          </button>
          <button
            onClick={() => handleCustomTest('open')}
            className="flex-1 min-w-[120px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition"
          >
            نطقت تاء عند الوقف و تاء بالوصل ➜ (ت)
          </button>
          <button
            onClick={() => handleCustomTest('ha')}
            className="flex-1 min-w-[120px] bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition"
          >
            نطقت هاء عند الوقف و هاء بالوصل ➜ (هـ)
          </button>
        </div>

        {customResult && (
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-center font-cairo space-y-1">
            <span className="text-xs text-slate-500">نتيجة فحص كلمة ({customWord}):</span>
            <p className="font-bold text-slate-800 text-sm">
              عند الوقف: {customResult.stop} | وعند الوصل: {customResult.connect}
            </p>
            <span className="inline-block mt-2 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              الحرف الصحيح: {customResult.letter}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
