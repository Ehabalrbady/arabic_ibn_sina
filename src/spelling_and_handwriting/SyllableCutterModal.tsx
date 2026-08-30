import React, { useState, useEffect } from 'react';
import { Volume2, X, Sparkles, CheckCircle2, RotateCcw, Puzzle, MoveRight, Trophy, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playArabicAudio } from '../speech_and_multimedia/audio';
import { sfx } from '../speech_and_multimedia/soundEffects';
import { VisualRewardModal } from '../phonological_awareness/VisualRewardModal';
import { FloatingRewardBadge, FloatingRewardItem } from '../phonological_awareness/FloatingRewardBadge';

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
  const [activeSyllable, setActiveSyllable] = useState<number | null>(null);
  
  // Interactive Syllable Puzzle State
  const [isPuzzleMode, setIsPuzzleMode] = useState<boolean>(true);
  const [shuffledSyllables, setShuffledSyllables] = useState<{ id: string; syl: string }[]>([]);
  const [assembledSyllables, setAssembledSyllables] = useState<{ id: string; syl: string }[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [floatingReward, setFloatingReward] = useState<FloatingRewardItem | null>(null);

  // Initialize or Reset Puzzle
  const initPuzzle = () => {
    const pieces = syllables.map((syl, index) => ({ id: `${index}-${syl}`, syl }));
    // Shuffle pieces randomly
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    setShuffledSyllables(shuffled);
    setAssembledSyllables([]);
    setPuzzleSolved(false);
    setShowRewardModal(false);
    setFloatingReward(null);
  };

  useEffect(() => {
    initPuzzle();
  }, [word, syllables]);

  const handlePlaySyllable = (syl: string, idx: number) => {
    setActiveSyllable(idx);
    sfx.playPop(520, 0.08);
    playArabicAudio(syl);
  };

  // Add piece to assembled slot
  const handleSelectPiece = (piece: { id: string; syl: string }) => {
    if (puzzleSolved) return;
    
    sfx.playPop(640, 0.08);
    playArabicAudio(piece.syl);
    const newAssembled = [...assembledSyllables, piece];
    const newShuffled = shuffledSyllables.filter(p => p.id !== piece.id);
    
    setAssembledSyllables(newAssembled);
    setShuffledSyllables(newShuffled);

    // Check if fully assembled
    if (newAssembled.length === syllables.length) {
      const assembledText = newAssembled.map(p => p.syl).join('');
      const originalJoined = syllables.join('');
      
      if (assembledText === originalJoined) {
        setPuzzleSolved(true);
        sfx.playCorrectChime();

        // Show floating reward
        setFloatingReward({
          id: `syl-${Date.now()}`,
          text: 'بطل! تركيب مقطعي صحيح ١٠٠٪ 🧩 (+1⭐)',
          emoji: '🧩',
          type: 'syllable'
        });

        setTimeout(() => {
          setFloatingReward(null);
        }, 1800);

        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        setTimeout(() => {
          playArabicAudio(word);
        }, 300);

        // Open grand reward celebration after a brief pleasant pause
        setTimeout(() => {
          setShowRewardModal(true);
        }, 900);
      } else {
        sfx.playPop(340, 0.12);
      }
    }
  };

  // Remove piece from assembled slot back to bank
  const handleRemovePiece = (piece: { id: string; syl: string }) => {
    if (puzzleSolved) return;
    sfx.playPop(440, 0.06);
    setAssembledSyllables(assembledSyllables.filter(p => p.id !== piece.id));
    setShuffledSyllables([...shuffledSyllables, piece]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-emerald-300 font-cairo space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-black flex items-center gap-1.5">
              <span>🧩</span>
              <span>التحليل والتركيب المقطعي التفاعلي</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display & Mode Switch */}
        <div className="text-center space-y-2 py-3 bg-linear-to-b from-slate-50 to-emerald-50/30 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 font-bold">الكلمة المستهدفة:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setIsPuzzleMode(false)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  !isPuzzleMode ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                تفكيك صوتي
              </button>
              <button
                onClick={() => setIsPuzzleMode(true)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  isPuzzleMode ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                تفكيك وتركيب 🧩
              </button>
            </div>
          </div>

          <div className="text-4xl font-black text-slate-900 font-amiri tracking-wide py-1">
            {word}
          </div>

          <button
            onClick={() => playArabicAudio(word)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>استمع للكلمة كاملة</span>
          </button>
        </div>

        {/* Mode 1: Interactive Syllable Puzzle */}
        {isPuzzleMode ? (
          <div className="space-y-4 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-slate-800 flex items-center gap-1">
                <Puzzle className="w-3.5 h-3.5 text-amber-600" />
                <span>ركّب المقاطع الصوتية بالترتيب الصحيح:</span>
              </span>
              <button
                onClick={initPuzzle}
                className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-amber-300 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة البدء</span>
              </button>
            </div>

            {/* Target Assembly Slots */}
            <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-amber-300 min-h-[70px] flex items-center justify-center gap-2 flex-wrap">
              {assembledSyllables.length === 0 ? (
                <span className="text-xs text-slate-400 font-bold">
                  اضغط على المقاطع بالأسفل لتركيب الكلمة هنا ⬇️
                </span>
              ) : (
                assembledSyllables.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => handleRemovePiece(piece)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-rose-600 text-white rounded-xl font-black font-amiri text-2xl shadow-xs transition group cursor-pointer"
                    title="اضغط للإعادة"
                  >
                    <span>{piece.syl}</span>
                    <span className="text-[9px] block font-sans font-normal opacity-80 group-hover:hidden">مقطع {idx + 1}</span>
                    <span className="text-[9px] hidden font-sans font-normal group-hover:block">إلغاء ✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Puzzle Solved Celebration or Bank */}
            {puzzleSolved ? (
              <div className="bg-emerald-100 border-2 border-emerald-500 rounded-2xl p-4 text-center text-emerald-950 font-black text-sm space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>أحسنت صنعاً! ركّبت الكلمة بالشكل الصحيح 🎉</span>
                </div>
                <div className="text-2xl font-amiri font-black text-emerald-950 bg-white/70 py-1.5 px-4 rounded-xl border border-emerald-300 inline-block">
                  {assembledSyllables.map(p => p.syl).join(' ')} = {word}
                </div>
                <div>
                  <button
                    onClick={() => setShowRewardModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition transform hover:scale-105 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-amber-950" />
                    <span>عرض وسام التكريم والنجوم ⭐</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Shuffled Pieces Pool */
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 font-bold block">
                  المقاطع المتاحة (اضغط عليها بالترتيب القرائي):
                </span>
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  {shuffledSyllables.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => handleSelectPiece(piece)}
                      className="px-4 py-2 rounded-xl bg-white border-2 border-amber-400 hover:border-emerald-600 hover:bg-emerald-50 text-slate-900 font-black font-amiri text-2xl shadow-xs hover:scale-105 transition cursor-pointer"
                    >
                      {piece.syl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mode 2: Standard Syllables Breakdown */
          <div className="space-y-3">
            <span className="text-xs text-slate-700 font-bold block">
              اضغط على المقطع الصوتي لسماع نطقه المنفرد:
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {syllables.map((syl, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePlaySyllable(syl, idx)}
                  className={`p-4 rounded-2xl border-2 transition flex flex-col items-center justify-center min-w-[70px] cursor-pointer ${
                    activeSyllable === idx
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 scale-105 shadow-md'
                      : 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 text-slate-900 shadow-xs'
                  }`}
                >
                  <span className="text-2xl font-black font-amiri mb-1">{syl}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5 font-bold">
                    <Volume2 className="w-3 h-3 text-emerald-700" />
                    <span>مقطع {idx + 1}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explanation Rule if present */}
        {explanation && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 leading-relaxed flex items-start gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{explanation}</span>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl text-sm transition shadow-xs cursor-pointer"
        >
          إغلاق ومتابعة الدرس
        </button>
      </div>

      {/* Floating Micro-Reward Notification */}
      <FloatingRewardBadge reward={floatingReward} />

      {/* Grand Visual Rewards Celebration Modal */}
      <VisualRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onRetry={initPuzzle}
        category="syllables"
        title={`🎉 إتقان باهر في تقطيع وتركيب كلمة (${word})!`}
        subtitle="أداء صوتي وتحليلي رائع للمقاطع الصوتية"
        score={syllables.length}
        total={syllables.length}
        badgeName="وسام عبقري التحليل المقطعي 🧩"
      />
    </div>
  );
};
