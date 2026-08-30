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

/**
 * Encodes school branding into a compact URL-safe string
 */
export const encodeBrandingToUrl = (branding: SchoolBranding): string => {
  try {
    const compact: Record<string, string | boolean | undefined> = {
      s: branding.schoolName,
      c: branding.countryName,
      m: branding.ministryName,
      g: branding.governorateName,
      d: branding.directorateName,
      dep: branding.departmentName,
      p: branding.programName,
      y: branding.academicYear,
      t: branding.teacherName,
      pr: branding.principalName,
      sv: branding.supervisorName,
    };

    // Only include logoUrl in the URL parameter if it's an external link or a reasonably sized data URI
    if (branding.logoUrl && branding.logoUrl.length < 2500) {
      compact.l = branding.logoUrl;
    }

    const jsonStr = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (e) {
    console.error('Failed to encode branding to URL:', e);
    return '';
  }
};

/**
 * Decodes school branding from URL search parameters
 */
export const decodeBrandingFromUrl = (params: URLSearchParams): Partial<SchoolBranding> | null => {
  try {
    const encoded = params.get('sb') || params.get('branding') || params.get('b');
    let decodedData: Partial<SchoolBranding> = {};

    if (encoded) {
      try {
        const jsonStr = decodeURIComponent(escape(atob(encoded)));
        const parsed = JSON.parse(jsonStr);
        if (parsed && typeof parsed === 'object') {
          if (parsed.s) decodedData.schoolName = parsed.s;
          if (parsed.c) decodedData.countryName = parsed.c;
          if (parsed.m) decodedData.ministryName = parsed.m;
          if (parsed.g) decodedData.governorateName = parsed.g;
          if (parsed.d) decodedData.directorateName = parsed.d;
          if (parsed.dep) decodedData.departmentName = parsed.dep;
          if (parsed.p) decodedData.programName = parsed.p;
          if (parsed.y) decodedData.academicYear = parsed.y;
          if (parsed.t) decodedData.teacherName = parsed.t;
          if (parsed.pr) decodedData.principalName = parsed.pr;
          if (parsed.sv) decodedData.supervisorName = parsed.sv;
          if (parsed.l) decodedData.logoUrl = parsed.l;
        }
      } catch (e) {
        console.warn('Failed to parse compact branding param:', e);
      }
    }

    // Direct readable parameter overrides
    const school = params.get('school') || params.get('schoolName');
    if (school) decodedData.schoolName = decodeURIComponent(school);

    const country = params.get('country') || params.get('countryName');
    if (country) decodedData.countryName = decodeURIComponent(country);

    const teacher = params.get('teacher') || params.get('teacherName');
    if (teacher) decodedData.teacherName = decodeURIComponent(teacher);

    const logo = params.get('logo') || params.get('logoUrl');
    if (logo) decodedData.logoUrl = decodeURIComponent(logo);

    if (Object.keys(decodedData).length > 0) {
      return decodedData;
    }
  } catch (e) {
    console.error('Failed to decode branding from URL:', e);
  }
  return null;
};

/**
 * Generates a clean, permanent shareable student link with embedded branding
 */
export const generateStudentShareableLink = (
  branding: SchoolBranding,
  studentName?: string,
  studentGrade?: string,
  studentClass?: string,
  targetTab: 'student_hub' | 'pages' = 'student_hub'
): string => {
  if (typeof window === 'undefined') return '';
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();

  // 1. Explicitly activate student mode
  params.set('mode', 'student');
  params.set('tab', targetTab);

  // 2. Student identification
  if (studentName) {
    params.set('student', encodeURIComponent(studentName));
  }
  if (studentGrade) {
    params.set('grade', encodeURIComponent(studentGrade));
  }
  if (studentClass) {
    params.set('cls', encodeURIComponent(studentClass));
  }

  // 3. Encoded school branding payload
  const encodedBranding = encodeBrandingToUrl(branding);
  if (encodedBranding) {
    params.set('sb', encodedBranding);
  }

  // Also include readable school name fallback
  if (branding.schoolName) {
    params.set('school', encodeURIComponent(branding.schoolName));
  }

  return `${baseUrl}?${params.toString()}`;
};


