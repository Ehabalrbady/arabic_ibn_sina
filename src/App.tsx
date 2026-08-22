import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PageRenderer } from './components/PageRenderer';
import { BookTableOfContents } from './components/BookTableOfContents';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { DictationLab } from './components/DictationLab';
import { SpeedReadingTrainer } from './components/SpeedReadingTrainer';
import { SukoonTestTool } from './components/SukoonTestTool';
import { SearchModal } from './components/SearchModal';
import { LogoUploadModal } from './components/LogoUploadModal';
import { PrintCenterModal } from './components/PrintCenterModal';
import { PrintWorksheetDocument } from './components/PrintWorksheetDocument';
import { ALL_BOOK_PAGES, getPageByNumber } from './data/bookData';
import { INITIAL_EVALUATION_SKILLS } from './data/evaluationSkills';
import { BookPage, EvaluationSkill } from './types/book';
import { SchoolBranding, loadSchoolBranding, saveSchoolBranding, DEFAULT_BRANDING } from './utils/schoolBranding';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pages' | 'units' | 'dictation' | 'speed' | 'sukoon_test' | 'evaluation' | 'toc'>('pages');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isPrintCenterOpen, setIsPrintCenterOpen] = useState(false);
  const [studentName, setStudentName] = useState<string>('طالب متميز');
  const [studentGrade, setStudentGrade] = useState<string>('الصف الأول / الثاني الابتدائي');
  const [studentClass, setStudentClass] = useState<string>('١ / أ');

  // School branding & logo state
  const [branding, setBranding] = useState<SchoolBranding>(() => loadSchoolBranding());

  // Pages currently queued for printing
  const [printBatch, setPrintBatch] = useState<BookPage[]>(() => [ALL_BOOK_PAGES[0]]);

  // Load / Save evaluation skills in localStorage
  const [skills, setSkills] = useState<EvaluationSkill[]>(() => {
    try {
      const saved = localStorage.getItem('ibn_sinai_reading_skills');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_EVALUATION_SKILLS;
  });

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('ibn_sinai_student_name');
      if (savedName) setStudentName(savedName);
      const savedGrade = localStorage.getItem('ibn_sinai_student_grade');
      if (savedGrade) setStudentGrade(savedGrade);
      const savedClass = localStorage.getItem('ibn_sinai_student_class');
      if (savedClass) setStudentClass(savedClass);
      const savedPage = localStorage.getItem('ibn_sinai_last_page');
      if (savedPage) {
        const num = Number(savedPage);
        if (num >= 1 && num <= 121) setCurrentPageNum(num);
      }
    } catch (e) {}
  }, []);

  const handleUpdateBranding = (updated: SchoolBranding) => {
    setBranding(updated);
    saveSchoolBranding(updated);
  };

  const handleSetStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('ibn_sinai_student_name', name);
    } catch (e) {}
  };

  const handleSetStudentGrade = (grade: string) => {
    setStudentGrade(grade);
    try {
      localStorage.setItem('ibn_sinai_student_grade', grade);
    } catch (e) {}
  };

  const handleSelectPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= 121) {
      setCurrentPageNum(pageNum);
      setActiveTab('pages');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        localStorage.setItem('ibn_sinai_last_page', String(pageNum));
      } catch (e) {}
    }
  };

  const currentPage = getPageByNumber(currentPageNum) || ALL_BOOK_PAGES[0];

  const masteredSkillsCount = skills.filter(s => s.attempts.some(a => a)).length;
  const masteryPercentage = Math.round((masteredSkillsCount / skills.length) * 100);

  // When printing is triggered outside print modal, ensure current page is in batch
  const handleOpenPrintCenter = () => {
    setPrintBatch([currentPage]);
    setIsPrintCenterOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-cairo flex flex-col selection:bg-amber-200 selection:text-amber-950">
      
      {/* 1. Header Navigation & Branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPage={currentPageNum}
        setCurrentPage={handleSelectPage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPrintCenter={handleOpenPrintCenter}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        studentName={studentName}
        setStudentName={handleSetStudentName}
        masteryPercentage={masteryPercentage}
        branding={branding}
      />

      {/* 2. Main Interactive Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 no-print">
        
        {/* VIEW 1: BOOK PAGES */}
        {activeTab === 'pages' && (
          <PageRenderer
            page={currentPage}
            onPrevPage={() => handleSelectPage(currentPageNum - 1)}
            onNextPage={() => handleSelectPage(currentPageNum + 1)}
            onSelectPage={handleSelectPage}
            onOpenToc={() => setActiveTab('toc')}
            onOpenPrint={handleOpenPrintCenter}
            skills={skills}
            setSkills={setSkills}
            branding={branding}
          />
        )}

        {/* VIEW 2: TABLE OF CONTENTS */}
        {activeTab === 'toc' && (
          <BookTableOfContents
            onSelectPage={handleSelectPage}
          />
        )}

        {/* VIEW 3: DICTATION LAB */}
        {activeTab === 'dictation' && (
          <DictationLab />
        )}

        {/* VIEW 4: SPEED READING TRAINER */}
        {activeTab === 'speed' && (
          <SpeedReadingTrainer />
        )}

        {/* VIEW 5: SUKOON & TA/HA TEST TOOL */}
        {activeTab === 'sukoon_test' && (
          <SukoonTestTool />
        )}

        {/* VIEW 6: EVALUATION DASHBOARD */}
        {activeTab === 'evaluation' && (
          <EvaluationDashboard
            skills={skills}
            setSkills={setSkills}
            studentName={studentName}
            setStudentName={handleSetStudentName}
            studentGrade={studentGrade}
            setStudentGrade={handleSetStudentGrade}
            studentClass={studentClass}
            branding={branding}
            onNavigateToPage={handleSelectPage}
          />
        )}
      </main>

      {/* 3. Screen Footer */}
      <footer className="bg-white border-t border-amber-200/80 py-8 text-center text-xs text-slate-600 font-cairo no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2.5">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <p className="font-extrabold text-slate-800 text-sm sm:text-base">
              {branding.departmentName} ب{branding.schoolName} — {branding.programName}
            </p>
          </div>
          <p className="text-slate-500 font-medium">
            الخطة العلاجية لمهارات القراءة والكتابة للمرحلة الابتدائية — منصة تعليمية ومطبوعات مجهزة (١٢١ صفحة • ١٥ مهارة)
          </p>
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-3">
            <span>جميع الحقوق محفوظة © {branding.schoolName} — {branding.departmentName}</span>
            <span>•</span>
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="text-amber-800 font-bold hover:underline"
            >
              تخصيص الشعار والبيانات
            </button>
            <span>•</span>
            <button
              onClick={handleOpenPrintCenter}
              className="text-emerald-800 font-bold hover:underline"
            >
              مركز الطباعة A4
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Search Modal */}
      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onSelectPage={handleSelectPage}
        />
      )}

      {/* 5. Logo & School Branding Uploader Modal */}
      {isLogoModalOpen && (
        <LogoUploadModal
          branding={branding}
          onSaveBranding={handleUpdateBranding}
          onClose={() => setIsLogoModalOpen(false)}
          onUpdateStudentInfo={(name, grade, cls) => {
            handleSetStudentName(name);
            handleSetStudentGrade(grade);
            setStudentClass(cls);
            try {
              localStorage.setItem('ibn_sinai_student_class', cls);
            } catch (e) {}
          }}
        />
      )}

      {/* 6. Curriculum Print Center Modal */}
      {isPrintCenterOpen && (
        <PrintCenterModal
          currentPageNum={currentPageNum}
          branding={branding}
          onUpdateBranding={handleUpdateBranding}
          onOpenLogoUpload={() => {
            setIsPrintCenterOpen(false);
            setIsLogoModalOpen(true);
          }}
          studentName={studentName}
          studentGrade={studentGrade}
          studentClass={studentClass}
          setStudentClass={setStudentClass}
          skills={skills}
          onClose={() => setIsPrintCenterOpen(false)}
          onSelectPrintBatch={(pages) => setPrintBatch(pages)}
        />
      )}

      {/* 7. Dedicated Print-Only Document Element (Rendered on window.print()) */}
      <div id="print-document-container">
        <PrintWorksheetDocument
          pages={printBatch.length > 0 ? printBatch : [currentPage]}
          branding={branding}
          studentName={studentName}
          studentGrade={studentGrade}
          studentClass={studentClass}
          skills={skills}
        />
      </div>

    </div>
  );
}
