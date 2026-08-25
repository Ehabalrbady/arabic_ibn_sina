import React from 'react';
import { Volume2, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { playArabicAudio } from '../speech_and_multimedia/audio';

interface SyllableCutterModalProps {
  word: string;
  syllables: string[];
  explanation?: string;
  onClose: () => void;
}

export const SyllableCutterModal: React.FC<SyllableCutterModalProps> = ({
  word,
  syllables,
  explanation,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-400 font-cairo space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 text-sm font-bold">
              ✂️ التحليل الصوتي للمقاطع
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display */}
        <div className="text-center space-y-2 py-2">
          <span className="text-xs text-slate-400 font-bold block">الكلمة كاملة:</span>
          <div className="text-4xl font-black text-slate-900 tracking-wide">
            {word}
          </div>
          <button
            onClick={() => playArabicAudio(word)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition mt-2 shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>نطق الكلمة كاملة</span>
          </button>
        </div>

        {/* Syllables Breakdown Cards */}
        <div className="space-y-2">
          <span className="text-xs text-slate-500 font-bold block text-center">
            المقاطع الصوتية المفككة (اضغط أي مقطع للاستماع):
          </span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {syllables.map((syl, idx) => (
              <button
                key={idx}
                onClick={() => playArabicAudio(syl)}
                className="p-4 rounded-2xl bg-linear-to-b from-emerald-50 to-teal-50 border-2 border-emerald-300 hover:border-emerald-500 hover:scale-105 transition text-center min-w-[70px] shadow-xs group"
              >
                <span className="text-2xl font-black text-emerald-950 block">{syl}</span>
                <span className="text-[10px] text-emerald-700 block mt-1">مقطع {idx + 1} 🔊</span>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Rule */}
        {explanation && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{explanation}</span>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-sm"
        >
          تم، فهمت التقطيع الصوتي
        </button>
      </div>
    </div>
  );
};
