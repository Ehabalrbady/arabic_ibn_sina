import { UnitId } from '../types/book';

export interface MasteryQuiz {
  unitId: UnitId;
  unitNumber: number;
  unitTitle: string;
  quizNumber: number;
  quizTitle: string;
  targetSkill: string;
  readingSpeedWords: string[];
  readingSpeedBenchmark: {
    targetSeconds: number; // e.g. 20s
    excellentThreshold: string;
    goodThreshold: string;
    needsTrainingThreshold: string;
  };
  dictationChallengeWords: string[];
  phoneticAnalysisItems: Array<{ word: string; expectedSyllables: string[] }>;
  ruleDiscriminationItems: Array<{ prompt: string; options: string[]; answer: string }>;
  masteryScoreMax: number;
}

export const UNIT_MASTERY_QUIZZES: MasteryQuiz[] = [
  {
    unitId: 'letters',
    unitNumber: 2,
    unitTitle: 'الحروف الهجائية بالحركات الثلاث',
    quizNumber: 1,
    quizTitle: 'اختبار قياس الأثر والطلاقة: نطق الحروف بالحركات والتمييز البصري السريع',
    targetSkill: 'نطق وتمييز الحروف بالحركات الثلاث دون تردد وإتقان رسم الحرف بالنسخ',
    readingSpeedWords: ['بَ', 'تِ', 'ثُ', 'جَ', 'حِ', 'خُ', 'دَ', 'ذِ', 'رُ', 'زَ', 'سِ', 'شُ', 'صَ', 'ضِ', 'طُ', 'ظَ'],
    readingSpeedBenchmark: {
      targetSeconds: 15,
      excellentThreshold: 'أقل من ١٥ ثانية (طلاقة تامة)',
      goodThreshold: '١٦ - ٣٠ ثانية (متوسط مع تردد بسيط)',
      needsTrainingThreshold: 'أكثر من ٣٠ ثانية (يحتاج تكرار)'
    },
    dictationChallengeWords: ['عَ', 'غِ', 'فُ', 'قَ', 'كِ', 'لُ', 'مَ', 'نِ'],
    phoneticAnalysisItems: [
      { word: 'سَ', expectedSyllables: ['سَ'] },
      { word: 'كِ', expectedSyllables: ['كِ'] },
      { word: 'لُ', expectedSyllables: ['لُ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'الحركة التي ترسم فوق الحرف وتفتح الفم عند النطق بها هي:', options: ['الفتحة', 'الكسرة', 'الضمة'], answer: 'الفتحة' },
      { prompt: 'حرف (جِ) تحته حركة:', options: ['فتحة', 'كسرة', 'ضمة'], answer: 'كسرة' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'two_letters',
    unitNumber: 3,
    unitTitle: 'قراءة وكتابة حرفين قراءة سريعة',
    quizNumber: 2,
    quizTitle: 'اختبار قياس الأثر: الوصل الثنائي السريع والتهيئة للطلاقة',
    targetSkill: 'دمج حرفين بحركات مختلفة دون تقطيع صوتي أو توقف',
    readingSpeedWords: ['دَرَا', 'زَرَا', 'قَرَا', 'بَرَا', 'فَتَا', 'حَمَا', 'عَلَا', 'سَمَا', 'أَذِ', 'وَجِ', 'شَرِ', 'فَرِ'],
    readingSpeedBenchmark: {
      targetSeconds: 20,
      excellentThreshold: 'أقل من ٢٠ ثانية (نطق متصل فوري)',
      goodThreshold: '٢١ - ٤٠ ثانية (وصل بطيء)',
      needsTrainingThreshold: 'أكثر من ٤٠ ثانية (تهجئة مقطعة)'
    },
    dictationChallengeWords: ['دَرَا', 'حَمَا', 'عَمِ', 'فَرِ', 'أَذِ', 'سَلَ'],
    phoneticAnalysisItems: [
      { word: 'دَرَا', expectedSyllables: ['دَ', 'رَ'] },
      { word: 'حَمَا', expectedSyllables: ['حَ', 'مَ'] },
      { word: 'فَرِ', expectedSyllables: ['فَ', 'رِ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'عند قراءة المقطع الثنائي يجب:', options: ['نطق الحرفين معاً بصوت متصل', 'السكوت طويلاً بين الحرفين'], answer: 'نطق الحرفين معاً بصوت متصل' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'three_letter_words',
    unitNumber: 4,
    unitTitle: 'قراءة الكلمات والمقطع الساكن',
    quizNumber: 3,
    quizTitle: 'اختبار قياس الأثر الشامل: الكلمات الثلاثية وقفل المقطع الساكن',
    targetSkill: 'قراءة الكلمات الثلاثية وقفل المقطع الساكن مع ما قبله دون فصل',
    readingSpeedWords: ['كَتَبَ', 'جَلَسَ', 'سَمِعَ', 'فَهِمَ', 'يَكْتُبُ', 'يَجْلِسُ', 'مَسْجِدُ', 'دَفْتَرُ', 'مَطْبَخُ', 'مَنْزِلُ', 'أَكَلَ', 'شَرِبَ'],
    readingSpeedBenchmark: {
      targetSeconds: 25,
      excellentThreshold: 'أقل من ٢٥ ثانية (قراءة مباشرة دقيقة)',
      goodThreshold: '٢٦ - ٥٠ ثانية (تردد في السكون)',
      needsTrainingThreshold: 'أكثر من ٥٠ ثانية (يحتاج إعادة تدريب السكون)'
    },
    dictationChallengeWords: ['كَتَبَ', 'فَهِمَ', 'مَسْجِدُ', 'مَطْبَخُ', 'يَشْرَبُ', 'دَفْتَرُ', 'يَفْهَمُ', 'حَمِدَ'],
    phoneticAnalysisItems: [
      { word: 'مَسْجِدُ', expectedSyllables: ['مَسْ', 'جِ', 'دُ'] },
      { word: 'دَفْتَرُ', expectedSyllables: ['دَفْ', 'تَ', 'رُ'] },
      { word: 'كَتَبَ', expectedSyllables: ['كَ', 'تَ', 'بَ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'الحرف الساكن في اللغة العربية:', options: ['ينطق مع الحرف الذي قبله كصوت واحد', 'ينطق مفرداً ومستقلاً'], answer: 'ينطق مع الحرف الذي قبله كصوت واحد' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'madd',
    unitNumber: 5,
    unitTitle: 'المد وحروفه بأنواعه الثلاثة',
    quizNumber: 4,
    quizTitle: 'اختبار قياس الأثر: التمييز بين الحركات والمدود الثلاثة (أ - و - ي)',
    targetSkill: 'إشباع الحركات للمدود وتمييز حرف المد والممدود سمعياً وإملائياً',
    readingSpeedWords: ['قَالَ', 'يَقُولُ', 'قِيلَ', 'سَارَ', 'يَسِيرُ', 'سُورُ', 'نَامَ', 'يَنَامُ', 'نُورُ', 'صَابِرُ', 'عَلِيمُ', 'غَفُورُ'],
    readingSpeedBenchmark: {
      targetSeconds: 20,
      excellentThreshold: 'أقل من ٢٠ ثانية (تمييز فوري للمد)',
      goodThreshold: '٢١ - ٤٥ ثانية (خلط بسيط بين القصير والطويل)',
      needsTrainingThreshold: 'أكثر من ٤٥ ثانية (عدم إشباع المد)'
    },
    dictationChallengeWords: ['قَالَ', 'يَقُولُ', 'قِيلَ', 'طَبِيبُ', 'نُورُ', 'كِتَابُ', 'صَبُورُ', 'سَمِيعُ'],
    phoneticAnalysisItems: [
      { word: 'كِتَابُ', expectedSyllables: ['كِ', 'تَا', 'بُ'] },
      { word: 'يَقُولُ', expectedSyllables: ['يَ', 'قُو', 'لُ'] },
      { word: 'سَمِيعُ', expectedSyllables: ['سَ', 'مِي', 'عُ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'الحرف الذي يسبق الألف الممدودة تكون حركته دائماً:', options: ['فتحة', 'ضمة', 'كسرة'], answer: 'فتحة' },
      { prompt: 'حرف المد لا تأتي عليه:', options: ['أي حركة (خالٍ من الحركة)', 'فتحة أو ضمة'], answer: 'أي حركة (خالٍ من الحركة)' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'tanween',
    unitNumber: 6,
    unitTitle: 'التنوين (ضم، فتح، كسر)',
    quizNumber: 5,
    quizTitle: 'اختبار قياس الأثر: التمييز بين النون الأصلية والتنوين وحالات ألف تنوين الفتح',
    targetSkill: 'كتابة التنوين دون وضع نون أصلية وضبط ألف تنوين الفتح واستثناءاتها',
    readingSpeedWords: ['كِتَابٌ', 'كِتَابًا', 'كِتَابٍ', 'بَيْتٌ', 'بَيْتًا', 'بَيْتٍ', 'مَدْرَسَةٌ', 'مَدْرَسَةً', 'مَدْرَسَةٍ', 'سَمَاءٌ', 'سَمَاءً', 'سَمَاءٍ'],
    readingSpeedBenchmark: {
      targetSeconds: 20,
      excellentThreshold: 'أقل من ٢٠ ثانية (نطق نغمة التنوين بدقة)',
      goodThreshold: '٢١ - ٤٠ ثانية (تردد بسيط)',
      needsTrainingThreshold: 'أكثر من ٤٠ ثانية (يحتاج مراجعة نون التنوين)'
    },
    dictationChallengeWords: ['قَلَمًا', 'قَلَمٌ', 'قَلَمٍ', 'حَدِيقَةً', 'سَمَاءً', 'صَبَاحًا', 'رَجُلٌ', 'عَمَلٍ'],
    phoneticAnalysisItems: [
      { word: 'بَيْتًا', expectedSyllables: ['بَيْ', 'تًا'] },
      { word: 'قَلَمٌ', expectedSyllables: ['قَ', 'لَ', 'مٌ'] },
      { word: 'شَجَرَةٍ', expectedSyllables: ['شَ', 'جَ', 'رَ', 'ةٍ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'التنوين هو نون ساكنة تلحق آخر الاسم تنطق:', options: ['ولا تكتب نوناً بل حركتين', 'وتكتب نوناً صريحة'], answer: 'ولا تكتب نوناً بل حركتين' },
      { prompt: 'الكلمة المنتهية بتاء مربوطة (مَدْرَسَة) عند تنوين الفتح:', options: ['لا نزيد لها ألفاً (مَدْرَسَةً)', 'نزيد لها ألفاً (مَدْرَسَتًا)'], answer: 'لا نزيد لها ألفاً (مَدْرَسَةً)' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'shaddah',
    unitNumber: 7,
    unitTitle: 'الشدة وتفكيك الحرف المشدد',
    quizNumber: 6,
    quizTitle: 'اختبار قياس الأثر: فك وتفكيك الشدة والقراءة المضاعفة',
    targetSkill: 'تفكيك الحرف المشدد إلى (ساكن + متحرك) والضغط الصوتي السليم',
    readingSpeedWords: ['شَدَّ', 'مَدَّ', 'عَلَّمَ', 'دَرَّبَ', 'سَلَّمَ', 'مُعَلِّمُ', 'الصَّفُّ', 'الشَّمْسُ', 'يُسَبِّحُ', 'يُرَتِّبُ', 'قَوِيٌّ', 'نَبِيٌّ'],
    readingSpeedBenchmark: {
      targetSeconds: 20,
      excellentThreshold: 'أقل من ٢٠ ثانية (نبر وتشديد صحيح)',
      goodThreshold: '٢١ - ٤٠ ثانية (تشديد خفيف)',
      needsTrainingThreshold: 'أكثر من ٤٠ ثانية (قراءة الحرف مخففاً)'
    },
    dictationChallengeWords: ['عَلَّمَ', 'دَرَّسَ', 'سَلَّمَ', 'مُعَلِّمُ', 'صَفٌّ', 'حَقٌّ', 'رَبَّنَا', 'جَدِّي'],
    phoneticAnalysisItems: [
      { word: 'عَلَّمَ', expectedSyllables: ['عَلْ', 'لَ', 'مَ'] },
      { word: 'دَرَّبَ', expectedSyllables: ['دَرْ', 'رَ', 'بَ'] },
      { word: 'مُعَلِّمُ', expectedSyllables: ['مُ', 'عَلْ', 'لِ', 'مُ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'الحرف المشدد في الأصل عبارة عن:', options: ['حرفين الأول ساكن والثاني متحرك', 'حرف واحد عليه ضمة'], answer: 'حرفين الأول ساكن والثاني متحرك' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'lam',
    unitNumber: 8,
    unitTitle: 'اللام الشمسية واللام القمرية',
    quizNumber: 7,
    quizTitle: 'اختبار قياس الأثر: التمييز الصوتي والكتابي بين اللامين الشمسية والقمرية',
    targetSkill: 'إظهار اللام القمرية بالسكون وإدغام اللام الشمسية بالشدة',
    readingSpeedWords: ['الْقَمَرُ', 'الشَّمْسُ', 'الْكِتَابُ', 'الدَّفْتَرُ', 'الْمَدْرَسَةُ', 'الصَّفُّ', 'الْبَابُ', 'التِّلْمِيذُ', 'الْوَلَدُ', 'النَّاسُ', 'الْحَدِيقَةُ', 'السَّمَاءُ'],
    readingSpeedBenchmark: {
      targetSeconds: 25,
      excellentThreshold: 'أقل من ٢٥ ثانية (إظهار وإدغام مثالي)',
      goodThreshold: '٢٦ - ٤٥ ثانية (تردد عند الشمسية)',
      needsTrainingThreshold: 'أكثر من ٤٥ ثانية (نطق لام الشمسية ظاهرة)'
    },
    dictationChallengeWords: ['الْقَمَرُ', 'الشَّمْسُ', 'الْمَسْجِدُ', 'الطَّالِبُ', 'الْبَيْتُ', 'الرَّجُلُ', 'الْفَصْلُ', 'السَّيَّارَةُ'],
    phoneticAnalysisItems: [
      { word: 'الْقَمَرُ', expectedSyllables: ['الْ', 'قَ', 'مَ', 'رُ'] },
      { word: 'الشَّمْسُ', expectedSyllables: ['أَشْ', 'شَمْ', 'سُ'] },
      { word: 'الْمَدْرَسَةُ', expectedSyllables: ['الْ', 'مَدْ', 'رَ', 'سَ', 'ةُ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'اللام القمرية حكمها:', options: ['تكتب وتنطق وعليها سكون', 'تكتب ولا تنطق'], answer: 'تكتب وتنطق وعليها سكون' },
      { prompt: 'الحرف الذي يأتي بعد اللام الشمسية يكون دائماً:', options: ['مشدداً', 'ساكناً'], answer: 'مشدداً' }
    ],
    masteryScoreMax: 20
  },
  {
    unitId: 'ta_and_ha',
    unitNumber: 9,
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    quizNumber: 8,
    quizTitle: 'اختبار قياس الأثر: تطبيق القاعدة الذهبية (اختبار السكون) بين التاءات والهاء',
    targetSkill: 'تطبيق اختبار الوقف بالسكون والوصل بالحركة للتمييز الإملائي الحاسم',
    readingSpeedWords: ['بَيْتْ - بَيْتٌ', 'مَدْرَسَهْ - مَدْرَسَةٌ', 'وَجْهْ - وَجْهُ', 'شَجَرَهْ - شَجَرَةٌ', 'كَتَبَتْ', 'مِيَاهْ - مِيَاهُ', 'بِنْتْ - بِنْتٌ', 'حَدِيقَهْ - حَدِيقَةٌ'],
    readingSpeedBenchmark: {
      targetSeconds: 20,
      excellentThreshold: 'أقل من ٢٠ ثانية (تطبيق فوري لقاعدة الوقف والوصل)',
      goodThreshold: '٢١ - ٤٠ ثانية (تردد بسيط)',
      needsTrainingThreshold: 'أكثر من ٤٠ ثانية (يحتاج مراجعة اختبار السكون)'
    },
    dictationChallengeWords: ['بَيْتٌ', 'شَجَرَةٌ', 'وَجْهٌ', 'سَاعَةٌ', 'مِيَاهٌ', 'مُعَلِّمَاتٌ', 'قِصَّةٌ', 'فَوَاكِهُ'],
    phoneticAnalysisItems: [
      { word: 'مَدْرَسَةٌ', expectedSyllables: ['مَدْ', 'رَ', 'سَ', 'ةٌ'] },
      { word: 'بَنَاتٌ', expectedSyllables: ['بَ', 'نَا', 'تٌ'] },
      { word: 'وَجْهٌ', expectedSyllables: ['وَجْ', 'هٌ'] }
    ],
    ruleDiscriminationItems: [
      { prompt: 'الحرف الذي ينطق (تاء) في الوصل، وينطق (هاء) عند الوقف بالسكون هو:', options: ['التاء المربوطة (ـة / ة)', 'التاء المفتوحة (ت)', 'الهاء (ـه / ه)'], answer: 'التاء المربوطة (ـة / ة)' },
      { prompt: 'كلمة (وَجْه) عند الوقف والوصل تنطق:', options: ['هاءً في الحالتين (هاء أصلية بدون نقاط)', 'تاء في الوصل'], answer: 'هاءً في الحالتين (هاء أصلية بدون نقاط)' }
    ],
    masteryScoreMax: 20
  }
];
