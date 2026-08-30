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
  Headphones,
  Heart,
  Settings,
  Share2,
  Lock,
  Unlock,
  Check,
  Smartphone,
  QrCode
} from 'lucide-react';
import { ALL_BOOK_PAGES } from '../curriculum/bookData';
import { BookPage } from '../curriculum/types';
import { IbnSinaLogo } from '../institutional_branding/IbnSinaLogo';
import { SchoolBranding, generateStudentShareableLink } from '../institutional_branding/schoolBranding';

interface HeaderProps {
  activeTab: 'pages' | 'student_hub' | 'units' | 'dictation' | 'speed' | 'sukoon_test' | 'minimal_pairs' | 'diagnostic_matrix' | 'evaluation' | 'toc' | 'print_book' | 'parents_portal' | 'curriculum_editor';
  setActiveTab: (tab: 'pages' | 'student_hub' | 'units' | 'dictation' | 'speed' | 'sukoon_test' | 'minimal_pairs' | 'diagnostic_matrix' | 'evaluation' | 'toc' | 'print_book' | 'parents_portal' | 'curriculum_editor') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onOpenSearch: () => void;
  onOpenPrintCenter: () => void;
  onOpenLogoModal: () => void;
  onOpenAndroidModal?: () => void;
  studentName: string;
  setStudentName: (name: string) => void;
  masteryPercentage: number;
  branding: SchoolBranding;
  isStudentMode?: boolean;
  setIsStudentMode?: (val: boolean) => void;
  studentGrade?: string;
  studentClass?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  onOpenSearch,
  onOpenPrintCenter,
  onOpenLogoModal,
  onOpenAndroidModal,
  studentName,
  setStudentName,
  masteryPercentage,
  branding,
  isStudentMode = false,
  setIsStudentMode,
  studentGrade = '',
  studentClass = ''
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTeacherPassModal, setShowTeacherPassModal] = useState(false);
  const [teacherPin, setTeacherPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleCopyStudentLink = () => {
    const link = generateStudentShareableLink(branding, studentName, studentGrade, studentClass, 'student_hub');
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleUnlockTeacherMode = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPin = localStorage.getItem('ibn_sinai_teacher_pin') || '1234';
    if (teacherPin === savedPin || teacherPin === '1234') {
      if (setIsStudentMode) setIsStudentMode(false);
      setShowTeacherPassModal(false);
      setTeacherPin('');
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  return (
    <header className="bg-white border-b border-amber-200/70 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-cairo shadow-inner flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
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
          {isStudentMode ? (
            /* Student Mode top actions */
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 text-[11px]">
                🌟 وضع الطالب المباشر
              </span>
              {onOpenAndroidModal && (
                <button
                  onClick={onOpenAndroidModal}
                  className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[11px] transition shadow-xs cursor-pointer"
                  title="تثبيت التطبيق على هاتف الأندرويد"
                >
                  <Smartphone className="w-3 h-3 text-slate-950" />
                  <span>تثبيت كـ تطبيق 📲</span>
                </button>
              )}
              {setIsStudentMode && (
                <button
                  onClick={() => setShowTeacherPassModal(true)}
                  className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-emerald-100 px-2.5 py-0.5 rounded-full border border-white/20 text-[11px] font-bold transition cursor-pointer"
                  title="التبديل إلى لوحة تحكم المعلم والإدارة"
                >
                  <Lock className="w-3 h-3 text-amber-300" />
                  <span>دخول المعلم</span>
                </button>
              )}
            </div>
          ) : (
            /* Teacher / Admin Mode top actions */
            <>
              {onOpenAndroidModal && (
                <button
                  onClick={onOpenAndroidModal}
                  className="flex items-center gap-1.5 bg-linear-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-3 py-1 rounded-full shadow-xs transition cursor-pointer border border-amber-300"
                  title="تجهيز تطبيق أندرويد ورمز QR للمدرسة"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-950" />
                  <span>تطبيق أندرويد و QR 📲</span>
                </button>
              )}

              <button
                onClick={handleCopyStudentLink}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs transition shadow-xs cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                    : 'bg-white/15 hover:bg-white/25 text-emerald-100 border border-white/20'
                }`}
                title="نسخ الرابط المخصص للطالب متضمناً شعار المدرسة وبياناتها"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم نسخ رابط الطالب!' : 'نشر رابط الطالب'}</span>
              </button>

              {setIsStudentMode && (
                <button
                  onClick={() => setIsStudentMode(true)}
                  className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-emerald-100 px-2.5 py-1 rounded-full border border-white/20 text-xs font-bold transition cursor-pointer"
                  title="معاينة الواجهة كما تظهر للطالب"
                >
                  <span>معاينة وضع الطالب 👦</span>
                </button>
              )}

              <button
                onClick={onOpenLogoModal}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-full shadow-xs transition cursor-pointer border border-emerald-500"
                title="تعديل بيانات المدرسة، الطالب، الإدارة، والشعار"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>بيانات المدرسة والشعار</span>
              </button>
            </>
          )}

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
                onClick={!isStudentMode ? onOpenLogoModal : undefined}
                className={`relative group ${!isStudentMode ? 'cursor-pointer' : ''}`}
                title={!isStudentMode ? "اضغط لتخصيص شعار وبيانات المدرسة" : branding.schoolName}
              >
                <IbnSinaLogo 
                  size="md" 
                  showText={false} 
                  customLogoUrl={branding.logoUrl} 
                  schoolName={branding.schoolName}
                />
                {!isStudentMode && (
                  <span className="absolute -bottom-1 -left-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition text-[9px] font-black">
                    ✎
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black font-cairo text-slate-900 leading-tight">
                    {branding.schoolName || 'مدارس ابن سيناء الأهلية'}
                  </h1>
                  <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                    ١٢١ صفحة
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="text-emerald-800 font-bold">{branding.departmentName}</span>
                  <span>•</span>
                  <span>الطالب:</span>
                  {isEditingName && !isStudentMode ? (
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
                      onClick={() => !isStudentMode && setIsEditingName(true)}
                      className={`font-bold text-emerald-800 flex items-center gap-1 ${!isStudentMode ? 'hover:underline cursor-pointer' : ''}`}
                      title={!isStudentMode ? "اضغط لتغيير اسم الطالب" : ""}
                    >
                      <span>{studentName || 'طالب متميز'}</span>
                      {!isStudentMode && <span className="text-[10px] text-slate-400 font-normal">✎</span>}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
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

            {!isStudentMode && (
              <>
                {/* Logo Settings Button */}
                <button
                  onClick={onOpenLogoModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition border border-emerald-300 cursor-pointer"
                  title="تخصيص الشعار والبيانات"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">شعار المدرسة</span>
                </button>

                {/* Print Center Button */}
                <button
                  onClick={onOpenPrintCenter}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition border border-amber-300 shadow-xs hover:scale-105 cursor-pointer"
                  title="مركز طباعة المنهج وأوراق العمل والتدريبات"
                >
                  <Printer className="w-4 h-4 text-amber-800" />
                  <span>طباعة المنهج</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        {isStudentMode ? (
          /* =========================================================================
             STUDENT MODE NAVIGATION: ONLY 2 BUTTONS AS REQUESTED
             1. مسار تعلم الطالب (Student Learning Path / Book Pages)
             2. بوابة الطالب (Student Hub)
             ========================================================================= */
          <nav className="flex items-center gap-3 mt-3 overflow-x-auto pb-1 border-t-2 border-amber-200 pt-2.5 text-sm font-cairo">
            
            {/* 1. مسار تعلم الطالب */}
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl font-black whitespace-nowrap transition flex items-center justify-center gap-2 border-2 shadow-xs transform hover:scale-[1.02] cursor-pointer text-sm sm:text-base ${
                activeTab === 'pages'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-400'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
              }`}
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>📖 مسار تعلم الطالب والدروس</span>
            </button>

            {/* 2. بوابة الطالب */}
            <button
              onClick={() => setActiveTab('student_hub')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl font-black whitespace-nowrap transition flex items-center justify-center gap-2 border-2 shadow-xs transform hover:scale-[1.02] cursor-pointer text-sm sm:text-base ${
                activeTab === 'student_hub'
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-400'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-800" />
              <span>⭐ بوابة الطالب والتفوق</span>
            </button>

          </nav>
        ) : (
          /* =========================================================================
             TEACHER / FULL CURRICULUM NAVIGATION
             ========================================================================= */
          <nav className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 border-t border-slate-100 pt-2 text-xs sm:text-sm font-cairo">
            <button
              onClick={() => setActiveTab('student_hub')}
              className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition flex items-center gap-1.5 border shadow-xs transform hover:scale-105 ${
                activeTab === 'student_hub'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400'
                  : 'bg-linear-to-r from-amber-100 via-amber-50 to-yellow-100 text-amber-950 border-amber-300 hover:bg-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>🚀 بوابة الطالب</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'pages'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-amber-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 مسار تعلم الطالب (ص {currentPage})</span>
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

            <button
              onClick={() => setActiveTab('parents_portal')}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
                activeTab === 'parents_portal'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
              }`}
            >
              <Heart className="w-4 h-4 fill-rose-100" />
              <span>👨‍👩‍👦 بوابة ولي الأمر الذكية</span>
            </button>

            <button
              onClick={() => setActiveTab('curriculum_editor')}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
                activeTab === 'curriculum_editor'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                  : 'text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>⚙️ محرر وإعداد المنهج</span>
            </button>
          </nav>
        )}
      </div>

      {/* Modal for Unlocking Teacher Mode from Student View */}
      {showTeacherPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-cairo">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-200 space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">الدخول إلى وضع المعلم والإدارة</h3>
              <p className="text-xs text-slate-500 mt-1">يرجى إدخال رمز المعلم لفتح كافة الأدوات ولوحات التقييم المنهجية (الرمز الافتراضي: 1234)</p>
            </div>

            <form onSubmit={handleUnlockTeacherMode} className="space-y-3">
              <input
                type="password"
                value={teacherPin}
                onChange={(e) => setTeacherPin(e.target.value)}
                placeholder="أدخل الرمز (مثال: 1234)"
                autoFocus
                className="w-full px-4 py-2.5 text-center text-lg font-black tracking-widest border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-hidden"
              />

              {pinError && (
                <p className="text-xs font-bold text-rose-600">الرمز غير صحيح، يرجى المحاولة مجدداً.</p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherPassModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition cursor-pointer shadow-xs"
                >
                  تأكيد الدخول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

