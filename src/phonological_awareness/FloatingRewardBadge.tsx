import React from 'react';
import { Sparkles, Star, Check } from 'lucide-react';

export interface FloatingRewardItem {
  id: string;
  text: string;
  emoji?: string;
  type?: 'solar' | 'lunar' | 'syllable' | 'star' | 'general';
}

interface FloatingRewardBadgeProps {
  reward: FloatingRewardItem | null;
}

export const FloatingRewardBadge: React.FC<FloatingRewardBadgeProps> = ({ reward }) => {
  if (!reward) return null;

  let bgClass = 'bg-linear-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300';
  if (reward.type === 'solar') {
    bgClass = 'bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-amber-500/20';
  } else if (reward.type === 'lunar') {
    bgClass = 'bg-linear-to-r from-sky-500 to-blue-600 text-white border-sky-300 shadow-sky-500/20';
  } else if (reward.type === 'syllable') {
    bgClass = 'bg-linear-to-r from-emerald-600 to-teal-600 text-white border-emerald-300 shadow-emerald-500/20';
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`px-4 py-2 rounded-2xl border-2 shadow-lg flex items-center gap-2 font-black text-sm font-cairo ${bgClass}`}>
        <span className="text-base">{reward.emoji || '⭐'}</span>
        <span>{reward.text}</span>
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>
    </div>
  );
};
