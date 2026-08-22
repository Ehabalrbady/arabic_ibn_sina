import { BookPage } from '../types/book';

export const PAGES_PART_1: BookPage[] = [
  // Page 1: Cover
  {
    pageNumber: 1,
    unitId: 'intro',
    unitTitle: 'الغلاف',
    title: 'خطة علاجية لمهارات القراءة والكتابة - المرحلة الابتدائية',
    pageType: 'cover',
    goal: 'إتقان القراءة والكتابة والتغلب على أسباب الضعف القرائي والإملائي',
    content: {
      text: 'قسم إدارة الجودة بمدارس ابن سيناء - برنامج التميز اللغوي - المرحلة الابتدائية'
    }
  },
  // Page 2: Credits
  {
    pageNumber: 2,
    unitId: 'intro',
    unitTitle: 'معلومات المذكرة',
    title: 'قسم إدارة الجودة والتطوير',
    pageType: 'intro',
    content: {
      text: 'مدارس ابن سيناء - قسم إدارة الجودة والتطوير - برنامج التميز اللغوي ورعاية المهارات القرائية والإملائية'
    }
  },
  // Page 3: Introduction
  {
    pageNumber: 3,
    unitId: 'intro',
    unitTitle: 'المقدمة',
    title: 'المقدمة وأسباب الضعف الستة',
    pageType: 'intro',
    content: {
      text: 'كانت القراءة والكتابة - ولا زالت - من أهم المهارات التي يكتسبها الفرد أثناء تعليمه...',
      ruleBoxes: [
        { title: '1. عدم تفريق الطالب بين الحروف', body: 'التشابه في رسم الحروف ونقاطها.', example: 'ب / ت / ث / ن / ي' },
        { title: '2. عدم التفريق بين الحركات', body: 'الخلط بين الفتحة والكسرة والضمة.', example: 'دَ / دِ / دُ' },
        { title: '3. عدم معرفة المد وحروفه ونطقه', body: 'عدم إطالة الصوت ومط الحرف مع حروف المد.', example: 'بَ vs بَا' },
        { title: '4. عدم فهم الشدة والتنوين', body: 'صعوبة فك الإدغام وكتابة النون في التنوين نوناً صريحة.', example: 'كَلَّمَ / قَلَمٌ' },
        { title: '5. عدم التفريق بين اللام الشمسية والقمرية', body: 'نطق اللام الشمسية خطأً أو عدم تشديد الحرف بعدها.', example: 'الشَّمْس vs الْقَمَر' },
        { title: '6. عدم التفريق بين التاء المفتوحة والمربوطة والهاء', body: 'الخلط في نهاية الكلمة عند الوقف والوصل.', example: 'مَدْرَسَة vs بِنْت vs وَجْه' }
      ]
    }
  },
  // Page 4: TOC
  {
    pageNumber: 4,
    unitId: 'intro',
    unitTitle: 'الفهرس',
    title: 'فهرس موضوعات المذكرة',
    pageType: 'toc',
    content: {
      items: [
        '1. المقدمة (ص 2)',
        '2. الحروف الهجائية (ص 5)',
        '3. قراءة وكتابة حرفين قراءة سريعة (ص 9)',
        '4. قراءة كلمات (ص 16)',
        '5. المد وحروفه (ص 49)',
        '6. التنوين (ص 77)',
        '7. الشدة (ص 91)',
        '8. اللام الشمسية واللام القمرية (ص 98)',
        '9. التاء المفتوحة والمربوطة والهاء (ص 111)'
      ]
    }
  },
  // Page 5: Letters Cover
  {
    pageNumber: 5,
    unitId: 'letters',
    unitTitle: 'الحروف الهجائية',
    title: 'الحروف',
    pageType: 'unit_cover',
    subtitle: 'تأسيس الحروف بالحركات الثلاث'
  },
  // Page 6: Letters Vowels
  {
    pageNumber: 6,
    unitId: 'letters',
    unitTitle: 'الحروف الهجائية',
    title: 'الحروف الهجائية بالحركات الثلاث',
    pageType: 'letter_vowels',
    goal: 'أن ينطق الطالب الحروف بحركاتها الثلاث ( الفتحة ، الكسرة ، الضمة )',
    procedure: 'يقوم الطالب بالتعرف على الحروف بحركاتها الثلاث ويميز بينها وينطقها.',
    skillId: 1,
    content: {
      gridItems: [
        'أَ إِ أُ', 'بَ بِ بُ', 'تَ تِ تُ', 'ثَ ثِ ثُ', 'جَ جِ جُ', 'حَ حِ حُ', 'خَ خِ خُ',
        'دَ دِ دُ', 'ذَ ذِ ذُ', 'رَ رِ رُ', 'زَ زِ زُ', 'سَ سِ سُ', 'شَ شِ شُ', 'صَ صِ صُ',
        'ضَ ضِ ضُ', 'طَ طِ طُ', 'ظَ ظِ ظُ', 'عَ عِ عُ', 'غَ غِ غُ', 'فَ فِ فُ', 'قَ قِ قُ',
        'كَ كِ كُ', 'لَ لِ لُ', 'مَ مِ مُ', 'نَ نِ نُ', 'هَـ هِـ هُـ', 'وَ وِ وُ', 'يَ يِ يُ'
      ]
    }
  },
  // Page 7: Random Letters Pronunciation
  {
    pageNumber: 7,
    unitId: 'letters',
    unitTitle: 'الحروف الهجائية',
    title: 'نطق الحروف العشوائي والسريع',
    pageType: 'letter_random',
    goal: 'التأكد من إتقان الطالب لنطق جميع الحروف بالحركات المختلفة وبسرعة.',
    procedure: 'قراءة الحروف بحركات مختلفة بشكل عشوائي وبسرعة بدون ترتيب مسبق.',
    skillId: 2,
    content: {
      gridItems: [
        'فَ', 'سِ', 'نُ', 'طِ', 'أَ', 'كِ', 'نَ', 'غُ', 'ظِ', 'مِ',
        'جَ', 'ظُ', 'نُ', 'رُ', 'ثَ', 'دِ', 'مُ', 'ثِ', 'كِ', 'طَ',
        'سُ', 'يِ', 'حِ', 'تِ', 'نِ', 'زَ', 'فُ', 'ظِ', 'شِ', 'مِ',
        'شِ', 'سُ', 'زِ', 'قُ', 'صُ', 'مِ', 'زُ', 'ضِ', 'دَ', 'ذُ',
        'وَ', 'كُ', 'غُ', 'خُ', 'تَ', 'ذِ', 'طِ', 'إِ', 'غَ', 'ثُ',
        'دُ', 'فِ', 'كِ', 'يُ', 'ثِ', 'ضِ', 'هِـ', 'كَ', 'وُ', 'رِ',
        'طُ', 'بَ', 'ذَ', 'ظَ', 'لِ', 'أُ', 'رَ', 'سِ', 'عُ', 'كِ'
      ]
    }
  },
  // Page 8: Written Tracing
  {
    pageNumber: 8,
    unitId: 'letters',
    unitTitle: 'الحروف الهجائية',
    title: 'تدريب كتابي: نسخ الحروف ونطقها',
    pageType: 'written_tracing',
    goal: 'كتابة الحروف بالحركات الثلاث مع السرعة والإتقان.',
    procedure: 'يقوم الطالب بنسخ الحروف التالية ونطقها، مع حثه وتشجيعه على السرعة في الكتابة.',
    skillId: 3,
    content: {
      gridItems: [
        'أَ إِ أُ', 'بَ بِ بُ', 'تَ تِ تُ', 'ثَ ثِ ثُ', 'جَ جِ جُ', 'حَ حِ حُ', 'خَ خِ خُ',
        'دَ دِ دُ', 'ذَ ذِ ذُ', 'رَ رِ رُ', 'زَ زِ زُ', 'سَ سِ سُ', 'شَ شِ شُ', 'صَ صِ صُ',
        'ضَ ضِ ضُ', 'طَ طِ طُ', 'ظَ ظِ ظُ', 'عَ عِ عُ', 'غَ غِ غُ', 'فَ فِ فُ', 'قَ قِ قُ',
        'كَ كِ كُ', 'لَ لِ لُ', 'مَ مِ مُ', 'نَ نِ نُ', 'هَـ هِـ هُـ', 'وَ وِ وُ', 'يَ يِ يُ'
      ]
    }
  },
  // Page 9: Dictation Board
  {
    pageNumber: 9,
    unitId: 'letters',
    unitTitle: 'الحروف الهجائية',
    title: 'تدريب إملائي للحروف بالحركات',
    pageType: 'dictation_board',
    goal: 'التأكد من قدرة الطالب على كتابة الحروف غيباً بمجرد سماع نطقها بالحركة.',
    procedure: 'يملي المعلم أو النظام الصوتي على الطالب الحروف مع حركاتها للتأكد من إتقانها.',
    skillId: 4,
    content: {
      dictationSuggestedWords: ['أُ', 'بِ', 'تَ', 'ثُ', 'جِ', 'حَ', 'خُ', 'دِ', 'ذَ', 'رُ', 'زِ', 'سَ', 'شُ', 'صِ', 'ضَ', 'طُ', 'ظِ', 'عَ', 'غُ', 'فِ', 'قَ', 'كُ', 'لِ', 'مَ', 'نُ', 'هِـ', 'وِ', 'يُ']
    }
  },
  // Page 10: Two Letters Cover
  {
    pageNumber: 10,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'قراءة وكتابة حرفين قراءة سريعة',
    pageType: 'unit_cover',
    subtitle: 'مهارة التهيئة والانطلاق للكلمات'
  },
  // Page 11: Two Letters Open
  {
    pageNumber: 11,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'قراءة حرفين مفتوحين',
    pageType: 'two_letters_reading',
    goal: 'أن يقرأ الطالب حرفين مفتوحين قراءة سريعة كصوت واحد.',
    procedure: 'يقوم الطالب بقراءة الحروف الآتية قراءة سريعة وينبغي حثه على السرعة.',
    skillId: 5,
    content: {
      gridItems: [
        'قَرَ', 'كَتَـ', 'جَلَـ', 'زَرَ', 'أَكَـ',
        'رَفَـ', 'طَلَـ', 'حَرَ', 'رَسَـ', 'دَخَـ',
        'غَرَ', 'فَتَـ', 'أَخَـ', 'هَرَ', 'وَقَـ',
        'نَظَـ', 'مَكَـ', 'حَمَـ', 'وَقَـ', 'شَرَ',
        'نَشَـ', 'نَبَـ', 'خَبَـ', 'جَمَـ', 'وَجَـ'
      ]
    }
  },
  // Page 12: Tracing Two Open Letters
  {
    pageNumber: 12,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'تدريب كتابي: حرفين مفتوحين',
    pageType: 'written_tracing',
    procedure: 'يقوم الطالب بقراءة الحرفين المفتوحين بسرعة ثم الإعادة على الحروف بقلم الرصاص ثم كتابتها.',
    skillId: 5,
    content: {
      gridItems: ['قَرَ', 'كَتَـ', 'حَرَ', 'هَرَ', 'وَقَـ', 'أَخَـ', 'جَمَـ', 'وَجَـ', 'نَشَـ', 'حَمَـ', 'دَخَـ', 'زَرَ']
    }
  },
  // Page 13: Two Letters with Kasra
  {
    pageNumber: 13,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'قراءة حرفين أحدهما مكسور',
    pageType: 'two_letters_reading',
    goal: 'أن يقرأ الطالب حرفين أحدهما مكسور قراءة سريعة متقنة.',
    procedure: 'يقوم الطالب بقراءة المقاطع الآتية قراءة سريعة مع مراعاة صوت الكسرة.',
    skillId: 6,
    content: {
      gridItems: [
        'رَغِـ', 'شَرِ', 'ضَحِـ', 'نَشِـ', 'قَبِـ',
        'سَهِـ', 'عَلِـ', 'نَسِـ', 'سَمِـ', 'صَحِـ',
        'تَعِـ', 'لَحِـ', 'فَهِـ', 'غَضِـ', 'سَلِـ',
        'نَضِـ', 'سَخِـ', 'لَقِـ', 'تَعِـ', 'وَسِـ',
        'نَدِ', 'مَرِ', 'فَرِ', 'قَدِ', 'شَهِـ'
      ]
    }
  },
  // Page 14: Tracing Two Letters with Kasra
  {
    pageNumber: 14,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'تدريب كتابي: حرفين أحدهما مكسور',
    pageType: 'written_tracing',
    procedure: 'يقوم الطالب بقراءة الحرفين بسرعة ثم الإعادة على الحروف بقلم الرصاص ثم كتابتها.',
    skillId: 6,
    content: {
      gridItems: ['لَحِـ', 'نَدِ', 'سَخِـ', 'تَعِـ', 'فَهِـ', 'قَبِـ', 'لَقِـ', 'سَلِـ', 'ضَحِـ', 'عَلِـ', 'نَضِـ', 'مَرِ']
    }
  },
  // Page 15: Two Letters with Damma
  {
    pageNumber: 15,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'قراءة حرفين أحدهما مضموم',
    pageType: 'two_letters_reading',
    goal: 'أن يقرأ الطالب حرفين أحدهما مضموم قراءة سريعة ومتقنة.',
    procedure: 'يقوم الطالب بقراءة الحروف الآتية قراءة سريعة مع ضبط حركة الضم.',
    skillId: 7,
    content: {
      gridItems: [
        'فُتِـ', 'كُتِـ', 'غُفِـ', 'سَهُـ', 'جُلِـ',
        'لُعِـ', 'مُنِـ', 'رُبِـ', 'رُزِ', 'كَرُ',
        'شُرِ', 'وُصِـ', 'مُسِـ', 'صُعِـ', 'أُكِـ',
        'سُكِـ', 'سُبِـ', 'قُفِـ', 'طَلُـ', 'حَلُـ',
        'كَبُـ', 'فُهِـ', 'زُرِ', 'خُبِـ', 'شُرِ'
      ]
    }
  },
  // Page 16: Tracing Two Letters with Damma
  {
    pageNumber: 16,
    unitId: 'two_letters',
    unitTitle: 'قراءة حرفين',
    title: 'تدريب كتابي: حرفين أحدهما مضموم',
    pageType: 'written_tracing',
    procedure: 'يقوم الطالب بقراءة الحرفين بسرعة ثم الإعادة على الحروف بقلم الرصاص ثم كتابتها.',
    skillId: 7,
    content: {
      gridItems: ['مُسِـ', 'وُصِـ', 'كَبُـ', 'شُرِ', 'كَرُ', 'رُزِ', 'كُتِـ', 'أُكِـ', 'لُعِـ', 'سَهُـ', 'رُبِـ', 'جُلِـ']
    }
  },
  // Page 17: Cover 3-Letter Words
  {
    pageNumber: 17,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'قراءة وكتابة كلمات جميع حروفها مفتوحة',
    pageType: 'unit_cover',
    subtitle: 'الكلمات الثلاثية المفتوحة'
  },
  // Page 18: 3-Letter Open Words
  {
    pageNumber: 18,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'كلمات جميع حروفها مفتوحة',
    pageType: 'words_reading',
    goal: 'أن يقرأ الطالب كلمات من ثلاث أحرف ، جميع حروف الكلمة مفتوحة.',
    procedure: 'يقوم الطالب بتهجي حروف الكلمة ثم قراءتها، وينبغي حثه على السرعة.',
    skillId: 8,
    content: {
      gridItems: [
        'قَرَأَ', 'كَتَبَ', 'جَلَسَ', 'زَرَعَ', 'أَكَلَ',
        'رَفَعَ', 'طَلَعَ', 'حَرَثَ', 'رَسَمَ', 'دَخَلَ',
        'غَرَسَ', 'فَتَحَ', 'أَخَذَ', 'هَرَبَ', 'وَقَفَ',
        'نَظَرَ', 'خَرَجَ', 'حَمَلَ', 'وَقَعَ', 'كَسَرَ',
        'نَشَرَ', 'نَبَتَ', 'خَبَزَ', 'جَمَعَ', 'وَجَدَ'
      ]
    }
  },
  // Page 19: Decomposition Activities
  {
    pageNumber: 19,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'أنشطة وتدريبات تركيب الكلمات المفتوحة',
    pageType: 'connect_and_read',
    procedure: 'يقوم الطالب بقراءة الكلمات ثم الإعادة على الحروف والكلمات بقلم الرصاص ثم كتابتها.',
    skillId: 8,
    content: {
      connectExercises: [
        { separated: 'قَ + رَ + أَ', combined: 'قَرَأَ' },
        { separated: 'كَ + تَ + بَ', combined: 'كَتَبَ' },
        { separated: 'حَ + رَ + ثَ', combined: 'حَرَثَ' },
        { separated: 'نَ + شَ + رَ', combined: 'نَشَرَ' }
      ]
    }
  },
  // Page 20: Syllable Analysis
  {
    pageNumber: 20,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب كتابي: تحليل الكلمات إلى مقاطع',
    pageType: 'analysis_syllables',
    procedure: 'يقوم الطالب بتحليل الكلمات إلى مقاطع صوتية.',
    skillId: 8,
    content: {
      analysisWords: [
        { word: 'غَرَسَ', syllables: ['غَ', 'رَ', 'سَ'] },
        { word: 'رَسَمَ', syllables: ['رَ', 'سَ', 'مَ'] },
        { word: 'نَظَرَ', syllables: ['نَ', 'ظَ', 'رَ'] },
        { word: 'زَرَعَ', syllables: ['زَ', 'رَ', 'عَ'] },
        { word: 'قَرَأَ', syllables: ['قَ', 'رَ', 'أَ'] },
        { word: 'وَجَدَ', syllables: ['وَ', 'جَ', 'دَ'] },
        { word: 'وَقَفَ', syllables: ['وَ', 'قَ', 'فَ'] },
        { word: 'نَبَتَ', syllables: ['نَ', 'بَ', 'تَ'] },
        { word: 'هَرَبَ', syllables: ['هَـ', 'رَ', 'بَ'] },
        { word: 'جَلَسَ', syllables: ['جَ', 'لَ', 'سَ'] }
      ]
    }
  },
  // Page 21: Letter Connecting Training
  {
    pageNumber: 21,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب: وصل الحروف وقراءة الكلمة',
    pageType: 'connect_and_read',
    procedure: 'يقوم الطالب بقراءة الكلمات ثم الإعادة على الحروف والكلمات بقلم الرصاص ثم كتابتها.',
    skillId: 8,
    content: {
      connectExercises: [
        { separated: 'قَ رَ أَ', combined: 'قَرَأَ' },
        { separated: 'كَ تَ بَ', combined: 'كَتَبَ' },
        { separated: 'سَ بَ كَ', combined: 'سَبَكَ' },
        { separated: 'حَ كَ مَ', combined: 'حَكَمَ' },
        { separated: 'غَ طَ سَ', combined: 'غَطَسَ' },
        { separated: 'طَ لَ عَ', combined: 'طَلَعَ' }
      ]
    }
  },
  // Page 22: Writing Words
  {
    pageNumber: 22,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'كتابة كلمات مفتوحة الحروف',
    pageType: 'written_tracing',
    procedure: 'يقوم الطالب بنسخ الكلمات التالية ونطقها، مع حثه وتشجيعه على السرعة في الكتابة.',
    skillId: 8,
    content: {
      gridItems: [
        'أَكَلَ', 'شَرَبَ', 'طَلَعَ', 'جَلَسَ', 'سَبَحَ', 'حَلَمَ',
        'جَمَعَ', 'رَكَعَ', 'سَجَدَ', 'قَرَأَ', 'دَبَغَ', 'لَمَعَ',
        'وَعَدَ', 'زَرَعَ', 'طَبَعَ', 'نَفَعَ', 'صَلَحَ', 'كَتَبَ'
      ]
    }
  },
  // Page 23: Dictation Open Words
  {
    pageNumber: 23,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب إملائي: كلمات مفتوحة',
    pageType: 'dictation_board',
    procedure: 'يملي المعلم على الطالب كلمات من ثلاث أحرف جميع حروفها مفتوحة.',
    skillId: 8,
    content: {
      dictationSuggestedWords: ['قَرَأَ', 'كَتَبَ', 'جَلَسَ', 'زَرَعَ', 'أَكَلَ', 'رَفَعَ', 'فَتَحَ', 'سَجَدَ', 'رَسَمَ', 'وَقَفَ', 'حَصَدَ', 'خَرَجَ']
    }
  },
  // Page 24: Reading Sentences Open Words
  {
    pageNumber: 24,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب قرائي: جمل قصيرة مفتوحة',
    pageType: 'sentences_reading',
    procedure: 'يطلب المعلم من الطالب قراءة الكلمات التالية على هيئة جمل قصيرة مع الحث على السرعة.',
    skillId: 8,
    content: {
      sentences: [
        'قَرَأَ وَ كَتَبَ — دَرَسَ وَ نَجَحَ',
        'طَلَعَ وَ نَزَلَ — فَتَحَ وَ أَخَذَ',
        'رَكَعَ وَ سَجَدَ — سَقَطَ وَ نَهَضَ',
        'طَبَخَ وَ أَكَلَ — سَبَحَ وَ غَطَسَ',
        'وَقَفَ وَ نَظَرَ — ذَهَبَ وَ رَجَعَ'
      ]
    }
  },
  // Page 25: Cover Words with Kasra
  {
    pageNumber: 25,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'قراءة وكتابة كلمات أحد أحرفها مكسور',
    pageType: 'unit_cover',
    subtitle: 'الكلمات الثلاثية مع الكسرة'
  },
  // Page 26: Words with Kasra
  {
    pageNumber: 26,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'كلمات أحد أحرفها مكسور',
    pageType: 'words_reading',
    goal: 'أن يقرأ الطالب كلمات من ثلاث أحرف ، أحد حروفها مكسور.',
    procedure: 'يقوم الطالب بتهجي حروف الكلمة ثم قراءة الكلمة، وينبغي حثه على السرعة.',
    skillId: 9,
    content: {
      gridItems: [
        'رَغِبَ', 'شَرِبَ', 'ضَحِكَ', 'نَشِطَ', 'قَبِلَ',
        'سَهِرَ', 'عَلِمَ', 'نَسِيَ', 'سَمِعَ', 'صَحِبَ',
        'تَعِبَ', 'لَحِقَ', 'فَهِمَ', 'غَضِبَ', 'سَلِمَ',
        'نَضِجَ', 'سَخِرَ', 'لَقِيَ', 'تَعِبَ', 'وَسِعَ',
        'نَدِمَ', 'مَرِضَ', 'فَرِحَ', 'قَدِمَ', 'شَهِدَ'
      ]
    }
  },
  // Page 27: Decomposition Kasra
  {
    pageNumber: 27,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'أنشطة وتدريبات: كلمات مكسورة',
    pageType: 'connect_and_read',
    skillId: 9,
    content: {
      connectExercises: [
        { separated: 'لَ + عِ + بَ', combined: 'لَعِبَ' },
        { separated: 'لَ + حِ + قَ', combined: 'لَحِقَ' },
        { separated: 'أَ + سِ + فَ', combined: 'أَسِفَ' },
        { separated: 'لَ + قِ + يَ', combined: 'لَقِيَ' }
      ]
    }
  },
  // Page 28: Analysis Kasra
  {
    pageNumber: 28,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب: تحليل الكلمات المكسورة لمقاطع',
    pageType: 'analysis_syllables',
    skillId: 9,
    content: {
      analysisWords: [
        { word: 'سَخِرَ', syllables: ['سَ', 'خِ', 'رَ'] },
        { word: 'مَرِضَ', syllables: ['مَ', 'رِ', 'ضَ'] },
        { word: 'فَهِمَ', syllables: ['فَ', 'هِـ', 'مَ'] },
        { word: 'نَسِيَ', syllables: ['نَ', 'سِ', 'يَ'] },
        { word: 'ضَحِكَ', syllables: ['ضَ', 'حِ', 'كَ'] },
        { word: 'نَشِطَ', syllables: ['نَ', 'شِ', 'طَ'] },
        { word: 'نَدِمَ', syllables: ['نَ', 'دِ', 'مَ'] },
        { word: 'سَمِعَ', syllables: ['سَ', 'مِ', 'عَ'] },
        { word: 'تَعِبَ', syllables: ['تَ', 'عِ', 'بَ'] },
        { word: 'غَضِبَ', syllables: ['غَ', 'ضِ', 'بَ'] }
      ]
    }
  },
  // Page 29: Connect & Read Kasra
  {
    pageNumber: 29,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب: وصل الكلمات المكسورة',
    pageType: 'connect_and_read',
    skillId: 9,
    content: {
      connectExercises: [
        { separated: 'رَ غِ بَ', combined: 'رَغِبَ' },
        { separated: 'ضَ حِ كَ', combined: 'ضَحِكَ' },
        { separated: 'نَ سِ يَ', combined: 'نَسِيَ' },
        { separated: 'عَ طِ شَ', combined: 'عَطِشَ' },
        { separated: 'نَ شِ طَ', combined: 'نَشِطَ' },
        { separated: 'قَ بِ لَ', combined: 'قَبِلَ' }
      ]
    }
  },
  // Page 30: Writing Kasra Words
  {
    pageNumber: 30,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'كتابة كلمات أحد حروفها مكسور',
    pageType: 'written_tracing',
    skillId: 9,
    content: {
      gridItems: [
        'لَعِبَ', 'لَحِقَ', 'تَعِبَ', 'مَرِضَ', 'سَمِعَ', 'عَلِمَ',
        'نَشِطَ', 'لَقِيَ', 'قَبِلَ', 'صَحِبَ', 'أَسِفَ', 'نَدِمَ',
        'غَرِقَ', 'سَهِرَ', 'وَسِعَ', 'رَغِبَ', 'فَرِحَ', 'عَطِشَ'
      ]
    }
  },
  // Page 31: Dictation Kasra Words
  {
    pageNumber: 31,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب إملائي: كلمات مكسورة',
    pageType: 'dictation_board',
    skillId: 9,
    content: {
      dictationSuggestedWords: ['شَرِبَ', 'سَمِعَ', 'فَرِحَ', 'لَعِبَ', 'عَلِمَ', 'ضَحِكَ', 'حَفِظَ', 'رَكِبَ', 'غَضِبَ', 'فَهِمَ', 'نَدِمَ', 'سَلِمَ']
    }
  },
  // Page 32: Sentences with Kasra
  {
    pageNumber: 32,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب قرائي: جمل تحوي كلمات مكسورة',
    pageType: 'sentences_reading',
    skillId: 9,
    content: {
      sentences: [
        'لَعِبَ وَ لَحِقَ — تَعِبَ وَ مَرِضَ',
        'سَمِعَ وَ عَلِمَ — نَشِطَ وَ لَقِيَ',
        'أَسِفَ وَ نَدِمَ — وَسِعَ وَ فَهِمَ',
        'فَرِحَ وَ ضَحِكَ — عَطِشَ وَ شَرِبَ',
        'نَسِيَ وَ نَضِجَ — رَغِبَ وَ صَحِبَ'
      ]
    }
  },
  // Page 33: Cover Words with Damma
  {
    pageNumber: 33,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'قراءة وكتابة كلمات أحد أحرفها مضموم',
    pageType: 'unit_cover',
    subtitle: 'الكلمات الثلاثية مع الضمة'
  },
  // Page 34: Words with Damma
  {
    pageNumber: 34,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'كلمات أحد أحرفها مضموم',
    pageType: 'words_reading',
    goal: 'أن يقرأ الطالب كلمات من ثلاث أحرف ، أحد حروفها مضموم.',
    skillId: 10,
    content: {
      gridItems: [
        'فُتِحَ', 'كُتِبَ', 'يَقِفُ', 'سَهُلَ', 'جُلِسَ',
        'يَصِفُ', 'مُنِعَ', 'رُبِطَ', 'رُزِقَ', 'كَرُمَ',
        'شُرِبَ', 'يَصِفُ', 'مُسِكَ', 'صُعِدَ', 'أُكِلَ',
        'كُسِرَ', 'سُبِقَ', 'قُفِلَ', 'طَلُعَ', 'حَلُمَ',
        'كَبُرَ', 'فُهِمَ', 'زُرِعَ', 'خُرِمَ', 'شُرِحَ'
      ]
    }
  },
  // Page 35: Decomposition Damma
  {
    pageNumber: 35,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'أنشطة وتدريبات: كلمات مضمومة',
    pageType: 'connect_and_read',
    skillId: 10,
    content: {
      connectExercises: [
        { separated: 'مُ + سِ + كَ', combined: 'مُسِكَ' },
        { separated: 'فُ + تِ + حَ', combined: 'فُتِحَ' },
        { separated: 'كَ + رُ + مَ', combined: 'كَرُمَ' },
        { separated: 'يَ + قِ + فُ', combined: 'يَقِفُ' }
      ]
    }
  },
  // Page 36: Analysis Damma
  {
    pageNumber: 36,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب: تحليل الكلمات المضمومة لمقاطع',
    pageType: 'analysis_syllables',
    skillId: 10,
    content: {
      analysisWords: [
        { word: 'كُسِرَ', syllables: ['كُ', 'سِ', 'رَ'] },
        { word: 'حَلُمَ', syllables: ['حَ', 'لُ', 'مَ'] },
        { word: 'مُسِكَ', syllables: ['مُ', 'سِ', 'كَ'] },
        { word: 'كَرُمَ', syllables: ['كَ', 'رُ', 'مَ'] },
        { word: 'يَصِفُ', syllables: ['يَ', 'صِ', 'فُ'] },
        { word: 'فُتِحَ', syllables: ['فُ', 'تِ', 'حَ'] },
        { word: 'زُرِعَ', syllables: ['زُ', 'رِ', 'عَ'] },
        { word: 'صُعِدَ', syllables: ['صُ', 'عِ', 'دَ'] },
        { word: 'سَهُلَ', syllables: ['سَ', 'هُ', 'لَ'] },
        { word: 'مُنِعَ', syllables: ['مُ', 'نِ', 'عَ'] }
      ]
    }
  },
  // Page 37: Connect & Read Damma
  {
    pageNumber: 37,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب: وصل الكلمات المضمومة',
    pageType: 'connect_and_read',
    skillId: 10,
    content: {
      connectExercises: [
        { separated: 'عُ لِ مَ', combined: 'عُلِمَ' },
        { separated: 'عَ ظُ مَ', combined: 'عَظُمَ' },
        { separated: 'يَ صِ فُ', combined: 'يَصِفُ' },
        { separated: 'أُ ذِ نَ', combined: 'أُذِنَ' },
        { separated: 'يَ هَـ بُ', combined: 'يَهَبُ' },
        { separated: 'حَ سُ نَ', combined: 'حَسُنَ' }
      ]
    }
  },
  // Page 38: Writing Damma Words
  {
    pageNumber: 38,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'كتابة كلمات أحد حروفها مضموم',
    pageType: 'written_tracing',
    skillId: 10,
    content: {
      gridItems: [
        'فُتِحَ', 'تُرِكَ', 'أُذِنَ', 'مُسِكَ', 'قَرُبَ', 'رُزِقَ',
        'قُفِلَ', 'كَرُمَ', 'حَسُنَ', 'رُبِطَ', 'يَقِفُ', 'سَهُلَ',
        'عُلِمَ', 'يَصِفُ', 'كَثُرَ', 'نُظِرَ', 'يَجِدُ', 'يَصِلُ'
      ]
    }
  },
  // Page 39: Dictation Damma Words
  {
    pageNumber: 39,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب إملائي: كلمات مضمومة',
    pageType: 'dictation_board',
    skillId: 10,
    content: {
      dictationSuggestedWords: ['كُتِبَ', 'قُرِئَ', 'رُسِمَ', 'زُرِعَ', 'طُلِبَ', 'خُلِقَ', 'جُمِعَ', 'حُمِلَ', 'سُئِلَ', 'وُعِدَ', 'ذُكِرَ', 'عُلِمَ']
    }
  },
  // Page 40: Sentences with Damma
  {
    pageNumber: 40,
    unitId: 'three_letter_words',
    unitTitle: 'قراءة كلمات',
    title: 'تدريب قرائي: جمل تحوي كلمات مضمومة',
    pageType: 'sentences_reading',
    skillId: 10,
    content: {
      sentences: [
        'مُسِكَ وَ فُتِحَ — قُفِلَ وَ رُبِطَ',
        'عُلِمَ وَ نُظِرَ — يَقِفُ وَ يَصِفُ',
        'أُذِنَ وَ رُزِقَ — حَسُنَ وَ سَهُلَ',
        'يَصِلُ وَ يَعِدُ — صُرِفَ وَ كَثُرَ',
        'عَظُمَ وَ عُبِدَ — شُرِحَ وَ فُهِمَ'
      ]
    }
  },
  // Page 41: Cover Sukun
  {
    pageNumber: 41,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'قراءة كلمات أحد أحرفها ساكن',
    pageType: 'unit_cover',
    subtitle: 'المقطع الساكن وقاعدته الصارمة'
  },
  // Page 42: Sukun Rules & Syllables
  {
    pageNumber: 42,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'إرشادات المقطع الساكن وقراءته',
    pageType: 'two_letters_reading',
    goal: 'نطق وكتابة كلمات تحتوي على حرف ساكن.',
    ruleNotice: 'الحرف الذي عليه سكون نقف عنده وقفة بسيطة بدون حركة. الحرف الساكن لا يقرأ لوحده أبداً، بل لا بد من قراءته مع الحرف الذي يسبقه!',
    skillId: 11,
    content: {
      gridItems: [
        'نَشْـ', 'تَسْـ', 'غُصْـ', 'سَطْـ', 'يَحْـ',
        'جِسْـ', 'يَعْـ', 'أَصْـ', 'مُدْ', 'أَصْـ',
        'صِدْ', 'مَكْـ', 'يَغْـ', 'يَسْـ', 'تَطْ',
        'أَكْـ', 'مِرْ', 'مَقْـ', 'هِنْـ', 'أَفْـ'
      ]
    }
  },
  // Page 43: Words with Sukun
  {
    pageNumber: 43,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'كلمات تحوي حرفاً ساكناً',
    pageType: 'words_reading',
    skillId: 11,
    content: {
      gridItems: [
        'نَشْكُرُ', 'تَسْلَمُ', 'غُصْنُ', 'سَطْرُ', 'يَحْرُسُ',
        'جِسْمُ', 'يَعْرِفُ', 'أَصْبَحَ', 'مُدْهِشْ', 'أَصْفَرُ',
        'صِدْقُ', 'مَكَّةُ', 'يَغْرِفُ', 'يَسْمَعُ', 'تَطْبَخُ',
        'أَكْتُبُ', 'مِرْفَقُ', 'مَقْصَفُ', 'هِنْدُ', 'أَفْرَاحُ',
        'بَيْتُ', 'رَقْمُ', 'كُرْسِيُّ', 'قُفْلُ', 'عِطْرُ'
      ]
    }
  },
  // Page 44: Decomposition Sukun
  {
    pageNumber: 44,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'أنشطة وتدريبات المقطع الساكن',
    pageType: 'connect_and_read',
    skillId: 11,
    content: {
      connectExercises: [
        { separated: 'أَ + خَ + ذَ + تْ', combined: 'أَخَذَتْ' },
        { separated: 'تَ + طْ + بَ + خُ', combined: 'تَطْبَخُ' },
        { separated: 'تَ + صْ + عَ + دُ', combined: 'تَصْعَدُ' },
        { separated: 'ا + قْ + فِ + زْ', combined: 'اقْفِزْ' },
        { separated: 'يَ + بْ + ذُ + رُ', combined: 'يَبْذُرُ' },
        { separated: 'غَ + سَ + لَ + تْ', combined: 'غَسَلَتْ' },
        { separated: 'تَ + نْ + زِ + لُ', combined: 'تَنْزِلُ' },
        { separated: 'قِ + فْ', combined: 'قِفْ' }
      ]
    }
  },
  // Page 45: Analysis Sukun with Preceding Letter
  {
    pageNumber: 45,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'تحليل المقطع الساكن مع الحرف الذي يسبقه',
    pageType: 'analysis_syllables',
    skillId: 11,
    content: {
      analysisWords: [
        { word: 'يَعْرِفُ', syllables: ['يَعْـ', 'رِ', 'فُ'] },
        { word: 'غُصْنُ', syllables: ['غُصْـ', 'نُ'] },
        { word: 'رَقْمُ', syllables: ['رَقْـ', 'مُ'] },
        { word: 'قُفْلُ', syllables: ['قُفْـ', 'لُ'] },
        { word: 'مِرْفَقُ', syllables: ['مِرْ', 'فَـ', 'قُ'] },
        { word: 'أَفْرَاحُ', syllables: ['أَفْـ', 'رَا', 'حُ'] },
        { word: 'مَكْةُ', syllables: ['مَكْـ', 'تُ'] },
        { word: 'أَصْفَرُ', syllables: ['أَصْـ', 'فَـ', 'رُ'] },
        { word: 'نَشْكُرُ', syllables: ['نَشْـ', 'كُ', 'رُ'] },
        { word: 'يَحْرُسُ', syllables: ['يَحْـ', 'رُ', 'سُ'] }
      ]
    }
  },
  // Page 46: Connect Sukun
  {
    pageNumber: 46,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'تدريب وصل المقطع الساكن',
    pageType: 'connect_and_read',
    skillId: 11,
    content: {
      connectExercises: [
        { separated: 'يَ حْرُ ثُ', combined: 'يَحْرُثُ' },
        { separated: 'نَ شَ رَ تْ', combined: 'نَشَرَتْ' },
        { separated: 'ا قْ رَ أْ', combined: 'اقْرَأْ' },
        { separated: 'ا رْ فَ عْ', combined: 'ارْفَعْ' },
        { separated: 'خُ ذْ', combined: 'خُذْ' },
        { separated: 'عَ صَ رَ تْ', combined: 'عَصَرَتْ' }
      ]
    }
  },
  // Page 47: Writing Sukun Words
  {
    pageNumber: 47,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'كتابة كلمات تحوي مقطعاً ساكناً',
    pageType: 'written_tracing',
    skillId: 11,
    content: {
      gridItems: [
        'أَخَذَتْ', 'قَرَأَتْ', 'تَطْبَخُ', 'تَغْرِفُ', 'تَعِبَتْ', 'سَقَطَتْ',
        'تَصْعَدُ', 'تَنْزِلُ', 'تَكْنِسُ', 'قِفْ', 'يَحْصُدُ', 'يَزْرَعُ',
        'غَسَلَتْ', 'يَبْذُرُ', 'خُذْ', 'يَشْرَبُ', 'يَرْكُضُ', 'يَحْلُمُ'
      ]
    }
  },
  // Page 48: Dictation Sukun Words
  {
    pageNumber: 48,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'تدريب إملائي: كلمات تحوي مقطعاً ساكناً',
    pageType: 'dictation_board',
    skillId: 11,
    content: {
      dictationSuggestedWords: ['مَدْرَسَة', 'مَسْجِد', 'دَفْتَر', 'مَكْتَب', 'أَحْمَد', 'أَصْفَر', 'يَشْرَب', 'تَطْبَخ', 'يَكْتُب', 'غُصْن', 'عِطْر', 'قُفْل']
    }
  },
  // Page 49: Reading Sentences Sukun Words
  {
    pageNumber: 49,
    unitId: 'three_letter_words',
    unitTitle: 'المقطع الساكن',
    title: 'تدريب قرائي: جمل المقطع الساكن',
    pageType: 'sentences_reading',
    skillId: 11,
    content: {
      sentences: [
        'أَحْمَدُ يَكْتُبُ — وَ عُمَرُ يَقْرَأُ',
        'هِنْدُ تَطْبَخُ — وَ لِينُ تَكْنِسُ',
        'أَشْعَبُ يَخْطِبُ — وَ أَنْوَرُ يَسْمَعُ',
        'رِيمُ تَلْعَبُ — وَ بَدْرُ يَدْرُسُ',
        'أَيْمَنُ يَشْرَحُ — وَ مَرْيَمُ تَفْهَمُ'
      ]
    }
  }
];
