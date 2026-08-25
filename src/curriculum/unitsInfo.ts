import { UnitInfo } from './types';

export const BOOK_UNITS: UnitInfo[] = [
  {
    id: 'intro',
    number: 1,
    title: 'المقدمة وخطة العلاج',
    shortTitle: 'المقدمة',
    startPage: 1,
    endPage: 4,
    description: 'تشخيص أسباب الضعف الستة، والمنهجية العلاجية وإرشادات المعلم وولي الأمر.',
    icon: 'BookOpen',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  {
    id: 'letters',
    number: 2,
    title: 'الحروف الهجائية بالحركات الثلاث',
    shortTitle: 'الحروف الهجائية',
    startPage: 5,
    endPage: 9,
    description: 'نطق الحروف بالفتحة والكسرة والضمة، القراءة العشوائية السريعة، والتدريب الكتابي والإملائي.',
    icon: 'Sparkles',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'two_letters',
    number: 3,
    title: 'قراءة وكتابة حرفين قراءة سريعة',
    shortTitle: 'قراءة حرفين',
    startPage: 10,
    endPage: 16,
    description: 'التهيئة للطلاقة عبر وصل حرفين مفتوحين، أحدهما مكسور، أو أحدهما مضموم مع التتبع.',
    icon: 'Zap',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'three_letter_words',
    number: 4,
    title: 'قراءة الكلمات والمقطع الساكن',
    shortTitle: 'قراءة الكلمات',
    startPage: 17,
    endPage: 49,
    description: 'الكلمات الثلاثية (مفتوحة، مكسورة، مضمومة)، تحليل المقاطع، والمقطع الساكن وقاعدته الصارمة.',
    icon: 'Layers',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'madd',
    number: 5,
    title: 'المد وحروفه بأنواعه الثلاثة',
    shortTitle: 'المد وحروفه',
    startPage: 50,
    endPage: 77,
    description: 'المد بالألف والواو والياء، المقارنة السمعية بين الحركة والمد، والتحليل الصوتي والإملاء.',
    icon: 'Volume2',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'tanween',
    number: 6,
    title: 'التنوين (ضم، فتح، كسر)',
    shortTitle: 'التنوين',
    startPage: 78,
    endPage: 91,
    description: 'مفهوم التنوين كـ نون ساكنة تنطق ولا تكتب، الحالات الاستثنائية لألف تنوين الفتح، والتدريبات.',
    icon: 'Bell',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    id: 'shaddah',
    number: 7,
    title: 'الشدة وتفكيك الحرف المشدد',
    shortTitle: 'الشدة',
    startPage: 92,
    endPage: 98,
    description: 'فك الإدغام (ساكن + متحرك)، الشدة مع الحركات ومع التنوين، واستخراج وتصنيف الشدة.',
    icon: 'Flame',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'lam',
    number: 8,
    title: 'اللام الشمسية واللام القمرية',
    shortTitle: 'اللام الشمسية والقمرية',
    startPage: 99,
    endPage: 111,
    description: 'الفرق الصوتي والكتابي، حروف اللامين، إدخال (ال) على الكلمات، وتصنيف وتلوين الكلمات.',
    icon: 'Sun',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  {
    id: 'ta_and_ha',
    number: 9,
    title: 'التاء المفتوحة والمربوطة والهاء',
    shortTitle: 'التاءات والهاء',
    startPage: 112,
    endPage: 120,
    description: 'القاعدة الذهبية (اختبار السكون بالوقف والوصل)، التمييز الإملائي، تمارين الصور والتلوين.',
    icon: 'CheckCircle2',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    id: 'evaluation',
    number: 10,
    title: 'سجل القياس وإتقان المهارات (المحاولات الـ 4)',
    shortTitle: 'سجل القياس والتقويم',
    startPage: 121,
    endPage: 121,
    description: 'جدول المتابعة الشامل لجميع المهارات الـ 15 مع إحصائيات الإتقان ونظام المحاولات الأربع والطباعة.',
    icon: 'Award',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  }
];
