import { EvaluationSkill } from '../curriculum/types';

export const INITIAL_EVALUATION_SKILLS: EvaluationSkill[] = [
  {
    id: 1,
    name: "نطق الحروف بحركاتها الثلاث (الفتحة، الكسرة، الضمة)",
    category: "الحروف الهجائية",
    pageRef: 6,
    unitId: "letters",
    attempts: [false, false, false, false]
  },
  {
    id: 2,
    name: "نطق الحروف بحركات مختلفة وبشكل عشوائي وبسرعة",
    category: "الحروف الهجائية",
    pageRef: 7,
    unitId: "letters",
    attempts: [false, false, false, false]
  },
  {
    id: 3,
    name: "نسخ الحروف وكتابتها بالحركات الثلاث وبسرعة",
    category: "الحروف الهجائية",
    pageRef: 8,
    unitId: "letters",
    attempts: [false, false, false, false]
  },
  {
    id: 4,
    name: "الإملاء الغيبي للحروف مع حركاتها الثلاث",
    category: "الحروف الهجائية",
    pageRef: 9,
    unitId: "letters",
    attempts: [false, false, false, false]
  },
  {
    id: 5,
    name: "قراءة حرفين مفتوحين قراءة سريعة",
    category: "قراءة حرفين",
    pageRef: 11,
    unitId: "two_letters",
    attempts: [false, false, false, false]
  },
  {
    id: 6,
    name: "قراءة حرفين أحدهما مكسور قراءة سريعة",
    category: "قراءة حرفين",
    pageRef: 13,
    unitId: "two_letters",
    attempts: [false, false, false, false]
  },
  {
    id: 7,
    name: "قراءة حرفين أحدهما مضموم قراءة سريعة",
    category: "قراءة حرفين",
    pageRef: 15,
    unitId: "two_letters",
    attempts: [false, false, false, false]
  },
  {
    id: 8,
    name: "قراءة وكتابة كلمات جميع حروفها مفتوحة وتحليلها",
    category: "قراءة كلمات",
    pageRef: 18,
    unitId: "three_letter_words",
    attempts: [false, false, false, false]
  },
  {
    id: 9,
    name: "قراءة وكتابة كلمات أحد حروفها مكسور وتحليلها",
    category: "قراءة كلمات",
    pageRef: 26,
    unitId: "three_letter_words",
    attempts: [false, false, false, false]
  },
  {
    id: 10,
    name: "قراءة وكتابة كلمات أحد حروفها مضموم وتحليلها",
    category: "قراءة كلمات",
    pageRef: 34,
    unitId: "three_letter_words",
    attempts: [false, false, false, false]
  },
  {
    id: 11,
    name: "قراءة ونطق المقطع الساكن وتحليله مع الحرف السابق",
    category: "المقطع الساكن",
    pageRef: 42,
    unitId: "three_letter_words",
    attempts: [false, false, false, false]
  },
  {
    id: 12,
    name: "قراءة وكتابة وتمييز المد بأنواعه الثلاثة (ألف، واو، ياء)",
    category: "المد وحروفه",
    pageRef: 51,
    unitId: "madd",
    attempts: [false, false, false, false]
  },
  {
    id: 13,
    name: "قراءة وكتابة وتمييز أنواع التنوين (ضم، فتح، كسر)",
    category: "التنوين",
    pageRef: 80,
    unitId: "tanween",
    attempts: [false, false, false, false]
  },
  {
    id: 14,
    name: "قراءة وتحليل الحرف المشدد وتصنيف الشدة",
    category: "الشدة",
    pageRef: 94,
    unitId: "shaddah",
    attempts: [false, false, false, false]
  },
  {
    id: 15,
    name: "التمييز بين اللام الشمسية والقمرية والتاء المفتوحة والمربوطة والهاء",
    category: "الظواهر اللغوية",
    pageRef: 100,
    unitId: "lam",
    attempts: [false, false, false, false]
  }
];
