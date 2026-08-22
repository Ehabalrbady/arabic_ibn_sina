import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playArabicAudio } from '../utils/audio';

interface ReadingStory {
  id: number;
  title: string;
  unit: string;
  text: string;
  wordsCount: number;
}

const READING_STORIES: ReadingStory[] = [
  {
    id: 1,
    title: 'جمل الكلمات المفتوحة (ص 24)',
    unit: 'قراءة الكلمات',
    text: 'قَرَأَ وَ كَتَبَ — دَرَسَ وَ نَجَحَ — طَلَعَ وَ نَزَلَ — فَتَحَ وَ أَخَذَ — رَكَعَ وَ سَجَدَ — سَقَطَ وَ نَهَضَ — طَبَخَ وَ أَكَلَ — سَبَحَ وَ غَطَسَ — وَقَفَ وَ نَظَرَ — ذَهَبَ وَ رَجَعَ.',
    wordsCount: 30
  },
  {
    id: 2,
    title: 'جمل الكلمات المكسورة (ص 32)',
    unit: 'قراءة الكلمات',
    text: 'لَعِبَ وَ لَحِقَ — تَعِبَ وَ مَرِضَ — سَمِعَ وَ عَلِمَ — نَشِطَ وَ لَقِيَ — أَسِفَ وَ نَدِمَ — وَسِعَ وَ فَهِمَ — فَرِحَ وَ ضَحِكَ — عَطِشَ وَ شَرِبَ — نَسِيَ وَ نَضِجَ — رَغِبَ وَ صَحِبَ.',
    wordsCount: 30
  },
  {
    id: 3,
    title: 'جمل الكلمات المضمومة (ص 40)',
    unit: 'قراءة الكلمات',
    text: 'مُسِكَ وَ فُتِحَ — قُفِلَ وَ رُبِطَ — عُلِمَ وَ نُظِرَ — يَقِفُ وَ يَصِفُ — أُذِنَ وَ رُزِقَ — حَسُنَ وَ سَهُلَ — يَصِلُ وَ يَعِدُ — صُرِفَ وَ كَثُرَ — عَظُمَ وَ عُبِدَ — شُرِحَ وَ فُهِمَ.',
    wordsCount: 30
  },
  {
    id: 4,
    title: 'جمل المقطع الساكن (ص 49)',
    unit: 'المقطع الساكن',
    text: 'أَحْمَدُ يَكْتُبُ وَ عُمَرُ يَقْرَأُ — هِنْدُ تَطْبَخُ وَ لِينُ تَكْنِسُ — أَشْعَبُ يَخْطِبُ وَ أَنْوَرُ يَسْمَعُ — رِيمُ تَلْعَبُ وَ بَدْرُ يَدْرُسُ — أَيْمَنُ يَشْرَحُ وَ مَرْيَمُ تَفْهَمُ.',
    wordsCount: 20
  },
  {
    id: 5,
    title: 'جمل المدود الشاملة (ص 76)',
    unit: 'المد وحروفه',
    text: 'إِيمَانُنَا عَظِيمٌ وَ خَيْرُ بَلَدِنَا وَفِيرٌ — نَزُورُ جَارَنَا وَ نُكْرِمُ ضُيُوفَنَا — يَا سَالِم : أَطِعْ أَبَاكَ وَاحْتَرِمْ أَخَاكَ — نَخِيلُنَا شَجَرُهُ طَوِيلٌ وَرُطَبُهُ لَذِيذٌ — نَعُودُ مَرِيضَنَا وَ نَدْعُو صَدِيقَنَا.',
    wordsCount: 25
  },
  {
    id: 6,
    title: 'نص التميز القرائي الكامل',
    unit: 'نص شامل',
    text: 'ذَهَبَ أَحْمَدُ إِلَى الْمَدْرَسَةِ فَرِحاً، وَقَرَأَ قِصَّةً جَمِيلَةً عَنْ طُيُورِ الْحَقْلِ وَأَشْجَارِ الرُّمَّانِ، ثُمَّ كَتَبَ دَرْسَهُ بِخَطٍّ جَمِيلٍ وَشَكَرَ مُعَلِّمَهُ الْمُخْلِصَ.',
    wordsCount: 22
  }
];

export const SpeedReadingTrainer: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<ReadingStory>(READING_STORIES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [finishedResult, setFinishedResult] = useState<{ time: number; wpm: number; rating: string } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setFinishedResult(null);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (seconds > 0) {
      const minutes = seconds / 60;
      const wpm = Math.round(selectedStory.wordsCount / minutes);
      let rating = 'ممتاز جداً 🌟';
      if (wpm < 25) rating = 'مبتدئ — يحتاج تكرار التدريب 🌱';
      else if (wpm < 45) rating = 'جيد — تقدم ملحوظ 👍';
      else if (wpm < 70) rating = 'رائع — طلاقة عالية 🎯';

      setFinishedResult({
        time: seconds,
        wpm,
        rating
      });

      try {
        confetti({ particleCount: 30, spread: 60 });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setFinishedResult(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-800 to-slate-900 text-white rounded-3xl p-6 shadow-md border-2 border-amber-400/40">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
              ⏱️
            </div>
            <div>
              <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                الطلاقة والسرعة القرائية
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-cairo text-white">
                عداد قياس سرعة وطلاقة القراءة الجهرية
              </h2>
            </div>
          </div>

          <div className="font-mono text-2xl font-black bg-slate-950 px-4 py-1.5 rounded-2xl text-amber-400 border border-amber-500/30">
            {formatTime(seconds)}
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          تؤكد المذكرة على ضرورة حث الطالب على السرعة في قراءة المقاطع والجمل لتثبيت الطلاقة ومنع التهجي البطيء المنفصل.
        </p>
      </div>

      {/* Story Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-amber-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-600 block">اختر قائمة الجمل للتدريب:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {READING_STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                handleReset();
              }}
              className={`p-3 rounded-xl border text-right font-cairo transition text-xs flex flex-col justify-between ${
                selectedStory.id === story.id
                  ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-amber-400 bg-slate-50/50 text-slate-700'
              }`}
            >
              <span className="font-bold">{story.title}</span>
              <span className="text-[10px] text-slate-400 mt-1">{story.wordsCount} كلمة تقريباً</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reading Text Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-cairo border-b border-slate-100 pb-3">
          <span className="font-bold text-slate-700">{selectedStory.title}</span>
          <button
            onClick={() => playArabicAudio(selectedStory.text)}
            className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold flex items-center gap-1 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>نطق النص بالذكاء الصوتي</span>
          </button>
        </div>

        {/* Text Area */}
        <div className="bg-[#FCFAF7] border-2 border-dashed border-amber-300/80 rounded-2xl p-6 text-center">
          <p className="text-xl sm:text-2xl font-bold font-cairo text-slate-800 leading-loose">
            {selectedStory.text}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-cairo rounded-xl text-base transition shadow-md flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ القراءة الآن</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold font-cairo rounded-xl text-base transition shadow-md flex items-center gap-2 animate-pulse"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>إنهاء وحساب السرعة</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-cairo rounded-xl text-sm transition border border-slate-300 flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة</span>
          </button>
        </div>

        {/* Finished Result Diagnostic */}
        {finishedResult && (
          <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 font-cairo space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>نتيجة فحص سرعة القراءة الجهرية:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-xs text-slate-300 block">الوقت المستغرق:</span>
                <span className="text-xl font-bold text-white mt-1 block">{finishedResult.time} ثانية</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-xs text-slate-300 block">معدل السرعة (كلمة/دقيقة):</span>
                <span className="text-xl font-bold text-amber-300 mt-1 block">{finishedResult.wpm} ك/د</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-xs text-slate-300 block">مستوى الطلاقة:</span>
                <span className="text-sm font-bold text-emerald-300 mt-1 block">{finishedResult.rating}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
