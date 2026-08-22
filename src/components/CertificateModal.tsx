import React from 'react';
import { Award, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { AchievementBadge } from '../data/achievementBadges';
import { SchoolBranding } from '../utils/schoolBranding';

interface CertificateModalProps {
  badge: AchievementBadge;
  studentName: string;
  studentGrade: string;
  studentClass: string;
  branding: SchoolBranding;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  badge,
  studentName,
  studentGrade,
  studentClass,
  branding,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const schoolName = branding.schoolName || 'مدارس ابن سيناء الأهلية';
  const ministryName = branding.ministryName || 'وزارة التربية والتعليم والبحث العلمي';
  const countryName = branding.countryName || 'الجمهورية اليمنية';
  const departmentName = branding.departmentName || 'قسم إدارة الجودة والتطوير';
  const programName = branding.programName || 'الخطة العلاجية لمهارات القراءة والكتابة';
  const teacherName = branding.teacherName || 'أستاذ المادة';
  const principalName = branding.principalName || 'مدير المدرسة';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs font-cairo overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 max-w-3xl w-full p-6 sm:p-8 relative my-8">
        
        {/* Close & Action Bar (Screen Only) */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-4 mb-6 no-print">
          <div className="flex items-center gap-2 text-amber-900 font-black">
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <h3 className="text-base sm:text-lg">شهادة تقدير وإنجاز — {badge.title}</h3>
              <p className="text-xs text-slate-500 font-normal">جاهزة للطباعة المباشرة بحجم A4 أو الحفظ كـ PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الآن</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div id="certificate-printable-frame" className="relative bg-[#FFFDF9] border-[6px] border-double border-amber-600/80 rounded-2xl p-6 sm:p-10 text-center shadow-inner overflow-hidden">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 right-2 text-amber-700/30 text-3xl font-serif select-none">⚜</div>
          <div className="absolute top-2 left-2 text-amber-700/30 text-3xl font-serif select-none">⚜</div>
          <div className="absolute bottom-2 right-2 text-amber-700/30 text-3xl font-serif select-none">⚜</div>
          <div className="absolute bottom-2 left-2 text-amber-700/30 text-3xl font-serif select-none">⚜</div>

          {/* Header */}
          <div className="flex items-center justify-between text-xs text-slate-700 border-b border-amber-200 pb-3 mb-6">
            <div className="text-right">
              <p className="font-bold text-slate-900">{countryName}</p>
              <p className="text-[11px] text-slate-600">{ministryName}</p>
              <p className="text-[11px] font-bold text-emerald-900">{schoolName}</p>
            </div>

            {branding.showLogoInPrint && branding.logoUrl ? (
              <img src={branding.logoUrl} alt="شعار المدرسة" className="w-14 h-14 object-contain max-h-14" />
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center text-2xl shadow-xs">
                {badge.icon}
              </div>
            )}

            <div className="text-left">
              <p className="font-bold text-slate-900">{departmentName}</p>
              <p className="text-[11px] text-slate-600">{programName}</p>
              <p className="text-[10px] text-amber-800 font-bold">العام الدراسي {branding.academicYear || '1446هـ'}</p>
            </div>
          </div>

          {/* Badge Icon & Certificate Title */}
          <div className="my-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-tr from-amber-400 to-yellow-200 text-amber-950 text-4xl shadow-md border-2 border-amber-500 mb-3 animate-bounce-slow">
              {badge.icon}
            </div>
            
            <div className="text-amber-800 text-xs font-black tracking-wider uppercase mb-1">
              🌟 وسام الإتقان والتميز القرائي والكتابي 🌟
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-cairo">
              {badge.certificateTitle}
            </h1>
          </div>

          {/* Body Statement */}
          <div className="max-w-xl mx-auto my-6 text-sm sm:text-base leading-relaxed text-slate-800">
            <p className="text-slate-600 text-xs sm:text-sm mb-2">
              يسر إدارة المدرسة وقسم التطوير التربوي منح هذا الوسام التكريمي للتلميذ/ة المتميز/ة:
            </p>

            <div className="my-3 py-1.5 px-6 border-b-2 border-dotted border-amber-700 inline-block">
              <span className="text-xl sm:text-2xl font-black text-emerald-900 font-amiri px-4">
                {studentName || 'طالب متميز'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1 font-bold">
              بالصف: <span className="text-slate-900">{studentGrade || 'الأساسي'}</span> — الشعبة: <span className="text-slate-900">{studentClass || '(أ)'}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-800 mt-4 leading-relaxed font-medium bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
              {badge.certificatePraise}
            </p>
          </div>

          {/* Stamp & Evaluation Badge */}
          <div className="flex items-center justify-center gap-2 my-4">
            <span className="bg-emerald-100 text-emerald-950 font-black text-xs px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>نسبة الإتقان المحققة: 100% بنجاح تام ⭐⭐⭐⭐⭐</span>
            </span>
          </div>

          {/* Signatures Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-amber-200 text-xs text-slate-800">
            <div>
              <p className="font-bold text-slate-900 mb-8">معلم / معلمة المادة</p>
              <p className="text-slate-600 font-semibold">{teacherName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-8">خاتم الاعتماد والتميز 🇾🇪</p>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600/60 mx-auto flex items-center justify-center text-[10px] text-amber-900 font-bold bg-amber-50/40">
                مُعتمد
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-8">مدير المدرسة</p>
              <p className="text-slate-600 font-semibold">{principalName}</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions (Screen Only) */}
        <div className="flex items-center justify-between mt-6 no-print">
          <span className="text-xs text-slate-500 font-medium">
            💡 نصيحة: يمكنك تعديل اسم الطالب أو الصف في أعلى الصفحة قبل الطباعة.
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الآن</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
