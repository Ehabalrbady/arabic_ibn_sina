import React, { useState } from 'react';
import { 
  Printer, 
  BookOpen, 
  FileText, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Sliders, 
  Sparkles, 
  Check, 
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ALL_BOOK_PAGES, getPagesByUnit } from '../data/bookData';
import { BOOK_UNITS } from '../data/unitsInfo';
import { BookPage, EvaluationSkill } from '../types/book';
import { SchoolBranding } from '../utils/schoolBranding';
import { PrintWorksheetDocument } from './PrintWorksheetDocument';
import { 
  generatePrintDocumentHtml, 
  printViaIsolatedIframe, 
  openPrintInNewWindow, 
  downloadPrintableFile 
} from '../utils/printHelper';

interface FullBookPrintViewProps {
  branding: SchoolBranding;
  onUpdateBranding: (branding: SchoolBranding) => void;
  studentName: string;
  studentGrade: string;
  studentClass: string;
  skills: EvaluationSkill[];
  onOpenLogoModal: () => void;
  onNavigateToInteractivePage: (pageNumber: number) => void;
}

export const FullBookPrintView: React.FC<FullBookPrintViewProps> = ({
  branding,
  onUpdateBranding,
  studentName,
  studentGrade,
  studentClass,
  skills,
  onOpenLogoModal,
  onNavigateToInteractivePage
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [currentViewPage, setCurrentViewPage] = useState<number>(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const getFilteredPages = (): BookPage[] => {
    if (selectedUnit === 'all') {
      return ALL_BOOK_PAGES;
    }
    return getPagesByUnit(selectedUnit);
  };

  const currentBatch = getFilteredPages();
  const activePage = currentBatch.find(p => p.pageNumber === currentViewPage) || currentBatch[0] || ALL_BOOK_PAGES[0];

  const handlePrintAll = async () => {
    setIsPrinting(true);
    setStatusMessage({ type: 'info', text: 'جاري تجهيز أمر الطباعة لجميع الصفحات المحددة...' });
    
    try {
      const html = generatePrintDocumentHtml({
        pages: currentBatch,
        branding,
        studentName,
        studentGrade,
        studentClass,
        skills
      });

      const printed = await printViaIsolatedIframe(html);
      if (printed) {
        setStatusMessage({ type: 'success', text: `تم إرسال ${currentBatch.length} صفحة إلى نافذة الطباعة بنجاح!` });
      } else {
        openPrintInNewWindow(html);
        setStatusMessage({ type: 'info', text: 'تم فتح مستند المنهج في نافذة منفصلة جاهزة للطباعة والتصدير كـ PDF.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'حدث خطأ أثناء الطباعة، يرجى المحاولة عبر زر التنزيل أو النافذة المستقلة.' });
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePrintSinglePage = async (page: BookPage) => {
    setIsPrinting(true);
    try {
      const html = generatePrintDocumentHtml({
        pages: [page],
        branding,
        studentName,
        studentGrade,
        studentClass,
        skills
      });
      const printed = await printViaIsolatedIframe(html);
      if (!printed) {
        openPrintInNewWindow(html);
      }
      setStatusMessage({ type: 'success', text: `تم إرسال الصفحة رقم ${page.pageNumber} للطباعة كصفحة A4 منفصلة.` });
    } catch (e) {
      console.error(e);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadHtml = () => {
    const html = generatePrintDocumentHtml({
      pages: currentBatch,
      branding,
      studentName,
      studentGrade,
      studentClass,
      skills
    });
    const scopeName = selectedUnit === 'all' ? 'المنهج_الكامل_121_صفحة' : `وحدة_${selectedUnit}`;
    downloadPrintableFile(html, `منهج_القراءة_والكتابة_${scopeName}.html`);
    setStatusMessage({ type: 'success', text: 'تم تنزيل ملف المنهج للطباعة بنجاح بصيغة مستقلة يمكن فتحها بأي وقت!' });
  };

  return (
    <div className="space-y-6 font-cairo max-w-7xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md text-xl">
              🖨️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded-lg text-xs">
                  نسخة مطابقة للكتاب الأصلي للطباعة A4
                </span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-lg text-xs">
                  ١٢١ صفحة متطابقة
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-1">
                منهج الخطة العلاجية الشامل للطباعة الورقية (A4)
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                جميع تدريبات ومحتويات الكتاب صفحة بصفحة بنفس التنسيق المعتمد، مع ترويسة المدرسة والوزارة ونظام المحاولات الأربع.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadHtml}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>تحميل ملف HTML للطباعة</span>
            </button>

            <button
              onClick={handlePrintAll}
              disabled={isPrinting}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>طباعة الكل ({currentBatch.length} صفحة)</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
            statusMessage.type === 'error' ? 'bg-rose-50 text-rose-900 border border-rose-200' :
            'bg-blue-50 text-blue-900 border border-blue-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Info className="w-4 h-4 text-blue-600" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Units / Filter Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => { setSelectedUnit('all'); setCurrentViewPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedUnit === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
              }`}
            >
              📚 المنهج كاملاً (١٢١ ص)
            </button>

            {BOOK_UNITS.map(unit => (
              <button
                key={unit.id}
                onClick={() => { 
                  setSelectedUnit(unit.id); 
                  const firstP = getPagesByUnit(unit.id)[0];
                  if (firstP) setCurrentViewPage(firstP.pageNumber);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedUnit === unit.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
                }`}
              >
                {unit.title}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenLogoModal}
            className="text-xs text-emerald-900 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition flex items-center gap-1"
          >
            <span>🏫 تخصيص ترويسة المدرسة والبيانات</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Page Quick Switcher */}
      <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const currentIdx = currentBatch.findIndex(p => p.pageNumber === currentViewPage);
              if (currentIdx > 0) {
                setCurrentViewPage(currentBatch[currentIdx - 1].pageNumber);
              }
            }}
            disabled={currentBatch.findIndex(p => p.pageNumber === currentViewPage) <= 0}
            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-800">
            الصفحة المعروضة: <strong className="text-emerald-900 text-sm">ص {activePage.pageNumber}</strong> من {ALL_BOOK_PAGES.length}
          </span>

          <button
            onClick={() => {
              const currentIdx = currentBatch.findIndex(p => p.pageNumber === currentViewPage);
              if (currentIdx < currentBatch.length - 1) {
                setCurrentViewPage(currentBatch[currentIdx + 1].pageNumber);
              }
            }}
            disabled={currentBatch.findIndex(p => p.pageNumber === currentViewPage) >= currentBatch.length - 1}
            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={activePage.pageNumber}
            onChange={(e) => setCurrentViewPage(Number(e.target.value))}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
          >
            {currentBatch.map(p => (
              <option key={p.pageNumber} value={p.pageNumber}>
                ص {p.pageNumber}: {p.title} ({p.unitTitle})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToInteractivePage(activePage.pageNumber)}
            className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-300 rounded-xl text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1 cursor-pointer"
            title="فتح هذه الصفحة في المستعرض التفاعلي مع الصوتيات ولوحة الرسم"
          >
            <span>🎧 فتح في المستعرض التفاعلي</span>
          </button>

          <button
            onClick={() => handlePrintSinglePage(activePage)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة هذه الصفحة (A4)</span>
          </button>
        </div>
      </div>

      {/* 3. High Fidelity Authentic Book Page Canvas Rendering (A4 Simulation) */}
      <div className="bg-slate-200/80 p-4 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-inner flex justify-center">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-400/60 max-w-[850px] w-full p-4 sm:p-8 overflow-hidden transition-all duration-200">
          <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 mb-3 flex items-center justify-between text-[11px] text-slate-500 font-bold">
            <span>📄 معاينة الصفحة الحقيقية للطباعة بنسبة 100% متطابقة مع الكتاب</span>
            <span>قياس الصفحة: A4 Standard (210mm × 297mm)</span>
          </div>

          <PrintWorksheetDocument
            pages={[activePage]}
            branding={branding}
            studentName={studentName}
            studentGrade={studentGrade}
            studentClass={studentClass}
            skills={skills}
          />
        </div>
      </div>

      {/* 4. Page Grid Selector for Quick Access */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>📑 فهرس صفحات المنهج السريع للطباعة ({currentBatch.length} صفحة):</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">اضغط على أي رقم للمعاينة الفورية</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2">
          {currentBatch.map(p => {
            const isSelected = p.pageNumber === activePage.pageNumber;
            return (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentViewPage(p.pageNumber)}
                className={`py-2 rounded-xl text-xs font-black border transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-amber-400'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-amber-100 hover:border-amber-400'
                }`}
                title={`ص ${p.pageNumber}: ${p.title}`}
              >
                <span>{p.pageNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
