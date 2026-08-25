import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  BookOpen, 
  FileText, 
  Layers, 
  Award, 
  Check, 
  Sliders, 
  Image as ImageIcon,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ALL_BOOK_PAGES, getPagesByUnit } from '../curriculum/bookData';
import { BOOK_UNITS } from '../curriculum/unitsInfo';
import { BookPage, EvaluationSkill } from '../curriculum/types';
import { SchoolBranding } from '../institutional_branding/schoolBranding';
import { PrintWorksheetDocument } from './PrintWorksheetDocument';
import { 
  generatePrintDocumentHtml, 
  printViaIsolatedIframe, 
  openPrintInNewWindow, 
  downloadPrintableFile 
} from './printHelper';

interface PrintCenterModalProps {
  currentPageNum: number;
  branding: SchoolBranding;
  onUpdateBranding: (updated: SchoolBranding) => void;
  onOpenLogoUpload: () => void;
  studentName: string;
  studentGrade: string;
  studentClass: string;
  setStudentClass: (cls: string) => void;
  skills: EvaluationSkill[];
  onClose: () => void;
  onSelectPrintBatch: (pages: BookPage[]) => void;
}

export type PrintScope = 'current' | 'all' | 'booklet' | 'unit' | 'mastery_quizzes' | 'worksheets_only' | 'evaluation_only';

export const PrintCenterModal: React.FC<PrintCenterModalProps> = ({
  currentPageNum,
  branding,
  onUpdateBranding,
  onOpenLogoUpload,
  studentName,
  studentGrade,
  studentClass,
  setStudentClass,
  skills,
  onClose,
  onSelectPrintBatch
}) => {
  const [printScope, setPrintScope] = useState<PrintScope>('current');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(BOOK_UNITS[1].id);
  const [previewPageIndex, setPreviewPageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'options' | 'preview'>('options');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Compute pages to print based on selected scope
  const getPagesForScope = (): BookPage[] => {
    switch (printScope) {
      case 'current':
        const cur = ALL_BOOK_PAGES.find(p => p.pageNumber === currentPageNum);
        return cur ? [cur] : [ALL_BOOK_PAGES[0]];
      case 'all':
      case 'booklet':
        return ALL_BOOK_PAGES;
      case 'unit':
        return getPagesByUnit(selectedUnitId);
      case 'mastery_quizzes':
        // Filter pages that are mastery evaluation or all unit quiz milestones
        return ALL_BOOK_PAGES.filter(p => p.unitId === 'evaluation' || p.pageType === 'letter_vowels' || p.pageNumber === 121 || p.pageType === 'conclusion');
      case 'worksheets_only':
        return ALL_BOOK_PAGES.filter(p => 
          p.pageType !== 'cover' && 
          p.pageType !== 'intro' && 
          p.pageType !== 'toc' && 
          p.pageType !== 'unit_cover'
        );
      case 'evaluation_only':
        return ALL_BOOK_PAGES.filter(p => p.pageNumber === 121);
      default:
        return [ALL_BOOK_PAGES[0]];
    }
  };

  const effectiveBranding = printScope === 'booklet' 
    ? { ...branding, bookletMode: true } 
    : branding;

  const pagesToPrint = getPagesForScope();
  const currentPreviewPage = pagesToPrint[Math.min(previewPageIndex, pagesToPrint.length - 1)] || pagesToPrint[0];

  const getFullHtml = () => {
    return generatePrintDocumentHtml({
      pages: pagesToPrint,
      branding: effectiveBranding,
      studentName,
      studentGrade,
      studentClass,
      skills
    });
  };

  // 1. Direct Print Method (with fallback)
  const handleExecuteDirectPrint = async () => {
    setIsPrinting(true);
    setStatusMessage({ type: 'info', text: 'جاري تجهيز أمر الطباعة وإرساله للطابعة...' });
    
    // Update print batch in state
    onSelectPrintBatch(pagesToPrint);

    const html = getFullHtml();
    const iframeSuccess = await printViaIsolatedIframe(html);
    
    if (!iframeSuccess) {
      // Fallback: trigger window.print directly
      setTimeout(() => {
        try {
          window.print();
          setStatusMessage({ type: 'success', text: 'تم إرسال أمر الطباعة بنجاح!' });
        } catch (e) {
          setStatusMessage({ 
            type: 'error', 
            text: 'لم تتمكن النافذة من الطباعة مباشرة بسبب قيود الإطار، يرجى الضغط على زر "فتح في نافذة مستقلة للطباعة".' 
          });
        }
      }, 100);
    } else {
      setStatusMessage({ type: 'success', text: 'تم تشغيل نافذة الطباعة بنجاح!' });
    }
    
    setIsPrinting(false);
  };

  // 2. Open in dedicated new tab/window (Guaranteed to work everywhere including mobile & iframes)
  const handleOpenNewWindow = () => {
    const html = getFullHtml();
    const opened = openPrintInNewWindow(html);
    if (opened) {
      setStatusMessage({ type: 'success', text: 'تم فتح نسخة الطباعة في صفحة مستقلة جاهزة للطباعة والحفظ كـ PDF!' });
    } else {
      setStatusMessage({ 
        type: 'error', 
        text: 'يرجى السماح بالنوافذ المنبثقة (Popups) أو استخدام زر التحميل أدناه.' 
      });
    }
  };

  // 3. Download standalone HTML
  const handleDownloadHtml = () => {
    const html = getFullHtml();
    const scopeName = printScope === 'all' ? 'المنهج_كاملا_121_صفحة' :
                      printScope === 'current' ? `صفحة_${currentPageNum}` :
                      printScope === 'unit' ? `وحدة_${selectedUnitId}` : 'أوراق_العمل';
    downloadPrintableFile(html, `مدارس_ابن_سيناء_${scopeName}.html`);
    setStatusMessage({ type: 'success', text: 'تم تنزيل ملف المطبوعات بنجاح، يمكنك فتحه وطباعته من أي جهاز!' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-cairo no-print modal-overlay">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-4xl w-full p-5 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                مركز الطباعة وإخراج منهج الطلاب A4
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                تجهيز وطباعة أوراق العمل والدروس والتمارين بصيغة A4 منسقة بجودة عالية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogoUpload}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5"
              title="رفع وتغيير شعار المدرسة"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">شعار المدرسة</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : statusMessage.type === 'error'
                ? 'bg-rose-50 text-rose-900 border border-rose-200'
                : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Navigation Mode Bar (Options vs Live Preview) */}
        <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('options')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTab === 'options'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>إعدادات ونطاق الطباعة</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة المطبوعات ({pagesToPrint.length} صفحة)</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-bold px-2">
            عدد الصفحات: <strong className="text-emerald-800 font-black">{pagesToPrint.length} صفحة</strong>
          </span>
        </div>

        {/* TAB 1: PRINT OPTIONS & SCOPE */}
        {activeTab === 'options' && (
          <div className="space-y-5">
            
            {/* 1. Scope Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-800 block">
                📋 اختر نوع ونطاق الطباعة:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                
                {/* Option 1: Current Page */}
                <button
                  onClick={() => { setPrintScope('current'); setPreviewPageIndex(0); }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'current'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">📄 ورقة عمل الصفحة الحالية</span>
                    <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">ص {currentPageNum}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    طباعة الدرس الحالي كورقة عمل مستقلة مع مساحة التدريب والتقييم.
                  </p>
                </button>

                {/* Option 2: Booklet Mode (A4 Booklet) */}
                <button
                  onClick={() => { 
                    setPrintScope('booklet'); 
                    setPreviewPageIndex(0);
                    onUpdateBranding({ ...branding, bookletMode: true });
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'booklet'
                      ? 'border-amber-600 bg-amber-50/80 shadow-md ring-2 ring-amber-400/40'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-amber-950 flex items-center gap-1.5">
                      <span>📖 كراسة التلميذ الكاملة المدمجة</span>
                    </span>
                    <span className="text-xs bg-amber-300 text-amber-950 font-black px-2 py-0.5 rounded">A4 Booklet</span>
                  </div>
                  <p className="text-[11px] text-amber-900 font-bold">
                    إخراج فوري للكتاب كاملاً مع هوامش التجليد المتناوبة والغلاف والفهرس المبوب.
                  </p>
                </button>

                {/* Option 3: Full 121-page Curriculum */}
                <button
                  onClick={() => { setPrintScope('all'); setPreviewPageIndex(0); }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'all'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">📘 المنهج كاملاً للتجليد</span>
                    <span className="text-xs bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded">١٢١ صفحة</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    طباعة الكتاب كاملاً (الغلاف + الفهرس + الـ 15 مهارة + سجل التقويم).
                  </p>
                </button>

                {/* Option 4: Mastery Quizzes Only */}
                <button
                  onClick={() => { 
                    setPrintScope('mastery_quizzes'); 
                    setPreviewPageIndex(0);
                    onUpdateBranding({ ...branding, enableMasteryQuizzes: true });
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'mastery_quizzes'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">⏱️ ملحق قياس الأثر والطلاقة</span>
                    <span className="text-xs bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded">اختبارات بعد الوحدات</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    اختبارات قياس سرعة القراءة (كلمة/دقيقة) ولوحة الإملاء الاختباري المعتمد.
                  </p>
                </button>

                {/* Option 5: Specific Unit */}
                <button
                  onClick={() => { setPrintScope('unit'); setPreviewPageIndex(0); }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'unit'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">📚 وحدة دراسية محددة</span>
                    <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">وحدة</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    طباعة جميع دروس وتدريبات مهارة معينة (كالمدود، أو التنوين، أو الشدة).
                  </p>
                </button>

                {/* Option 6: Worksheets Only */}
                <button
                  onClick={() => { setPrintScope('worksheets_only'); setPreviewPageIndex(0); }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'worksheets_only'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">📝 كراسة التدريبات والواجبات</span>
                    <span className="text-xs bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded">تمارين فقط</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    استبعاد صفحات الأغلفة والفهارس وطباعة صفحات التطبيق العملي.
                  </p>
                </button>

                {/* Option 7: Evaluation Sheet Only */}
                <button
                  onClick={() => { setPrintScope('evaluation_only'); setPreviewPageIndex(0); }}
                  className={`p-3.5 rounded-2xl border-2 text-right transition flex flex-col justify-between gap-2 ${
                    printScope === 'evaluation_only'
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">📊 سجل القياس والتقويم</span>
                    <span className="text-xs bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded">ص ١٢١</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    طباعة استمارة المتابعة الشاملة لـ ١٥ مهارة بالمحاولات الـ 4 والتوقيعات.
                  </p>
                </button>

              </div>
            </div>

            {/* Unit Dropdown if Unit Scope Selected */}
            {printScope === 'unit' && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                <label className="text-xs font-black text-blue-950 block">
                  اختر الوحدة المراد طباعتها:
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-hidden"
                >
                  {BOOK_UNITS.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.number}. {unit.title} (ص {unit.startPage} - ص {unit.endPage})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 2. Layout Customization Toggles (Pedagogical Best Practices) */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 block">
                  ⚙️ تجويد المنهج وتخصيص المخرجات المطبوعة:
                </label>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  يمكنك تفعيل أو تعطيل أي خاصية للمعاينة والتأكد
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Toggle 1: 4-Line Handwriting Grids */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block flex items-center gap-1">
                      <span>خطوط شبكة النسخ الدقيقة (4-Line Handwriting Grids)</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">جديد</span>
                    </span>
                    <span className="text-[11px] text-slate-500">شبكة رسم الحروف (صاعد، وسط، أساس، هابط) لمحاكاة كراسات الخط الرسمية</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.show4LineGrid !== false}
                    onChange={(e) => onUpdateBranding({ ...branding, show4LineGrid: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                {/* Toggle 2: QR Code */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block flex items-center gap-1">
                      <span>رمز الاستجابة السريعة (QR Code) للنطق الصوتي</span>
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-black">ذكي</span>
                    </span>
                    <span className="text-[11px] text-slate-500">رمز QR أعلى الصفحة يتيح لولي الأمر مسحه والاستماع للنطق الفوري</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.showQRCode !== false}
                    onChange={(e) => onUpdateBranding({ ...branding, showQRCode: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                {/* Toggle 3: Unit Mastery Quizzes */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block flex items-center gap-1">
                      <span>ملحق اختبارات قياس الأثر بعد كل وحدة (Mastery Quizzes)</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-black">معياري</span>
                    </span>
                    <span className="text-[11px] text-slate-500">إدراج صفحة تقويم الطلاقة وسرعة القراءة (كلمة/دقيقة) والإملاء الاختباري</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.enableMasteryQuizzes !== false}
                    onChange={(e) => onUpdateBranding({ ...branding, enableMasteryQuizzes: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                {/* Toggle 4: Booklet Mode Margins */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">تنسيق الكراسة المدمجة (Booklet Mode)</span>
                    <span className="text-[11px] text-slate-500">موازنة الهوامش المتناوبة يميناً ويساراً للتجليد والتدبيس المكتبي</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.bookletMode || false}
                    onChange={(e) => onUpdateBranding({ ...branding, bookletMode: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                {/* Toggle 5: Evaluation Box */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">صندوق تقييم وتوقيع المعلم وولي الأمر</span>
                    <span className="text-[11px] text-slate-500">خانة إتقان المهارة وتوقيع المتابعة أسفل كل ورقة</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.showEvaluationBoxInPrint}
                    onChange={(e) => onUpdateBranding({ ...branding, showEvaluationBoxInPrint: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                {/* Toggle 6: Student Info Header */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">إظهار شريط بيانات الطالب في الترويسة</span>
                    <span className="text-[11px] text-slate-500">خانة اسم الطالب، الصف، الفصل، والتاريخ</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.showStudentInfoInPrint}
                    onChange={(e) => onUpdateBranding({ ...branding, showStudentInfoInPrint: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                {/* Toggle 7: Ink-Saver Mode */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-amber-50/50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">نمط توفير الحبر (أبيض وأسود عالي التباين)</span>
                    <span className="text-[11px] text-slate-500">مناسب لآلات التصوير وطابعات الليزر المدرسية</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={branding.inkSaverMode}
                    onChange={(e) => onUpdateBranding({ ...branding, inkSaverMode: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

              </div>
            </div>

            {/* Quick Student and School Administration Customization */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🇾🇪</span>
                  <span className="font-black text-emerald-950">بيانات الطالب والمدرسة والبلد المطبوعة:</span>
                </div>
                <button
                  onClick={onOpenLogoUpload}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>تعديل الشعار وكافة البيانات</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">اسم التلميذ/ة:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => onUpdateBranding({ ...branding, studentName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    placeholder="اسم الطالب"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">الصف الدراسي:</label>
                  <input
                    type="text"
                    value={studentGrade}
                    onChange={(e) => onUpdateBranding({ ...branding, studentGrade: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    placeholder="الصف الأول الابتدائي"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">الشعبة / الفصل:</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => {
                      setStudentClass(e.target.value);
                      onUpdateBranding({ ...branding, studentClass: e.target.value });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 text-center"
                    placeholder="شعبة (أ)"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between text-[11px] text-slate-600 flex-wrap gap-2">
                <div>
                  <span className="font-bold text-emerald-900">المدرسة: </span>
                  <span className="font-extrabold text-slate-900">{branding.schoolName}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-900">الدولة: </span>
                  <span className="font-extrabold text-slate-900">{branding.countryName || 'الجمهورية اليمنية'}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-900">العام: </span>
                  <span className="font-extrabold text-slate-900">{branding.academicYear || '1446-1447هـ'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            
            {/* Preview Pagination Controls */}
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-2xl">
              <button
                onClick={() => setPreviewPageIndex(Math.max(0, previewPageIndex - 1))}
                disabled={previewPageIndex <= 0}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الصفحة السابقة</span>
              </button>

              <span className="text-xs font-black text-slate-800">
                معاينة الورقة {previewPageIndex + 1} من {pagesToPrint.length} (ص {currentPreviewPage.pageNumber}: {currentPreviewPage.title})
              </span>

              <button
                onClick={() => setPreviewPageIndex(Math.min(pagesToPrint.length - 1, previewPageIndex + 1))}
                disabled={previewPageIndex >= pagesToPrint.length - 1}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold disabled:opacity-30 flex items-center gap-1"
              >
                <span>الصفحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* A4 Preview Container */}
            <div className="max-h-[50vh] overflow-y-auto p-4 bg-slate-200/80 rounded-2xl border-2 border-slate-300 flex justify-center">
              <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 transform origin-top">
                <PrintWorksheetDocument
                  pages={[currentPreviewPage]}
                  branding={branding}
                  studentName={studentName}
                  studentGrade={studentGrade}
                  studentClass={studentClass}
                  skills={skills}
                />
              </div>
            </div>

          </div>
        )}

        {/* Multi-Method Print & Export Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadHtml}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-300"
              title="تحميل ملف HTML منسق لفتحه وطباعته من أي جهاز"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>تحميل ملف المطبوعات</span>
            </button>

            <button
              onClick={handleOpenNewWindow}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-blue-300"
              title="فتح المنهج في نافذة جديدة مستقلة للطباعة أو الحفظ كـ PDF"
            >
              <ExternalLink className="w-4 h-4 text-blue-700" />
              <span>فتح بنافذة مستقلة / PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              إغلاق
            </button>

            <button
              onClick={handleExecuteDirectPrint}
              disabled={isPrinting}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md hover:scale-105 disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{isPrinting ? 'جاري تجهيز الطباعة...' : `طباعة فورية (${pagesToPrint.length} ص)`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
