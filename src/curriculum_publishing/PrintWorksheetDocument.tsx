import React from 'react';
import { BookPage, EvaluationSkill } from '../curriculum/types';
import { SchoolBranding } from '../institutional_branding/schoolBranding';
import { IbnSinaLogo } from '../institutional_branding/IbnSinaLogo';
import { SyllableHighlighter } from '../phonological_awareness/syllableHighlighter';

interface PrintWorksheetDocumentProps {
  pages: BookPage[];
  branding: SchoolBranding;
  studentName: string;
  studentGrade: string;
  studentClass?: string;
  skills?: EvaluationSkill[];
}

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
        const isEvaluation = page.pageType === 'evaluation' || page.pageNumber === 121;
        const isToc = page.pageType === 'toc';

        return (
          <div 
            key={page.pageNumber || index} 
            className={`print-page-container w-full bg-white box-border text-right p-6 relative flex flex-col justify-between ${
              branding.inkSaverMode ? 'ink-saver' : ''
            }`}
            style={{ minHeight: '277mm', pageBreakAfter: 'always', breakAfter: 'page' }}
          >
            {/* ========================================================================= */}
            {/* 1. DOCUMENT HEADER */}
            {/* ========================================================================= */}
            {!isCover && (
              <header className="border-b-2 border-slate-900 pb-2 mb-3">
                <div className="flex items-center justify-between gap-3">
                  {/* Right: School Logo & Name (Clean, without country/ministry repetition) */}
                  <div className="flex items-center gap-2.5">
                    {branding.showLogoInPrint && (
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                        <IbnSinaLogo 
                          size="md" 
                          showText={false} 
                          customLogoUrl={branding.logoUrl} 
                          schoolName={branding.schoolName}
                        />
                      </div>
                    )}
                    <div className="text-right">
                      <h1 className="text-sm font-black text-emerald-950 tracking-tight leading-tight">
                        {branding.schoolName}
                      </h1>
                      <p className="text-[10px] font-bold text-amber-800">
                        {branding.departmentName}
                      </p>
                    </div>
                  </div>

                  {/* Center: Curriculum / Unit Title */}
                  <div className="text-center px-2">
                    <span className="inline-block bg-slate-100 border border-slate-400 text-slate-900 px-3 py-0.5 rounded-full text-xs font-black">
                      {page.unitTitle}
                    </span>
                    <h2 className="text-sm font-black text-slate-900 mt-0.5">
                      {page.title}
                    </h2>
                  </div>

                  {/* Left: Page Number Badge */}
                  <div className="text-left shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm shadow-sm">
                      {page.pageNumber}
                    </div>
                    <span className="block text-[9px] text-slate-500 font-bold mt-0.5 text-center">
                      ص {page.pageNumber} من ١٢١
                    </span>
                  </div>
                </div>
              </header>
            )}

            {/* ========================================================================= */}
            {/* 2. BODY CONTENT */}
            {/* ========================================================================= */}
            <main className="flex-1 space-y-4">
              
              {/* COVER PAGE PRINT FORMAT */}
              {isCover && (
                <div className="h-full flex flex-col justify-between items-center text-center p-6 border-4 double border-emerald-900 rounded-3xl bg-white relative">
                  
                  {/* Top Administration Header */}
                  <div className="w-full flex items-center justify-between border-b-2 border-emerald-900 pb-3">
                    <div className="text-right text-xs space-y-0.5 font-bold">
                      <p className="font-black text-sm text-emerald-900">{branding.countryName || 'الجمهورية اليمنية'}</p>
                      <p className="text-slate-800 text-[11px]">{branding.ministryName || 'وزارة التربية والتعليم والبحث العلمي'}</p>
                      <p className="text-slate-600 text-[10px]">{branding.governorateName || 'أمانة العاصمة / صنعاء'}</p>
                      <p className="text-slate-600 text-[10px]">{branding.directorateName || 'منطقة معين التعليمية'}</p>
                    </div>

                    <div className="w-20 h-20 flex items-center justify-center">
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
                  <div className="text-lg font-bold text-emerald-950 font-amiri my-2">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>

                  {/* Hero Curriculum Section */}
                  <div className="my-4 space-y-4 max-w-lg">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-full font-black text-xs inline-block">
                      ✨ الحقيبة التأسيسية الشاملة لمعالجة الضعف القرائي والإملائي
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 leading-tight">
                      الخطة العلاجية لمهارات القراءة والكتابة
                    </h1>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed border-y border-slate-300 py-2.5">
                      برنامج نوعي متدرج وشامل لمعالجة جوانب القصور القرائي والإملائي وتأسيس الطالب في القراءة السريعة والتحليل الصوتي وقواعد الإملاء
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-black text-slate-700">
                      <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">١٢١ صفحة علاجية متكاملة</span>
                      <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">١٥ مهارة تأسيسية</span>
                      <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">نظام التتبع والكتابة الثلاثي</span>
                    </div>
                  </div>

                  {/* Comprehensive Student & Administration Profile Card */}
                  <div className="w-full max-w-lg bg-slate-50 border-2 border-emerald-900 rounded-2xl overflow-hidden text-right text-xs font-bold shadow-sm">
                    <div className="bg-emerald-900 text-white px-3 py-1 text-center font-black text-xs">
                      📋 بطاقة بيانات التلميذ والهيئة التعليمية والإشرافية
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-600">اسم التلميذ/ة:</span>
                        <span className="text-slate-950 font-black">{studentName || branding.studentName || '................................'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-600">الصف والشعبة:</span>
                        <span className="text-slate-950">{studentGrade || branding.studentGrade} ({studentClass || branding.studentClass})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-600">المدرسة:</span>
                        <span className="text-slate-950 font-black">{branding.schoolName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-600">معلم/ة المادة:</span>
                        <span className="text-slate-950">{branding.teacherName || '................................'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-600">المشرف التربوي:</span>
                        <span className="text-slate-950">{branding.supervisorName || '................................'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-600">مدير المدرسة:</span>
                        <span className="text-slate-950">{branding.principalName || '................................'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Footer */}
                  <div className="w-full pt-3 border-t-2 border-emerald-900 text-[10px] text-slate-600 flex items-center justify-between font-bold">
                    <span>🇾🇪 {branding.countryName || 'الجمهورية اليمنية'} — {branding.ministryName || 'وزارة التربية والتعليم'}</span>
                    <span>{branding.schoolName} — {branding.departmentName}</span>
                    <span>العام الدراسي: {branding.academicYear || '1446-1447هـ'}</span>
                  </div>
                </div>
              )}

              {/* TOC PAGE PRINT FORMAT */}
              {isToc && (
                <div className="space-y-4">
                  <div className="bg-slate-100 border border-slate-400 p-2.5 rounded-xl text-center font-black text-sm text-slate-900">
                    فهرس موضوعات ومهارات الخطة العلاجية (١٢١ صفحة علاجية شاملة)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {page.content?.items?.map((item, idx) => (
                      <div key={idx} className="border-2 border-slate-800 rounded-xl p-3 bg-white flex items-center justify-between font-black text-xs">
                        <span className="text-slate-900">{item}</span>
                        <span className="border border-slate-300 bg-slate-50 px-2 py-0.5 rounded text-[10px] text-slate-600">مكتمل</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NON-COVER & NON-EVALUATION & NON-TOC PAGES */}
              {!isCover && !isEvaluation && !isToc && (
                <div className="space-y-4">
                  
                  {/* UNIT COVER PRINT FORMAT */}
                  {page.pageType === 'unit_cover' && (
                    <div className="h-full flex flex-col justify-center items-center text-center p-8 border-2 border-slate-800 rounded-2xl bg-slate-50 space-y-6 my-4">
                      <span className="px-4 py-1 bg-slate-200 border border-slate-500 text-slate-900 rounded-full font-black text-xs">
                        {page.unitTitle}
                      </span>
                      <h2 className="text-3xl font-black text-slate-950">
                        {page.title}
                      </h2>
                      {page.subtitle && (
                        <p className="text-base font-bold text-slate-700 border-y border-slate-300 py-3 max-w-md">
                          {page.subtitle}
                        </p>
                      )}
                      <div className="p-4 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 max-w-md leading-relaxed font-bold">
                        تهدف هذه الوحدة لتأسيس الطالب في المهارة المستهدفة بالتدريج عبر القراءة السريعة والتحليل الصوتي والنسخ والتطبيق الإملائي.
                      </div>
                    </div>
                  )}

                  {/* Goal and Procedure */}
                  {(page.goal || page.procedure) && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-300">
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
                    <div className="bg-slate-100 border-r-4 border-slate-800 p-2 rounded text-xs font-bold text-slate-900">
                      📌 إرشاد وتنبيه: {page.ruleNotice}
                    </div>
                  )}

                  {/* INTRO / CONCLUSION TEXT */}
                  {page.content?.text && page.pageType !== 'unit_cover' && (
                    <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm leading-relaxed font-medium">
                      {page.content.text}
                    </div>
                  )}

                  {/* RULE BOXES */}
                  {page.content?.ruleBoxes && (
                    <div className="grid grid-cols-2 gap-3">
                      {page.content.ruleBoxes.map((box, bIdx) => (
                        <div key={bIdx} className="border-2 border-slate-700 p-3 rounded-xl bg-white">
                          <h4 className="font-black text-xs text-slate-900 mb-1 border-b border-slate-300 pb-1">
                            {box.title}
                          </h4>
                          <p className="text-[11px] text-slate-700 mb-2">{box.body}</p>
                          <div className="text-[11px] bg-slate-100 p-1.5 rounded font-bold text-slate-900">
                            أمثلة: {box.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* LETTER VOWELS (PAGE 6) */}
                  {page.pageType === 'letter_vowels' && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700 text-center">
                        اقرأ الحروف بالحركات الثلاث (فتحة - كسرة - ضمة) ثم اكتب كل حرف بخط جميل:
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {page.content?.gridItems?.map((group, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2 bg-white flex flex-col gap-1 text-center">
                            <div className="border border-slate-300 bg-slate-50 rounded p-1">
                              <span className="text-[10px] text-slate-500 font-bold block">النموذج</span>
                              <span className="text-2xl font-black block text-slate-900 font-amiri leading-tight">{group}</span>
                            </div>
                            <div className="border border-dashed border-slate-400 bg-slate-50/50 rounded p-1">
                              <span className="text-[10px] text-slate-500 font-bold block">١. تتبع</span>
                              <span className="text-2xl font-black block arabic-dotted-tracing leading-tight">{group}</span>
                            </div>
                            <div className="border border-slate-700 rounded p-1 bg-white">
                              <span className="text-[10px] text-slate-500 font-bold block">٢. اكتب</span>
                              <div className="arabic-4line-container compact">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>
                            <div className="border border-slate-700 rounded p-1 bg-white">
                              <span className="text-[10px] text-slate-500 font-bold block">٣/٤. كرر</span>
                              <div className="arabic-4line-container compact">
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

                  {/* WRITTEN TRACING & COPYING EXERCISES (تدريبات النسخ والتتبع الرأسية رباعية المستويات) */}
                  {page.pageType === 'written_tracing' && (
                    <div className="space-y-2.5">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 flex items-center justify-between text-xs font-black text-slate-900">
                        <span>تدريب كتابي رأسي: اقرأ النموذج ➜ تتبع المقطع المنقط بقلم الرصاص ➜ اكتب المقطع في المحاولات التالية على سطر الأساس:</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {page.content?.gridItems?.map((item, idx) => (
                          <div key={idx} className="border-2 border-slate-900 rounded-xl p-2 bg-white flex flex-col gap-1.5 shadow-sm">
                            {/* 1. Original Syllable Model */}
                            <div className="border border-slate-300 bg-slate-50 rounded-lg p-1.5 text-center flex flex-col justify-between">
                              <span className="text-[10px] text-slate-500 font-bold text-right block">النموذج</span>
                              <span className="text-3xl font-black font-amiri text-slate-950 py-0.5 leading-tight">
                                {item}
                              </span>
                            </div>

                            {/* 2. Dotted Traceable Syllable (Attempt 1) */}
                            <div className="border-2 border-dashed border-slate-400 bg-slate-50/50 rounded-lg p-1.5 text-center flex flex-col justify-between">
                              <span className="text-[10px] text-slate-500 font-bold text-right block">١. تتبع منقط ✏️</span>
                              <span className="arabic-dotted-tracing text-3xl font-black py-0.5 leading-tight">
                                {item}
                              </span>
                            </div>

                            {/* 3. Handwriting Grid Box (Attempt 2) */}
                            <div className="border-2 border-slate-800 bg-white rounded-lg p-1.5 flex flex-col justify-between">
                              <span className="text-[10px] text-slate-600 font-bold text-right block">٢. اكتب على السطر</span>
                              <div className="arabic-4line-container compact mt-1">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>

                            {/* 4. Handwriting Grid Box (Attempt 3/4 Mastery) */}
                            <div className="border-2 border-slate-800 bg-white rounded-lg p-1.5 flex flex-col justify-between">
                              <span className="text-[10px] text-emerald-800 font-black text-right block">٣/٤. كرر للإتقان ⭐</span>
                              <div className="arabic-4line-container compact mt-1">
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

                  {/* DICTATION BOARD WORKSHEET (لوحة الإملاء التأسيسي) */}
                  {page.pageType === 'dictation_board' && (
                    <div className="space-y-3">
                      <div className="bg-slate-100 border border-slate-400 p-2.5 rounded-xl text-center">
                        <h3 className="text-base font-black text-slate-900">لوحة الإملاء الصوتي والاختبار الإملائي</h3>
                        <p className="text-xs text-slate-600 font-bold">استمع للمعلم واكتب الكلمة بدقة في الخانة المخصصة على شبكة أسطر خط النسخ:</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {Array.from({ length: Math.min(10, Math.max(8, page.content?.dictationSuggestedWords?.length || 8)) }).map((_, dIdx) => (
                          <div key={dIdx} className="border-2 border-slate-800 rounded-xl p-2 bg-white flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                                {dIdx + 1}
                              </span>
                              <span className="text-xs text-slate-500 font-bold">الكلمة:</span>
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
                            <div className="border border-slate-300 px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-bold shrink-0">
                              [ ] صحيح
                            </div>
                          </div>
                        ))}
                      </div>

                      {page.content?.dictationSuggestedWords && (
                        <div className="mt-3 p-2.5 bg-slate-50 border border-dashed border-slate-400 rounded-xl">
                          <span className="text-[12px] font-black text-slate-800 block mb-1">
                            بنك الكلمات والحروف المقترحة للمعلم للإملاء:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {page.content.dictationSuggestedWords.map((w, wIdx) => (
                              <span key={wIdx} className="bg-white border border-slate-300 px-2.5 py-1 rounded-md text-sm font-black text-slate-900 font-amiri">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RANDOM LETTERS / TWO LETTERS / WORDS READING GRIDS */}
                  {(page.pageType === 'letter_random' || 
                    page.pageType === 'two_letters_reading' || 
                    page.pageType === 'words_reading' || 
                    page.pageType === 'madd_comparison') && (
                    <div className="space-y-3">
                      <div className={`grid gap-2.5 ${
                        page.pageType === 'letter_random' 
                          ? 'grid-cols-4 sm:grid-cols-6' 
                          : page.pageType === 'two_letters_reading' 
                            ? 'grid-cols-3 sm:grid-cols-4' 
                            : 'grid-cols-2 sm:grid-cols-3'
                      }`}>
                        {page.content?.gridItems?.map((word, idx) => (
                          <div 
                            key={idx} 
                            className="border-2 border-slate-800 rounded-xl p-2 bg-white flex flex-col gap-1 shadow-sm"
                          >
                            <div className="border border-slate-300 bg-slate-50 rounded p-1 text-center">
                              <span className="text-[10px] text-slate-500 font-bold block text-right">النموذج (المقاطع الصوتية)</span>
                              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-amiri block leading-tight">
                                <SyllableHighlighter text={word} showArcs={true} />
                              </span>
                            </div>

                            <div className="border border-dashed border-slate-400 bg-slate-50/50 rounded p-1 text-center">
                              <span className="text-[10px] text-slate-500 font-bold block text-right">١. تتبع</span>
                              <span className="text-2xl sm:text-3xl font-black arabic-dotted-tracing block leading-tight">
                                {word}
                              </span>
                            </div>

                            {branding.showHandwritingLinesInPrint && (
                              <>
                                <div className="border border-slate-700 rounded p-1 bg-white">
                                  <span className="text-[10px] text-slate-500 font-bold block text-right">٢. اكتب</span>
                                  <div className="arabic-4line-container compact">
                                    <div className="grid-line line-ascender"></div>
                                    <div className="grid-line line-waist"></div>
                                    <div className="grid-line line-base"></div>
                                    <div className="grid-line line-descender"></div>
                                    <span className="grid-guide-indicator">ـ✍️ـ</span>
                                  </div>
                                </div>
                                <div className="border border-slate-700 rounded p-1 bg-white">
                                  <span className="text-[10px] text-slate-500 font-bold block text-right">٣/٤. كرر</span>
                                  <div className="arabic-4line-container compact">
                                    <div className="grid-line line-ascender"></div>
                                    <div className="grid-line line-waist"></div>
                                    <div className="grid-line line-base"></div>
                                    <div className="grid-line line-descender"></div>
                                    <span className="grid-guide-indicator">ـ✍️ـ</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FALLBACK FOR ANY OTHER GRID ITEMS */}
                  {page.pageType !== 'letter_vowels' && 
                   page.pageType !== 'letter_random' && 
                   page.pageType !== 'two_letters_reading' && 
                   page.pageType !== 'words_reading' && 
                   page.pageType !== 'madd_comparison' && 
                   page.pageType !== 'written_tracing' && 
                   page.pageType !== 'dictation_board' && 
                   page.content?.gridItems && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {page.content.gridItems.map((word, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2 bg-white flex flex-col gap-1">
                            <div className="border border-slate-300 bg-slate-50 rounded p-1 text-center">
                              <span className="text-[10px] text-slate-500 font-bold block text-right">النموذج</span>
                              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-amiri block leading-tight">{word}</span>
                            </div>
                            <div className="border border-dashed border-slate-400 bg-slate-50/50 rounded p-1 text-center">
                              <span className="text-[10px] text-slate-500 font-bold block text-right">١. تتبع</span>
                              <span className="text-2xl sm:text-3xl font-black arabic-dotted-tracing block leading-tight">{word}</span>
                            </div>
                            {branding.showHandwritingLinesInPrint && (
                              <div className="border border-slate-700 rounded p-1 bg-white">
                                <span className="text-[10px] text-slate-500 font-bold block text-right">٢. اكتب</span>
                                <div className="arabic-4line-container compact">
                                  <div className="grid-line line-ascender"></div>
                                  <div className="grid-line line-waist"></div>
                                  <div className="grid-line line-base"></div>
                                  <div className="grid-line line-descender"></div>
                                  <span className="grid-guide-indicator">ـ✍️ـ</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CONNECT AND READ EXERCISES */}
                  {page.pageType === 'connect_and_read' && (
                    <div className="space-y-2.5">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 text-xs font-black text-slate-900">
                        صل الحروف المنفصلة ➜ تتبع الكلمة المنقطة بقلم الرصاص ➜ اكتب الكلمة في المحاولات التالية:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {page.content?.connectExercises?.map((ex, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5 bg-white shadow-sm">
                            <div className="border border-slate-300 bg-slate-50 rounded-lg p-1.5 text-center flex flex-col justify-between">
                              <span className="text-[10px] text-slate-500 font-bold text-right block">المقاطع منفصلة (النموذج)</span>
                              <span className="bg-emerald-50 text-emerald-950 border border-emerald-300 px-3 py-1 rounded-md font-amiri font-black text-2xl inline-block mx-auto">
                                {ex.separated}
                              </span>
                            </div>
                            <div className="border-2 border-dashed border-slate-400 bg-slate-50/50 rounded-lg p-1.5 text-center flex flex-col justify-between">
                              <span className="text-[10px] text-slate-500 font-bold text-right block">١. تتبع متصل منقط ✏️</span>
                              <span className="arabic-dotted-tracing text-3xl font-black py-0.5 font-amiri leading-tight">
                                {ex.combined}
                              </span>
                            </div>
                            <div className="border-2 border-slate-800 rounded-lg p-1.5 bg-white flex flex-col justify-between">
                              <span className="text-[10px] text-slate-600 font-bold text-right block">٢. اكتب الكلمة متصلة</span>
                              <div className="arabic-4line-container compact mt-0.5">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>
                            <div className="border-2 border-slate-800 rounded-lg p-1.5 bg-white flex flex-col justify-between">
                              <span className="text-[10px] text-emerald-800 font-black text-right block">٣/٤. كرر للإتقان ⭐</span>
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

                  {/* ANALYSIS SYLLABLES */}
                  {page.pageType === 'analysis_syllables' && (
                    <div className="space-y-2.5">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 text-xs font-black text-slate-900">
                        حلل الكلمات إلى مقاطعها الصوتية (الكلمة ➜ المقاطع مفككة ➜ كتابة المقاطع):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {page.content?.analysisWords?.map((item, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2.5 space-y-2 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                              <span className="text-2xl font-black text-slate-950 font-amiri">{item.word}</span>
                              <div className="flex items-center gap-1">
                                {item.syllables.map((syl, sIdx) => (
                                  <span key={sIdx} className="border border-dashed border-slate-400 bg-slate-50 px-2 py-0.5 rounded text-sm font-black arabic-dotted-tracing font-amiri">
                                    {syl}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-1 pt-0.5">
                              <span className="text-[10px] text-slate-500 font-bold">كتابة المقاطع:</span>
                              <div className="flex items-center gap-1.5 flex-1 justify-end">
                                {item.syllables.map((_, sIdx) => (
                                  <div key={sIdx} className="w-14 h-8 border-2 border-slate-700 rounded bg-white p-0.5">
                                    <div className="arabic-4line-container compact" style={{ height: '24px' }}>
                                      <div className="grid-line line-ascender"></div>
                                      <div className="grid-line line-waist"></div>
                                      <div className="grid-line line-base"></div>
                                      <div className="grid-line line-descender"></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SENTENCES READING */}
                  {page.pageType === 'sentences_reading' && (
                    <div className="space-y-2.5">
                      <div className="bg-slate-100 border border-slate-400 rounded-lg p-1.5 text-xs font-black text-slate-900">
                        اقرأ الجمل التالية بطلاقة ➜ تتبع المنقط ➜ اكتب الجملة بخط النسخ الجميل:
                      </div>
                      {page.content?.sentences?.map((sentence, idx) => (
                        <div key={idx} className="border-2 border-slate-800 rounded-xl p-3 space-y-2 bg-white shadow-sm">
                          {/* Model */}
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 bg-slate-50 p-2 rounded-lg">
                            <span className="text-xs font-black text-slate-600 shrink-0">النموذج:</span>
                            <div className="text-2xl font-black text-slate-950 font-amiri flex-1 leading-snug">
                              {sentence}
                            </div>
                          </div>
                          {/* Dotted */}
                          <div className="flex items-center gap-2 border border-dashed border-slate-400 p-2 rounded-lg bg-slate-50/50">
                            <span className="text-xs font-black text-slate-500 shrink-0">١. تتبع:</span>
                            <div className="text-2xl font-black arabic-dotted-tracing flex-1 leading-snug">
                              {sentence}
                            </div>
                          </div>
                          {/* Write 1 */}
                          <div className="flex items-center gap-2 border border-slate-700 p-2 rounded-lg bg-white">
                            <span className="text-xs font-black text-slate-700 shrink-0">٢. اكتب:</span>
                            <div className="flex-1">
                              <div className="arabic-4line-container">
                                <div className="grid-line line-ascender"></div>
                                <div className="grid-line line-waist"></div>
                                <div className="grid-line line-base"></div>
                                <div className="grid-line line-descender"></div>
                                <span className="grid-guide-indicator">ـ✍️ـ</span>
                              </div>
                            </div>
                          </div>
                          {/* Write 2 Mastery */}
                          <div className="flex items-center gap-2 border border-slate-700 p-2 rounded-lg bg-white">
                            <span className="text-xs font-black text-emerald-800 shrink-0">٣/٤. كرر:</span>
                            <div className="flex-1">
                              <div className="arabic-4line-container">
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
                  )}

                  {/* SHADDAH / LAM SORTING TABLES */}
                  {(page.pageType === 'shaddah_extraction' || 
                    page.pageType === 'shaddah_sorting' || 
                    page.pageType === 'lam_sorting' || 
                    page.pageType === 'madd_identification') && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {page.content?.sortingItems?.map((item, idx) => (
                          <div key={idx} className="border-2 border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs bg-white">
                            <span className="font-black text-sm text-slate-900">{item.word}</span>
                            <span className="border border-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold text-[11px]">
                              {item.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PICTURE BLANKS */}
                  {page.pageType === 'ta_ha_picture_blanks' && page.content?.pictureBlanks && (
                    <div className="grid grid-cols-4 gap-2.5">
                      {page.content.pictureBlanks.map((item) => (
                        <div key={item.id} className="border-2 border-slate-800 rounded-xl p-3 text-center space-y-2 bg-white">
                          <div className="text-3xl">{item.imageEmoji}</div>
                          <div className="text-base font-black text-slate-900">{item.wordStart} ( .... )</div>
                          <div className="flex justify-center gap-1 text-xs font-bold">
                            {item.options.map(opt => (
                              <span key={opt} className="border border-slate-400 px-2 py-0.5 rounded bg-slate-50">[ {opt} ]</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TA & HA COLORING */}
                  {page.pageType === 'ta_ha_coloring' && page.content?.colorItems && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold bg-slate-100 p-2 rounded border border-slate-300 flex justify-between">
                        <span>🟩 تاء مفتوحة (ت)</span>
                        <span>🟥 تاء مربوطة (ـة / ة)</span>
                        <span>🟦 هاء (ـه / ه)</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {page.content.colorItems.map((item, idx) => (
                          <div key={idx} className="border-2 border-slate-800 rounded-xl p-2.5 text-center bg-white space-y-1">
                            <span className="text-sm font-black block">{item.word}</span>
                            <div className="flex justify-center gap-1 text-[10px]">
                              <span className="border border-slate-300 px-1.5 rounded">[ ت ]</span>
                              <span className="border border-slate-300 px-1.5 rounded">[ ة ]</span>
                              <span className="border border-slate-300 px-1.5 rounded">[ هـ ]</span>
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
                <div className="space-y-3">
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-400 text-center font-bold text-xs">
                    سجل تقويم ومتابعة إتقان المهارات القرائية والإملائية الـ ١٥ (نظام المحاولات الأربع)
                  </div>

                  <div className="border-2 border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-right border-collapse">
                      <thead className="bg-slate-200 border-b-2 border-slate-800 text-slate-900 font-black">
                        <tr>
                          <th className="p-1.5 border-l border-slate-400 w-8 text-center">م</th>
                          <th className="p-1.5 border-l border-slate-400">المهارة المستهدفة</th>
                          <th className="p-1.5 border-l border-slate-400 w-16 text-center">الصفحات</th>
                          <th className="p-1.5 border-l border-slate-400 w-24 text-center">المحاولات (١-٤)</th>
                          <th className="p-1.5 border-l border-slate-400 w-20 text-center">حالة الإتقان</th>
                          <th className="p-1.5">ملاحظات وتوقيع المعلم</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {skills.map((skill, sIdx) => {
                          const isMastered = skill.attempts.some(a => a);
                          return (
                            <tr key={skill.id} className={sIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                              <td className="p-1 text-center font-bold border-l border-slate-300">{skill.id}</td>
                              <td className="p-1 font-bold border-l border-slate-300 text-[11px]">{skill.name}</td>
                              <td className="p-1 text-center font-medium border-l border-slate-300 text-[10px]">{skill.pageRange}</td>
                              <td className="p-1 text-center border-l border-slate-300">
                                <div className="flex justify-center gap-1">
                                  {skill.attempts.map((att, attIdx) => (
                                    <span 
                                      key={attIdx} 
                                      className={`w-4 h-4 rounded border text-[9px] font-black flex items-center justify-center ${
                                        att ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-400'
                                      }`}
                                    >
                                      {att ? '✓' : attIdx + 1}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-1 text-center font-bold border-l border-slate-300 text-[10px]">
                                {isMastered ? 'متقن [✓]' : '[  ] يحتاج تدريب'}
                              </td>
                              <td className="p-1 text-[10px] text-slate-500">
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
              <footer className="mt-4 pt-2 border-t-2 border-slate-900 space-y-1.5">
                {/* 4-Attempt Mastery Indicators */}
                {branding.showEvaluationBoxInPrint !== false && (
                  <div className="bg-slate-50 border-2 border-emerald-900/80 p-2 rounded-xl text-[11px] shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5 font-black text-emerald-950">
                        <span>🎯</span>
                        <span>مؤشرات إتقان التلميذ (نظام المحاولات الأربع):</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-white border border-slate-400 px-2 py-0.5 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الأولى ⭐⭐⭐
                        </span>
                        <span className="bg-white border border-slate-400 px-2 py-0.5 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الثانية ⭐⭐
                        </span>
                        <span className="bg-white border border-slate-400 px-2 py-0.5 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الثالثة ⭐
                        </span>
                        <span className="bg-white border border-slate-400 px-2 py-0.5 rounded font-bold text-slate-900 inline-flex items-center gap-1">
                          <span className="font-mono text-slate-500">[ &nbsp; ]</span> المحاولة الرابعة (علاجي)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700">
                      <div>
                        <span className="font-black text-emerald-950">توقيع المعلم/ة: </span>
                        <span className="font-bold text-slate-400">...................................</span>
                      </div>
                      <div>
                        <span className="font-black text-emerald-950">تاريخ الإتقان: </span>
                        <span className="font-bold text-slate-700">.... / .... / ١٤٤هـ</span>
                      </div>
                      <div>
                        <span className="font-black text-emerald-950">توقيع ولي الأمر: </span>
                        <span className="font-bold text-slate-400">...................................</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Print Footer Text */}
                <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold px-1">
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
