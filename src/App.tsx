import React, { useState, useEffect } from 'react';
import { Header } from './app_shell';
import { 
  PageRenderer, 
  BookTableOfContents, 
  SearchModal, 
  ALL_BOOK_PAGES, 
  getPageByNumber 
} from './curriculum';
import type { BookPage, EvaluationSkill } from './curriculum';
import { 
  ParentsPortal,
  EvaluationDashboard, 
  SpeedReadingTrainer, 
  SukoonTestTool, 
  DiagnosticTrackingMatrix, 
  INITIAL_EVALUATION_SKILLS 
} from './reading_fluency_and_diagnostics';
import { DictationLab } from './spelling_and_handwriting';
import { MinimalPairsLab } from './phonological_awareness';
import { 
  FullBookPrintView, 
  PrintCenterModal, 
  PrintWorksheetDocument 
} from './curriculum_publishing';
import { 
  LogoUploadModal, 
  loadSchoolBranding, 
  saveSchoolBranding, 
  DEFAULT_BRANDING,
  decodeBrandingFromUrl,
  generateStudentShareableLink
} from './institutional_branding';
import type { SchoolBranding } from './institutional_branding';
import { CurriculumEditor } from './curriculum/CurriculumEditor';
import { AccessibilityControls } from './components/AccessibilityControls';
import { QuickAudioBar } from './speech_and_multimedia/QuickAudioBar';
import { StudentHub } from './student_portal';
import { AndroidInstallModal } from './pwa/AndroidInstallModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pages' | 'student_hub' | 'units' | 'dictation' | 'speed' | 'sukoon_test' | 'minimal_pairs' | 'diagnostic_matrix' | 'evaluation' | 'toc' | 'print_book' | 'parents_portal' | 'curriculum_editor'>('pages');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isPrintCenterOpen, setIsPrintCenterOpen] = useState(false);
  const [isStudentMode, setIsStudentMode] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('طالب متميز');
  const [studentGrade, setStudentGrade] = useState<string>('الصف الأول / الثاني الابتدائي');
  const [studentClass, setStudentClass] = useState<string>('١ / أ');

  // School branding & logo state
  const [branding, setBranding] = useState<SchoolBranding>(() => loadSchoolBranding());

  // Global accessibility states for visual/reading ease
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [textScale, setTextScale] = useState(1.0);
  const [spaciousSpacing, setSpaciousSpacing] = useState(false);

  // Dynamic reactive pages state loaded from localStorage or fallback to defaults
  const [pages, setPages] = useState<BookPage[]>(() => {
    try {
      const saved = localStorage.getItem('ibn_sinai_custom_pages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return ALL_BOOK_PAGES;
  });

  // Pages currently queued for printing
  const [printBatch, setPrintBatch] = useState<BookPage[]>(() => [pages[0]]);

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
      const params = new URLSearchParams(window.location.search);

      // 1. Decode & persist incoming School Branding from the URL automatically
      const decodedBranding = decodeBrandingFromUrl(params);
      if (decodedBranding) {
        const currentSaved = loadSchoolBranding();
        const mergedBranding: SchoolBranding = {
          ...currentSaved,
          ...decodedBranding
        };
        setBranding(mergedBranding);
        saveSchoolBranding(mergedBranding); // Persist permanently on the receiver device!
      }

      // 2. Detect Student Mode from Link
      const modeParam = params.get('mode');
      const studentLinkParam = params.get('student_link');
      const tabParam = params.get('tab');
      
      const isStudent = modeParam === 'student' || studentLinkParam === 'true' || tabParam === 'student_hub';
      if (isStudent) {
        setIsStudentMode(true);
        if (tabParam === 'pages') {
          setActiveTab('pages');
        } else {
          setActiveTab('student_hub');
        }
      }

      // 3. Load student details from URL or local storage
      const queryStudent = params.get('student') || params.get('name');
      if (queryStudent) {
        try {
          const decoded = decodeURIComponent(queryStudent);
          if (decoded) {
            setStudentName(decoded);
            localStorage.setItem('ibn_sinai_student_name', decoded);
          }
        } catch (e) {}
      }

      const queryGrade = params.get('grade');
      if (queryGrade) {
        try {
          const decoded = decodeURIComponent(queryGrade);
          if (decoded) {
            setStudentGrade(decoded);
            localStorage.setItem('ibn_sinai_student_grade', decoded);
          }
        } catch (e) {}
      }

      const queryCls = params.get('cls');
      if (queryCls) {
        try {
          const decoded = decodeURIComponent(queryCls);
          if (decoded) {
            setStudentClass(decoded);
            localStorage.setItem('ibn_sinai_student_class', decoded);
          }
        } catch (e) {}
      }

      // Jump to page if specified in URL (e.g. ?p=15 or ?page=15)
      const queryPage = params.get('page') || params.get('p');
      if (queryPage) {
        const pNum = Number(queryPage);
        if (pNum >= 1 && pNum <= 121) {
          setCurrentPageNum(pNum);
        }
      }

      // Parent portal link handling
      if (params.get('portal') === 'true') {
        const encodedStudent = params.get('student');
        if (encodedStudent) {
          try {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(encodedStudent))));
            if (decoded && decoded.name) {
              setStudentName(decoded.name);
              if (decoded.grade) setStudentGrade(decoded.grade);
              if (decoded.cls) setStudentClass(decoded.cls);
              setActiveTab('parents_portal');
              
              // Direct login for parent so they don't get locked out
              localStorage.setItem('ibn_sinai_student_pin', '1234'); // ensure default opens
            }
          } catch (e) {
            console.error('Failed to parse parent portal link state', e);
          }
        }
      }

      // 4. Load standard fallback settings from localStorage if not provided in URL
      if (!queryStudent && params.get('portal') !== 'true') {
        const savedName = localStorage.getItem('ibn_sinai_student_name');
        if (savedName) setStudentName(savedName);
      }
      if (!queryGrade && params.get('portal') !== 'true') {
        const savedGrade = localStorage.getItem('ibn_sinai_student_grade');
        if (savedGrade) setStudentGrade(savedGrade);
      }
      if (!queryCls && params.get('portal') !== 'true') {
        const savedClass = localStorage.getItem('ibn_sinai_student_class');
        if (savedClass) setStudentClass(savedClass);
      }
      if (!queryPage) {
        const savedPage = localStorage.getItem('ibn_sinai_last_page');
        if (savedPage) {
          const num = Number(savedPage);
          if (num >= 1 && num <= 121) setCurrentPageNum(num);
        }
      }
    } catch (e) {
      console.error('Initialization error:', e);
    }
  }, []);

  const handleSavePages = (updatedPages: BookPage[]) => {
    setPages(updatedPages);
    try {
      localStorage.setItem('ibn_sinai_custom_pages', JSON.stringify(updatedPages));
    } catch (e) {}
  };

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

  const currentPage = pages.find(p => p.pageNumber === currentPageNum) || pages[0];

  const masteredSkillsCount = skills.filter(s => s.attempts.some(a => a)).length;
  const masteryPercentage = Math.round((masteredSkillsCount / skills.length) * 100);

  // When printing is triggered outside print modal, ensure current page is in batch
  const handleOpenPrintCenter = () => {
    setPrintBatch([currentPage]);
    setIsPrintCenterOpen(true);
  };

  return (
    <div className={`min-h-screen bg-[#FDFBF7] text-slate-900 font-cairo flex flex-col selection:bg-amber-200 selection:text-amber-950 ${
      isHighContrast ? 'is-high-contrast bg-white!' : ''
    } ${
      spaciousSpacing ? 'is-spacious-spacing' : ''
    } ${
      textScale !== 1.0 ? 'is-scaled-text' : ''
    }`}>
      
      {/* Dynamic accessibility styles injection */}
      <style>{`
        ${isHighContrast ? `
          .is-high-contrast *, .is-high-contrast {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #000000 !important;
            background-image: none !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }
          .is-high-contrast button,
          .is-high-contrast a,
          .is-high-contrast select,
          .is-high-contrast input {
            border: 3px solid #000000 !important;
            font-weight: 900 !important;
          }
          .is-high-contrast .bg-emerald-800,
          .is-high-contrast .bg-rose-600,
          .is-high-contrast .bg-indigo-700,
          .is-high-contrast button[class*="bg-emerald"],
          .is-high-contrast button[class*="bg-amber"],
          .is-high-contrast button[class*="bg-rose"],
          .is-high-contrast button[class*="bg-indigo"] {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 3px solid #000000 !important;
          }
        ` : ''}
        ${spaciousSpacing ? `
          .is-spacious-spacing p, 
          .is-spacious-spacing span, 
          .is-spacious-spacing div,
          .is-spacious-spacing button {
            letter-spacing: 0.08em !important;
            word-spacing: 0.15em !important;
            line-height: 2.0 !important;
          }
        ` : ''}
        ${textScale !== 1.0 ? `
          .is-scaled-text p, 
          .is-scaled-text span, 
          .is-scaled-text button,
          .is-scaled-text select,
          .is-scaled-text input,
          .is-scaled-text h1,
          .is-scaled-text h2,
          .is-scaled-text h3 {
            font-size: calc(1em * ${textScale}) !important;
          }
        ` : ''}
      `}</style>
      
      {/* 1. Header Navigation & Branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPage={currentPageNum}
        setCurrentPage={handleSelectPage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPrintCenter={handleOpenPrintCenter}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        studentName={studentName}
        setStudentName={handleSetStudentName}
        masteryPercentage={masteryPercentage}
        branding={branding}
        isStudentMode={isStudentMode}
        setIsStudentMode={setIsStudentMode}
        studentGrade={studentGrade}
        studentClass={studentClass}
      />

      {/* Quick Audio Persona & Phonetic Controller */}
      <QuickAudioBar onOpenSettingsModal={() => setIsLogoModalOpen(true)} />

      {/* 2. Main Interactive Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 no-print">
        
        {/* VIEW 0: STUDENT TRAINING HUB & ROADMAP */}
        {activeTab === 'student_hub' && (
          <StudentHub
            skills={skills}
            studentName={studentName}
            setStudentName={handleSetStudentName}
            studentGrade={studentGrade}
            setStudentGrade={handleSetStudentGrade}
            studentClass={studentClass}
            setStudentClass={setStudentClass}
            branding={branding}
            onNavigateToPage={handleSelectPage}
            onNavigateToTab={(t) => setActiveTab(t)}
            onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
            pages={pages}
          />
        )}

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
            pages={pages}
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

        {/* VIEW 6: MINIMAL PAIRS LAB */}
        {activeTab === 'minimal_pairs' && (
          <MinimalPairsLab 
            branding={branding}
            onNavigateToLesson={handleSelectPage}
          />
        )}

        {/* VIEW 7: DIAGNOSTIC TRACKING MATRIX */}
        {activeTab === 'diagnostic_matrix' && (
          <DiagnosticTrackingMatrix
            studentName={studentName}
            studentGrade={studentGrade}
            studentClass={studentClass}
            branding={branding}
          />
        )}

        {/* VIEW 8: EVALUATION DASHBOARD */}
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

        {/* VIEW 9: FULL BOOK PRINT CURRICULUM (A4) */}
        {activeTab === 'print_book' && (
          <FullBookPrintView
            branding={branding}
            onUpdateBranding={handleUpdateBranding}
            studentName={studentName}
            studentGrade={studentGrade}
            studentClass={studentClass}
            skills={skills}
            onOpenLogoModal={() => setIsLogoModalOpen(true)}
            onNavigateToInteractivePage={handleSelectPage}
          />
        )}

        {/* VIEW 10: PARENTS PORTAL */}
        {activeTab === 'parents_portal' && (
          <ParentsPortal
            skills={skills}
            studentName={studentName}
            studentGrade={studentGrade}
            studentClass={studentClass}
            branding={branding}
            masteryPercentage={masteryPercentage}
          />
        )}

        {/* VIEW 11: CURRICULUM EDITOR */}
        {activeTab === 'curriculum_editor' && (
          <CurriculumEditor
            pages={pages}
            onSavePages={handleSavePages}
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
          pages={pages}
        />
      )}

      {/* 5. Logo & School Branding Uploader Modal */}
      {isLogoModalOpen && (
        <LogoUploadModal
          branding={branding}
          onSaveBranding={handleUpdateBranding}
          onClose={() => setIsLogoModalOpen(false)}
          onOpenAndroidModal={() => {
            setIsLogoModalOpen(false);
            setIsAndroidModalOpen(true);
          }}
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

      {/* 5.1 Dedicated Android PWA Install & QR Code Modal */}
      <AndroidInstallModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        branding={branding}
        studentName={studentName}
        studentGrade={studentGrade}
        studentClass={studentClass}
      />

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

      {/* 8. Floating Accessibility Console controls for visually impaired kids */}
      <AccessibilityControls
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        textScale={textScale}
        setTextScale={setTextScale}
        spaciousSpacing={spaciousSpacing}
        setSpaciousSpacing={setSpaciousSpacing}
      />

    </div>
  );
}
