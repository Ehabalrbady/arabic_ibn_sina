import { BookPage } from '../types/book';

export const PAGES_PART_2: BookPage[] = [
  // Page 50: Madd Cover
  {
    pageNumber: 50,
    unitId: 'madd',
    unitTitle: 'المد وحروفه',
    title: 'المد بأنواعه الثلاثة',
    pageType: 'unit_cover',
    subtitle: 'المد بالألف والواو والياء'
  },
  // Page 51: Madd Definition
  {
    pageNumber: 51,
    unitId: 'madd',
    unitTitle: 'المد وحروفه',
    title: 'تعريف المد وقواعده',
    pageType: 'rule_explanation',
    goal: 'قراءة وكتابة كلمات تحتوي على حرف مد ( ا - و - ي ) قراءة وكتابة صحيحة.',
    ruleNotice: 'المد هو إطالة الصوت بأحد حروف المد الثلاثة: ( ا - و - ي ). الحرف الذي يسبق المد يسمى (الحرف الممدود).',
    skillId: 12,
    content: {
      ruleBoxes: [
        { title: '1. المد بالألف ( ا )', body: 'يكون حرف مد إذا كان الحرف الذي قبله مفتوحاً.', example: 'صَالِح' },
        { title: '2. المد بالواو ( و )', body: 'يكون حرف مد إذا كان الحرف الذي قبله مضموماً.', example: 'تَقُومُ' },
        { title: '3. المد بالياء ( ي )', body: 'يكون حرف مد إذا كان الحرف الذي قبله مكسوراً.', example: 'تَخِيطُ' }
      ]
    }
  },
  // Page 52: Alif Madd Illustration
  {
    pageNumber: 52,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'المد بالألف: قَامَ',
    pageType: 'rule_explanation',
    skillId: 12,
    content: {
      ruleBoxes: [
        { title: 'تحليل صوتي لكلمة قَامَ', body: 'الحرف الممدود المفتوح ( قَـ ) متبوعاً بألف المد ( ـا ) = ( قَا ) صوت طويل.', example: 'قَامَ' }
      ]
    }
  },
  // Page 53: Alif Madd Sound Comparison
  {
    pageNumber: 53,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'مقارنة الحرف مفرداً ثم مع مد الألف',
    pageType: 'madd_comparison',
    skillId: 12,
    content: {
      gridItems: [
        'صَـ صَا', 'نَـ نَا', 'مَـ مَا',
        'عَـ عَا', 'سَـ سَا', 'كَـ كَا',
        'تَـ تَا', 'رَ رَا', 'هَـ هَا',
        'قَـ قَا', 'جَـ جَا', 'لَـ لا'
      ]
    }
  },
  // Page 54: Dictation Alif Madd
  {
    pageNumber: 54,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'تدريب إملائي: مقاطع المد بالألف',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['بَا', 'تَا', 'ثَا', 'جَا', 'حَا', 'خَا', 'دَا', 'ذَا', 'رَا', 'زَا', 'سَا', 'شَا', 'صَا', 'ضَا', 'طَا', 'ظَا', 'عَا', 'غَا', 'فَا', 'قَا', 'كَا', 'لا', 'مَا', 'نَا', 'هَا', 'وَا', 'يَا']
    }
  },
  // Page 55: Words Alif Madd
  {
    pageNumber: 55,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'كلمات تحوي مد الألف',
    pageType: 'words_reading',
    skillId: 12,
    content: {
      gridItems: [
        'صَادَ', 'نَامَ', 'عَاشَ', 'مَاء',
        'عَادَ', 'كَانَ', 'فَاتَ', 'سُلْطَانُ',
        'تَابَ', 'قَامَ', 'جَاءَ', 'شَارِعُ',
        'طَافَ', 'شَاعَ', 'نَالَ', 'لاحَ'
      ]
    }
  },
  // Page 56: Analysis Alif Madd
  {
    pageNumber: 56,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'تحليل كلمات مد الألف إلى مقاطع',
    pageType: 'analysis_syllables',
    skillId: 12,
    content: {
      analysisWords: [
        { word: 'قَامَ', syllables: ['قَا', 'مَ'] },
        { word: 'شَارِعُ', syllables: ['شَا', 'رِ', 'عُ'] },
        { word: 'طَافَ', syllables: ['طَا', 'فَ'] },
        { word: 'كَانَ', syllables: ['كَا', 'نَ'] },
        { word: 'سَلْمَانُ', syllables: ['سَلْـ', 'مَا', 'نُ'] },
        { word: 'لاعِبٌ', syllables: ['لا', 'عِ', 'بٌ'] },
        { word: 'مَاتَ', syllables: ['مَا', 'تَ'] },
        { word: 'صَادَ', syllables: ['صَا', 'دَ'] }
      ]
    }
  },
  // Page 57: Writing Alif Madd Words
  {
    pageNumber: 57,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'تدريب كتابي: كلمات مد الألف',
    pageType: 'written_tracing',
    skillId: 12,
    content: {
      gridItems: ['طَارَ', 'صَادَ', 'خَاطَتْ', 'نَامَتْ', 'تُطَالِعُ', 'صَامَتْ', 'سَلْمَانُ', 'تَابَعَ']
    }
  },
  // Page 58: Dictation Alif Madd Words
  {
    pageNumber: 58,
    unitId: 'madd',
    unitTitle: 'المد بالألف',
    title: 'تدريب إملائي: كلمات مد الألف',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['قَامَ', 'نَامَ', 'عَادَ', 'شَارِع', 'كِتَاب', 'سَمَاء', 'طَائِر', 'سَالِم', 'صَادِق', 'عَامِل']
    }
  },
  // Page 59: Waw Madd Illustration
  {
    pageNumber: 59,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'المد بالواو: رَسُولُ',
    pageType: 'rule_explanation',
    skillId: 12,
    content: {
      ruleBoxes: [
        { title: 'تحليل صوتي لكلمة رَسُولُ', body: 'الحرف الممدود المضموم ( سُـ ) متبوعاً بواو المد ( ـو ) = ( سُو ) صوت طويل.', example: 'رَسُولُ' }
      ]
    }
  },
  // Page 60: Waw Madd Comparison
  {
    pageNumber: 60,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'مقارنة الحرف مفرداً ثم مع مد الواو',
    pageType: 'madd_comparison',
    skillId: 12,
    content: {
      gridItems: [
        'سُـ سُو', 'حُـ حُو', 'جُـ جُو',
        'رُ رُو', 'فُـ فُو', 'ذُ ذُو',
        'قُـ قُو', 'صُـ صُو', 'غُـ غُو',
        'ضُـ ضُو', 'كُـ كُو', 'طُ طُو'
      ]
    }
  },
  // Page 61: Dictation Waw Madd
  {
    pageNumber: 61,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'تدريب إملائي: مقاطع مد الواو',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['بُو', 'تُو', 'ثُو', 'جُو', 'حُو', 'خُو', 'دُو', 'ذُو', 'رُو', 'زُو', 'سُو', 'شُو', 'صُو', 'ضُو', 'طُو', 'ظُو', 'عُو', 'غُو', 'فُو', 'قُو', 'كُو', 'لُو', 'مُو', 'نُو', 'هُو', 'يُو']
    }
  },
  // Page 62: Words Waw Madd
  {
    pageNumber: 62,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'كلمات تحوي مد الواو',
    pageType: 'words_reading',
    skillId: 12,
    content: {
      gridItems: [
        'يَدْعُو', 'أَرْجُو', 'صَبُورُ', 'ضُيُوفُ',
        'شَكُور', 'يَعُود', 'يَزُور', 'رَسُول',
        'يَجُود', 'مَسْرُور', 'وُعُود', 'سَعُود',
        'رُعُود', 'حُرُوب', 'طُيُور', 'زُهُور'
      ]
    }
  },
  // Page 63: Analysis Waw Madd
  {
    pageNumber: 63,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'تحليل كلمات مد الواو إلى مقاطع',
    pageType: 'analysis_syllables',
    skillId: 12,
    content: {
      analysisWords: [
        { word: 'أَدْعُو', syllables: ['أَدْ', 'عُو'] },
        { word: 'يَصْحُو', syllables: ['يَصْـ', 'حُو'] },
        { word: 'ضُيُوف', syllables: ['ضُـ', 'يُو', 'فٌ'] },
        { word: 'سَعُودُ', syllables: ['سَـ', 'عُو', 'دُ'] },
        { word: 'عُهُود', syllables: ['عُـ', 'هُو', 'دٌ'] },
        { word: 'زُهُورٌ', syllables: ['زُ', 'هُو', 'رٌ'] },
        { word: 'يَمْحُو', syllables: ['يَمْـ', 'حُو'] },
        { word: 'بُرُوقٌ', syllables: ['بُ', 'رُو', 'قٌ'] }
      ]
    }
  },
  // Page 64: Writing Waw Madd Words
  {
    pageNumber: 64,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'تدريب كتابي: كلمات مد الواو',
    pageType: 'written_tracing',
    skillId: 12,
    content: {
      gridItems: ['تَدُورُ', 'يَطُوفُ', 'يَدْعُو', 'يَلْعَبُونَ', 'تَزُورُ', 'نَعُودُ', 'يَرْكَبُونَ', 'يَحْبُو']
    }
  },
  // Page 65: Dictation Waw Madd Words
  {
    pageNumber: 65,
    unitId: 'madd',
    unitTitle: 'المد بالواو',
    title: 'تدريب إملائي: كلمات مد الواو',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['رَسُول', 'يَدْعُو', 'صَبُور', 'شَكُور', 'يَزُور', 'سَعُود', 'زُهُور', 'طُيُور', 'يَقُول', 'يَصُوم']
    }
  },
  // Page 66: Ya Madd Illustration
  {
    pageNumber: 66,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'المد بالياء: تَخِيطُ',
    pageType: 'rule_explanation',
    skillId: 12,
    content: {
      ruleBoxes: [
        { title: 'تحليل صوتي لكلمة تَخِيطُ', body: 'الحرف الممدود المكسور ( خِـ ) متبوعاً بياء المد ( ـيـ ) = ( خِيـ ) صوت طويل.', example: 'تَخِيطُ' }
      ]
    }
  },
  // Page 67: Ya Madd Comparison
  {
    pageNumber: 67,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'مقارنة الحرف مفرداً ثم مع مد الياء',
    pageType: 'madd_comparison',
    skillId: 12,
    content: {
      gridItems: [
        'تِـ تِيـ', 'خِـ خِيـ', 'نِـ نِيـ',
        'سِـ سِيـ', 'ثِـ ثِيـ', 'مِـ مِيـ',
        'جِـ جِيـ', 'دِ دِيـ', 'زِ زِيـ',
        'كِـ كِيـ', 'شِـ شِيـ', 'بِـ بِيـ'
      ]
    }
  },
  // Page 68: Dictation Ya Madd
  {
    pageNumber: 68,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'تدريب إملائي: مقاطع مد الياء',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['بِي', 'تِي', 'ثِي', 'جِي', 'حِي', 'خِي', 'دِي', 'ذِي', 'رِي', 'زِي', 'سِي', 'شِي', 'صِي', 'ضِي', 'طِي', 'ظِي', 'عِي', 'غِي', 'فِي', 'قِي', 'كِي', 'لِي', 'مِي', 'نِي', 'هِي', 'وِي']
    }
  },
  // Page 69: Words Ya Madd
  {
    pageNumber: 69,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'كلمات تحوي مد الياء',
    pageType: 'words_reading',
    skillId: 12,
    content: {
      gridItems: [
        'تَخِيطُ', 'أُرِيدُ', 'أَبِي', 'مَرِيضٌ',
        'تَبِيضُ', 'تُنِيرُ', 'بَعِيدٌ', 'حَدِيدُ',
        'يَطِيرُ', 'وَطَنِي', 'سَعِيدٌ', 'شَهِيقٌ',
        'يَصِيدُ', 'تِلْمِيذُ', 'حَبِيبٌ', 'طَبِيبُ'
      ]
    }
  },
  // Page 70: Analysis Ya Madd
  {
    pageNumber: 70,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'تحليل كلمات مد الياء إلى مقاطع',
    pageType: 'analysis_syllables',
    skillId: 12,
    content: {
      analysisWords: [
        { word: 'أُرِيدُ', syllables: ['أُ', 'رِيـ', 'دُ'] },
        { word: 'تَسِيرُ', syllables: ['تَـ', 'سِيـ', 'رُ'] },
        { word: 'وَطَنِي', syllables: ['وَ', 'طَـ', 'نِي'] },
        { word: 'شَدِيدٌ', syllables: ['شَـ', 'دِيـ', 'دٌ'] },
        { word: 'بَعِيدٌ', syllables: ['بَـ', 'عِيـ', 'دٌ'] },
        { word: 'أَصِيدُ', syllables: ['أَ', 'صِيـ', 'دُ'] },
        { word: 'يَطِيبُ', syllables: ['يَـ', 'طِيـ', 'بُ'] },
        { word: 'حَلِيبٌ', syllables: ['حَـ', 'لِيـ', 'بٌ'] }
      ]
    }
  },
  // Page 71: Writing Ya Madd Words
  {
    pageNumber: 71,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'تدريب كتابي: كلمات مد الياء',
    pageType: 'written_tracing',
    skillId: 12,
    content: {
      gridItems: ['تَخِيطُ', 'تَكْوِي', 'تَمِيلُ', 'يَطِيرُ', 'رَأْسِي', 'عَيْنِي', 'تُنِيرُ', 'يَسِيرُ']
    }
  },
  // Page 72: Dictation Ya Madd Words
  {
    pageNumber: 72,
    unitId: 'madd',
    unitTitle: 'المد بالياء',
    title: 'تدريب إملائي: كلمات مد الياء',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['سَعِيد', 'طَبِيب', 'حَدِيد', 'وَطَنِي', 'تِلْمِيذ', 'أَمِير', 'كَبِير', 'صَغِير', 'نَظِيف', 'حَلِيب']
    }
  },
  // Page 73: General Madd Exercises
  {
    pageNumber: 73,
    unitId: 'madd',
    unitTitle: 'المد بأنواعه الثلاثة',
    title: 'تدريبات على المد بأنواعه الثلاثة',
    pageType: 'words_reading',
    skillId: 12,
    content: {
      gridItems: [
        'سَالِم', 'بُحُورٌ', 'شَاهَدَ', 'بَصِيرٌ',
        'مَشْرُوعٌ', 'طَارَ', 'عَلِيم', 'فَاتِنٌ',
        'سَمِيعٌ', 'طَالِب', 'لُحُومٌ', 'يَمِيلُ',
        'لامِع', 'جُلُود', 'سَابِحٌ', 'رَحِيم'
      ]
    }
  },
  // Page 74: Syllable Analysis All Madd
  {
    pageNumber: 74,
    unitId: 'madd',
    unitTitle: 'المد بأنواعه الثلاثة',
    title: 'تحليل الكلمات التي تحوي مدوداً',
    pageType: 'analysis_syllables',
    skillId: 12,
    content: {
      analysisWords: [
        { word: 'سُحُورٌ', syllables: ['سُـ', 'حُو', 'رٌ'] },
        { word: 'فَاتِن', syllables: ['فَا', 'تِـ', 'نٌ'] },
        { word: 'بَعِيدٌ', syllables: ['بَـ', 'عِيـ', 'دٌ'] },
        { word: 'جُلُود', syllables: ['جُـ', 'لُو', 'دٌ'] },
        { word: 'جَنِينٌ', syllables: ['جَـ', 'نِيـ', 'نٌ'] },
        { word: 'بِلادِي', syllables: ['بِـ', 'لا', 'دِي'] },
        { word: 'حَمَامَةٌ', syllables: ['حَـ', 'مَا', 'مَـ', 'ةٌ'] },
        { word: 'تَعْلِيمٌ', syllables: ['تَعْـ', 'لِيـ', 'مٌ'] },
        { word: 'حُدُودٌ', syllables: ['حُـ', 'دُو', 'دٌ'] },
        { word: 'بُنْيَانٌ', syllables: ['بُنْـ', 'يَا', 'نٌ'] }
      ]
    }
  },
  // Page 75: Identifying Madd vs Leen
  {
    pageNumber: 75,
    unitId: 'madd',
    unitTitle: 'المد بأنواعه الثلاثة',
    title: 'التمييز بين حروف المد وحروف اللين',
    pageType: 'madd_identification',
    procedure: 'يقوم الطالب بوضع دائرة حول الكلمة التي تحتوي على المد بأنواعه الثلاثة.',
    skillId: 12,
    content: {
      sortingItems: [
        { word: 'مَعْلُومَات', category: 'مد بالواو والألف' },
        { word: 'سَعِيدَةٌ', category: 'مد بالياء' },
        { word: 'أَحْلامٌ', category: 'مد بالألف' },
        { word: 'أَعْطَيْتُ', category: 'ليس مداً (ياء ساكنة)' },
        { word: 'سَالِم', category: 'مد بالألف' },
        { word: 'بَيْتٌ', category: 'ليس مداً (ياء لين)' },
        { word: 'لَوْز', category: 'ليس مداً (واو لين)' },
        { word: 'عَلِيمٌ', category: 'مد بالياء' },
        { word: 'خُرْطُوم', category: 'مد بالواو' },
        { word: 'دَيْن', category: 'ليس مداً' },
        { word: 'طِين', category: 'مد بالياء' },
        { word: 'رَامِي', category: 'مد بالألف والياء' },
        { word: 'عَيْن', category: 'ليس مداً' },
        { word: 'بُرْتُقَال', category: 'مد بالألف' },
        { word: 'بُحُورٌ', category: 'مد بالواو' },
        { word: 'أَوْعَدَ', category: 'ليس مداً' },
        { word: 'جَوْزٌ', category: 'ليس مداً' },
        { word: 'مَمْنُوعٌ', category: 'مد بالواو' },
        { word: 'فَاهِم', category: 'مد بالألف' },
        { word: 'حُوتٌ', category: 'مد بالواو' }
      ]
    }
  },
  // Page 76: Madd Sentences
  {
    pageNumber: 76,
    unitId: 'madd',
    unitTitle: 'المد بأنواعه الثلاثة',
    title: 'تدريب قرائي: جمل تحوي مدوداً',
    pageType: 'sentences_reading',
    skillId: 12,
    content: {
      sentences: [
        'إِيمَانُنَا عَظِيمٌ وَ خَيْرُ بَلَدِنَا وَفِيرٌ.',
        'نَزُورُ جَارَنَا وَ نُكْرِمُ ضُيُوفَنَا.',
        'يَا سَالِم : أَطِعْ أَبَاكَ وَاحْتَرِمْ أَخَاكَ.',
        'نَخِيلُنَا شَجَرُهُ طَوِيلٌ وَرُطَبُهُ لَذِيذٌ.',
        'نَعُودُ مَرِيضَنَا وَ نَدْعُو صَدِيقَنَا.'
      ]
    }
  },
  // Page 77: Dictation All Madd
  {
    pageNumber: 77,
    unitId: 'madd',
    unitTitle: 'المد بأنواعه الثلاثة',
    title: 'تدريب إملائي شامل على المدود',
    pageType: 'dictation_board',
    skillId: 12,
    content: {
      dictationSuggestedWords: ['سَالِم', 'بُحُور', 'سَعِيد', 'كِتَاب', 'يَقُول', 'يَسِير', 'طَيَّار', 'نُور', 'عَصِير', 'بُرْتُقَال', 'طَبِيب', 'زُهُور']
    }
  },
  // Page 78: Tanween Cover
  {
    pageNumber: 78,
    unitId: 'tanween',
    unitTitle: 'التنوين',
    title: 'التنوين',
    pageType: 'unit_cover',
    subtitle: 'تنوين الضم والفتح والكسر'
  },
  // Page 79: Tanween Visual Diagram
  {
    pageNumber: 79,
    unitId: 'tanween',
    unitTitle: 'التنوين',
    title: 'مخطط التنوين ونطقه الصوتي',
    pageType: 'tanween_types',
    skillId: 13,
    content: {
      ruleBoxes: [
        { title: 'بَيْتٌ (تنوين ضم)', body: 'تُنطق: بَيْتُنْ — تُكتب: بَيْتٌ', example: 'ضمتان فوق الحرف الأخير' },
        { title: 'بَيْتاً (تنوين فتح)', body: 'تُنطق: بَيْتَنْ — تُكتب: بَيْتاً', example: 'فتحتان مع ألف التنوين' },
        { title: 'بَيْتٍ (تنوين كسر)', body: 'تُنطق: بَيْتِنْ — تُكتب: بَيْتٍ', example: 'كسرتان تحت الحرف الأخير' }
      ]
    }
  },
  // Page 80: Tanween Rules & Exceptions
  {
    pageNumber: 80,
    unitId: 'tanween',
    unitTitle: 'التنوين',
    title: 'قواعد التنوين والحالات الاستثنائية لألف الفتح',
    pageType: 'rule_explanation',
    ruleNotice: 'التنوين هو نون ساكنة تلحق آخر الاسم نطقاً لا كتابةً. في تنوين الفتح يضاف ألف زائدة ( ا ) دائماً إلا في 4 حالات استثنائية:',
    skillId: 13,
    content: {
      ruleBoxes: [
        { title: '1. التاء المربوطة ( ة / ـة )', body: 'توضع الفتحتان مباشرة فوق التاء دون إضافة ألف.', example: 'مَدْرَسَةً ، خَيْمَةً ، لُعْبَةً ، سَيَّارَةً' },
        { title: '2. الألف المقصورة ( ى / ــى / ا )', body: 'يوضع التنوين على الحرف قبل الألف المقصورة دون زيادة ألف.', example: 'فَتَىً ، ضُحَىً ، عَصَاً' },
        { title: '3. ألف فوقها همزة ( أ )', body: 'يوضع التنوين فوق الهمزة مباشرة.', example: 'مَلْجَأً ، نَبَأً ، سَبَأً' },
        { title: '4. ألف بعدها همزة على السطر ( اء )', body: 'توضع الفتحتان فوق الهمزة المتطرفة المسبوقة بألف مد.', example: 'مَاءً ، سَمَاءً ، بِنَاءً' }
      ]
    }
  },
  // Page 81: Damma Tanween Letters
  {
    pageNumber: 81,
    unitId: 'tanween',
    unitTitle: 'تنوين الضم',
    title: 'قراءة أحرف منونة بتنوين الضم',
    pageType: 'two_letters_reading',
    skillId: 13,
    content: {
      gridItems: [
        'خٌ', 'صٌ', 'ضٌ', 'طٌ', 'عٌ',
        'دٌ', 'ذٌ', 'فٌ', 'لٌ', 'بٌ',
        'شٌ', 'حٌ', 'هـٌ', 'تٌ', 'غٌ',
        'جٌ', 'ظٌ', 'خٌ', 'رٌ', 'ثٌ',
        'فٌ', 'سٌ', 'نٌ', 'طٌ', 'مٌ'
      ]
    }
  },
  // Page 82: Damma Tanween Words
  {
    pageNumber: 82,
    unitId: 'tanween',
    unitTitle: 'تنوين الضم',
    title: 'كلمات منونة بتنوين الضم',
    pageType: 'words_reading',
    skillId: 13,
    content: {
      gridItems: [
        'تَمْرٌ', 'ابْنٌ', 'لَحْمٌ', 'زَيْتٌ', 'مُفِيدَةٌ',
        'بَحْرٌ', 'هِنْدٌ', 'طَيْرٌ', 'زَرَافَةٌ', 'دَجَاجَةٌ',
        'مُعَلِّمٌ', 'طَالِبٌ', 'دَارِسٌ', 'بَيْتٌ', 'ثَعْلَبٌ',
        'مَاكِرٌ', 'بَارِدٌ', 'حُلْوٌ', 'بَابٌ', 'قُطْنٌ'
      ]
    }
  },
  // Page 83: Writing Damma Tanween
  {
    pageNumber: 83,
    unitId: 'tanween',
    unitTitle: 'تنوين الضم',
    title: 'تدريب كتابي: تنوين الضم',
    pageType: 'written_tracing',
    skillId: 13,
    content: {
      gridItems: ['مُعَلِّمٌ', 'طَالِبٌ', 'مُفِيدَةٌ', 'بَارِدٌ', 'ثَعْلَبٌ', 'تَمْرٌ']
    }
  },
  // Page 84: Fatha Tanween Letters
  {
    pageNumber: 84,
    unitId: 'tanween',
    unitTitle: 'تنوين الفتح',
    title: 'قراءة أحرف منونة بتنوين الفتح',
    pageType: 'two_letters_reading',
    skillId: 13,
    content: {
      gridItems: [
        'فاً', 'ساً', 'ناً', 'طاً', 'ماً',
        'ـىً', 'ظاً', 'خاً', 'رًا', 'ثاً',
        'شاً', 'ءً', 'هـاً', 'تاً', 'غاً',
        'داً', 'ذاً', 'فاً', 'ةً', 'ــةً',
        'أً', 'صاً', 'ضاً', 'طاً', 'عاً'
      ]
    }
  },
  // Page 85: Fatha Tanween Words
  {
    pageNumber: 85,
    unitId: 'tanween',
    unitTitle: 'تنوين الفتح',
    title: 'كلمات منونة بتنوين الفتح',
    pageType: 'words_reading',
    skillId: 13,
    content: {
      gridItems: [
        'سَبُّورَةً', 'لَحْماً', 'دِيكاً', 'حُلْماً', 'بَيْتاً',
        'سَفَراً', 'لَعِباً', 'سَمَاءً', 'عَدَداً', 'قَلَماً',
        'فَتَىً', 'فَصْلاً', 'أَبـاً', 'قِصَّةً', 'دَجَاجَةً',
        'بَلَحاً', 'نَبَأً', 'رَقْماً', 'حُبّاً', 'نَوْماً'
      ]
    }
  },
  // Page 86: Writing Fatha Tanween
  {
    pageNumber: 86,
    unitId: 'tanween',
    unitTitle: 'تنوين الفتح',
    title: 'تدريب كتابي: تنوين الفتح',
    pageType: 'written_tracing',
    skillId: 13,
    content: {
      gridItems: ['عَدَداً', 'قِصَّةً', 'دِيكاً', 'قَلَماً', 'سَبُّورَةً', 'ضُحَىً']
    }
  },
  // Page 87: Kasra Tanween Letters
  {
    pageNumber: 87,
    unitId: 'tanween',
    unitTitle: 'تنوين الكسر',
    title: 'قراءة أحرف منونة بتنوين الكسر',
    pageType: 'two_letters_reading',
    skillId: 13,
    content: {
      gridItems: [
        'خٍ', 'صٍ', 'ضٍ', 'طٍ', 'عٍ',
        'دٍ', 'ذٍ', 'فٍ', 'لٍ', 'بٍ',
        'شٍ', 'حٍ', 'هـٍ', 'تٍ', 'غٍ',
        'جٍ', 'ظٍ', 'خٍ', 'رٍ', 'ثٍ',
        'فٍ', 'سٍ', 'نٍ', 'طٍ', 'مٍ'
      ]
    }
  },
  // Page 88: Kasra Tanween Words
  {
    pageNumber: 88,
    unitId: 'tanween',
    unitTitle: 'تنوين الكسر',
    title: 'كلمات منونة بتنوين الكسر',
    pageType: 'words_reading',
    skillId: 13,
    content: {
      gridItems: [
        'سَبُّورَةٍ', 'لَحْمٍ', 'دِيكٍ', 'حُلْمٍ', 'بَيْتٍ',
        'سَفَرٍ', 'لَعِبٍ', 'فَهْمٍ', 'عَدَدٍ', 'قَلَمٍ',
        'مُعَلِّمٍ', 'طَالِبٍ', 'دَارِسٍ', 'سَاكِنٍ', 'ثَعْلَبٍ',
        'مَاكِرٍ', 'بَارِدٍ', 'حُلْوٍ', 'بَابٍ', 'قُطْنٍ'
      ]
    }
  },
  // Page 89: Writing Kasra Tanween
  {
    pageNumber: 89,
    unitId: 'tanween',
    unitTitle: 'تنوين الكسر',
    title: 'تدريب كتابي: تنوين الكسر',
    pageType: 'written_tracing',
    skillId: 13,
    content: {
      gridItems: ['قَلَمٍ', 'دِيكٍ', 'بَارِدٍ', 'بَابٍ', 'سَبُّورَةٍ', 'حُلْوٍ']
    }
  },
  // Page 90: All Tanween Comparison
  {
    pageNumber: 90,
    unitId: 'tanween',
    unitTitle: 'التنوين بأنواعه الثلاثة',
    title: 'مقارنة بين أنواع التنوين الثلاثة',
    pageType: 'tanween_types',
    skillId: 13,
    content: {
      gridItems: [
        'وَلَدٌ — وَلَداً — وَلَدٍ',
        'تِينٌ — تِيناً — تِينٍ',
        'عُطْلَةٌ — عُطْلَةً — عُطْلَةٍ',
        'بَيْضٌ — بَيْضاً — بَيْضٍ',
        'سَمَاءٌ — سَمَاءً — سَمَاءٍ',
        'تَمْرَةٌ — تَمْرَةً — تَمْرَةٍ',
        'طَيْرٌ — طَيْراً — طَيْرٍ'
      ]
    }
  },
  // Page 91: Transforming Tanween Exercise
  {
    pageNumber: 91,
    unitId: 'tanween',
    unitTitle: 'التنوين بأنواعه الثلاثة',
    title: 'تدريب تحويل الكلمات بالتنوينات الثلاثة',
    pageType: 'written_tracing',
    skillId: 13,
    content: {
      gridItems: [
        'طَالِبٌ — طَالِباً — طَالِبٍ',
        'فَحْمٌ — فَحْماً — فَحْمٍ',
        'عُطْلَةٌ — عُطْلَةً — عُطْلَةٍ',
        'بَيْضٌ — بَيْضاً — بَيْضٍ',
        'سَمَاءٌ — سَمَاءً — سَمَاءٍ',
        'تَمْرَةٌ — تَمْرَةً — تَمْرَةٍ',
        'طَيْرٌ — طَيْراً — طَيْرٍ'
      ]
    }
  },
  // Page 92: Shaddah Cover
  {
    pageNumber: 92,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'الشدة ( ّ )',
    pageType: 'unit_cover',
    subtitle: 'تفكيك الحرف المشدد وأصواته'
  },
  // Page 93: Shaddah Diagram
  {
    pageNumber: 93,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'تفكيك الحرف المشدد: عَلَّمَ',
    pageType: 'rule_explanation',
    skillId: 14,
    content: {
      ruleBoxes: [
        { title: 'تفكيك الإدغام في كلمة عَلَّمَ', body: 'الحرف المشدد ( لَّ ) أصله حرفان: لام ساكنة ( لْ ) + لام مفتوحة ( لَـ ) أُدغما فأصبحا حرفاً واحداً مشدداً ( لَّ ).', example: 'عَلَّمَ = عَلْ + لَـ + مَ' }
      ]
    }
  },
  // Page 94: Shaddah Types & Table
  {
    pageNumber: 94,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'أنواع الشدة مع الحركات والتنوين',
    pageType: 'rule_explanation',
    ruleNotice: 'الشدة علامة ( ّ ) توضع على الحرف المشدد مع حركة الفتح ( َّ )، أو الضم ( ُّ )، أو الكسر ( ِّ )، أو التنوين ( ًّ ، ٌّ ، ٍّ ).',
    skillId: 14,
    content: {
      tableData: [
        { type: 'شدة بالفتح', example: 'مُحَمَّدُ ، ثُمَّ ، جَوَّال ، كَلَّمَ ، لَعَّبَ ، فَهَّمَ' },
        { type: 'شدة بالضم', example: 'يَرِنُّ ، يُحِبُّ ، أَقُصُّ ، يَعُدُّ ، يَشُدُّ ، يَفُكُّ' },
        { type: 'شدة بالكسر', example: 'يُنَظِّفُ ، قُصِّي ، عُدِّي ، يُحَلِّقُ ، مُتَأَلِّمُ ، مُدِّي' },
        { type: 'الشدة مع التنوين', example: 'رَفّاً / رَفٌّ / رَفٍّ — شَرّاً / شَرٌّ / شَرٍّ — جَدّاً / جَدٌّ / جَدٍّ' }
      ]
    }
  },
  // Page 95: Reading Shaddah Words
  {
    pageNumber: 95,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'قراءة كلمات تحوي شدة',
    pageType: 'words_reading',
    skillId: 14,
    content: {
      gridItems: [
        'رُمَّان', 'تُفَّاح', 'مُدَرِّب', 'يَحُكُّ', 'بَطٌّ',
        'عَمٌّ', 'يَرِنُّ', 'كُرَّاسَة', 'أَقُصُّ', 'صَفٌّ',
        'دَرَّاجَة', 'يُحِبُّ', 'مَكَّة', 'شَرٌّ', 'مُسَلِّيَة',
        'حَجٌّ', 'مُشَرِّف', 'جَدٌّ', 'مُثَلَّث', 'يَسُبُّ'
      ]
    }
  },
  // Page 96: Writing Shaddah Words
  {
    pageNumber: 96,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'تدريب كتابي: كلمات مشددة',
    pageType: 'written_tracing',
    skillId: 14,
    content: {
      gridItems: [
        'سَبُّورَة', 'عَلَّمَ', 'سَلَّمَ', 'يَقُصُّ', 'يُبَلِّغُ',
        'خَطٌّ', 'بَرّاً', 'جَوّاً', 'حَجٌّ', 'مُتَعَلِّم',
        'فَلاَّح', 'أُصَلِّي', 'بَطّاً', 'مُتَنَوِّع', 'تُفَّاح'
      ]
    }
  },
  // Page 97: Extracting Shaddah Table
  {
    pageNumber: 97,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'استخراج الحرف المشدد وحركته',
    pageType: 'shaddah_extraction',
    skillId: 14,
    content: {
      sortingItems: [
        { word: 'مَكَّة', category: 'ك (فتحة)' },
        { word: 'كُرَّاسَة', category: 'ر (فتحة)' },
        { word: 'سَلَّمَ', category: 'ل (فتحة)' },
        { word: 'دَرَّاجَة', category: 'ر (فتحة)' },
        { word: 'يَظَلُّ', category: 'ل (ضمة)' },
        { word: 'يَحُلُّ', category: 'ل (ضمة)' },
        { word: 'يَقُصُّ', category: 'ص (ضمة)' },
        { word: 'يَبْتَلُّ', category: 'ل (ضمة)' },
        { word: 'صُنِّعَ', category: 'ن (كسرة)' },
        { word: 'قُطِّعَ', category: 'ط (كسرة)' },
        { word: 'نُظِّمَ', category: 'ظ (كسرة)' },
        { word: 'دُرِّسَ', category: 'ر (كسرة)' }
      ]
    }
  },
  // Page 98: Sorting Shaddah by Vowel
  {
    pageNumber: 98,
    unitId: 'shaddah',
    unitTitle: 'الشدة',
    title: 'تصنيف الكلمات المشددة في الجدول',
    pageType: 'shaddah_sorting',
    skillId: 14,
    content: {
      sortingItems: [
        { word: 'جَدٌّ', category: 'شدة مع تنوين ضم' },
        { word: 'بَطٌّ', category: 'شدة مع تنوين ضم' },
        { word: 'بَرٍّ', category: 'شدة مع تنوين كسر' },
        { word: 'هَشّاً', category: 'شدة مع تنوين فتح' },
        { word: 'شَرٍّ', category: 'شدة مع تنوين كسر' },
        { word: 'حَظّاً', category: 'شدة مع تنوين فتح' },
        { word: 'أُمٌّ', category: 'شدة مع تنوين ضم' },
        { word: 'رَبٌّ', category: 'شدة مع تنوين ضم' },
        { word: 'بَثٍّ', category: 'شدة مع تنوين كسر' },
        { word: 'سَدٍّ', category: 'شدة مع تنوين كسر' },
        { word: 'حَبٍّ', category: 'شدة مع تنوين كسر' },
        { word: 'صُمٌّ', category: 'شدة مع تنوين ضم' },
        { word: 'ظَنٍّ', category: 'شدة مع تنوين كسر' },
        { word: 'عَمّاً', category: 'شدة مع تنوين فتح' },
        { word: 'رَبّاً', category: 'شدة مع تنوين فتح' }
      ]
    }
  },
  // Page 99: Lam Shamsiyyah/Qamariyyah Cover
  {
    pageNumber: 99,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'اللام الشمسية واللام القمرية',
    pageType: 'unit_cover',
    subtitle: 'الفرق الصوتي والكتابي والتمييز'
  },
  // Page 100: Lam Comparison Infographic
  {
    pageNumber: 100,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'مقارنة اللام الشمسية واللام القمرية',
    pageType: 'lam_comparison',
    skillId: 15,
    content: {
      ruleBoxes: [
        {
          title: 'اللام الشمسية (تُكتب ولا تُنطق)',
          body: 'يأتي بعدها حرف مشدد. حروفها (14 حرفاً): ت ، ث ، د ، ذ ، ر ، ز ، س ، ش ، ص ، ض ، ط ، ظ ، ل ، ن.',
          example: 'الشَّمْس ، الثَّوْب ، السَّيَّارَة'
        },
        {
          title: 'اللام القمرية (تُكتب وتُنطق)',
          body: 'تكون اللام ساكنة ( الْـ ). مجموعة في جملة (ابغ حجك وخف عقيمه): أ ، ب ، ج ، ح ، خ ، ع ، غ ، ف ، ق ، ك ، م ، هـ ، و ، ي.',
          example: 'الْقَمَر ، الْبَيْت ، الْكَعْبَة'
        }
      ]
    }
  },
  // Page 101: Lam Shamsiyyah Syllables
  {
    pageNumber: 101,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية',
    title: 'مقاطع اللام الشمسية',
    pageType: 'two_letters_reading',
    skillId: 15,
    content: {
      gridItems: [
        'الرَّ', 'الرُّ', 'الرِّ', 'السَّـ', 'السُّـ', 'السِّـ',
        'الذُّ', 'الطَّ', 'التَّـ', 'الثَّـ', 'الدَّ', 'الصَّـ',
        'الضَّـ', 'الضِّـ', 'الطُّ', 'اللَّـ', 'النَّـ', 'الظِّـ',
        'الزَّ', 'الثِّـ', 'اللِّـ', 'التُّـ', 'الدِّ', 'الذَّ'
      ]
    }
  },
  // Page 102: Lam Shamsiyyah Words
  {
    pageNumber: 102,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية',
    title: 'كلمات تحوي لاماً شمسية',
    pageType: 'words_reading',
    skillId: 15,
    content: {
      gridItems: [
        'الرَّمْل', 'الرُّمَّان', 'الرِّسَالَة', 'السَّلَّة', 'السُّوق', 'السِّحْر',
        'الذُّبَاب', 'الطَّبِيب', 'التَّاج', 'الثَّلْج', 'الدَّرَج', 'الصَّابُون',
        'الضَّبُع', 'الضِّفْدَع', 'الطِّبَاعَة', 'اللَّه', 'النَّاس', 'اللُّعَاب',
        'الزِّحَام', 'الثِّيَاب', 'اللِّبَاس', 'التُّفَّاح', 'الدِّيك', 'الظِّل'
      ]
    }
  },
  // Page 103: Writing Lam Shamsiyyah
  {
    pageNumber: 103,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية',
    title: 'تدريب كتابي: اللام الشمسية',
    pageType: 'written_tracing',
    skillId: 15,
    content: {
      gridItems: [
        'الرَّجُل', 'الرُّبَّان', 'الرِّيح', 'السَّد',
        'الضَّب', 'الضِّفْدَع', 'الطَّيْر', 'اللَّعِب',
        'الدُّب', 'التُّمُور', 'الصِّيَاح', 'الزَّمَان'
      ]
    }
  },
  // Page 104: Lam Qamariyyah Syllables
  {
    pageNumber: 104,
    unitId: 'lam',
    unitTitle: 'اللام القمرية',
    title: 'مقاطع اللام القمرية',
    pageType: 'two_letters_reading',
    skillId: 15,
    content: {
      gridItems: [
        'الْبَـ', 'الْـجَـ', 'الْـحَـ', 'الْـخَـ', 'الْـعَـ', 'الْـغَـ',
        'الْفَـ', 'الْـقَـ', 'الْكَـ', 'الْـمَـ', 'الْـهُـ', 'الْـحُـ',
        'الْـغُـ', 'الْوَ', 'الْـجُـ', 'الْيـَ', 'الْـعِـ', 'الْقِـ',
        'الْكِـ', 'الْـخِـ', 'الْفُـ', 'الْـمُـ', 'الْـبِـ', 'الْهِـ'
      ]
    }
  },
  // Page 105: Lam Qamariyyah Words
  {
    pageNumber: 105,
    unitId: 'lam',
    unitTitle: 'اللام القمرية',
    title: 'كلمات تحوي لاماً قمرية',
    pageType: 'words_reading',
    skillId: 15,
    content: {
      gridItems: [
        'الْبَيْت', 'الْجَرَس', 'الْحَبْل', 'الْخَيْل', 'الْعَلَم', 'الْغَرْب',
        'الْفَحْم', 'الْقَمَر', 'الْكَعْبَة', 'الْمَاء', 'الْهُدْهُد', 'الْحُب',
        'الْغُلام', 'الْوَلَد', 'الْجُبْن', 'الْيَد', 'الْعِلْم', 'الْقِرْد',
        'الْكِتَاب', 'الْخِيَار', 'الْفُقْمَة', 'الْمُعَلِّم', 'الْبِنْت', 'الْهِلال'
      ]
    }
  },
  // Page 106: Writing Lam Qamariyyah
  {
    pageNumber: 106,
    unitId: 'lam',
    unitTitle: 'اللام القمرية',
    title: 'تدريب كتابي: اللام القمرية',
    pageType: 'written_tracing',
    skillId: 15,
    content: {
      gridItems: [
        'الْغُلام', 'الْمُعَلِّم', 'الْكُتُب', 'الْقَلَم',
        'الْبَرْق', 'الْخَد', 'الْحَكَم', 'الْمُدَرِّس',
        'الْخِيَار', 'الْجَرَس', 'الْغُرَاب', 'الْفَم'
      ]
    }
  },
  // Page 107: Adding (Al) to Alphabet
  {
    pageNumber: 107,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'تدريب إدخال ( ال ) على جميع الحروف وتحديد نوعها',
    pageType: 'lam_sorting',
    skillId: 15,
    content: {
      sortingItems: [
        { word: 'أَسَد -> الأَسَد', category: 'قمرية' },
        { word: 'بِنْت -> الْبِنْت', category: 'قمرية' },
        { word: 'تَمْر -> التَّمْر', category: 'شمسية' },
        { word: 'ثَوْب -> الثَّوْب', category: 'شمسية' },
        { word: 'جَمَل -> الْجَمَل', category: 'قمرية' },
        { word: 'حَبْل -> الْحَبْل', category: 'قمرية' },
        { word: 'خَيْل -> الْخَيْل', category: 'قمرية' },
        { word: 'دَفْتَر -> الدَّفْتَر', category: 'شمسية' },
        { word: 'ذِئْب -> الذِّئْب', category: 'شمسية' },
        { word: 'رَجُل -> الرَّجُل', category: 'شمسية' },
        { word: 'زَرَافَة -> الزَّرَافَة', category: 'شمسية' },
        { word: 'سَمَك -> السَّمَك', category: 'شمسية' },
        { word: 'شَمْس -> الشَّمْس', category: 'شمسية' },
        { word: 'صَقْر -> الصَّقْر', category: 'شمسية' },
        { word: 'ضَيْف -> الضَّيْف', category: 'شمسية' },
        { word: 'طَيْر -> الطَّيْر', category: 'شمسية' },
        { word: 'ظَرْف -> الظَّرْف', category: 'شمسية' },
        { word: 'عَيْن -> الْعَيْن', category: 'قمرية' },
        { word: 'غَزَال -> الْغَزَال', category: 'قمرية' },
        { word: 'فِيل -> الْفِيل', category: 'قمرية' },
        { word: 'قَمَر -> الْقَمَر', category: 'قمرية' },
        { word: 'كِتَاب -> الْكِتَاب', category: 'قمرية' },
        { word: 'لَحْم -> اللَّحْم', category: 'شمسية' },
        { word: 'مَاء -> الْمَاء', category: 'قمرية' },
        { word: 'نَاس -> النَّاس', category: 'شمسية' },
        { word: 'هَرَم -> الْهَرَم', category: 'قمرية' },
        { word: 'وَلَد -> الْوَلَد', category: 'قمرية' },
        { word: 'يَد -> الْيَد', category: 'قمرية' }
      ]
    }
  },
  // Page 108: Color Shamsiyyah
  {
    pageNumber: 108,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'تظليل الكلمات التي تحوي لاماً شمسية',
    pageType: 'lam_sorting',
    skillId: 15,
    content: {
      sortingItems: [
        { word: 'الطَّبِيب', category: 'شمسية' },
        { word: 'النَّاس', category: 'شمسية' },
        { word: 'الْقَلَم', category: 'قمرية' },
        { word: 'السِّبَاق', category: 'شمسية' },
        { word: 'السُّوق', category: 'شمسية' },
        { word: 'الرُّمَّان', category: 'شمسية' },
        { word: 'السَّيَّارَة', category: 'شمسية' },
        { word: 'الشَّمْس', category: 'شمسية' },
        { word: 'الرِّسَالَة', category: 'شمسية' },
        { word: 'الثَّمَر', category: 'شمسية' },
        { word: 'الدُّب', category: 'شمسية' },
        { word: 'اللَّحْم', category: 'شمسية' },
        { word: 'الزَّرَافَة', category: 'شمسية' },
        { word: 'الصَّقْر', category: 'شمسية' },
        { word: 'السَّقْف', category: 'شمسية' },
        { word: 'الصَّدِيق', category: 'شمسية' },
        { word: 'الرَّحِيم', category: 'شمسية' },
        { word: 'السَّمِيع', category: 'شمسية' }
      ]
    }
  },
  // Page 109: Color Qamariyyah
  {
    pageNumber: 109,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'تظليل الكلمات التي تحوي لاماً قمرية',
    pageType: 'lam_sorting',
    skillId: 15,
    content: {
      sortingItems: [
        { word: 'الْمُعَلِّم', category: 'قمرية' },
        { word: 'الْكِتَاب', category: 'قمرية' },
        { word: 'الْقِرْد', category: 'قمرية' },
        { word: 'الْحَكَم', category: 'قمرية' },
        { word: 'الْقَلَم', category: 'قمرية' },
        { word: 'الْبَصَل', category: 'قمرية' },
        { word: 'الْجَد', category: 'قمرية' },
        { word: 'الْخَلِيج', category: 'قمرية' },
        { word: 'الْكُرْسِي', category: 'قمرية' },
        { word: 'الْقَلْب', category: 'قمرية' },
        { word: 'الأُم', category: 'قمرية' },
        { word: 'الْغُلام', category: 'قمرية' },
        { word: 'الْحَبْل', category: 'قمرية' },
        { word: 'الْخَل', category: 'قمرية' },
        { word: 'الْعَيْن', category: 'قمرية' },
        { word: 'الْوَلَد', category: 'قمرية' },
        { word: 'الْيَوْم', category: 'قمرية' },
        { word: 'الْعِنَب', category: 'قمرية' },
        { word: 'الْفَحْم', category: 'قمرية' },
        { word: 'الْكَهْف', category: 'قمرية' }
      ]
    }
  },
  // Page 110: Quick Distinction Table
  {
    pageNumber: 110,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'جدول التمييز السريع بين الشمسية والقمرية',
    pageType: 'lam_sorting',
    skillId: 15,
    content: {
      sortingItems: [
        { word: 'الرَّقْمُ', category: 'شمسية' },
        { word: 'الْكَبِدُ', category: 'قمرية' },
        { word: 'الْبَطْنُ', category: 'قمرية' },
        { word: 'السَّمْعُ', category: 'شمسية' },
        { word: 'الزَّعْفَرَان', category: 'شمسية' },
        { word: 'النَّهْرُ', category: 'شمسية' },
        { word: 'التَّفَوُّق', category: 'شمسية' },
        { word: 'الْكَفُّ', category: 'قمرية' },
        { word: 'اللَّحْمُ', category: 'شمسية' },
        { word: 'الْيَوْمُ', category: 'قمرية' },
        { word: 'الأَسَد', category: 'قمرية' },
        { word: 'الْفِيلُ', category: 'قمرية' },
        { word: 'الْقَلْب', category: 'قمرية' },
        { word: 'الطَّيْر', category: 'شمسية' },
        { word: 'الْهَيْل', category: 'قمرية' },
        { word: 'الْعُمْر', category: 'قمرية' }
      ]
    }
  },
  // Page 111: Sorting into Boxes
  {
    pageNumber: 111,
    unitId: 'lam',
    unitTitle: 'اللام الشمسية واللام القمرية',
    title: 'فرز الكلمات في صندوق اللام الشمسية وصندوق القمرية',
    pageType: 'lam_sorting',
    skillId: 15,
    content: {
      sortingItems: [
        { word: 'الْكُتُبُ', category: 'قمرية' },
        { word: 'الطَّحِينُ', category: 'شمسية' },
        { word: 'الأَحْمَرُ', category: 'قمرية' },
        { word: 'الضَّيْفُ', category: 'شمسية' },
        { word: 'الْغَيْثُ', category: 'قمرية' },
        { word: 'الْفَكُّ', category: 'قمرية' },
        { word: 'اللَّوْحُ', category: 'شمسية' },
        { word: 'الْجَزَرُ', category: 'قمرية' },
        { word: 'الدَّفْتَرُ', category: 'شمسية' },
        { word: 'الْخَرَزُ', category: 'قمرية' },
        { word: 'النَّحْلُ', category: 'شمسية' },
        { word: 'الْقِمَاشُ', category: 'قمرية' }
      ]
    }
  },
  // Page 112: Taa and Haa Cover
  {
    pageNumber: 112,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    title: 'التاء المفتوحة والتاء المربوطة والهاء',
    pageType: 'unit_cover',
    subtitle: 'قواعد التمييز في الوقف والوصل'
  },
  // Page 113: Taa and Haa Rules (Golden Rule)
  {
    pageNumber: 113,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    title: 'القاعدة الذهبية للتفريق بين التاءات والهاء',
    pageType: 'ta_ha_rule',
    ruleNotice: 'للتمييز بينها: نقف على آخر الكلمة بالسكون، ثم نوصلها بالحركة:',
    skillId: 15,
    content: {
      ruleBoxes: [
        {
          title: 'التاء المفتوحة ( ت )',
          body: 'تُنطق ( تاء ) عند الوقف بالسكون، وتُنطق ( تاء ) عند الوصل بالحركة.',
          example: 'بَيْتْ (بالوقف) -> بَيْتٌ كَبِيرٌ (بالوصل) = تاء مفتوحة (ت)'
        },
        {
          title: 'التاء المربوطة ( ة / ـة )',
          body: 'تُنطق ( هاء ) عند الوقف بالسكون، وتُنطق ( تاء ) عند الوصل بالحركة.',
          example: 'كُرَةْ (بالوقف) -> كُرَةٌ جَدِيدَةٌ (بالوصل) = تاء مربوطة (ة)'
        },
        {
          title: 'الهاء ( هـ / ـه )',
          body: 'تُنطق ( هاء ) عند الوقف بالسكون، وتُنطق ( هاء ) عند الوصل بالحركة.',
          example: 'مِيَاهْ (بالوقف) -> مِيَاهُ الْبَحْرِ (بالوصل) = هاء (ه)'
        }
      ]
    }
  },
  // Page 114: Open Taa Words
  {
    pageNumber: 114,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة',
    title: 'تدريبات على التاء المفتوحة ( ت )',
    pageType: 'words_reading',
    skillId: 15,
    content: {
      gridItems: [
        'نَامَتْ', 'بَعُدَتْ', 'قَطَفْتُ', 'زَرَعْتُ',
        'نَبَاتٌ', 'بِنْتٌ', 'قَالَتْ', 'فَعَلْتِ',
        'سَهِرْتِ', 'دَرَسْتَ', 'سَافَرْتَ', 'نِمْتُ',
        'جَلَسْتُ', 'فَهِمَتْ', 'ذَهَبَتْ', 'حُوتٍ'
      ]
    }
  },
  // Page 115: Tied Taa Words
  {
    pageNumber: 115,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المربوطة',
    title: 'تدريبات على التاء المربوطة ( ة / ـة )',
    pageType: 'words_reading',
    skillId: 15,
    content: {
      gridItems: [
        'جَنَّةْ', 'جَنَّةٌ', 'نَحْلَةٌ', 'نَخْلَةً',
        'فُرْشَاةٌ', 'زَهْرَةً', 'لُعْبَةْ', 'سَيَّارَةْ',
        'مَجَلَّةٍ', 'مَدْرَسَةً', 'صُورَةٍ', 'طَاوِلَةْ',
        'طَائِرَةٌ', 'عَجَلَةً', 'مَكْتَبَةٍ', 'عُطْلَةْ'
      ]
    }
  },
  // Page 116: Haa Words
  {
    pageNumber: 116,
    unitId: 'ta_and_ha',
    unitTitle: 'الهاء',
    title: 'تدريبات على الهاء ( هـ / ـه )',
    pageType: 'words_reading',
    skillId: 15,
    content: {
      gridItems: [
        'وَجْهٌ', 'نَبِيُّهُ', 'نَفْسُهُ', 'عِنْدَهُ',
        'بَيْتُهُ', 'مِيَاه', 'لَهُ', 'أَبُوهُ',
        'لُعْبَتُهُ', 'ثَوْبُهُ', 'فَوَاكِهُ', 'مُنْتَزَهٍ',
        'ذِرَاعُهُ', 'مُنَبِّهٌ', 'هَذِهِ', 'قَلَمُهُ'
      ]
    }
  },
  // Page 117: Picture Blanks (Complete Taa/Haa)
  {
    pageNumber: 117,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    title: 'تكملة الحرف الأخير الناقص بمساعدة الصور',
    pageType: 'ta_ha_picture_blanks',
    skillId: 15,
    content: {
      pictureBlanks: [
        { id: 1, wordStart: 'نَحْـلَ', options: ['ة', 'ت', 'ه'], correct: 'ة', imageEmoji: '🐝', wordComplete: 'نَحْلَة' },
        { id: 2, wordStart: 'سَفِيـنَـ', options: ['ة', 'ت', 'ه'], correct: 'ة', imageEmoji: '⛵', wordComplete: 'سَفِينَة' },
        { id: 3, wordStart: 'زَيْـ', options: ['ت', 'ة', 'ه'], correct: 'ت', imageEmoji: '🫒', wordComplete: 'زَيْت' },
        { id: 4, wordStart: 'فَـوَاكِـ', options: ['ه', 'ة', 'ت'], correct: 'ه', imageEmoji: '🍎', wordComplete: 'فَوَاكِه' },
        { id: 5, wordStart: 'بَيْـ', options: ['ت', 'ة', 'ه'], correct: 'ت', imageEmoji: '🏠', wordComplete: 'بَيْت' },
        { id: 6, wordStart: 'شَـمْـعَـ', options: ['ة', 'ت', 'ه'], correct: 'ة', imageEmoji: '🕯️', wordComplete: 'شَمْعَة' },
        { id: 7, wordStart: 'مِيَـا', options: ['ه', 'ة', 'ت'], correct: 'ه', imageEmoji: '💧', wordComplete: 'مِيَاه' },
        { id: 8, wordStart: 'بَـقَـرَ', options: ['ة', 'ت', 'ه'], correct: 'ة', imageEmoji: '🐄', wordComplete: 'بَقَرَة' },
        { id: 9, wordStart: 'وَـرْدَ', options: ['ة', 'ت', 'ه'], correct: 'ة', imageEmoji: '🌸', wordComplete: 'وَرْدَة' },
        { id: 10, wordStart: 'نَبَـا', options: ['ت', 'ة', 'ه'], correct: 'ت', imageEmoji: '🌱', wordComplete: 'نَبَات' },
        { id: 11, wordStart: 'سَمَـكَـ', options: ['ة', 'ت', 'ه'], correct: 'ة', imageEmoji: '🐟', wordComplete: 'سَمَكَة' },
        { id: 12, wordStart: 'مُنَبِّـ', options: ['ه', 'ة', 'ت'], correct: 'ه', imageEmoji: '⏰', wordComplete: 'مُنَبِّه' }
      ]
    }
  },
  // Page 118: Color Classify
  {
    pageNumber: 118,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    title: 'تلوين التاء المفتوحة (أخضر) والمربوطة (أحمر) والهاء (أزرق)',
    pageType: 'ta_ha_coloring',
    skillId: 15,
    content: {
      colorItems: [
        { word: 'سَيَّارَةٌ', type: 'tied_ta' },
        { word: 'بَيْتُهُ', type: 'ha' },
        { word: 'طَاوِلَة', type: 'tied_ta' },
        { word: 'جَمِيلَة', type: 'tied_ta' },
        { word: 'بِنْت', type: 'open_ta' },
        { word: 'حَدِيقَة', type: 'tied_ta' },
        { word: 'بَيْت', type: 'open_ta' },
        { word: 'حُوت', type: 'open_ta' },
        { word: 'ثَوْبُهُ', type: 'ha' },
        { word: 'سَيَّارَتُهُ', type: 'ha' },
        { word: 'زَرَافَة', type: 'tied_ta' },
        { word: 'هَاتِفُهُ', type: 'ha' },
        { word: 'حَيَاةٍ', type: 'tied_ta' },
        { word: 'تُوت', type: 'open_ta' },
        { word: 'أُمُّهُ', type: 'ha' },
        { word: 'مُنَبِّهٌ', type: 'ha' },
        { word: 'صَوْت', type: 'open_ta' },
        { word: 'قِصَّةً', type: 'tied_ta' },
        { word: 'لَهُ', type: 'ha' },
        { word: 'وَقَفْتُ', type: 'open_ta' },
        { word: 'عِنْدَهُ', type: 'ha' },
        { word: 'مَزْرَعَة', type: 'tied_ta' },
        { word: 'جَلَسْتُ', type: 'open_ta' },
        { word: 'رَبُّهُ', type: 'ha' },
        { word: 'نِمْتُ', type: 'open_ta' }
      ]
    }
  },
  // Page 119: Forms of Taa and Haa Writing
  {
    pageNumber: 119,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    title: 'تدريب كتابة أشكال التاء والهاء المتصلة والمنفصلة',
    pageType: 'written_tracing',
    skillId: 15,
    content: {
      gridItems: [
        'ت : ثَمَرَات',
        'ـت : وَقْت',
        'ـة : قِطَّة',
        'ة : زَهْرَة',
        'ـه : إِنَّهُ',
        'ه : هَذِهِ'
      ]
    }
  },
  // Page 120: Dictation Taa and Haa
  {
    pageNumber: 120,
    unitId: 'ta_and_ha',
    unitTitle: 'التاء المفتوحة والمربوطة والهاء',
    title: 'تدريب إملائي شامل: التاء المفتوحة والمربوطة والهاء',
    pageType: 'dictation_board',
    skillId: 15,
    content: {
      dictationSuggestedWords: ['بِنْت', 'مَدْرَسَة', 'وَجْه', 'سَيَّارَة', 'زَيْت', 'فَوَاكِه', 'شَجَرَة', 'حُوت', 'مِيَاه', 'قِصَّة', 'سَافَرْتُ', 'مُنَبِّه']
    }
  },
  // Page 121: Conclusion
  {
    pageNumber: 121,
    unitId: 'evaluation',
    unitTitle: 'الخاتمة والتقويم',
    title: 'نهاية المذكرة وسجل الإتقان النهائي',
    pageType: 'conclusion',
    content: {
      text: 'قسم إدارة الجودة بمدارس ابن سيناء - برنامج التميز اللغوي. نسأل الله العلي القدير التوفيق والنجاح لجميع أبنائنا وبناتنا الطلاب والطالبات، وأن تكون هذه المذكرة رافداً تعليمياً متميزاً لمعالجة جوانب القصور القرائي والإملائي وتعزيز الإتقان.'
    }
  }
];
