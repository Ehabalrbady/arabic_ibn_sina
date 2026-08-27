import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Eye, Type, Sliders, X, RefreshCw } from 'lucide-react';

interface AccessibilityControlsProps {
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  textScale: number;
  setTextScale: (val: number) => void;
  spaciousSpacing: boolean;
  setSpaciousSpacing: (val: boolean) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  isHighContrast,
  setIsHighContrast,
  textScale,
  setTextScale,
  spaciousSpacing,
  setSpaciousSpacing
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedContrast = localStorage.getItem('ibn_sinai_access_contrast');
      if (savedContrast === 'true') setIsHighContrast(true);

      const savedScale = localStorage.getItem('ibn_sinai_access_scale');
      if (savedScale) setTextScale(parseFloat(savedScale));

      const savedSpacing = localStorage.getItem('ibn_sinai_access_spacing');
      if (savedSpacing === 'true') setSpaciousSpacing(true);
    } catch (e) {}
  }, [setIsHighContrast, setTextScale, setSpaciousSpacing]);

  // Persist settings
  const toggleContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    localStorage.setItem('ibn_sinai_access_contrast', String(next));
  };

  const changeScale = (val: number) => {
    setTextScale(val);
    localStorage.setItem('ibn_sinai_access_scale', String(val));
  };

  const toggleSpacing = () => {
    const next = !spaciousSpacing;
    setSpaciousSpacing(next);
    localStorage.setItem('ibn_sinai_access_spacing', String(next));
  };

  const handleReset = () => {
    setIsHighContrast(false);
    setTextScale(1.0);
    setSpaciousSpacing(false);
    localStorage.setItem('ibn_sinai_access_contrast', 'false');
    localStorage.setItem('ibn_sinai_access_scale', '1.0');
    localStorage.setItem('ibn_sinai_access_spacing', 'false');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 font-cairo no-print">
      {/* Trigger Button */}
      {!isOpen ? (
        <button
          id="accessibility-trigger-btn"
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-xl border-2 border-amber-400 transition hover:scale-105"
          title="خيارات إمكانية الوصول وتيسير القراءة للطلاب"
        >
          <Eye className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 rounded-full w-4 h-4 text-[9px] font-black flex items-center justify-center animate-bounce">
            ⚙️
          </span>
        </button>
      ) : (
        /* Floating Console Box */
        <div 
          id="accessibility-console"
          className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-4 sm:p-5 w-72 sm:w-80 space-y-4 animate-in slide-in-from-bottom duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-right">
              <span className="text-lg">👁️</span>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-none">تيسير القراءة وسهولة الرؤية</h4>
                <span className="text-[10px] text-slate-500 font-bold">مخصص للطلاب ذوي الصعوبات البصرية</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 text-right text-xs">
            {/* Toggle 1: High Contrast */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <button
                onClick={toggleContrast}
                className={`w-11 h-6 rounded-full transition-colors relative outline-hidden ${
                  isHighContrast ? 'bg-emerald-800' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-xs ${
                    isHighContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-950 block">نمط العرض المريح عالي التباين</span>
                <span className="text-[10px] text-slate-500 block">تبديل الألوان لأسود عالي التباين مسهل للرؤية</span>
              </div>
            </div>

            {/* Toggle 2: Spacious Letter Spacing */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <button
                onClick={toggleSpacing}
                className={`w-11 h-6 rounded-full transition-colors relative outline-hidden ${
                  spaciousSpacing ? 'bg-emerald-800' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-xs ${
                    spaciousSpacing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-950 block">فاصل الحركات التباعدي</span>
                <span className="text-[10px] text-slate-500 block">زيادة التباعد والارتفاع للتمييز الفوري للحركات</span>
              </div>
            </div>

            {/* Toggle 3: Text Scale Slider */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                  {textScale === 1.0 ? 'حجم عادي' : textScale === 1.15 ? 'حجم كبير' : 'حجم ضخم جداً'}
                </span>
                <span className="font-extrabold text-slate-950">تكبير خط ونصوص الدرس:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeScale(1.0)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold border transition ${
                    textScale === 1.0 
                      ? 'bg-emerald-800 text-white border-emerald-800' 
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  صغير (طبيعي)
                </button>
                <button
                  onClick={() => changeScale(1.15)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold border transition ${
                    textScale === 1.15 
                      ? 'bg-emerald-800 text-white border-emerald-800' 
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  كبير (1.15x)
                </button>
                <button
                  onClick={() => changeScale(1.3)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold border transition ${
                    textScale === 1.3 
                      ? 'bg-emerald-800 text-white border-emerald-800' 
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  ضخم (1.3x)
                </button>
              </div>
            </div>

            {/* Reset Controls */}
            <button
              onClick={handleReset}
              className="w-full py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 rounded-xl transition font-black text-center text-[10px] flex items-center justify-center gap-1 border border-slate-200"
            >
              <RefreshCw className="w-3 h-3" />
              <span>إعادة تهيئة الإعدادات للوضع الافتراضي</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
