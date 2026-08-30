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
  Flag, 
  Volume2,
  Share2,
  Smartphone
} from 'lucide-react';
import { SchoolBranding, generateStudentShareableLink } from './schoolBranding';
import { IbnSinaLogo } from './IbnSinaLogo';
import { 
  getAudioSettings, 
  saveAudioSettings, 
  playArabicAudio, 
  PERSONA_INFO, 
  VoicePersona,
  splitArabicIntoSyllables 
} from '../speech_and_multimedia/audio';
import { getAudioCacheStats, clearAudioCache, saveCachedAudio } from '../speech_and_multimedia/audioCache';
import { precacheAllCurriculumAudio } from '../speech_and_multimedia/audioPreloader';

interface LogoUploadModalProps {
  branding: SchoolBranding;
  onSaveBranding: (updated: SchoolBranding) => void;
  onClose: () => void;
  onUpdateStudentInfo?: (name: string, grade: string, studentClass: string) => void;
  onOpenAndroidModal?: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  branding,
  onSaveBranding,
  onClose,
  onUpdateStudentInfo,
  onOpenAndroidModal
}) => {
  const [currentBranding, setCurrentBranding] = useState<SchoolBranding>({ ...branding });
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'country' | 'school' | 'student' | 'logo' | 'print' | 'audio'>('country');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio Engine Custom settings states
  const [audioSettings, setAudioSettings] = useState(() => getAudioSettings());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testText, setTestText] = useState('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، الرَّحْمَٰنِ الرَّحِيمِ.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cacheStats, setCacheStats] = useState<{ count: number; estimatedSizeKb: number }>({ count: 0, estimatedSizeKb: 0 });
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchMessage, setBatchMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyDirectLink = () => {
    const sName = localStorage.getItem('ibn_sinai_student_name') || 'طالب متميز';
    const sGrade = localStorage.getItem('ibn_sinai_student_grade') || '';
    const sCls = localStorage.getItem('ibn_sinai_student_class') || '';
    const link = generateStudentShareableLink(currentBranding, sName, sGrade, sCls, 'student_hub');
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const refreshCacheStats = async () => {
    try {
      const stats = await getAudioCacheStats();
      setCacheStats(stats);
    } catch (e) {}
  };

  React.useEffect(() => {
    saveAudioSettings(audioSettings);
  }, [audioSettings]);

  React.useEffect(() => {
    refreshCacheStats();
  }, [activeTab]);

  const handleBatchGenerateCurriculumAudio = async () => {
    setIsBatchGenerating(true);
    setBatchProgress(0);
    setBatchMessage('جاري بدء توليد وتخزين مقاطع المنهاج...');

    await precacheAllCurriculumAudio((prog) => {
      setBatchProgress(prog.percent);
      setBatchMessage(`${prog.statusText} (${prog.completedItems}/${prog.totalItems})`);
    });

    await refreshCacheStats();
    setIsBatchGenerating(false);
    setBatchMessage('تم حفظ كافة المقاطع الصوتية في الذاكرة بنجاح!');
  };

  const handleClearCache = async () => {
    await clearAudioCache();
    await refreshCacheStats();
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices.filter(v => v.lang.startsWith('ar')));
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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
    saveAudioSettings(audioSettings);
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

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-white text-emerald-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-600" />
            <span>نبرة وسرعة الصوت</span>
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

        {/* TAB 6: AUDIO ENGINE SETTINGS */}
        {activeTab === 'audio' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-right font-cairo">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <span className="text-3xl shrink-0 p-1 bg-white rounded-xl shadow-xs border border-emerald-100">🎙️</span>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-emerald-950 flex items-center gap-2">
                  <span>محرك النطق الصوتي بالذكاء الاصطناعي (AI Arabic Speech Studio)</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-600 text-white font-extrabold">24kHz استوديو</span>
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  توليد أصوات عربية فصيحة عالية النقاء للكلمات ومقاطعها التأسيسية، مع تخزين دائم محلي في التطبيق لإعادة التشغيل الفوري بدون استهلاك للإنترنت.
                </p>
              </div>
            </div>

            {/* TWO VOICE PERSONAS CARDS */}
            <div className="space-y-2">
              <label className="text-slate-900 font-black block text-xs">
                اختر نوع ونبرة صوت النطق في جميع أنحاء البرنامج:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PERSONA 1: TEACHER */}
                <div
                  onClick={() => setAudioSettings(prev => ({ ...prev, voicePersona: 'teacher', pitch: PERSONA_INFO.teacher.defaultPitch, rate: PERSONA_INFO.teacher.defaultRate }))}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between text-right ${
                    audioSettings.voicePersona === 'teacher'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  {audioSettings.voicePersona === 'teacher' && (
                    <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3" /> المفعل حالياً
                    </span>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 bg-white rounded-xl shadow-xs border border-slate-100">👩‍🏫</span>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 leading-tight">
                          النوع الأول: {PERSONA_INFO.teacher.name}
                        </h5>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {PERSONA_INFO.teacher.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-600 leading-relaxed">
                      {PERSONA_INFO.teacher.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSpeaking(true);
                        playArabicAudio('كِتَابٌ مُفِيدٌ، مَدْرَسَةُ الْعِلْمِ وَالْإِبْدَاعِ.', {
                          persona: 'teacher',
                          forceFallback: false
                        }).finally(() => setIsSpeaking(false));
                      }}
                      disabled={isSpeaking}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>تجربة صوت المعلمة</span>
                    </button>
                    <span className="text-[9px] text-slate-400 font-mono font-bold">Pitch: 1.0 | Rate: 0.85x</span>
                  </div>
                </div>

                {/* PERSONA 2: CHILD */}
                <div
                  onClick={() => setAudioSettings(prev => ({ ...prev, voicePersona: 'child', pitch: PERSONA_INFO.child.defaultPitch, rate: PERSONA_INFO.child.defaultRate }))}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between text-right ${
                    audioSettings.voicePersona === 'child'
                      ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                  }`}
                >
                  {audioSettings.voicePersona === 'child' && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3" /> المفعل حالياً
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 bg-white rounded-xl shadow-xs border border-slate-100">👦</span>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 leading-tight">
                          النوع الثاني: {PERSONA_INFO.child.name}
                        </h5>
                        <span className="text-[10px] text-amber-900 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {PERSONA_INFO.child.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-600 leading-relaxed">
                      {PERSONA_INFO.child.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSpeaking(true);
                        playArabicAudio('أَنَا أُحِبُّ الْقِرَاءَةَ، وَأَتَعَلَّمُ بِفَرَحٍ وَنَشَاطٍ!', {
                          persona: 'child',
                          forceFallback: false
                        }).finally(() => setIsSpeaking(false));
                      }}
                      disabled={isSpeaking}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>تجربة صوت البطل الصغير</span>
                    </button>
                    <span className="text-[9px] text-slate-400 font-mono font-bold">Pitch: 1.45 | Rate: 0.90x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI PERSISTENT AUDIO CACHE & BATCH GENERATOR */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black text-emerald-300">الذاكرة الصوتية الذكية المخزنة (Offline Audio Cache)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                  <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                    عدد المقاطع: <strong className="text-amber-400">{cacheStats.count}</strong>
                  </span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                    الحجم: <strong className="text-teal-300">{cacheStats.estimatedSizeKb} KB</strong>
                  </span>
                </div>
              </div>

              {isBatchGenerating ? (
                <div className="space-y-2 py-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300">
                    <span>{batchMessage}</span>
                    <span className="text-emerald-400 font-mono">{batchProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${batchProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleBatchGenerateCurriculumAudio}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-xs transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>⚡ توليد وتخزين أصوات الكلمات التأسيسية بالذكاء الاصطناعي</span>
                  </button>

                  {cacheStats.count > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCache}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/80 hover:text-red-300 border border-slate-700 text-slate-400 text-[11px] font-bold transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح الذاكرة المؤقتة</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Syllable Spelling and Tanween Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
              <label className="flex items-center justify-between gap-2 cursor-pointer p-1">
                <input
                  type="checkbox"
                  checked={audioSettings.syllableSpelling}
                  onChange={(e) => setAudioSettings(prev => ({ ...prev, syllableSpelling: e.target.checked }))}
                  className="w-4 h-4 text-emerald-700 accent-emerald-700 rounded-sm"
                />
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 block text-[11px]">التهجي المقطّع الممدود</span>
                  <span className="text-[9px] text-slate-500 block">نطق الكلمات مقسمة مع وقفة ٣٠٠ملي ثانية</span>
                </div>
              </label>

              <label className="flex items-center justify-between gap-2 cursor-pointer p-1 border-t sm:border-t-0 sm:border-r border-slate-200 sm:pr-3">
                <input
                  type="checkbox"
                  checked={audioSettings.tanweenSimplification}
                  onChange={(e) => setAudioSettings(prev => ({ ...prev, tanweenSimplification: e.target.checked }))}
                  className="w-4 h-4 text-emerald-700 accent-emerald-700 rounded-sm"
                />
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 block text-[11px]">تبسيط نطق التنوين الفصيح</span>
                  <span className="text-[9px] text-slate-500 block">نطق التنوين كنون ساكنة صريحة فصيحة</span>
                </div>
              </label>
            </div>

            {/* Speed and Pitch Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Rate Speed Selector */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-amber-950 font-bold text-[10.5px]">
                    {audioSettings.rate}x
                  </span>
                  <label className="text-slate-800 font-bold text-[11px]">سرعة النطق والقراءة:</label>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.5"
                  step="0.05"
                  value={audioSettings.rate}
                  onChange={(e) => setAudioSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[9.5px] text-slate-400">
                  <span>1.5x (سريع)</span>
                  <span>1.0x</span>
                  <span>0.75x (مستحسن)</span>
                  <span>0.4x (بطيء)</span>
                </div>
              </div>

              {/* Pitch Selector */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-amber-950 font-bold text-[10.5px]">
                    {audioSettings.pitch}
                  </span>
                  <label className="text-slate-800 font-bold text-[11px]">طبقة ونبرة الصوت (Pitch):</label>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={audioSettings.pitch}
                  onChange={(e) => setAudioSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[9.5px] text-slate-400">
                  <span>1.5 (رنان)</span>
                  <span>1.3 (طفولي)</span>
                  <span>1.0 (معتدل)</span>
                  <span>0.5 (عميق)</span>
                </div>
              </div>
            </div>

            {/* Live Pronunciation SandBox Tester */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/50 to-emerald-50/50 border border-amber-200 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold">
                  الصوت المحدد حالياً: <strong className="text-slate-900">{PERSONA_INFO[audioSettings.voicePersona].name}</strong>
                </span>
                <label className="text-slate-900 font-extrabold block text-xs">صندوق تجربة النطق المباشر:</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSpeaking(true);
                    playArabicAudio(testText, {
                      persona: audioSettings.voicePersona,
                      rate: audioSettings.rate,
                      pitch: audioSettings.pitch
                    }).finally(() => setIsSpeaking(false));
                  }}
                  disabled={isSpeaking}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-slate-950 font-black text-xs shrink-0 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'جاري النطق...' : 'تجربة النطق'}</span>
                </button>
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold text-right outline-hidden focus:border-amber-500"
                  placeholder="اكتب كلمة أو جملة لتجربة الصوت..."
                />
              </div>
            </div>

          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleCopyDirectLink}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                copiedLink 
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
              title="نسخ رابط الطالب المباشر حاملاً الشعار والبيانات المدخلة"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط الطالب'}</span>
            </button>

            {onOpenAndroidModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAndroidModal();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="تجهيز رمز الاستجابة السريعة وتطبيق الأندرويد"
              >
                <Smartphone className="w-4 h-4 text-emerald-800" />
                <span>تطبيق أندرويد و QR 📲</span>
              </button>
            )}

            <span className="text-[11px] text-slate-500 hidden md:inline">
              🇾🇪 {currentBranding.schoolName}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              إلغاء
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black transition flex items-center gap-2 shadow-md cursor-pointer"
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

