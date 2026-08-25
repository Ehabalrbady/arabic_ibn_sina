import React from 'react';

interface IbnSinaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'print';
  showText?: boolean;
  customLogoUrl?: string | null;
  schoolName?: string;
  departmentName?: string;
}

export const IbnSinaLogo: React.FC<IbnSinaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  customLogoUrl = null,
  schoolName = 'مَدَارِسُ ابْنِ سِينَاء',
  departmentName = 'إدارة الجودة والتطوير • التميز اللغوي'
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-xs', subtext: 'text-[9px]' },
    md: { icon: 'w-11 h-11', text: 'text-sm', subtext: 'text-[10px]' },
    lg: { icon: 'w-16 h-16', text: 'text-lg', subtext: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-2xl', subtext: 'text-sm' },
    print: { icon: 'w-16 h-16', text: 'text-base', subtext: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`} id="ibn-sina-school-logo">
      {/* Emblem Graphic: Custom Uploaded or Default Official Vector */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center`}>
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt={schoolName}
            className="w-full h-full object-contain drop-shadow-sm rounded-xl"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg 
            viewBox="0 0 120 120" 
            className="w-full h-full drop-shadow-md"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Golden/Emerald Ring */}
            <circle cx="60" cy="60" r="56" fill="url(#ibnSinaGold)" stroke="#065F46" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="50" fill="#064E3B" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 1.5" />
            
            {/* Inner Deep Emerald Gradient Background */}
            <circle cx="60" cy="60" r="46" fill="url(#emeraldDeep)" />
            
            {/* Sun Rays / Radiance */}
            <g opacity="0.35">
              <line x1="60" y1="18" x2="60" y2="28" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="60" y1="92" x2="60" y2="102" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="60" x2="28" y2="60" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="92" y1="60" x2="102" y2="60" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="30" x2="38" y2="38" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="82" y1="82" x2="90" y2="90" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="90" x2="38" y2="82" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="90" y1="30" x2="82" y2="38" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Open Book of Wisdom & Knowledge */}
            <path 
              d="M60 68 C 50 63, 34 65, 26 73 L 26 50 C 34 43, 50 42, 60 48 Z" 
              fill="#FEF3C7" 
              stroke="#D97706" 
              strokeWidth="1.2"
            />
            <path 
              d="M60 68 C 70 63, 86 65, 94 73 L 94 50 C 86 43, 70 42, 60 48 Z" 
              fill="#FEF3C7" 
              stroke="#D97706" 
              strokeWidth="1.2"
            />
            {/* Book Spine Center Line */}
            <path d="M60 48 L60 76" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />

            {/* Torch of Knowledge / Quill */}
            <path 
              d="M60 26 L63 38 L57 38 Z" 
              fill="#F59E0B" 
              stroke="#FEF3C7" 
              strokeWidth="0.8"
            />
            <circle cx="60" cy="24" r="3.5" fill="#EF4444" />
            <circle cx="60" cy="24" r="1.5" fill="#FBBF24" />

            {/* Laurel Wreath on Left and Right */}
            <path 
              d="M32 78 C 30 65, 34 50, 42 42" 
              stroke="#F59E0B" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />
            <path 
              d="M88 78 C 90 65, 86 50, 78 42" 
              stroke="#F59E0B" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* 3 Golden Stars */}
            <polygon points="60,82 61.5,86 66,86 62.5,88.5 64,93 60,90 56,93 57.5,88.5 54,86 58.5,86" fill="#FBBF24" />
            <polygon points="46,84 47,87 50,87 47.5,89 48.5,92 46,90 43.5,92 44.5,89 42,87 45,87" fill="#FBBF24" />
            <polygon points="74,84 75,87 78,87 75.5,89 76.5,92 74,90 71.5,92 72.5,89 70,87 73,87" fill="#FBBF24" />

            {/* Gradients */}
            <defs>
              <linearGradient id="ibnSinaGold" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FEF3C7" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="emeraldDeep" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#064E3B" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#022C22" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-right font-cairo">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-emerald-950 ${currentSize.text} leading-tight tracking-tight`}>
              {schoolName}
            </span>
          </div>
          <span className={`text-amber-800 font-bold ${currentSize.subtext} leading-tight`}>
            {departmentName}
          </span>
        </div>
      )}
    </div>
  );
};
