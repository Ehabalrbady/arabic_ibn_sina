import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  UserCheck, 
  Activity,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { SchoolBranding } from '../institutional_branding/schoolBranding';

export interface DiagnosticRecord {
  id: string;
  weekNumber: number;
  date: string;
  skillName: string;
  unitTitle: string;
  cwpm: number; // Correct Words Per Minute
  totalWordsRead: number;
  errorsCount: number;
  timeSeconds: number;
  accuracyRate: number; // Percentage
  masteryLevel: 'advanced' | 'proficient' | 'remedial';
  teacherNotes: string;
  parentAcknowledged: boolean;
}

const DEFAULT_DIAGNOSTIC_RECORDS: DiagnosticRecord[] = [
  {
    id: 'diag-1',
    weekNumber: 1,
    date: '2026-09-05',
    skillName: 'نطق الحركات الثلاث والوعي الصوتي',
    unitTitle: 'الحروف الهجائية',
    cwpm: 22,
    totalWordsRead: 25,
    errorsCount: 3,
    timeSeconds: 60,
    accuracyRate: 88,
    masteryLevel: 'proficient',
    teacherNotes: 'تحسن ملحوظ في تمييز الكسرة عن الضمة. يحتاج لمواصلة تدريبات السرعة.',
    parentAcknowledged: true
  },
  {
    id: 'diag-2',
    weekNumber: 2,
    date: '2026-09-12',
    skillName: 'قراءة مقطع من حرفين (حرف متحرك مع ساكن)',
    unitTitle: 'قراءة حرفين',
    cwpm: 28,
    totalWordsRead: 30,
    errorsCount: 2,
    timeSeconds: 60,
    accuracyRate: 93,
    masteryLevel: 'advanced',
    teacherNotes: 'أتقن قراءة المقطع الساكن كدفعة صوتية واحدة بطلاقة ممتازة.',
    parentAcknowledged: true
  },
  {
    id: 'diag-3',
    weekNumber: 3,
    date: '2026-09-19',
    skillName: 'قراءة كلمات ثلاثية بالحركات المختلفة',
    unitTitle: 'قراءة كلمات',
    cwpm: 34,
    totalWordsRead: 36,
    errorsCount: 2,
    timeSeconds: 60,
    accuracyRate: 94,
    masteryLevel: 'advanced',
    teacherNotes: 'تجاوز مرحلة التهجئة الحرفية وبدأ بالقراءة المقطعية المباشرة.',
    parentAcknowledged: false
  },
  {
    id: 'diag-4',
    weekNumber: 4,
    date: '2026-09-26',
    skillName: 'التمييز بين الحركات القصيرة والمدود الطويلة',
    unitTitle: 'المد وحروفه',
    cwpm: 30,
    totalWordsRead: 35,
    errorsCount: 5,
    timeSeconds: 60,
    accuracyRate: 85,
    masteryLevel: 'proficient',
    teacherNotes: 'يوصى بالتركيز على مختبر التمييز السمعي للتفرقة بين (قَلَّ وقَالَ).',
    parentAcknowledged: false
  }
];

interface DiagnosticTrackingMatrixProps {
  studentName: string;
  studentGrade?: string;
  studentClass?: string;
  branding: SchoolBranding;
}

export const DiagnosticTrackingMatrix: React.FC<DiagnosticTrackingMatrixProps> = ({
  studentName,
  studentGrade = 'الصف الثاني الابتدائي',
  studentClass = '١ / أ',
  branding
}) => {
  const [records, setRecords] = useState<DiagnosticRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ibn_sinai_diagnostic_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_DIAGNOSTIC_RECORDS;
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSkill, setNewSkill] = useState('المد بالواو والياء');
  const [newUnit, setNewUnit] = useState('المد وحروفه');
  const [newWordsRead, setNewWordsRead] = useState(30);
  const [newErrors, setNewErrors] = useState(2);
  const [newTime, setNewTime] = useState(60);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ibn_sinai_diagnostic_records', JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  const handleAddNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const wordsRead = Number(newWordsRead) || 1;
    const errors = Number(newErrors) || 0;
    const correctWords = Math.max(0, wordsRead - errors);
    const time = Number(newTime) || 60;
    const cwpm = Math.round((correctWords / time) * 60);
    const accuracy = Math.round((correctWords / wordsRead) * 100);

    let level: 'advanced' | 'proficient' | 'remedial' = 'remedial';
    if (accuracy >= 90 && cwpm >= 25) level = 'advanced';
    else if (accuracy >= 75) level = 'proficient';

    const newRec: DiagnosticRecord = {
      id: `diag-${Date.now()}`,
      weekNumber: records.length + 1,
      date: new Date().toISOString().split('T')[0],
      skillName: newSkill,
      unitTitle: newUnit,
      cwpm,
      totalWordsRead: wordsRead,
      errorsCount: errors,
      timeSeconds: time,
      accuracyRate: accuracy,
      masteryLevel: level,
      teacherNotes: newNotes || 'تم الرصد والتقييم وفق معايير نهج القراءة المبكر.',
      parentAcknowledged: false
    };

    setRecords([newRec, ...records]);
    setIsAddingNew(false);
    setNewNotes('');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const toggleParentAck = (id: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, parentAcknowledged: !r.parentAcknowledged } : r));
  };

  // Calculations for summary cards
  const avgCWPM = records.length > 0 ? Math.round(records.reduce((sum, r) => sum + r.cwpm, 0) / records.length) : 0;
  const avgAccuracy = records.length > 0 ? Math.round(records.reduce((sum, r) => sum + r.accuracyRate, 0) / records.length) : 0;
  const advancedCount = records.filter(r => r.masteryLevel === 'advanced').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
              <span>📊 نهج القراءة المبكر (EGR)</span>
              <span>•</span>
              <span>مصفوفة الرصد والتشخيص الأسبوعي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-amiri leading-tight">
              بطاقة رصد الطلاقة والتشخيص الأسبوعي
            </h2>
            <p className="text-sm text-emerald-100 font-medium leading-relaxed">
              توثيق دقيق لمعدل الكلمات الصحيحة في الدقيقة (CWPM)، ونسبة الدقة القرائية، وزمن الاستجابة ومتابعة ولي الأمر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-2xl font-black text-sm shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل جلسة تقييم جديدة</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المصفوفة A4</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: CWPM Average */}
        <div className="bg-white border-2 border-emerald-200 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-black shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block">متوسط الطلاقة (CWPM)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{avgCWPM}</span>
              <span className="text-xs text-slate-500 font-bold">كلمة / دقيقة</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Accuracy Rate */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-black shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block">متوسط دقة القراءة والتهجئة</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{avgAccuracy}%</span>
              <span className="text-xs text-emerald-700 font-bold">مستوى ممتاز</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Mastered Sessions */}
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-black shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block">الجلسات المتقنة بمستوى متقدم</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{advancedCount}</span>
              <span className="text-xs text-slate-500 font-bold">من أصل {records.length} تقييم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Session Form */}
      {isAddingNew && (
        <form onSubmit={handleAddNewRecord} className="bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>إضافة جلسة تشخيص ورصد أسبوعي جديدة</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الوحدة التعليمية:</label>
              <input
                type="text"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">المهارة المستهدفة:</label>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">إجمالي الكلمات المقروءة:</label>
              <input
                type="number"
                value={newWordsRead}
                onChange={(e) => setNewWordsRead(Number(e.target.value))}
                min="1"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">عدد الأخطاء القرائية / الإملائية:</label>
              <input
                type="number"
                value={newErrors}
                onChange={(e) => setNewErrors(Number(e.target.value))}
                min="0"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">الزمن المستغرق (بالثواني):</label>
              <input
                type="number"
                value={newTime}
                onChange={(e) => setNewTime(Number(e.target.value))}
                min="5"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ملاحظات المعلم والإجراء العلاجي:</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="أداء ممتاز مع حاجة لتعزيز..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              حفظ النتيجة في السجل 💾
            </button>
          </div>
        </form>
      )}

      {/* Main Records Table */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
              <tr>
                <th className="p-3.5">الأسبوع / التاريخ</th>
                <th className="p-3.5">الوحدة والمهارة</th>
                <th className="p-3.5 text-center">الطلاقة (CWPM)</th>
                <th className="p-3.5 text-center">نسبة الدقة</th>
                <th className="p-3.5 text-center">المستوى</th>
                <th className="p-3.5">ملاحظات المعلم والتوجيه</th>
                <th className="p-3.5 text-center">توقيع ولي الأمر</th>
                <th className="p-3.5 text-center no-print">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                    <span className="block">الأسبوع {rec.weekNumber}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{rec.date}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-900 font-bold block">{rec.skillName}</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold inline-block mt-0.5">
                      {rec.unitTitle}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="font-black text-base text-slate-900 font-amiri block">
                      {rec.cwpm}
                    </span>
                    <span className="text-[9px] text-slate-400">كلمة/دقيقة</span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="font-black text-sm text-emerald-800 block">
                      {rec.accuracyRate}%
                    </span>
                    <span className="text-[9px] text-slate-400">({rec.errorsCount} أخطاء)</span>
                  </td>
                  <td className="p-3.5 text-center">
                    {rec.masteryLevel === 'advanced' ? (
                      <span className="bg-emerald-100 text-emerald-950 font-black px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>متقدم ⭐</span>
                      </span>
                    ) : rec.masteryLevel === 'proficient' ? (
                      <span className="bg-amber-100 text-amber-950 font-black px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        <span>متمكن 👍</span>
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-950 font-black px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        <span>بحاجة لمتابعة ⚠️</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 max-w-xs text-slate-600 leading-relaxed font-medium">
                    {rec.teacherNotes}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => toggleParentAck(rec.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer inline-flex items-center gap-1 ${
                        rec.parentAcknowledged
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {rec.parentAcknowledged ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تم الاطلاع والتوقيع ✍️</span>
                        </>
                      ) : (
                        <span>اضغط للتوقيع ✍️</span>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 text-center no-print">
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="حذف الجلسة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Official Validation Info */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span className="font-bold">
              المعلم المشرف: أ. مختص الصعوبات والقرائية — {branding.departmentName}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>معيار الصف الأول: 20-30 كلمة/دقيقة</span>
            <span>•</span>
            <span>معيار الصف الثاني: 40-60 كلمة/دقيقة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
