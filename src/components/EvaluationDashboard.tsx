import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Printer, Sparkles, User, Calendar, Check, X, Trophy, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EvaluationSkill } from '../types/book';
import { ACHIEVEMENT_BADGES, AchievementBadge } from '../data/achievementBadges';
import { CertificateModal } from './CertificateModal';
import { SchoolBranding, DEFAULT_BRANDING } from '../utils/schoolBranding';

interface EvaluationProps {
  skills: EvaluationSkill[];
  setSkills: React.Dispatch<React.SetStateAction<EvaluationSkill[]>>;
  studentName: string;
  setStudentName: (name: string) => void;
  studentGrade: string;
  setStudentGrade: (grade: string) => void;
  studentClass?: string;
  branding?: SchoolBranding;
  onNavigateToPage: (pageNumber: number) => void;
}

export const EvaluationDashboard: React.FC<EvaluationProps> = ({
  skills,
  setSkills,
  studentName,
  setStudentName,
  studentGrade,
  setStudentGrade,
  studentClass = '١ / أ',
  branding = DEFAULT_BRANDING,
  onNavigateToPage
}) => {
  const [selectedBadgeForCertificate, setSelectedBadgeForCertificate] = useState<AchievementBadge | null>(null);

  const toggleAttempt = (skillId: number, attemptIndex: number) => {
    setSkills((prev) => {
      const updated = prev.map((s) => {
        if (s.id === skillId) {
          const newAttempts: [boolean, boolean, boolean, boolean] = [
            attemptIndex === 0 ? !s.attempts[0] : s.attempts[0],
            attemptIndex === 1 ? !s.attempts[1] : s.attempts[1],
            attemptIndex === 2 ? !s.attempts[2] : s.attempts[2],
            attemptIndex === 3 ? !s.attempts[3] : s.attempts[3],
          ];
          return { ...s, attempts: newAttempts };
        }
        return s;
      });
      localStorage.setItem('ibn_sinai_reading_skills', JSON.stringify(updated));
      return updated;
    });

    try {
      confetti({ particleCount: 25, spread: 50 });
    } catch (e) {}
  };

  const resetAll = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط كافة المحاولات والتقييمات؟')) {
      const reset = skills.map(s => ({ ...s, attempts: [false, false, false, false] as [boolean, boolean, boolean, boolean] }));
      setSkills(reset);
      localStorage.setItem('ibn_sinai_reading_skills', JSON.stringify(reset));
    }
  };

  const masteredCount = skills.filter(s => s.attempts.some(a => a)).length;
  const totalCount = skills.length;
  const masteryPercentage = Math.round((masteredCount / totalCount) * 100);

  // Helper to check if a badge is unlocked (100% of its target skills are mastered)
  const isBadgeUnlocked = (badge: AchievementBadge): boolean => {
    if (badge.id === 'badge_grand_master') {
      return skills.length > 0 && skills.every(s => s.attempts.some(a => a));
    }
    if (badge.skillIds && badge.skillIds.length > 0) {
      const targetSkills = skills.filter(s => badge.skillIds!.includes(s.id));
      return targetSkills.length > 0 && targetSkills.every(s => s.attempts.some(a => a));
    }
    if (badge.unitId) {
      const targetSkills = skills.filter(s => s.unitId === badge.unitId);
      return targetSkills.length > 0 && targetSkills.every(s => s.attempts.some(a => a));
    }
    return false;
  };

  // Calculate progress for a badge (e.g. 3/4 skills)
  const getBadgeProgress = (badge: AchievementBadge) => {
    if (badge.id === 'badge_grand_master') {
      return { completed: masteredCount, total: totalCount, percent: masteryPercentage };
    }
    let targetSkills = skills;
    if (badge.skillIds && badge.skillIds.length > 0) {
      targetSkills = skills.filter(s => badge.skillIds!.includes(s.id));
    } else if (badge.unitId) {
      targetSkills = skills.filter(s => s.unitId === badge.unitId);
    }
    const completed = targetSkills.filter(s => s.attempts.some(a => a)).length;
    const total = targetSkills.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent };
  };

  const unlockedBadgesCount = ACHIEVEMENT_BADGES.filter(b => isBadgeUnlocked(b)).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-cairo">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-amber-400/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
              📊
            </div>
            <div>
              <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full">
                نظام التقويم المنهجي — ٤ محاولات
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                سجل قياس وإتقان المهارات القرائية والإملائية
              </h2>
            </div>
          </div>

          {/* Mastery Percentage & Badges Counter */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-3 rounded-2xl text-center">
              <span className="text-[11px] text-amber-300 block font-bold">الأوسمة المكتسبة:</span>
              <span className="text-2xl font-black text-amber-400">🏅 {unlockedBadgesCount} / {ACHIEVEMENT_BADGES.length}</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">وسام إتقان 100%</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-5 py-3 rounded-2xl text-center">
              <span className="text-xs text-amber-300 block font-bold">نسبة الإتقان الكلية:</span>
              <span className="text-3xl font-black text-white">{masteryPercentage}%</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">{masteredCount} من {totalCount} مهارات</span>
            </div>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-3xl leading-relaxed">
          وفقاً لمنهجية الكتيب، يمنح الطالب <strong>٤ محاولات تقييمية متدرجة</strong> لكل مهارة من مهارات البرنامج الـ ١٥ لضمان الإتقان التام (١٠٠٪) قبل الاعتماد النهائي، مع فتح <strong>أوسمة الإنجاز وشهادات التقدير التكريمية</strong> تلقائياً.
        </p>

        {/* Student Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1">اسم الطالب:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-transparent text-white font-bold text-sm w-full outline-hidden border-b border-amber-400/60 pb-0.5"
            />
          </div>
          <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1">الصف الدراسي:</span>
            <input
              type="text"
              value={studentGrade}
              onChange={(e) => setStudentGrade(e.target.value)}
              className="bg-transparent text-white font-bold text-sm w-full outline-hidden border-b border-amber-400/60 pb-0.5"
            />
          </div>
          <div className="flex items-center justify-end gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السجل الرسمي</span>
            </button>
            <button
              onClick={resetAll}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
              title="إعادة ضبط الجدول"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIGITAL ACHIEVEMENT BADGES & CERTIFICATE GENERATOR SYSTEM */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>أوسمة الإنجاز الرقمية وشهادات التكريم الفورية</span>
                <span className="text-xs bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  {unlockedBadgesCount} / {ACHIEVEMENT_BADGES.length} مُكتسب
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                يحصل التلميذ على وسام الإنجاز عند إتمام مهارات الوحدة بنسبة 100%، مع إمكانية طباعة شهادة تقدير معتمدة باسمه فوراً!
              </p>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = isBadgeUnlocked(badge);
            const progress = getBadgeProgress(badge);

            return (
              <div
                key={badge.id}
                className={`relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between border-2 ${
                  unlocked
                    ? 'bg-linear-to-b from-white to-amber-50/60 border-amber-400 shadow-md ring-2 ring-amber-300/40 hover:-translate-y-1'
                    : 'bg-slate-50/80 border-slate-200 opacity-80'
                }`}
              >
                {/* Top Badge Icon & Category */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                      {badge.categoryTitle}
                    </span>
                    {unlocked ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>مكتمل 100%</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>قيد التقدم</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs transition-transform ${
                        unlocked
                          ? 'bg-linear-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 scale-105'
                          : 'bg-slate-200 text-slate-400 grayscale border border-slate-300'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-black leading-tight ${unlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>نسبة الإتقان:</span>
                    <span className={unlocked ? 'text-emerald-700 font-black' : 'text-amber-800'}>
                      {progress.completed} / {progress.total} ({progress.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        unlocked ? 'bg-linear-to-r from-emerald-500 to-teal-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  {/* Action: Print Certificate */}
                  <div className="mt-3">
                    {unlocked ? (
                      <button
                        onClick={() => setSelectedBadgeForCertificate(badge)}
                        className="w-full py-1.5 px-3 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>طباعة شهادة التقدير 📜</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-1.5 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium cursor-not-allowed text-center"
                      >
                        أكمل مهارات الوحدة لفتح الوسام
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-amber-100 flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-base text-slate-900">
            📋 جدول رصد المهارات الـ ١٥ التفصيلي مع نظام المحاولات الأربع:
          </h3>
          <span className="text-xs text-slate-500 font-medium">انقر على أي محاولة لتبديل حالة الإتقان</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-emerald-900 text-white text-xs">
              <tr>
                <th className="p-3.5 text-center w-12">#</th>
                <th className="p-3.5">المهارة المستهدفة</th>
                <th className="p-3.5 text-center">الوحدة والصفحة</th>
                <th className="p-3.5 text-center">المحاولة ١</th>
                <th className="p-3.5 text-center">المحاولة ٢</th>
                <th className="p-3.5 text-center">المحاولة ٣</th>
                <th className="p-3.5 text-center">المحاولة ٤</th>
                <th className="p-3.5 text-center">حالة الإتقان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skills.map((skill, idx) => {
                const isMastered = skill.attempts.some(a => a === true);
                return (
                  <tr key={skill.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]/60'}>
                    <td className="p-3.5 text-center font-bold text-slate-400 text-xs">
                      {skill.id}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>{skill.name}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{skill.category}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onNavigateToPage(skill.pageRef)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition"
                      >
                        ص {skill.pageRef}
                      </button>
                    </td>
                    {[0, 1, 2, 3].map((attIdx) => {
                      const checked = skill.attempts[attIdx];
                      return (
                        <td key={attIdx} className="p-3.5 text-center">
                          <button
                            onClick={() => toggleAttempt(skill.id, attIdx)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center font-black transition mx-auto cursor-pointer ${
                              checked
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                : 'bg-slate-50 text-slate-300 border-slate-200 hover:border-amber-400'
                            }`}
                            title={`المحاولة ${attIdx + 1}`}
                          >
                            {checked ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5 opacity-40" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        isMastered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isMastered ? 'متقن ✓' : 'يحتاج تكرار ✗'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Print-Only Signature Section */}
        <div className="hidden print-only p-8 border-t-2 border-slate-300 mt-6">
          <div className="grid grid-cols-3 gap-6 text-center text-xs font-cairo">
            <div>
              <p className="font-bold mb-10">توقيع المعلم / المعلمة</p>
              <p>.......................................</p>
            </div>
            <div>
              <p className="font-bold mb-10">توقيع ولي الأمر</p>
              <p>.......................................</p>
            </div>
            <div>
              <p className="font-bold mb-10">خاتم إدارة المدرسة</p>
              <p>.......................................</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedBadgeForCertificate && (
        <CertificateModal
          badge={selectedBadgeForCertificate}
          studentName={studentName}
          studentGrade={studentGrade}
          studentClass={studentClass}
          branding={branding}
          onClose={() => setSelectedBadgeForCertificate(null)}
        />
      )}
    </div>
  );
};

