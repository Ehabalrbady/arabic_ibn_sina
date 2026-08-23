import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Printer, 
  Volume2, 
  Award, 
  Layers, 
  PenTool, 
  Clock, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Upload,
  Sliders,
  Headphones
} from 'lucide-react';
import { ALL_BOOK_PAGES } from '../data/bookData';
import { BookPage } from '../types/book';
import { IbnSinaLogo } from './IbnSinaLogo';
import { SchoolBranding } from '../utils/schoolBranding';

interface HeaderProps {
  activeTab: 'pages' | 'units' | 'dictation' | 'speed' | 'sukoon_test' | 'minimal_pairs' | 'diagnostic_matrix' | 'evaluation' | 'toc' | 'print_book';
  setActiveTab: (tab: 'pages' | 'units' | 'dictation' | 'speed' | 'sukoon_test' | 'minimal_pairs' | 'diagnostic_matrix' | 'evaluation' | 'toc' | 'print_book') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onOpenSearch: () => void;
  onOpenPrintCenter: () => void;
  onOpenLogoModal: () => void;
  studentName: string;
  setStudentName: (name: string) => void;
  masteryPercentage: number;
  branding: SchoolBranding;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  onOpenSearch,
  onOpenPrintCenter,
  onOpenLogoModal,
  studentName,
  setStudentName,
  masteryPercentage,
  branding
}) => {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <header className="bg-white border-b border-amber-200/70 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-cairo shadow-inner flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-emerald-100 font-bold px-2 py-0.5 rounded text-[11px] border border-white/20 flex items-center gap-1">
            <span>🇾🇪</span>
            <span>{branding.countryName || 'الجمهورية اليمنية'}</span>
          </span>
          <span className="bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[11px]">
            {branding.schoolName || 'مدارس ابن سيناء'}
          </span>
          <span className="hidden md:inline font-bold text-emerald-100">
            {branding.departmentName} — {branding.programName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onOpenLogoModal}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1 rounded-full shadow-xs transition cursor-pointer"
            title="تعديل بيانات المدرسة، الطالب، الإدارة، والشعار"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-950" />
            <span>بيانات المدرسة والبلد</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
            <span>نسبة الإتقان:</span>
            <span className="font-bold text-amber-300">{masteryPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Book Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div 
                onClick={onOpenLogoModal}
                className="cursor-pointer group relative"
                title="اضغط لرفع أو تخصيص شعار المدرسة"
              >
                <IbnSinaLogo 
                  size="md" 
                  showText={false} 
                  customLogoUrl={branding.logoUrl} 
                  schoolName={branding.schoolName}
                />
                <span className="absolute -bottom-1 -left-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition text-[9px] font-black">
                  ✎
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black font-cairo text-slate-900 leading-tight">
                    {branding.schoolName}
                  </h1>
                  <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                    ١٢١ صفحة
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="text-emerald-800 font-bold">{branding.departmentName}</span>
                  <span>•</span>
                  <span>الطالب:</span>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      autoFocus
                      className="border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-slate-800 font-bold bg-white"
                    />
                  ) : (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="font-bold text-emerald-800 hover:underline flex items-center gap-1"
                      title="اضغط لتغيير اسم الطالب"
                    >
                      <span>{studentName || 'طالب متميز'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">✎</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Page Step controls on Mobile */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-cairo px-1">
                ص {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(121, currentPage + 1))}
                disabled={currentPage >= 121}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
              title="البحث في كلمات ودروس الكتاب"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>بحث في الكتاب</span>
            </button>

            {/* Page Jump Selector */}
            <div className="hidden md:flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl text-xs">
              <span className="text-slate-600 font-medium">الصفحة:</span>
              <select
                value={currentPage}
                onChange={(e) => {
                  setCurrentPage(Number(e.target.value));
                  if (activeTab !== 'pages') setActiveTab('pages');
                }}
                className="bg-white border border-amber-300 rounded px-2 py-0.5 text-xs font-bold text-slate-800 outline-hidden"
              >
                {ALL_BOOK_PAGES.map((p) => (
                  <option key={p.pageNumber} value={p.pageNumber}>
                    ص {p.pageNumber}: {p.title.length > 28 ? p.title.substring(0, 28) + '...' : p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Logo Settings Button */}
            <button
              onClick={onOpenLogoModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition border border-emerald-300"
              title="تخصيص الشعار والبيانات"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">شعار المدرسة</span>
            </button>

            {/* Print Center Button */}
            <button
              onClick={onOpenPrintCenter}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition border border-amber-300 shadow-xs hover:scale-105"
              title="مركز طباعة المنهج وأوراق العمل والتدريبات"
            >
              <Printer className="w-4 h-4 text-amber-800" />
              <span>طباعة المنهج</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 border-t border-slate-100 pt-2 text-xs sm:text-sm font-cairo">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'pages'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 مستعرض الصفحات (ص {currentPage})</span>
          </button>

          <button
            onClick={() => setActiveTab('toc')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'toc'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📑 الفهرس والوحدات</span>
          </button>

          <button
            onClick={() => setActiveTab('dictation')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'dictation'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>🎧 معمل الإملاء السمعي</span>
          </button>

          <button
            onClick={() => setActiveTab('speed')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'speed'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>⏱️ اختبار طلاقة وسرعة القراءة</span>
          </button>

          <button
            onClick={() => setActiveTab('minimal_pairs')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'minimal_pairs'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Headphones className="w-4 h-4 text-emerald-600" />
            <span>🎧 مختبر التمييز السمعي والمدود</span>
          </button>

          <button
            onClick={() => setActiveTab('sukoon_test')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'sukoon_test'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>✨ أداة اختبار السكون (التاء والهاء)</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostic_matrix')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'diagnostic_matrix'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>📈 بطاقة الرصد الأسبوعي (EGR)</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'evaluation'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>📊 سجل القياس (المحاولات الـ 4)</span>
          </button>

          <button
            onClick={() => setActiveTab('print_book')}
            className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition flex items-center gap-1.5 shadow-2xs ${
              activeTab === 'print_book'
                ? 'bg-emerald-950 text-amber-300 ring-2 ring-amber-400'
                : 'bg-amber-200/80 hover:bg-amber-300 text-amber-950 border border-amber-400'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-900" />
            <span>🖨️ منهج الكتاب الكامل للطباعة (A4)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
