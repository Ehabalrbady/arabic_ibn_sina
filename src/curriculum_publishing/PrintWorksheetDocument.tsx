import React from 'react';
import { BookPage, EvaluationSkill } from '../curriculum/types';
import { SchoolBranding } from '../institutional_branding/schoolBranding';
import { IbnSinaLogo } from '../institutional_branding/IbnSinaLogo';
import { SyllableHighlighter } from '../phonological_awareness/syllableHighlighter';
import { calculatePageLayoutDensity } from '../curriculum/smartContainment';

interface PrintWorksheetDocumentProps {
  pages: BookPage[];
  branding: SchoolBranding;
  studentName: string;
  studentGrade: string;
  studentClass?: string;
  skills?: EvaluationSkill[];
}

const pageHasExercises = (p: BookPage): boolean => {
  if (p.pageType === 'cover' || p.pageType === 'unit_cover' || p.pageType === 'toc' || p.pageType === 'intro' || p.pageType === 'conclusion' || p.pageNumber === 121) {
    return false;
  }
  return !!(
    (p.content?.gridItems && p.content.gridItems.length > 0) ||
    (p.content?.connectExercises && p.content.connectExercises.length > 0) ||
    (p.content?.analysisWords && p.content.analysisWords.length > 0) ||
    (p.content?.sentences && p.content.sentences.length > 0) ||
    (p.content?.sortingItems && p.content.sortingItems.length > 0) ||
    (p.content?.pictureBlanks && p.content.pictureBlanks.length > 0) ||
    (p.content?.colorItems && p.content.colorItems.length > 0) ||
    (p.content?.dictationSuggestedWords && p.content.dictationSuggestedWords.length > 0) ||
    p.pageType === 'dictation_board'
  );
};

export const PrintWorksheetDocument: React.FC<PrintWorksheetDocumentProps> = ({
  pages,
  branding,
  studentName,
  studentGrade,
  studentClass = '١ / أ',
  skills = []
}) => {
  return (
    <div className="print-document-root font-cairo bg-white text-slate-900">
      {pages.map((page, index) => {
        const isCover = page.pageType === 'cover';
        const isEvaluation = page.pageType === 'conclusion' || page.pageNumber === 121;
        const isToc = page.pageType === 'toc';
        const hasExercises = pageHasExercises(page);
        const printDensity = calculatePageLayoutDensity(page);
        const printCols = printDensity.recommendedCols;

        return (
          <div 
            key={page.pageNumber || index} 
            className={`print-page-container w-full bg-white box-border text-right p-5 relative flex flex-col justify-between ${
              branding.inkSaverMode ? 'ink-saver' : ''
            }`}
            style={{ 
              height: '100%',
              maxHeight: '280mm', 
              boxSizing: 'border-box',
              overflow: 'hidden', 
              pageBreakInside: 'avoid', 
              pageBreakAfter: 'always', 
              breakAfter: 'page' 
            }}
          >
            {/* ========================================================================= */}
            {/* 1. DOCUMENT HEADER */}
            {/* ========================================================================= */}
            {!isCover && (
              <header className="border-b-2 border-slate-900 pb-2 mb-2 shrink-0">
                <div className="flex items-center justify-between gap-3">
                  {/* Right: School Logo & Name */}
                  <div className="flex items-center gap-2">
                    {branding.showLogoInPrint && (
                      <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                        <IbnSinaLogo 
                          size="md" 
                          showText={false} 
                          customLogoUrl={branding.logoUrl} 
                          schoolName={branding.schoolName}
                        />
                      </div>
                    )}
                    <div className="text-right">
                      <h1 className="text-xs font-black text-emerald-950 tracking-tight leading-tight">
                        {branding.schoolName}
                      </h1>
                      <p className="text-[9px] font-bold text-amber-800">
                        {branding.departmentName}
                      </p>
                    </div>
                  </div>

                  {/* Center: Curriculum / Unit Title */}
                  <div className="text-center px-2">
                    <span className="inline-block bg-slate-100 border border-slate-400 text-slate-900 px-3 py-0.5 rounded-full text-[11px] font-black">
                      {page.unitTitle}
                    </span>
                    <h2 className="text-xs font-black text-slate-900 mt-0.5">
                      {page.title}
                    </h2>
                  </div>

                  {/* Left: Page Number Badge */}
                  <div className="text-left shrink-0">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-xs shadow-2xs">
                      {page.pageNumber}
                    </div>
                    <span className="block text-[8px] text-slate-500 font-bold mt-0.5 text-center">
                      ص {page.pageNumber} من ١٢١
                    </span>
                  </div>
                </div>
              </header>
            )}

            {/* ========================================================================= */}
            {/* 2. BODY CONTENT */}
            {/* ========================================================================= */}
            <main className="flex-1 overflow-hidden space-y-2.5">
              
              {/* COVER PAGE PRINT FORMAT */}
              {isCover && (
                <div className="h-full flex flex-col justify-between items-center text-center p-6 border-4 double border-emerald-900 rounded-3xl bg-white relative">
                  
                  {/* Top Administration Header */}
                  <div className="w-full flex items-center justify-between border-b-2 border-emerald-900 pb-2">
                    <div className="text-right text-xs space-y-0.5 font-bold">
                      <p className="font-black text-sm text-emerald-900">{branding.countryName || 'الجمهورية اليمنية'}</p>
                      <p className="text-slate-800 text-[11px]">{branding.ministryName || 'وزارة التربية والتعليم والبحث العلمي'}</p>
                      <p className="text-slate-600 text-[10px]">{branding.governorateName || 'أمانة العاصمة / صنعاء'}</p>
                      <p className="text-slate-600 text-[10px]">{branding.directorateName || 'منطقة معين التعليمية'}</p>
                    </div>

                    <div className="w-16 h-16 flex items-center justify-center">
                      <IbnSinaLogo 
                        size="xl" 
                        showText={false} 
                        customLogoUrl={branding.logoUrl} 
                        schoolName={branding.schoolName}
                      />
                    </div>

                    <div className="text-left text-xs space-y-0.5 font-bold">
                      <p className="font-black text-sm text-emerald-900">{branding.schoolName}</p>
                      <p className="text-amber-800 text-[11px]">{branding.departmentName}</p>
                      <span className="inline-block bg-amber-50 text-amber-900 border border-amber-300 text-[10px] px-2 py-0.5 rounded-md mt-1">
                        {branding.academicYear || '1446-1447هـ'}
                      </span>
                    </div>
                  </div>

                  {/* Bismillah Calligraphy */}
                  <div className="text-base font-bold text-emerald-950 font-amiri my-1">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>

                  {/* Hero Curriculum Section */}
                  <div className="my-2 space-y-2.5 max-w-lg">
                    <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full font-black text-xs inline-block">
                      الحقيبة التأسيسية الشاملة لمعالجة الضعف القرائي والإملائي
                    </span>
                    <h1 className="text-2xl font-black text-emerald-950 leading-tight">
                      الخطة العلاجية لمهارات القراءة والكتابة
                    </h1>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed border-y border-slate-300 py-2">
                      برنامج نوعي متدرج وشامل لمعالجة جوانب القصور القرائي والإملائي وتأسيس الطالب في القراءة السريعة والتحليل الصوتي وقواعد الإملاء
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-black text-slate-700">
                      <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">١٢١ صفحة علاجية متكاملة</span>
                      <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">١٥ مهارة تأسيسية</span>
                      <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">نظام التتبع والكتابة والتطبيق</span>
                    </div>
                  </div>

                  {/* Comprehensive Student & Administration Profile Card */}
                  <div className="w-full max-w-lg bg-slate-50 border-2 border-emerald-900 rounded-xl overflow-hidden text-right text-xs font-bold shadow-2xs">
                    <div className="bg-emerald-900 text-white px-3 py-1 text-center font-black text-xs">
                      بطاقة بيانات التلميذ والهيئة التعليمية والإشرافية
                    </div>
                    <div className="p-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span className="text-slate-600 text-[11px]">اسم التلميذ/ة:</span>
                        <span className="text-slate-950 font-black text-[11px]">{studentName || branding.studentName || '................................'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span className="text-slate-600 text-[11px]">الصف والشعبة:</span>
                        <span className="text-slate-950 text-[11px]">{studentGrade || branding.studentGrade} ({studentClass || branding.studentClass})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span className="text-slate-600 text-[11px]">المدرسة:</span>
                        <span className="text-slate-950 font-black text-[11px]">{branding.schoolName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span className="text-slate-600 text-[11px]">معلم/ة المادة:</span>
                        <span className="text-slate-950 text-[11px]">{branding.teacherName || '................................'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span className="text-slate-600 text-[11px]">المشرف التربوي:</span>
                        <span className="text-slate-950 text-[11px]">{branding.supervisorName || '................................'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span className="text-slate-600 text-[11px]">مدير المدرسة:</span>
                        <span className="text-slate-950 text-[11px]">{branding.principalName || '................................'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Footer */}
                  <div className="w-full pt-2 border-t-2 border-emerald-900 text-[10px] text-slate-600 flex items-center justify-between font-bold">
                    <span>{branding.countryName || 'الجمهورية اليمنية'} — {branding.ministryName || 'وزارة التربية والتعليم'}</span>
                    <span>{branding.schoolName} — {branding.departmentName}</span>
                    <span>العام الدراسي: {branding.academicYear || '1446-1447هـ'}</span>
                  </div>
                </div>
              )}

              {/* TOC PAGE PRINT FORMAT */}
              {isToc && (
                <div className="space-y-3">
                  <div className="bg-slate-100 border border-slate-400 p-2 rounded-xl text-center font-black text-xs text-slate-900">
                    فهرس موضوعات ومهارات الخطة العلاجية (١٢١ صفحة علاجية شاملة)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {page.content?.items?.map((item, idx) => (
                      <div key={idx} className="border border-slate-800 rounded-lg p-2 bg-white flex items-center justify-between font-black text-xs">
                        <span className="text-slate-900">{item}</span>
                        <span className="border border-slate-300 bg-slate-50 px-2 py-0.5 rounded text-[10px] text-slate-600">مكتمل</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NON-COVER & NON-EVALUATION & NON-TOC PAGES */}
              {!isCover && !isEvaluation && !isToc && (
                <div className="space-y-2">
                  
                  {/* UNIT COVER PRINT FORMAT */}
                  {page.pageType === 'unit_cover' && (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6 border-2 border-slate-800 rounded-2xl bg-slate-50 space-y-4 my-2">
                      <span className="px-4 py-1 bg-slate-200 border border-slate-500 text-slate-900 rounded-full font-black text-xs">
                        {page.unitTitle}
                      </span>
                      <h2 className="text-2xl font-black text-slate-950">
                        {page.title}
                      </h2>
                      {page.subtitle && (
                        <p className="text-sm font-bold text-slate-700 border-y border-slate-300 py-2 max-w-md">
                          {page.subtitle}
                        </p>
                      )}
                      <div className="p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 max-w-md leading-relaxed font-bold">
                        تهدف هذه الوحدة لتأسيس الطالب في المهارة المستهدفة بالتدريج عبر القراءة السريعة والتحليل الصوتي والنسخ والتطبيق الإملائي.
                      </div>
                    </div>
                  )}

                  {/* Goal and Procedure */}
                  {(page.goal || page.procedure) && (
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-300">
                      {page.goal && (
                        <div>
                          <strong className="text-slate-900 block font-black">🎯 الهدف التعليمي:</strong>
                          <span className="text-slate-700">{page.goal}</span>
                        </div>
                      )}
                      {page.procedure && (
                        <div>
                          <strong className="text-slate-900 block font-black">📋 طريقة التنفيذ:</strong>
                          <span className="text-slate-700">{page.procedure}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rule Notice */}
                  {page.ruleNotice && (
                    <div className="bg-slate-100 border-r-4 border-slate-800 p-1.5 rounded text-[11px] font-bold text-slate-900">
                      📌 إرشاد وتنبيه: {page.ruleNotice}
                    </div>
                  )}

                  {/* INTRO / CONCLUSION TEXT */}
                  {page.content?.text && page.pageType !== 'unit_cover' && (
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed font-medium">
                      {page.content.text}
                    </div>
                  )}

                  {/* RULE BOXES & PAGE 59 RASUL SPOTLIGHT */}
                  {page.pageNumber === 59 && (
                    <div className="border-2 border-slate-900 rounded-xl p-3 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                        <span className="font-black text-xs text-slate-900">📜 التحليل الصوتي المقطعي لكلمة: ( رَسُولُ )</span>
                        <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">مد بالواو (صوت طويل)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="border border-slate-400 bg-white p-2 rounded-lg">
                          <span className="text-[9px] text-slate-500 font-bold block">١. صوت قصير مفتوح</span>
                          <span className="text-2xl font-black font-amiri text-slate-900">رَ</span>
                        </div>
                        <div className="border-2 border-slate-900 bg-slate-100 p-2 rounded-lg">
                          <span className="text-[9px] text-slate-800 font-black block">٢. مقطع مد بالواو</span>
                          <span className="text-2xl font-black font-amiri text-slate-900">سُو</span>
                        </div>
                        <div className="border border-slate-400 bg-white p-2 rounded-lg">
                          <span className="text-[9px] text-slate-500 font-bold block">٣. صوت قصير مضموم</span>
                          <span className="text-2xl font-black font-amiri text-slate-900">لُ</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {page.content?.ruleBoxes && page.pageNumber !== 59 && (
                    <div className={`grid gap-2 ${printCols === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-2'}`}>
                      {page.content.ruleBoxes.map((box, bIdx) => (
                        <div key={bIdx} className="border border-slate-700 p-2.5 rounded-xl bg-white">
                          <h4 className="font-black text-xs text-slate-900 mb-1 border-b border-slate-300 pb-1">
                            {box.title}
                          </h4>
                          <p className="text-[10px] text-slate-700 mb-1.5">{box.body}</p>
                          <div className="text-[10px] bg-slate-100 p-1 rounded font-bold text-slate-900">
                            أمثلة: {box.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* LETTER VOWELS (PAGE 6) */}
                  {page.pageType === 'letter_vowels' && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-700 text-center">
                        اقرأ الحروف بالحركات الثلاث (فتحة - كسرة - ضمة) ثم اكتب كل حرف بخط جميل:
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                        {page.content?.gridItems?.map((group, idx) => (
                          <div key={idx} className="border border-slate-800 rounded-lg p-1.5 bg-white flex flex-col gap-1 text-center">
                            <div className="border border-slate-300 bg-slate-50 rounded p-0.5">
                              <span className="text-[8px] text-slate-500 font-bold block">النموذج</span>
                              <span className="text-xl font-black block text-slate-900 font-amiri leading-tight">{group}</span>
                            </div>
                            <div className="border border-dashed border-slate-400 bg-slate-50/50 rounded p-0.5">
                              <span className="text-[8px] text-slate-500 font-bold block">١. تتبع</span>
                              <span className="text-xl font-black block arabic-dotted-tracing leading-tight font-amiri">{group}</span>
                            </div>
                            <div className="border border-slate-700 rounded p-0.5 bg-white">
                              <span className="text-[8px] text-slate-500 font-bold block">٢. اكتب</span>
                              <div className="arabic-4line-container compact" style={{ height: '22px' }}>
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RANDOM LETTERS / TWO LETTERS / WORDS READING GRIDS (FLEXIBLE AUTO-SIZED WORDS) */}
                  {(page.pageType === 'letter_random' || 
                    page.pageType === 'two_letters_reading' || 
                    page.pageType === 'words_reading' || 
                    page.pageType === 'madd_comparison') && (
                    <div className="space-y-2">
                      <div className={`grid gap-2 ${
                        page.pageType === 'letter_random' 
                          ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-7' 
                          : page.pageType === 'two_letters_reading' 
                            ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' 
                            : (page.content?.gridItems && page.content.gridItems.length > 18)
                              ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
                              : 'grid-cols-3 sm:grid-cols-4'
                      }`}>
                        {page.content?.gridItems?.map((word, idx) => (
                          <div 
                            key={idx} 
                            className="border-2 border-slate-800 rounded-xl p-2 bg-white flex flex-col justify-center items-center text-center shadow-2xs min-h-[50px]"
                          >
                            <span className="text-2xl sm:text-3xl font-black text-slate-950 font-amiri block leading-tight py-0.5">
                              <SyllableHighlighter text={word} showArcs={false} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WRITTEN TRACING & COPYING EXERCISES (تدريبات النسخ والتتبع الرأسية) */}
                  {page.pageType === 'written_tracing' && (
                    <div className="space-y-2">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 flex items-center justify-between text-xs font-black text-slate-900">
                        <span>تدريب كتابي: اقرأ النموذج ➜ تتبع المقطع المنقط ➜ اكتب على سطر الأساس:</span>
                      </div>

                      <div className={`grid gap-2 ${
                        printCols === 1 
                          ? 'grid-cols-1 max-w-xl mx-auto' 
                          : (page.content?.gridItems && page.content.gridItems.length > 8)
                            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                            : 'grid-cols-2 sm:grid-cols-3'
                      }`}>
                        {page.content?.gridItems?.map((item, idx) => (
                          <div key={idx} className="border-2 border-slate-900 rounded-xl p-2 bg-white flex flex-col gap-1 shadow-2xs">
                            {/* 1. Model */}
                            <div className="border border-slate-300 bg-slate-50 rounded-lg p-1 text-center">
                              <span className="text-[9px] text-slate-500 font-bold block text-right">النموذج</span>
                              <span className="text-2xl sm:text-3xl font-black font-amiri text-slate-950 py-0.5 leading-tight block">
                                {item}
                              </span>
                            </div>

                            {/* 2. Dotted */}
                            <div className="border border-dashed border-slate-400 bg-slate-50/50 rounded-lg p-1 text-center">
                              <span className="text-[9px] text-slate-500 font-bold block text-right">١. تتبع ✏️</span>
                              <span className="arabic-dotted-tracing text-2xl sm:text-3xl font-black py-0.5 leading-tight block font-amiri">
                                {item}
                              </span>
                            </div>

                            {/* 3. Handwriting Grid Box */}
                            <div className="border border-slate-800 bg-white rounded-lg p-1 flex flex-col justify-between">
                              <span className="text-[9px] text-slate-600 font-bold block text-right">٢. اكتب على السطر</span>
                              <div className="arabic-4line-container compact mt-0.5">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CONNECT AND READ EXERCISES (صل واقرأ) */}
                  {page.pageType === 'connect_and_read' && (
                    <div className="space-y-2">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 text-xs font-black text-slate-900">
                        صل الحروف المنفصلة ➜ تتبع الكلمة المنقطة بقلم الرصاص ➜ اكتب الكلمة متصلة:
                      </div>
                      <div className={`grid gap-2 ${
                        printCols === 1 
                          ? 'grid-cols-1 max-w-xl mx-auto' 
                          : (page.content?.connectExercises && page.content.connectExercises.length > 6)
                            ? 'grid-cols-2 sm:grid-cols-3'
                            : 'grid-cols-1 sm:grid-cols-2'
                      }`}>
                        {page.content?.connectExercises?.map((ex, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2 flex flex-col gap-1 bg-white shadow-2xs">
                            <div className="border border-slate-300 bg-slate-50 rounded-lg p-1 text-center">
                              <span className="text-[9px] text-slate-500 font-bold block text-right">المقاطع منفصلة</span>
                              <span className="bg-emerald-50 text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-md font-amiri font-black text-xl inline-block mx-auto">
                                {ex.separated}
                              </span>
                            </div>
                            <div className="border border-dashed border-slate-400 bg-slate-50/50 rounded-lg p-1 text-center">
                              <span className="text-[9px] text-slate-500 font-bold block text-right">١. تتبع متصل ✏️</span>
                              <span className="arabic-dotted-tracing text-2xl font-black py-0.5 font-amiri leading-tight block">
                                {ex.combined}
                              </span>
                            </div>
                            <div className="border border-slate-800 rounded-lg p-1 bg-white flex flex-col justify-between">
                              <span className="text-[9px] text-slate-600 font-bold block text-right">٢. اكتب الكلمة متصلة</span>
                              <div className="arabic-4line-container compact mt-0.5">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ANALYSIS SYLLABLES (تحليل المقاطع الصوتية مع سطر كتابة الكلمة كاملة) */}
                  {page.pageType === 'analysis_syllables' && (
                    <div className="space-y-2">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 text-xs font-black text-slate-900">
                        حلل الكلمات إلى مقاطعها الصوتية ثم اكتب الكلمة كاملة على السطر المخصص:
                      </div>
                      <div className={`grid gap-2 ${printCols === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        {page.content?.analysisWords?.map((item, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2.5 bg-white shadow-2xs space-y-1.5">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                              <span className="text-2xl font-black text-slate-950 font-amiri">{item.word}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500 font-bold ml-1">المقاطع:</span>
                                {item.syllables.map((syl, sIdx) => (
                                  <span key={sIdx} className="border border-dashed border-slate-400 bg-slate-50 px-2 py-0.5 rounded text-base font-black arabic-dotted-tracing font-amiri">
                                    {syl}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-0.5">
                              <span className="text-[10px] text-slate-700 font-black shrink-0">كتابة الكلمة كاملة:</span>
                              <div className="flex-1 border-b-2 border-dotted border-slate-600 h-5"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SENTENCES READING (2 SENTENCES PER ROW HORIZONTALLY) */}
                  {page.pageType === 'sentences_reading' && (
                    <div className="space-y-2">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 text-xs font-black text-slate-900">
                        اقرأ الجمل التالية بطلاقة ➜ تتبع المنقط ➜ اكتب الجملة بخط النسخ على السطر:
                      </div>
                      <div className={`grid gap-2 ${printCols === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-2'}`}>
                        {page.content?.sentences?.map((sentence, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2 space-y-1 bg-white shadow-2xs">
                            {/* Model */}
                            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 bg-slate-50 p-1 rounded-lg">
                              <span className="text-[10px] font-black text-slate-600 shrink-0">النموذج:</span>
                              <div className="text-base font-black text-slate-950 font-amiri flex-1 leading-tight">
                                {sentence}
                              </div>
                            </div>
                            {/* Dotted */}
                            <div className="flex items-center gap-1.5 border border-dashed border-slate-400 p-1 rounded-lg bg-slate-50/50">
                              <span className="text-[10px] font-black text-slate-500 shrink-0">١. تتبع:</span>
                              <div className="text-base font-black arabic-dotted-tracing flex-1 leading-tight">
                                {sentence}
                              </div>
                            </div>
                            {/* Write */}
                            <div className="flex items-center gap-1.5 border border-slate-700 p-1 rounded-lg bg-white">
                              <span className="text-[10px] font-black text-slate-700 shrink-0">٢. اكتب:</span>
                              <div className="flex-1">
                                <div className="arabic-4line-container compact" style={{ height: '22px' }}>
                                  <div className="grid-line line-ascender"></div>
                                  <div className="grid-line line-waist"></div>
                                  <div className="grid-line line-base"></div>
                                  <div className="grid-line line-descender"></div>
                                  <span className="grid-guide-indicator">ـ✍️ـ</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DICTATION BOARD WORKSHEET */}
                  {page.pageType === 'dictation_board' && (
                    <div className="space-y-2.5">
                      <div className="bg-slate-100 border border-slate-400 p-2 rounded-xl text-center">
                        <h3 className="text-sm font-black text-slate-900">لوحة الإملاء الصوتي والاختبار الإملائي</h3>
                        <p className="text-[11px] text-slate-600 font-bold">استمع للمعلم واكتب الكلمة بدقة في الخانة المخصصة على سطر الأساس:</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: Math.min(10, Math.max(8, page.content?.dictationSuggestedWords?.length || 8)) }).map((_, dIdx) => (
                          <div key={dIdx} className="border-2 border-slate-800 rounded-xl p-1.5 bg-white flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                {dIdx + 1}
                              </span>
                              <span className="text-[11px] text-slate-500 font-bold">الكلمة:</span>
                            </div>
                            <div className="flex-1">
                              <div className="arabic-4line-container compact">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>
                            <div className="border border-slate-300 px-1 py-0.5 rounded text-[9px] text-slate-500 font-bold shrink-0">
                              [ ] صحيح
                            </div>
                          </div>
                        ))}
                      </div>

                      {page.content?.dictationSuggestedWords && (
                        <div className="mt-2 p-2 bg-slate-50 border border-dashed border-slate-400 rounded-xl">
                          <span className="text-[11px] font-black text-slate-800 block mb-1">
                            بنك الكلمات والحروف المقترحة للمعلم للإملاء:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {page.content.dictationSuggestedWords.map((w, wIdx) => (
                              <span key={wIdx} className="bg-white border border-slate-300 px-2 py-0.5 rounded text-xs font-black text-slate-900 font-amiri">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LAM SORTING DEDICATED PRINT TABLE */}
                  {page.pageType === 'lam_sorting' && page.content?.sortingItems && (
                    <div className="space-y-3">
                      {/* Word Bank Pool */}
                      <div className="border border-slate-400 bg-slate-50 rounded-lg p-2 text-center space-y-1">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          بنك الكلمات المطلوب فرزها في الجدول أدناه:
                        </span>
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {page.content.sortingItems.map((item, idx) => (
                            <span key={idx} className="bg-white border border-slate-300 px-2 py-0.5 rounded font-black text-xs font-amiri text-slate-900">
                              {item.word}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Split Divided Solar vs Lunar Table */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Solar (Orange) */}
                        <div className="border-2 border-amber-500 rounded-xl overflow-hidden bg-amber-50/30">
                          <div className="bg-amber-500 text-slate-950 font-black text-xs py-1 px-2 text-center flex items-center justify-center gap-1">
                            <span>☀️ اللام الشمسية (تُكتب ولا تُنطق - حرف مشدد)</span>
                          </div>
                          <div className="p-2 space-y-1.5 min-h-[140px]">
                            {page.content.sortingItems.map((item, idx) => (
                              <div key={idx} className="border-b border-amber-200 h-6 flex items-center justify-between px-1 text-xs">
                                <span className="text-slate-400 font-medium text-[10px]">{idx + 1}.</span>
                                <span className="text-slate-300">........................</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lunar (Sky Blue) */}
                        <div className="border-2 border-sky-500 rounded-xl overflow-hidden bg-sky-50/30">
                          <div className="bg-sky-600 text-white font-black text-xs py-1 px-2 text-center flex items-center justify-center gap-1">
                            <span>🌙 اللام القمرية (تُكتب وتُنطق - لام ساكنة)</span>
                          </div>
                          <div className="p-2 space-y-1.5 min-h-[140px]">
                            {page.content.sortingItems.map((item, idx) => (
                              <div key={idx} className="border-b border-sky-200 h-6 flex items-center justify-between px-1 text-xs">
                                <span className="text-slate-400 font-medium text-[10px]">{idx + 1}.</span>
                                <span className="text-slate-300">........................</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SHADDAH / MADD SORTING TABLES */}
                  {(page.pageType === 'shaddah_extraction' || 
                    page.pageType === 'shaddah_sorting' || 
                    page.pageType === 'madd_identification') && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {page.content?.sortingItems?.map((item, idx) => (
                          <div key={idx} className="border border-slate-700 rounded-lg p-2 flex items-center justify-between text-xs bg-white">
                            <span className="font-black text-sm text-slate-900 font-amiri">{item.word}</span>
                            <span className="border border-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold text-[10px]">
                              {item.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PICTURE BLANKS */}
                  {page.pageType === 'ta_ha_picture_blanks' && page.content?.pictureBlanks && (
                    <div className="grid grid-cols-4 gap-2">
                      {page.content.pictureBlanks.map((item) => (
                        <div key={item.id} className="border-2 border-slate-800 rounded-xl p-2.5 text-center space-y-1.5 bg-white">
                          <div className="text-2xl">{item.imageEmoji}</div>
                          <div className="text-sm font-black text-slate-900">{item.wordStart} ( .... )</div>
                          <div className="flex justify-center gap-1 text-[10px] font-bold">
                            {item.options.map(opt => (
                              <span key={opt} className="border border-slate-400 px-1.5 py-0.5 rounded bg-slate-50">[ {opt} ]</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TA & HA COLORING */}
                  {page.pageType === 'ta_ha_coloring' && page.content?.colorItems && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold bg-slate-100 p-1.5 rounded border border-slate-300 flex justify-between">
                        <span>🟩 تاء مفتوحة (ت)</span>
                        <span>🟥 تاء مربوطة (ـة / ة)</span>
                        <span>🟦 هاء (ـه / ه)</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {page.content.colorItems.map((item, idx) => (
                          <div key={idx} className="border border-slate-800 rounded-lg p-2 text-center bg-white space-y-1">
                            <span className="text-xs font-black block font-amiri">{item.word}</span>
                            <div className="flex justify-center gap-1 text-[9px]">
                              <span className="border border-slate-300 px-1 rounded">[ ت ]</span>
                              <span className="border border-slate-300 px-1 rounded">[ ة ]</span>
                              <span className="border border-slate-300 px-1 rounded">[ هـ ]</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TABLE DATA */}
                  {page.content?.tableData && (
                    <div className="border-2 border-slate-800 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-right">
                        <thead className="bg-slate-200 font-black border-b-2 border-slate-800">
                          <tr>
                            <th className="p-2 border-l border-slate-400">نوع المهارة</th>
                            <th className="p-2">أمثلة وتدريبات تطبيقية</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                          {page.content.tableData.map((row: any, rIdx: number) => (
                            <tr key={rIdx}>
                              <td className="p-2 font-black border-l border-slate-300 bg-slate-50">{row.type}</td>
                              <td className="p-2 font-bold">{row.example}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}

              {/* EVALUATION SHEET PRINT FORMAT (PAGE 121) */}
              {isEvaluation && (
                <div className="space-y-2">
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-400 text-center font-bold text-xs">
                    سجل تقويم ومتابعة إتقان المهارات القرائية والإملائية الـ ١٥ (نظام المحاولات الأربع)
                  </div>

                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-right border-collapse">
                      <thead className="bg-slate-200 border-b-2 border-slate-800 text-slate-900 font-black">
                        <tr>
                          <th className="p-1 border-l border-slate-400 w-7 text-center text-[10px]">م</th>
                          <th className="p-1 border-l border-slate-400 text-[10px]">المهارة المستهدفة</th>
                          <th className="p-1 border-l border-slate-400 w-14 text-center text-[10px]">الصفحات</th>
                          <th className="p-1 border-l border-slate-400 w-24 text-center text-[10px]">المحاولات (١-٤)</th>
                          <th className="p-1 border-l border-slate-400 w-20 text-center text-[10px]">حالة الإتقان</th>
                          <th className="p-1 text-[10px]">ملاحظات وتوقيع المعلم</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {skills.map((skill, sIdx) => {
                          const isMastered = skill.attempts.some(a => a);
                          return (
                            <tr key={skill.id} className={sIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                              <td className="p-1 text-center font-bold border-l border-slate-300 text-[10px]">{skill.id}</td>
                              <td className="p-1 font-bold border-l border-slate-300 text-[10px]">{skill.name}</td>
                              <td className="p-1 text-center font-medium border-l border-slate-300 text-[9px]">{skill.pageRange}</td>
                              <td className="p-1 text-center border-l border-slate-300">
                                <div className="flex justify-center gap-1">
                                  {skill.attempts.map((att, attIdx) => (
                                    <span 
                                      key={attIdx} 
                                      className={`w-3.5 h-3.5 rounded border text-[8px] font-black flex items-center justify-center ${
                                        att ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-400'
                                      }`}
                                    >
                                      {att ? '✓' : attIdx + 1}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-1 text-center font-bold border-l border-slate-300 text-[9px]">
                                {isMastered ? 'متقن [✓]' : '[  ] يحتاج تدريب'}
                              </td>
                              <td className="p-1 text-[9px] text-slate-500">
                                ....................................
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </main>

            {/* ========================================================================= */}
            {/* 3. OFFICIAL MASTERY INDICATORS (4-ATTEMPT SYSTEM) & FOOTER */}
            {/* ========================================================================= */}
            {!isCover && (
              <footer className="mt-2 pt-1.5 border-t-2 border-slate-900 space-y-1 shrink-0">
                {/* 4-Attempt Mastery Indicators (Shown ONLY on pages with exercises) */}
                {hasExercises && branding.showEvaluationBoxInPrint !== false && (
                  <div className="bg-slate-50 border border-slate-400 p-1.5 rounded-lg text-[10px] shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-300 pb-1 mb-1">
                      <div className="flex items-center gap-1 font-black text-slate-900">
                        <span>🎯</span>
                        <span>مؤشرات إتقان التلميذ (نظام المحاولات الأربع):</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-white border border-slate-400 px-1.5 py-0.2 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الأولى (إتقان تام)
                        </span>
                        <span className="bg-white border border-slate-400 px-1.5 py-0.2 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الثانية (متقدم)
                        </span>
                        <span className="bg-white border border-slate-400 px-1.5 py-0.2 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الثالثة (مقبول)
                        </span>
                        <span className="bg-white border border-slate-400 px-1.5 py-0.2 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الرابعة (تدريب علاجي)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-700">
                      <div>
                        <span className="font-black text-slate-900">توقيع المعلم/ة: </span>
                        <span className="font-bold text-slate-400">.......................</span>
                      </div>
                      <div>
                        <span className="font-black text-slate-900">تاريخ الإتقان: </span>
                        <span className="font-bold text-slate-700">.... / .... / ١٤٤هـ</span>
                      </div>
                      <div>
                        <span className="font-black text-slate-900">توقيع ولي الأمر: </span>
                        <span className="font-bold text-slate-400">.......................</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Print Footer Text */}
                <div className="flex items-center justify-between text-[9px] text-slate-600 font-bold px-1">
                  <span>{branding.schoolName}</span>
                  <span>الخطة العلاجية لمهارات القراءة والكتابة (١٢١ صفحة علاجية)</span>
                  <span>صفحة {page.pageNumber} من ١٢١</span>
                </div>
              </footer>
            )}

          </div>
        );
      })}
    </div>
  );
};
