import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Trophy, 
  Star, 
  Zap, 
  Layers, 
  Volume2, 
  Flame, 
  Sun, 
  Moon, 
  PenTool, 
  Clock, 
  User, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft, 
  Puzzle, 
  Lock, 
  Unlock, 
  Printer, 
  HelpCircle,
  Smartphone,
  Tablet,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BOOK_UNITS } from '../curriculum/unitsInfo';
import { ALL_BOOK_PAGES } from '../curriculum/bookData';
import { BookPage, EvaluationSkill } from '../curriculum/types';
import { SchoolBranding, generateStudentShareableLink } from '../institutional_branding/schoolBranding';
import { sfx } from '../speech_and_multimedia/soundEffects';
import { playArabicAudio, unlockAllAudioContexts } from '../speech_and_multimedia/audio';

export interface StudentHubProps {
  skills: EvaluationSkill[];
  studentName: string;
  setStudentName: (name: string) => void;
  studentGrade: string;
  setStudentGrade: (grade: string) => void;
  studentClass: string;
  setStudentClass: (cls: string) => void;
  branding: SchoolBranding;
  onNavigateToPage: (pageNumber: number) => void;
  onNavigateToTab: (tab: 'pages' | 'dictation' | 'speed' | 'sukoon_test' | 'minimal_pairs' | 'parents_portal') => void;
  onOpenAndroidModal?: () => void;
  pages?: BookPage[];
}

const AVATARS = [
  { id: 'scholar', emoji: '🎓', label: 'العالم الصغير' },
  { id: 'trophy', emoji: '🏆', label: 'البطل المتميز' },
  { id: 'rocket', emoji: '🚀', label: 'المكتشف الذكي' },
  { id: 'star', emoji: '🌟', label: 'النجم المتألق' },
  { id: 'lion', emoji: '🦁', label: 'الأسد الشجاع' },
  { id: 'eagle', emoji: '🦅', label: 'الصقر الجسور' },
  { id: 'flower', emoji: '🌸', label: 'الزهرة المتألقة' },
  { id: 'crown', emoji: '👑', label: 'المبدع المتوج' },
];

export const StudentHub: React.FC<StudentHubProps> = ({
  skills,
  studentName,
  setStudentName,
  studentGrade,
  setStudentGrade,
  studentClass,
  setStudentClass,
  branding,
  onNavigateToPage,
  onNavigateToTab,
  onOpenAndroidModal,
  pages = ALL_BOOK_PAGES
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'labs' | 'trophies' | 'whatsapp'>('roadmap');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
    return localStorage.getItem('ibn_sinai_student_avatar') || '🎓';
  });
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [teacherWhatsappNumber, setTeacherWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('ibn_sinai_teacher_whatsapp') || '';
  });
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('letters');

  // Track completed pages stored in localStorage
  const [completedPages, setCompletedPages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`ibn_sinai_completed_pages_${studentName}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [1, 2, 3, 5, 6, 7, 10, 11, 17, 18, 50, 78, 92, 99]; // Default sample unlocked progress
  });

  // Calculate mastery statistics
  const masteredSkillsCount = skills.filter(s => s.attempts.some(a => a)).length;
  const masteryPercentage = Math.round((masteredSkillsCount / skills.length) * 100);
  const completedCount = completedPages.length;
  const totalPages = pages.length || 121;
  const progressPercent = Math.min(100, Math.round((completedCount / totalPages) * 100));

  // Save completed pages
  useEffect(() => {
    try {
      localStorage.setItem(`ibn_sinai_completed_pages_${studentName}`, JSON.stringify(completedPages));
    } catch (e) {}
  }, [completedPages, studentName]);

  const handleSelectAvatar = (emoji: string) => {
    sfx.playPop();
    setSelectedAvatar(emoji);
    try {
      localStorage.setItem('ibn_sinai_student_avatar', emoji);
    } catch (e) {}
  };

  const handleTogglePageCompletion = (pageNum: number) => {
    sfx.playPop();
    if (completedPages.includes(pageNum)) {
      setCompletedPages(completedPages.filter(p => p !== pageNum));
    } else {
      const updated = [...completedPages, pageNum];
      setCompletedPages(updated);
      sfx.playCorrectChime();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  // Generate direct share URL with embedded branding and student info
  const generateDirectStudentLink = () => {
    return generateStudentShareableLink(branding, studentName, studentGrade, studentClass, 'student_hub');
  };

  const directLink = generateDirectStudentLink();

  const handleCopyLink = () => {
    sfx.playPop();
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendWhatsappReport = () => {
    sfx.playPop();
    const cleanPhone = teacherWhatsappNumber.replace(/[^\d]/g, '');
    const schoolTitle = branding.schoolName || 'مدارس ابن سيناء الأهلية';
    const text = `السلام عليكم ورحمة الله وبركاته 🌹\nنرسل لكم تقرير وتدريبات الطالب/ة: *${studentName}*\nالمدرسة: *${schoolTitle}*\nالصف: ${studentGrade} - الشعبة: ${studentClass}\nنسبة إتقان المهارات: *${masteryPercentage}%*\nالصفحات المنجزة: *${completedCount} من ${totalPages}*\n\nرابط الدخول المباشر لمسار الطالب والتفوق (متضمناً الشعار والبيانات):\n${directLink}`;
    
    let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (cleanPhone) {
      waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    }
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 font-cairo text-slate-900 select-none">
      
      {/* Top Banner & Student ID Card */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border-2 border-emerald-500/30">
        
        {/* Background Decorative Auras */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Student Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right w-full lg:w-auto">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-lg flex items-center justify-center transform group-hover:scale-105 transition duration-300">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
                  {selectedAvatar}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-slate-950">
                مباشر 🚀
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  {branding.schoolName || 'مدارس ابن سيناء'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
                  مسار الطالب التفاعلي
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                <span>أهلاً بك يا بطل:</span>
                <span className="text-amber-300 border-b-2 border-amber-400/50 pb-0.5">{studentName}</span>
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                {studentGrade} | الشعبة: <span className="font-bold text-white">{studentClass}</span>
              </p>
            </div>
          </div>

          {/* Key Metrics / Mastery Pill Widgets */}
          <div className="grid grid-cols-3 gap-2.5 w-full lg:w-auto">
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center space-y-0.5">
              <div className="text-amber-300 font-black text-xl sm:text-2xl flex items-center justify-center gap-1">
                <span>{masteryPercentage}%</span>
              </div>
              <p className="text-[11px] font-bold text-emerald-100">إتقان المهارات</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center space-y-0.5">
              <div className="text-sky-300 font-black text-xl sm:text-2xl flex items-center justify-center gap-1">
                <span>{completedCount}</span>
                <span className="text-xs text-sky-200">/ {totalPages}</span>
              </div>
              <p className="text-[11px] font-bold text-emerald-100">صفحات منجزة</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center space-y-0.5">
              <div className="text-emerald-300 font-black text-xl sm:text-2xl flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{completedCount * 2 + masteredSkillsCount * 3}</span>
              </div>
              <p className="text-[11px] font-bold text-emerald-100">نجوم التفوق</p>
            </div>

          </div>

        </div>

        {/* Quick Action Bar for WhatsApp Share & Avatar Changer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            <span className="text-emerald-200 font-bold whitespace-nowrap">اختر رمزك المفضّل:</span>
            {AVATARS.map(av => (
              <button
                key={av.id}
                onClick={() => handleSelectAvatar(av.emoji)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition transform hover:scale-110 cursor-pointer ${
                  selectedAvatar === av.emoji 
                    ? 'bg-amber-400 text-slate-950 scale-110 ring-2 ring-white shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={av.label}
              >
                {av.emoji}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {onOpenAndroidModal && (
              <button
                onClick={onOpenAndroidModal}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md transform hover:scale-105"
                title="تثبيت التطبيق على هاتف الأندرويد"
              >
                <Smartphone className="w-4 h-4" />
                <span>تثبيت التطبيق 📲</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'تم نسخ الرابط! 🔗' : 'نسخ رابط الطالب'}</span>
            </button>

            <button
              onClick={handleSendWhatsappReport}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>إرسال بالواتساب 📲</span>
            </button>
          </div>

        </div>

      </div>

      {/* Android Installation & Offline Sync Callout */}
      {onOpenAndroidModal && (
        <div className="bg-linear-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-300/80 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 text-right">
            <div className="w-11 h-11 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>تطبيق الأندرويد جاهز لهاتفك!</span>
                <span className="text-[10px] bg-emerald-800 text-white font-black px-2 py-0.5 rounded-full">بيانات المدرسة محفوظة</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                يمكنك تثبيت هذا المسار كتطبيق مستقل على شاشة هاتفك الرئيسية، والقراءة ومتابعة الدروس دون انقطاع.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAndroidModal}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition transform hover:scale-105 cursor-pointer shrink-0"
          >
            <span>فتح نافذة التثبيت ورمز QR 📲</span>
          </button>
        </div>
      )}

      {/* Responsive Touch-Friendly Sub-Navigation Tabs (Designed for Tablets & Phones) */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300 shadow-inner overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => {
            sfx.playPop();
            setActiveSubTab('roadmap');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'roadmap'
              ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>مسار الدروس 🗺️</span>
        </button>

        <button
          onClick={() => {
            sfx.playPop();
            setActiveSubTab('labs');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'labs'
              ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <Puzzle className="w-4 h-4" />
          <span>المختبرات والتمارين 🎮</span>
        </button>

        <button
          onClick={() => {
            sfx.playPop();
            setActiveSubTab('trophies');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'trophies'
              ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>الأوسمة والإنجازات 🏆</span>
        </button>

        <button
          onClick={() => {
            sfx.playPop();
            setActiveSubTab('whatsapp');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'whatsapp'
              ? 'bg-emerald-800 text-white shadow-md scale-[1.02]'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>الرابط والبيانات 📲</span>
        </button>

      </div>

      {/* SUB-TAB 1: ROADMAP (مسار الدروس المنهجية) */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 font-bold flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                المسار التفاعلي الشامل لجميع وحدات منهج كتاب القرائي: اضغط على أية وحدة للاطلاع على دروسها والبدء المباشر!
              </span>
            </div>
            <span className="hidden sm:inline bg-amber-200 text-amber-950 px-3 py-1 rounded-full font-black text-xs whitespace-nowrap">
              ١٠ وحدات منهجية
            </span>
          </div>

          {/* Unit Roadmap Nodes */}
          <div className="space-y-4">
            {BOOK_UNITS.map((unit) => {
              const isExpanded = expandedUnitId === unit.id;
              const unitPages = pages.filter(p => p.pageNumber >= unit.startPage && p.pageNumber <= unit.endPage);
              const unitCompletedPages = unitPages.filter(p => completedPages.includes(p.pageNumber)).length;
              const unitTotalPages = unitPages.length;
              const unitPercent = unitTotalPages > 0 ? Math.round((unitCompletedPages / unitTotalPages) * 100) : 0;

              return (
                <div 
                  key={unit.id}
                  className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                    isExpanded ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Unit Header Bar */}
                  <div 
                    onClick={() => {
                      sfx.playPop();
                      setExpandedUnitId(isExpanded ? null : unit.id);
                    }}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Unit Number Badge */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0 ${
                        unitPercent === 100 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-linear-to-tr from-amber-500 to-yellow-400 text-slate-950'
                      }`}>
                        {unitPercent === 100 ? '✓' : `#${unit.number}`}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base sm:text-lg text-slate-900">
                            {unit.title}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${unit.badgeColor}`}>
                            ص {unit.startPage} - {unit.endPage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                          {unit.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicator & Toggle Chevron */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-black text-slate-800">{unitPercent}% إكمال</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-1">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                            style={{ width: `${unitPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition ${
                        isExpanded ? 'rotate-180 bg-emerald-100 text-emerald-800' : ''
                      }`}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Expanded Unit Lessons List */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                        <span>قائمة الدروس والصفحات التفاعلية ({unitTotalPages} صفحة):</span>
                        <span className="text-emerald-800">اضغط لفتح الصفحة أو معلم الإنجاز</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {unitPages.map((page) => {
                          const isDone = completedPages.includes(page.pageNumber);
                          return (
                            <div 
                              key={page.pageNumber}
                              className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                                isDone 
                                  ? 'bg-emerald-50/80 border-emerald-300' 
                                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  onClick={() => handleTogglePageCompletion(page.pageNumber)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition text-xs font-bold shrink-0 cursor-pointer ${
                                    isDone 
                                      ? 'bg-emerald-600 text-white shadow-xs' 
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-300'
                                  }`}
                                  title={isDone ? 'تحديد كـ غير مكتمل' : 'تحديد كـ مكتمل'}
                                >
                                  {isDone ? '✓' : page.pageNumber}
                                </button>

                                <div className="min-w-0">
                                  <h4 className="font-black text-xs text-slate-900 truncate">
                                    {page.title}
                                  </h4>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {page.subtitle || page.unitTitle || `الصفحة ${page.pageNumber}`}
                                  </p>
                                </div>
                              </div>

                              {/* Direct Launch & Voice Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unlockAllAudioContexts();
                                    playArabicAudio(page.title);
                                  }}
                                  className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs transition flex items-center justify-center shadow-2xs cursor-pointer hover:scale-105"
                                  title="استمع لنطق عنوان الدرس"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    sfx.playPop();
                                    onNavigateToPage(page.pageNumber);
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs transition flex items-center gap-1 shadow-xs cursor-pointer hover:scale-105"
                                  title="فتح الصفحة التفاعلية مباشرة"
                                >
                                  <Play className="w-3 h-3 fill-white" />
                                  <span>ابدأ</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: LABS & EXERCISES (نافذة الألعاب والأنشطة الصوتية) */}
      {activeSubTab === 'labs' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-xs sm:text-sm text-sky-950 font-bold flex items-center gap-2 shadow-2xs">
            <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
            <span>
              نوافذ التدريبات الصوتية والإملائية التفاعلية: اختر المختبر المطلوب للبدء الفوري بالتدريب المباشر!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1: Dictation & Writing Lab */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 transition shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition">
                  ✍️
                </div>
                <h3 className="font-black text-base text-slate-900">مختبر الإملاء والخط التفاعلي</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  تتبع الحروف بالحركات، الكتابة التفاعلية، والتدريب على الإملاء المنظور والاختباري.
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  onNavigateToTab('dictation');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>دخول المختبر 🚀</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Minimal Pairs Lab */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 transition shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 border border-sky-300 flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition">
                  🔊
                </div>
                <h3 className="font-black text-base text-slate-900">مختبر الأزواج الصوتية المتقاربة</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  التمييز السمعي والبصري بين الحروف المتقاربة المخرج (س/ص، ت/ط، ذ/ظ/ض) بحسابات الجمل.
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  onNavigateToTab('minimal_pairs');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>دخول المختبر 🚀</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Speed Reading Trainer */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 transition shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 border border-rose-300 flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition">
                  ⏱️
                </div>
                <h3 className="font-black text-base text-slate-900">مدرب السرعة والطلاقة القرائية</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  حساب عدد الكلمات في الدقيقة (WPM)، قياس الزمن الرقمي بالثواني، وتعزيز الانسيابية.
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  onNavigateToTab('speed');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>دخول المدرب 🚀</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Card 4: Sukoon & Ta/Ha Test Tool */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 transition shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition">
                  📝
                </div>
                <h3 className="font-black text-base text-slate-900">اختبار السكون وقاعدة الوقف الذهبية</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  اختبار التمييز بين التاء المفتوحة والمرسومة والهاء عبر السكون بالوصل والوقف.
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  onNavigateToTab('sukoon_test');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>دخول الاختبار 🚀</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Card 5: Solar & Lunar Table Direct Access */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 transition shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition">
                  ☀️🌙
                </div>
                <h3 className="font-black text-base text-slate-900">مصنع اللام الشمسية والقمرية</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  تصنيف الكلمات إلى شمسية وقمرية، تمييز الحرف المشدد والسكون والتصحيح الذاتي.
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  onNavigateToPage(99); // Direct to page 99 (Solar/Lunar table page)
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>فتح مصنع اللام 🚀</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Card 6: Parents Portal */}
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 transition shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-900 border border-teal-300 flex items-center justify-center text-xl font-black shadow-xs group-hover:scale-110 transition">
                  👨‍👩‍👧‍👦
                </div>
                <h3 className="font-black text-base text-slate-900">بوابة ولي الأمر للمتابعة والاعتماد</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  تأكيد مراجعة الواجبات المنزلية، الاطلاع على سجل القياس، وتدوين الملاحظات.
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  onNavigateToTab('parents_portal');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>دخول بوابة ولي الأمر 🚀</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: TROPHIES & BADGES (نافذة لوحة الشرف والأوسمة) */}
      {activeSubTab === 'trophies' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          <div className="bg-amber-500 text-slate-950 rounded-3xl p-6 shadow-lg border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <div className="space-y-1">
              <div className="inline-block bg-slate-950 text-amber-300 text-xs font-black px-3 py-1 rounded-full">
                👑 لوحة الشرف والتميز
              </div>
              <h3 className="text-2xl font-black">أوسمة ونجوم البطل: {studentName}</h3>
              <p className="text-xs font-bold text-amber-950">
                كل تدريب تنجزه وكل مهارة تتقنها تمنحك وساماً جديداً ونجوماً تلمع في سجلك!
              </p>
            </div>

            <div className="bg-slate-950/90 text-white px-5 py-3 rounded-2xl border border-amber-300 flex items-center gap-3 shrink-0">
              <Trophy className="w-8 h-8 text-amber-400" />
              <div className="text-right">
                <span className="text-[10px] text-amber-300 font-bold block">مجموع النجوم المكتسبة</span>
                <span className="text-2xl font-black text-white">{completedCount * 2 + masteredSkillsCount * 3} ⭐</span>
              </div>
            </div>
          </div>

          {/* Badges Cabinet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className={`bg-white rounded-3xl p-5 border-2 transition ${masteryPercentage >= 30 ? 'border-amber-400 shadow-md' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-2xl font-black">
                  ☀️
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">وسام الحركات والمدود</h4>
                  <p className="text-[11px] text-slate-500">مكتسب بـ {Math.min(100, masteryPercentage * 2)}% إتقان</p>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-3xl p-5 border-2 transition ${masteryPercentage >= 50 ? 'border-emerald-400 shadow-md' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center text-2xl font-black">
                  🧩
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">وسام خبير التقطيع المقطعي</h4>
                  <p className="text-[11px] text-slate-500">إتقان تحليل المقاطع والشدة</p>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-3xl p-5 border-2 transition ${masteryPercentage >= 70 ? 'border-sky-400 shadow-md' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 border border-sky-300 flex items-center justify-center text-2xl font-black">
                  ⏱️
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">وسام فارس الطلاقة والسرعة</h4>
                  <p className="text-[11px] text-slate-500">قراءة الكلمات بسرعة فائقة</p>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-3xl p-5 border-2 transition ${masteryPercentage >= 90 ? 'border-purple-400 shadow-md' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 border border-purple-300 flex items-center justify-center text-2xl font-black">
                  ✍️
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">وسام بطل الخط والإملاء</h4>
                  <p className="text-[11px] text-slate-500">كتابة الحروف المتقنة بالحركات</p>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-3xl p-5 border-2 transition ${masteryPercentage >= 100 ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/30' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-900 border border-yellow-300 flex items-center justify-center text-2xl font-black">
                  👑
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">وسام القارئ العبقري الكامل</h4>
                  <p className="text-[11px] text-slate-500">إتمام ١٠٠٪ من مهارات الكتاب</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 4: DIRECT WHATSAPP LINK & DATA (نافذة الرابط المباشر والواتساب) */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-5">
            
            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-800" />
                <span>إعدادات الدخول المباشر والرابط التفاعلي للواتساب</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                تتيح هذه النافذة توليد رابط مباشر للطالب للدخول فوراً بضغطة واحدة عبر الواتساب دون الحاجة لكتابة الاسم مجدداً!
              </p>
            </div>

            {/* Direct Link Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                رابط الطالب المباشر (يمكن إرساله لولي الأمر أو المعلم):
              </label>

              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  readOnly
                  value={directLink}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 font-bold select-all dir-ltr"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>

            {/* Editable Profile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">اسم الطالب/ة:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">الصف الدراسي:</label>
                <input
                  type="text"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">الشعبة / الفصل:</label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Teacher WhatsApp Number for Auto Reporting */}
            <div className="pt-2 space-y-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-700 block">
                رقم واتساب المعلم/ة المباشر (اختياري مع فتحة الدولة مثل 967xxxxxxxxx):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="مثال: 967770000000"
                  value={teacherWhatsappNumber}
                  onChange={(e) => {
                    setTeacherWhatsappNumber(e.target.value);
                    try {
                      localStorage.setItem('ibn_sinai_teacher_whatsapp', e.target.value);
                    } catch (err) {}
                  }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none dir-ltr text-right"
                />
                <button
                  onClick={handleSendWhatsappReport}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>مشاركة التقرير عبر الواتساب</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
