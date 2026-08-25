import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Layers, 
  Volume2, 
  Bell, 
  Flame, 
  Sun, 
  CheckCircle2, 
  Award,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BOOK_UNITS, ALL_BOOK_PAGES } from './bookData';
import { UnitId } from './types';

interface TOCProps {
  onSelectPage: (pageNumber: number) => void;
}

export const BookTableOfContents: React.FC<TOCProps> = ({ onSelectPage }) => {
  const [expandedUnit, setExpandedUnit] = useState<UnitId | null>('letters');

  const getUnitIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Volume2': return <Volume2 className="w-5 h-5" />;
      case 'Bell': return <Bell className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-cairo">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-amber-400/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
            📑
          </div>
          <div>
            <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full">
              فهرس المنهج الكامل
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              الفهرس التفصيلي لجميع الوحدات والصفحات (١ - ١٢١)
            </h2>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          انقر على أي وحدة لاستعراض كافة صفحاتها وتدريباتها، أو اضغط مباشرة على رقم الصفحة للانتقال الفوري لها.
        </p>
      </div>

      {/* Units Accordion Grid */}
      <div className="space-y-4">
        {BOOK_UNITS.map((unit) => {
          const unitPages = ALL_BOOK_PAGES.filter(p => p.unitId === unit.id);
          const isExpanded = expandedUnit === unit.id;

          return (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border-2 border-amber-200/80 shadow-xs overflow-hidden transition"
            >
              {/* Unit Header Bar */}
              <button
                onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-right bg-slate-50/60 hover:bg-amber-50/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                    {getUnitIcon(unit.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-800">
                        الوحدة {unit.number}
                      </span>
                      <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full font-bold">
                        ص {unit.startPage} - ص {unit.endPage}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      {unit.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                    {unitPages.length} صفحة
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-800" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Unit Description & Pages List */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-white space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                    💡 <strong>هدف الوحدة:</strong> {unit.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {unitPages.map((page) => (
                      <button
                        key={page.pageNumber}
                        onClick={() => onSelectPage(page.pageNumber)}
                        className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-right transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition">
                            {page.pageNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {page.title}
                          </span>
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
