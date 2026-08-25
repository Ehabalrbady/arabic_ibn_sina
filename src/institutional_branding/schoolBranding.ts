export interface SchoolBranding {
  logoUrl: string | null;
  countryName: string;
  ministryName: string;
  governorateName: string;
  directorateName: string;
  schoolName: string;
  departmentName: string;
  programName: string;
  academicYear: string;
  teacherName: string;
  supervisorName: string;
  principalName: string;
  studentName: string;
  studentGrade: string;
  studentClass: string;
  showLogoInPrint: boolean;
  showEvaluationBoxInPrint: boolean;
  showHandwritingLinesInPrint: boolean;
  show4LineGrid: boolean; // Authentic 4-Line Handwriting Grids for calligraphy
  showQRCode: boolean; // QR Code for smart voice / interactive access
  qrCodeCustomUrl?: string; // Optional custom URL for QR Code
  enableMasteryQuizzes: boolean; // Post-unit Mastery and Fluency Evaluation quizzes
  bookletMode: boolean; // Full A4 Student Booklet Mode with alternating margins
  showStudentInfoInPrint: boolean;
  inkSaverMode: boolean;
  fontSizePreference: 'normal' | 'large';
}

export const DEFAULT_BRANDING: SchoolBranding = {
  logoUrl: null,
  countryName: 'الجمهورية اليمنية',
  ministryName: 'وزارة التربية والتعليم والبحث العلمي',
  governorateName: 'أمانة العاصمة / صنعاء',
  directorateName: 'منطقة معين التعليمية',
  schoolName: 'مدارس ابن سيناء الأهلية النموذجية',
  departmentName: 'قسم إدارة الجودة والتطوير التعليمي',
  programName: 'الخطة العلاجية الشاملة لمهارات القراءة والكتابة',
  academicYear: '1446-1447هـ / 2024-2025م',
  teacherName: 'أستاذ المادة',
  supervisorName: 'المشرف التربوي',
  principalName: 'مدير المدرسة',
  studentName: 'طالب متميز',
  studentGrade: 'الصف الأساسي (الأول / الثاني)',
  studentClass: 'شعبة (أ)',
  showLogoInPrint: true,
  showEvaluationBoxInPrint: true,
  showHandwritingLinesInPrint: true,
  show4LineGrid: true,
  showQRCode: true,
  qrCodeCustomUrl: '',
  enableMasteryQuizzes: true,
  bookletMode: false,
  showStudentInfoInPrint: true,
  inkSaverMode: false,
  fontSizePreference: 'normal'
};

export const loadSchoolBranding = (): SchoolBranding => {
  try {
    const saved = localStorage.getItem('ibn_sina_branding_config');
    if (saved) {
      return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load school branding:', e);
  }
  return DEFAULT_BRANDING;
};

export const saveSchoolBranding = (branding: SchoolBranding): void => {
  try {
    localStorage.setItem('ibn_sina_branding_config', JSON.stringify(branding));
  } catch (e) {
    console.error('Failed to save school branding:', e);
  }
};

