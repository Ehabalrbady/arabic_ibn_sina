import { UnitId } from '../curriculum/types';

export interface AchievementBadge {
  id: string;
  unitId?: UnitId;
  skillIds?: number[];
  title: string;
  subtitle: string;
  categoryTitle: string;
  icon: string;
  gradient: string;
  borderGlow: string;
  textColor: string;
  description: string;
  certificateTitle: string;
  certificatePraise: string;
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge_letters',
    unitId: 'letters',
    skillIds: [1, 2, 3, 4],
    title: 'فارس الحروف والحركات',
    subtitle: 'إتقان نطق ونسخ وإملاء الحروف بحركاتها الثلاث',
    categoryTitle: 'الوحدة ٢: الحروف الهجائية',
    icon: '✨',
    gradient: 'from-emerald-600 to-teal-800',
    borderGlow: 'border-emerald-400',
    textColor: 'text-emerald-800',
    description: 'تم إتقان جميع مهارات نطق الحروف بالحركات الثلاث والقراءة العشوائية السريعة والإملاء بنسبة 100%.',
    certificateTitle: 'شهادة تميز وإتقان الحروف الهجائية',
    certificatePraise: 'تقديراً لإتقانه/ـا التام لمهارات نطق ورسم وإملاء الحروف الهجائية بالحركات الثلاث بدقة وسرعة فائقة.'
  },
  {
    id: 'badge_two_letters',
    unitId: 'two_letters',
    skillIds: [5, 6, 7],
    title: 'بطل انطلاق الحرفين',
    subtitle: 'قراءة حرفين متصلين بجميع الحركات بطلاقة وسرعة',
    categoryTitle: 'الوحدة ٣: قراءة حرفين',
    icon: '⚡',
    gradient: 'from-blue-600 to-indigo-800',
    borderGlow: 'border-blue-400',
    textColor: 'text-blue-800',
    description: 'تم إتقان وصل وقراءة حرفين مفتوحين ومكسورين ومضمومين بقراءة سريعة متصلة دون تقطيع بنسبة 100%.',
    certificateTitle: 'شهادة تميز وطلاقة وصل الحرفين',
    certificatePraise: 'تقديراً لإتقانه/ـا مهارة التهيئة للطلاقة وسرعة وصل ونطق الحرفين المتتاليين بمختلف الحركات بإتقان تام.'
  },
  {
    id: 'badge_words_sukoon',
    unitId: 'three_letter_words',
    skillIds: [8, 9, 10, 11],
    title: 'عبقري الكلمات والمقطع الساكن',
    subtitle: 'قراءة الكلمات الثلاثية والمقطع الساكن وتحليلها صوتياً',
    categoryTitle: 'الوحدة ٤: قراءة الكلمات والمقطع الساكن',
    icon: '💎',
    gradient: 'from-amber-600 to-amber-900',
    borderGlow: 'border-amber-400',
    textColor: 'text-amber-800',
    description: 'تم إتقان قراءة وكتابة وتحليل الكلمات الثلاثية بمختلف الحركات والوقوف على المقطع الساكن بنسبة 100%.',
    certificateTitle: 'شهادة تفوق في قراءة الكلمات والمقطع الساكن',
    certificatePraise: 'تقديراً لإبداعه/ـا في نطق وتحليل الكلمات الثلاثية بحركاتها وتطبيق قاعدة المقطع الساكن بمهارة واقتدار.'
  },
  {
    id: 'badge_madd',
    unitId: 'madd',
    skillIds: [12],
    title: 'سفير المدود والأصوات الطويلة',
    subtitle: 'التمييز بين الحركات والمدود (ألف، واو، ياء) وقراءتها',
    categoryTitle: 'الوحدة ٥: المد وحروفه',
    icon: '🌟',
    gradient: 'from-purple-600 to-fuchsia-900',
    borderGlow: 'border-purple-400',
    textColor: 'text-purple-800',
    description: 'تم إتقان التمييز السمعي والبصري لأنواع المد الثلاثة ومطابقة الحرف الممدود والتحليل الصوتي بنسبة 100%.',
    certificateTitle: 'شهادة إتقان حروف المد والأصوات الطويلة',
    certificatePraise: 'تقديراً لتميزه/ـا في التمييز الدقيق بين الحركات القصيرة والمدود الطويلة وقراءتها وإملائها بإتقان تام.'
  },
  {
    id: 'badge_tanween',
    unitId: 'tanween',
    skillIds: [13],
    title: 'أستاذ التنوين وقواعد النون',
    subtitle: 'إتقان أنواع التنوين الثلاثة كتابة ونطقاً دون خلط بالنون',
    categoryTitle: 'الوحدة ٦: التنوين',
    icon: '🔔',
    gradient: 'from-teal-600 to-cyan-900',
    borderGlow: 'border-teal-400',
    textColor: 'text-teal-800',
    description: 'تم إتقان نطق وكتابة تنوين الضم والفتح والكسر ومعرفة حالات كتابة ألف التنوين واستثناءاتها بنسبة 100%.',
    certificateTitle: 'شهادة إتقان مهارة التنوين',
    certificatePraise: 'تقديراً لتفوقه/ـا في تطبيق قواعد التنوين بأنواعه الثلاثة ونطق النون الساكنة وكتابة الحركات الإملائية بدقة.'
  },
  {
    id: 'badge_shaddah',
    unitId: 'shaddah',
    skillIds: [14],
    title: 'قاهر الشدة وفك الإدغام',
    subtitle: 'تفكيك الحرف المشدد صوتياً وكتابته بالحركات والتنوين',
    categoryTitle: 'الوحدة ٧: الشدة',
    icon: '🔥',
    gradient: 'from-rose-600 to-red-900',
    borderGlow: 'border-rose-400',
    textColor: 'text-rose-800',
    description: 'تم إتقان فك وتفكيك الحرف المشدد إلى حرفين (ساكن فمتحرك) ونطقه المضبوط واستخراجه بنسبة 100%.',
    certificateTitle: 'شهادة تفوق في مهارة الشدة وتفكيك المقاطع',
    certificatePraise: 'تقديراً لاقتداره/ـا على تفكيك الحرف المشدد الصوتي وتحليله وكتابته بالحركات بدقة وإتقان ممتاز.'
  },
  {
    id: 'badge_lam_ta_ha',
    unitId: 'lam',
    skillIds: [15],
    title: 'خبير الظواهر اللغوية والتاءات',
    subtitle: 'التمييز بين اللام الشمسية والقمرية والتاء المفتوحة والمربوطة والهاء',
    categoryTitle: 'الوحدات ٨ و ٩: اللام والتاءات والهاء',
    icon: '☀️',
    gradient: 'from-amber-600 to-orange-800',
    borderGlow: 'border-amber-400',
    textColor: 'text-amber-800',
    description: 'تم إتقان التمييز بين اللامين واختبار السكون بالوقف والوصل للتاء المربوطة والمفتوحة والهاء بنسبة 100%.',
    certificateTitle: 'شهادة إتقان الظواهر اللغوية والتمييز الإملائي',
    certificatePraise: 'تقديراً لإتقانه/ـا التمييز بين اللام الشمسية والقمرية وتطبيق القاعدة الذهبية للتفرقة بين التاء والهاء بدقة.'
  },
  {
    id: 'badge_grand_master',
    title: 'وسام التاج — خريج الخطة العلاجية',
    subtitle: 'إتقان 100% من جميع المهارات الـ 15 للمنهج كاملاً',
    categoryTitle: 'الاعتماد النهائي الشامل للمنهج',
    icon: '👑',
    gradient: 'from-amber-500 via-yellow-600 to-amber-800',
    borderGlow: 'border-amber-300 ring-4 ring-amber-400/50',
    textColor: 'text-amber-950',
    description: 'إنجاز استثنائي: أتم الطالب إتقان كافة المهارات القرائية والإملائية الـ 15 لمنهج الخطة العلاجية بنجاح باهر بنسبة 100%.',
    certificateTitle: 'الشهادة التقديرية الكبرى للتخرج والتميز اللغوي',
    certificatePraise: 'تقديراً لإتمامه/ـا بنجاح وتفوق برنامج الخطة العلاجية الشاملة لمهارات القراءة والكتابة وإتقان كافة المهارات الـ 15 بنسبة 100%.'
  }
];
