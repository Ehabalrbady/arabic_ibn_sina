import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Check, 
  School, 
  Sparkles, 
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  MapPin,
  Building,
  User,
  GraduationCap,
  FileText,
  Printer,
  Flag
} from 'lucide-react';
import { SchoolBranding } from '../utils/schoolBranding';
import { IbnSinaLogo } from './IbnSinaLogo';

interface LogoUploadModalProps {
  branding: SchoolBranding;
  onSaveBranding: (updated: SchoolBranding) => void;
  onClose: () => void;
  onUpdateStudentInfo?: (name: string, grade: string, studentClass: string) => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  branding,
  onSaveBranding,
  onClose,
  onUpdateStudentInfo
}) => {
  const [currentBranding, setCurrentBranding] = useState<SchoolBranding>({ ...branding });
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'country' | 'school' | 'student' | 'logo' | 'print'>('country');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    setPreviewError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPreviewError('يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WEBP)');
      return;
    }

    // Validate file size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPreviewError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCurrentBranding(prev => ({
          ...prev,
          logoUrl: result
        }));
      }
    };
    reader.onerror = () => {
      setPreviewError('حدث خطأ أثناء قراءة ملف الصورة.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleResetToDefaultLogo = () => {
    setCurrentBranding(prev => ({
      ...prev,
      logoUrl: null
    }));
  };

  const handleSave = () => {
    onSaveBranding(currentBranding);
    if (onUpdateStudentInfo) {
      onUpdateStudentInfo(
        currentBranding.studentName,
        currentBranding.studentGrade,
        currentBranding.studentClass
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-cairo">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                تخصيص بيانات المدرسة والبلد والطالب
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                تعديل ترويسة الدولة (الجمهورية اليمنية)، المدرسة، بيانات الطالب، وشعار الطباعة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('country')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === 'country'
                ? 'bg-white text-emerald-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-600" />
            <span>بيانات البلد والوزارة</span>
          </button>

          <button
            onClick={() => setActiveTab('school')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === 'school'
                ? 'bg-white text-emerald-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-blue-600" />
            <span>المدرسة والبرنامج</span>
          </button>

          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === 'student'
                ? 'bg-white text-emerald-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>بيانات الطالب والمعلم</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === 'logo'
                ? 'bg-white text-emerald-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>شعار المدرسة</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === 'print'
                ? 'bg-white text-emerald-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-teal-600" />
            <span>خيارات الطباعة</span>
          </button>
        </div>

        {/* TAB 1: COUNTRY & MINISTRY */}
        {activeTab === 'country' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-red-50/60 border border-red-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="text-2xl">🇾🇪</div>
              <div>
                <h4 className="text-xs font-black text-red-950">بيانات الدولة والجهة التعليمية المشرفة (الجمهورية اليمنية):</h4>
                <p className="text-[11px] text-slate-600">تظهر هذه البيانات في أعلى ترويسة الغلاف الرسمي وجميع أوراق العمل عند الطباعة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">الدولة / البلد:</label>
                <input
                  type="text"
                  value={currentBranding.countryName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, countryName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="الجمهورية اليمنية"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">الوزارة المشرفة:</label>
                <input
                  type="text"
                  value={currentBranding.ministryName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, ministryName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="وزارة التربية والتعليم والبحث العلمي"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">المحافظة / مكتب التربية:</label>
                <input
                  type="text"
                  value={currentBranding.governorateName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, governorateName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="أمانة العاصمة / صنعاء، تعز، إب، عدن..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">المديرية / المنطقة التعليمية:</label>
                <input
                  type="text"
                  value={currentBranding.directorateName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, directorateName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="منطقة معين التعليمية، مديرية صيرة..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOOL & PROGRAM */}
        {activeTab === 'school' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">اسم المدرسة / المجمع التعليمي:</label>
                <input
                  type="text"
                  value={currentBranding.schoolName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="مدارس ابن سيناء الأهلية النموذجية"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">القسم / الإدارة المشرفة:</label>
                <input
                  type="text"
                  value={currentBranding.departmentName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, departmentName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="قسم إدارة الجودة والتطوير التعليمي"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 font-bold">عنوان الخطة العلاجية / المنهج:</label>
                <input
                  type="text"
                  value={currentBranding.programName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, programName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="الخطة العلاجية الشاملة لمهارات القراءة والكتابة"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 font-bold">العام الدراسي:</label>
                <input
                  type="text"
                  value={currentBranding.academicYear}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, academicYear: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="1446-1447هـ / 2024-2025م"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT & TEACHER */}
        {activeTab === 'student' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 font-bold">
              👤 بيانات الطالب والمعلم تطبع مباشرة على الغلاف وفي ترويسة كل ورقة عمل:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-700 font-bold">اسم الطالب الرباعي:</label>
                <input
                  type="text"
                  value={currentBranding.studentName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, studentName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="مثال: أحمد محمد عبد الله العريقي"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">الصف الدراسي:</label>
                <input
                  type="text"
                  value={currentBranding.studentGrade}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, studentGrade: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="الصف الأساسي (الأول / الثاني)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">الشعبة / الفصل:</label>
                <input
                  type="text"
                  value={currentBranding.studentClass}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, studentClass: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="شعبة (أ) أو (١/ب)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">معلم / معلمة المادة:</label>
                <input
                  type="text"
                  value={currentBranding.teacherName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, teacherName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="أ. عبد الله الحكيمي"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">المشرف التربوي / مدير المدرسة:</label>
                <input
                  type="text"
                  value={currentBranding.supervisorName}
                  onChange={(e) => setCurrentBranding(prev => ({ ...prev, supervisorName: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  placeholder="مشرف التطوير التربوي"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LOGO UPLOAD */}
        {activeTab === 'logo' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                isDragging 
                  ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]' 
                  : 'border-amber-300 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-amber-200 text-amber-800 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-black text-slate-800">
                  اضغط لاختيار شعار مدرستك أو اسحب الصورة هنا
                </p>
                <p className="text-[11px] text-slate-500">
                  يدعم صيغ PNG الشفافة، JPG، SVG (الحد الأقصى 5 ميجابايت)
                </p>
              </div>
            </div>

            {previewError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                ⚠️ {previewError}
              </p>
            )}

            {/* Current Logo Preview Card */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-xl border border-slate-300 flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                  <IbnSinaLogo 
                    size="md" 
                    showText={false} 
                    customLogoUrl={currentBranding.logoUrl} 
                    schoolName={currentBranding.schoolName}
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-bold">
                    {currentBranding.logoUrl ? 'الشعار المخصص المرفوع' : 'الشعار الرسمي الافتراضي'}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {currentBranding.schoolName}
                  </span>
                </div>
              </div>

              {currentBranding.logoUrl && (
                <button
                  onClick={handleResetToDefaultLogo}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  title="استعادة الشعار الافتراضي"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>استعادة الافتراضي</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PRINT OPTIONS */}
        {activeTab === 'print' && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">إظهار شعار المدرسة في الترويسة</span>
                <span className="text-[11px] text-slate-500">طباعة الشعار الرسمي أو المرفوع أعلى كل صفحة</span>
              </div>
              <input
                type="checkbox"
                checked={currentBranding.showLogoInPrint}
                onChange={(e) => setCurrentBranding(prev => ({ ...prev, showLogoInPrint: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">شريط بيانات الطالب في الترويسة</span>
                <span className="text-[11px] text-slate-500">طباعة اسم الطالب والصف والشعبة والتاريخ أعلى كل ورقة</span>
              </div>
              <input
                type="checkbox"
                checked={currentBranding.showStudentInfoInPrint}
                onChange={(e) => setCurrentBranding(prev => ({ ...prev, showStudentInfoInPrint: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">أسطر النسخ والتتبع المنقطة</span>
                <span className="text-[11px] text-slate-500">تضمين أسطر الكتابة والخط المنقط لتدريب الطالب</span>
              </div>
              <input
                type="checkbox"
                checked={currentBranding.showHandwritingLinesInPrint}
                onChange={(e) => setCurrentBranding(prev => ({ ...prev, showHandwritingLinesInPrint: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">صندوق التقييم والتوقيعات أسفل الصفحة</span>
                <span className="text-[11px] text-slate-500">خانة إتقان المهارة، ملحوظات المعلم وتوقيع ولي الأمر</span>
              </div>
              <input
                type="checkbox"
                checked={currentBranding.showEvaluationBoxInPrint}
                onChange={(e) => setCurrentBranding(prev => ({ ...prev, showEvaluationBoxInPrint: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">نمط توفير الحبر (Ink-Saver Mode)</span>
                <span className="text-[11px] text-slate-500">أبيض وأسود عالي التباين لآلات التصوير المدرسية</span>
              </div>
              <input
                type="checkbox"
                checked={currentBranding.inkSaverMode}
                onChange={(e) => setCurrentBranding(prev => ({ ...prev, inkSaverMode: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
          <div className="text-[11px] text-slate-500">
            🇾🇪 الجمهورية اليمنية — {currentBranding.schoolName}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              إلغاء
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black transition flex items-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>حفظ وتطبيق التعديلات</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

