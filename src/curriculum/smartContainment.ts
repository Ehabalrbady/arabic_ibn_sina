import { BookPage } from './types';

/**
 * Smart Containment & Layout Optimization Module
 * 
 * Features:
 * 1. Automatic Deduplication (حذف التكرار التلقائي): Removes redundant words across grids, 
 *    sentences, and dictation lists while keeping pristine didactic sequence.
 * 2. Adaptive Density & Column Scaling (توزيع مرن للمساحات): Computes optimal column spans 
 *    and card sizes based on item counts.
 * 3. Dynamic Layout Density Engine (حساب كثافة النصوص وخانات الإدخال للطباعة والشاشة):
 *    Calculates text character density, handwriting slot count, tier complexity, and 
 *    automatically toggles between 1-column and 2-column modes for print exports to prevent A4 overflow.
 * 4. Pedagogical Fillers (أمثلة تكميلية ذكية): Supplies supplementary vocabulary when a page 
 *    has sparse items to utilize paper/screen space effectively.
 */

// Supplementary bank for enrichment based on skill/unit
const SUPPLEMENTARY_BANK: Record<string, string[]> = {
  'حركات قصيرة': ['رَسَمَ', 'حَصَدَ', 'دَخَلَ', 'خَرَجَ', 'شَرِبَ', 'لَعِبَ', 'سَمِعَ', 'فَهِمَ', 'عَلِمَ', 'كَتَبَ', 'قَرَأَ', 'ذَهَبَ'],
  'مد بالألف': ['قَالَ', 'نَامَ', 'صَامَ', 'عَادَ', 'زَارَ', 'بَاعَ', 'طَارَ', 'سَارَ', 'خَافَ', 'تَابَ', 'دَارَ', 'نَارَ'],
  'مد بالواو': ['يَقُولُ', 'يَصُومُ', 'يَزُورُ', 'يَعُودُ', 'يَنُومُ', 'يَفُوزُ', 'يَكُونُ', 'نُورُ', 'سُورُ', 'حُورُ', 'طُورُ', 'دُورُ'],
  'مد بالياء': ['قِيلَ', 'سِيرَ', 'بِيعَ', 'زِيدَ', 'عِيدَ', 'رِيفُ', 'تِينُ', 'طِينُ', 'فِيلُ', 'دِينُ', 'حِينُ', 'سِينُ'],
  'سكون': ['يَقْرَأُ', 'يَكْتُبُ', 'يَسْمَعُ', 'يَفْهَمُ', 'يَرْسُمُ', 'يَلْعَبُ', 'يَشْكُرُ', 'يَنْصُرُ'],
  'تنوين': ['كِتَاباً', 'قَلَماً', 'بَيْتـاً', 'مَسْجِداً', 'بَاباً', 'نَهْراً', 'جَبَلاً', 'بَحْراً', 'زَهْراً', 'ثَمَراً', 'شَجَراً', 'قَمَراً'],
  'لام شمسية وقمرية': ['الشَّمْسُ', 'الْقَمَرُ', 'النَّجْمُ', 'الْبَابُ', 'التِّينُ', 'الْعِنَبُ', 'الرَّجُلُ', 'الْكِتَابُ', 'السَّمَاءُ', 'الْأَرْضُ', 'الصَّيْفُ', 'الشِّتَاءُ'],
  'شدة': ['عَلَّمَ', 'فَهَّمَ', 'دَرَّبَ', 'سَلَّمَ', 'قَدَّمَ', 'رَتَّبَ', 'نَظَّمَ', 'عَظَّمَ', 'حَرَّكَ', 'سَكَّنَ', 'جَدَّدَ', 'بَدَّلَ'],
  'مربوطة ومفتوحة': ['مَدْرَسَةٌ', 'مَكْتَبَةٌ', 'حَدِيقَةٌ', 'شَجَرَةٌ', 'بِنْتٌ', 'أُخْتٌ', 'بَيْتٌ', 'وَقْتٌ', 'مِياهٌ', 'وَجْهٌ', 'فَواكِهُ', 'مُنْتَبِهٌ']
};

/**
 * Remove duplicates from an array of strings while preserving first occurrence
 */
export function deduplicateStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const normalized = item.trim();
    if (!seen.has(normalized) && normalized.length > 0) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

/**
 * Identify relevant supplementary category from page title/unit
 */
export function getSupplementaryWords(page: BookPage, targetCount: number = 8): string[] {
  const text = `${page.unitTitle || ''} ${page.title || ''}`.toLowerCase();
  
  let key = 'حركات قصيرة';
  if (text.includes('واو') || text.includes('رَسُول')) key = 'مد بالواو';
  else if (text.includes('ألف') || text.includes('الف')) key = 'مد بالألف';
  else if (text.includes('ياء')) key = 'مد بالياء';
  else if (text.includes('سكون') || text.includes('ساكن')) key = 'سكون';
  else if (text.includes('تنوين')) key = 'تنوين';
  else if (text.includes('شمس') || text.includes('قمر') || text.includes('لام')) key = 'لام شمسية وقمرية';
  else if (text.includes('شد') || text.includes('تضعيف')) key = 'شدة';
  else if (text.includes('تاء') || text.includes('هاء')) key = 'مربوطة ومفتوحة';

  const bank = SUPPLEMENTARY_BANK[key] || SUPPLEMENTARY_BANK['حركات قصيرة'];
  return bank.slice(0, targetCount);
}

/**
 * Smart containment processor:
 * - Deduplicates grid items, sentences, connect exercises, and dictation lists
 * - Fills in sparse grids to achieve balanced layout
 */
export function processSmartContainment(page: BookPage): BookPage {
  if (!page.content) return page;

  const newContent = { ...page.content };

  // 1. Deduplicate grid items
  if (newContent.gridItems && newContent.gridItems.length > 0) {
    let deduped = deduplicateStrings(newContent.gridItems);
    
    // If sparse (less than 4 items on a reading page), complement intelligently
    if (deduped.length < 4 && page.pageType === 'words_reading') {
      const extra = getSupplementaryWords(page, 4 - deduped.length);
      const combined = [...deduped, ...extra];
      deduped = deduplicateStrings(combined);
    }
    
    newContent.gridItems = deduped;
  }

  // 2. Deduplicate sentences
  if (newContent.sentences && newContent.sentences.length > 0) {
    newContent.sentences = deduplicateStrings(newContent.sentences);
  }

  // 3. Deduplicate dictation suggested words
  if (newContent.dictationSuggestedWords && newContent.dictationSuggestedWords.length > 0) {
    newContent.dictationSuggestedWords = deduplicateStrings(newContent.dictationSuggestedWords);
  }

  // 4. Deduplicate connect exercises
  if (newContent.connectExercises && newContent.connectExercises.length > 0) {
    const seen = new Set<string>();
    newContent.connectExercises = newContent.connectExercises.filter(ex => {
      const key = `${ex.separated}->${ex.combined}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return {
    ...page,
    content: newContent
  };
}

/**
 * Calculates responsive grid column count for words grids
 */
export function getOptimizedGridCols(itemCount: number): string {
  if (itemCount <= 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4';
  if (itemCount <= 8) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  if (itemCount <= 12) return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-4';
  if (itemCount <= 16) return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-4';
  return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
}

/**
 * Layout Density Metrics Interface
 */
export interface PageLayoutDensity {
  score: number; // 0 - 100 percentage
  level: 'low' | 'balanced' | 'dense' | 'high-density';
  levelLabel: string;
  recommendedCols: 1 | 2;
  textDensity: number; // average char length of items
  totalChars: number;
  itemCount: number;
  inputBoxCount: number; // total handwriting / input slots
  tierComplexity: number; // vertical tiers per item
  estimatedContentHeightMm: number; // Content height in mm
  totalPageHeightMm: number; // Header + Content + Footer in mm
  a4HeightBudgetMm: number; // 297mm standard
  overflowRisk: boolean; // whether 1-col would overflow A4
  autoGridClassScreen: string;
  autoGridClassPrint: string;
  summaryText: string;
}

/**
 * Dynamic Layout Density Calculation Engine
 * 
 * Accurately calculates text density, input boxes, tier complexity,
 * and determines optimal 1-column vs 2-column modes for both interactive screen
 * and A4 print export without page spillover.
 */
export function calculatePageLayoutDensity(page: BookPage): PageLayoutDensity {
  const pageType = page.pageType;
  const content = page.content || {};

  let itemCount = 0;
  let totalChars = 0;
  let inputBoxCount = 0;
  let tierComplexity = 1; // default 1 tier
  let estimatedContentHeightMm = 0;

  // Base fixed header and guidance overhead (mm)
  let baseOverheadMm = 42;
  if (page.goal || page.procedure) baseOverheadMm += 14;
  if (page.ruleNotice) baseOverheadMm += 8;
  if (content.text && pageType !== 'cover') baseOverheadMm += 16;
  if (page.pageNumber === 59) baseOverheadMm += 55; // Rasul spotlight card
  
  // Footer overhead on print (4-attempt rubric + signatures + margins)
  const footerOverheadMm = 44;
  const printableBudgetMm = 297 - 24; // 273mm printable inner height
  const availableContentBudgetMm = printableBudgetMm - baseOverheadMm - footerOverheadMm; // ~173mm

  switch (pageType) {
    case 'sentences_reading': {
      const sentences = content.sentences || [];
      itemCount = sentences.length;
      totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
      tierComplexity = 4; // Model + Dotted + Write 1 + Write 2
      inputBoxCount = itemCount * 2; // 2 handwriting slots per sentence

      // In 1-column mode, each sentence card is ~34mm.
      // In 2-column mode, 2 sentence cards share a row of ~34mm height.
      const rows1Col = itemCount;
      const rows2Col = Math.ceil(itemCount / 2);

      const height1Col = rows1Col * 34;
      const height2Col = rows2Col * 35;

      // If 1-column would exceed available budget, recommend 2 columns
      if (itemCount > 3 || height1Col > availableContentBudgetMm) {
        estimatedContentHeightMm = height2Col;
      } else {
        estimatedContentHeightMm = height1Col;
      }
      break;
    }

    case 'written_tracing': {
      const items = content.gridItems || [];
      itemCount = items.length;
      totalChars = items.reduce((sum, s) => sum + s.length, 0);
      tierComplexity = 4; // Model, Dotted, Write 1, Repeat 2
      inputBoxCount = itemCount * 2;

      // Tracing cards: In 2-column, rows = ceil(itemCount / 2) * 36mm
      const rows2Col = Math.ceil(itemCount / 2);
      const rows3Col = Math.ceil(itemCount / 3);

      if (itemCount > 8) {
        estimatedContentHeightMm = rows3Col * 34;
      } else {
        estimatedContentHeightMm = rows2Col * 36;
      }
      break;
    }

    case 'connect_and_read': {
      const exercises = content.connectExercises || [];
      itemCount = exercises.length;
      totalChars = exercises.reduce((sum, ex) => sum + ex.separated.length + ex.combined.length, 0);
      tierComplexity = 3; // Separated, Dotted Combined, Write line
      inputBoxCount = itemCount;

      const rows1Col = itemCount;
      const rows2Col = Math.ceil(itemCount / 2);
      const height1Col = rows1Col * 28;
      const height2Col = rows2Col * 30;

      estimatedContentHeightMm = (itemCount > 4 || height1Col > availableContentBudgetMm) ? height2Col : height1Col;
      break;
    }

    case 'analysis_syllables': {
      const words = content.analysisWords || [];
      itemCount = words.length;
      totalChars = words.reduce((sum, w) => sum + w.word.length + w.syllables.join('').length, 0);
      tierComplexity = 2; // Word + Syllable tags + Full word write line
      inputBoxCount = itemCount;

      const rows1Col = itemCount;
      const rows2Col = Math.ceil(itemCount / 2);
      const height1Col = rows1Col * 26;
      const height2Col = rows2Col * 28;

      estimatedContentHeightMm = (itemCount > 4 || height1Col > availableContentBudgetMm) ? height2Col : height1Col;
      break;
    }

    case 'dictation_board': {
      const words = content.dictationSuggestedWords || [];
      itemCount = Math.min(10, Math.max(8, words.length || 8));
      totalChars = words.reduce((sum, w) => sum + w.length, 0);
      tierComplexity = 1;
      inputBoxCount = itemCount;
      estimatedContentHeightMm = Math.ceil(itemCount / 2) * 18 + 25; // slots + word bank
      break;
    }

    case 'lam_sorting':
    case 'shaddah_sorting':
    case 'shaddah_extraction':
    case 'madd_identification': {
      const items = content.sortingItems || [];
      itemCount = items.length;
      totalChars = items.reduce((sum, item) => sum + item.word.length + item.category.length, 0);
      tierComplexity = 1;
      inputBoxCount = itemCount;
      estimatedContentHeightMm = Math.ceil(itemCount / 3) * 18 + 20;
      break;
    }

    case 'words_reading':
    case 'two_letters_reading':
    case 'madd_comparison': {
      const words = content.gridItems || [];
      itemCount = words.length;
      totalChars = words.reduce((sum, w) => sum + w.length, 0);
      tierComplexity = 1;
      inputBoxCount = 0;
      const cols = itemCount <= 8 ? 3 : (itemCount <= 16 ? 4 : 5);
      estimatedContentHeightMm = Math.ceil(itemCount / cols) * 22;
      break;
    }

    case 'letter_vowels': {
      const items = content.gridItems || [];
      itemCount = items.length;
      totalChars = items.reduce((sum, w) => sum + w.length, 0);
      tierComplexity = 3;
      inputBoxCount = itemCount;
      estimatedContentHeightMm = Math.ceil(itemCount / 7) * 45;
      break;
    }

    case 'letter_random': {
      const items = content.gridItems || [];
      itemCount = items.length;
      totalChars = items.length;
      tierComplexity = 1;
      inputBoxCount = 0;
      estimatedContentHeightMm = Math.ceil(itemCount / 7) * 16;
      break;
    }

    case 'ta_ha_picture_blanks': {
      const items = content.pictureBlanks || [];
      itemCount = items.length;
      totalChars = items.reduce((sum, item) => sum + (item.wordStart || '').length + (item.options || []).join('').length, 0);
      tierComplexity = 2;
      inputBoxCount = itemCount;
      estimatedContentHeightMm = Math.ceil(itemCount / 3) * 36;
      break;
    }

    case 'ta_ha_coloring': {
      const items = content.colorItems || [];
      itemCount = items.length;
      totalChars = items.reduce((sum, item) => sum + (item.word || '').length, 0);
      tierComplexity = 2;
      inputBoxCount = itemCount;
      estimatedContentHeightMm = Math.ceil(itemCount / 4) * 24;
      break;
    }

    case 'rule_explanation':
    case 'tanween_types':
    case 'ta_ha_rule':
    case 'lam_comparison': {
      const ruleBoxes = content.ruleBoxes || [];
      itemCount = ruleBoxes.length;
      totalChars = ruleBoxes.reduce((sum, b) => sum + b.title.length + b.body.length + (b.example || '').length, 0);
      tierComplexity = 2;
      inputBoxCount = 0;
      estimatedContentHeightMm = (itemCount > 1 ? Math.ceil(itemCount / 2) * 38 : 60);
      break;
    }

    default: {
      itemCount = content.gridItems?.length || 4;
      totalChars = itemCount * 4;
      estimatedContentHeightMm = 65;
      break;
    }
  }

  const textDensity = itemCount > 0 ? Math.round(totalChars / itemCount) : 0;
  const totalPageHeightMm = baseOverheadMm + estimatedContentHeightMm + footerOverheadMm;

  // Calculate density score (0 to 100%) against printable A4 budget
  const score = Math.min(100, Math.max(10, Math.round((totalPageHeightMm / printableBudgetMm) * 100)));

  // Determine density level and recommendation
  let level: 'low' | 'balanced' | 'dense' | 'high-density' = 'balanced';
  let levelLabel = 'متوازنة';
  let recommendedCols: 1 | 2 = 2;
  let overflowRisk = false;

  if (score < 55) {
    level = 'low';
    levelLabel = 'منخفضة (رحبة)';
    // In low density with few items, 1-col gives great focus or 2-col keeps it airy
    recommendedCols = (itemCount <= 3 && ['sentences_reading', 'connect_and_read'].includes(pageType)) ? 1 : 2;
  } else if (score <= 78) {
    level = 'balanced';
    levelLabel = 'مثالية ومتوازنة';
    recommendedCols = 2;
  } else if (score <= 92) {
    level = 'dense';
    levelLabel = 'مكثفة (محكمة)';
    recommendedCols = 2;
  } else {
    level = 'high-density';
    levelLabel = 'عالية جداً (ضغط ذكي)';
    recommendedCols = 2;
    overflowRisk = totalPageHeightMm > printableBudgetMm + 5;
  }

  // Grid classes for Screen and Print
  let autoGridClassScreen = 'grid-cols-1 md:grid-cols-2';
  let autoGridClassPrint = 'grid-cols-2';

  if (recommendedCols === 1) {
    autoGridClassScreen = 'grid-cols-1 max-w-2xl mx-auto';
    autoGridClassPrint = 'grid-cols-1';
  } else {
    autoGridClassScreen = 'grid-cols-1 md:grid-cols-2';
    autoGridClassPrint = 'grid-cols-2';
  }

  // Custom summary text for pedagogical clarity
  let summaryText = '';
  if (recommendedCols === 2) {
    summaryText = `تم تفعيل نمط العمودين (كثافة ${score}%) لضغط العناصر أفقياً وتفادي امتداد الورقة على A4.`;
  } else {
    summaryText = `تم تفعيل نمط العمود الفردي (كثافة ${score}%) لإتاحة مساحة كتابة واسعة ومريحة ليد التلميذ.`;
  }

  return {
    score,
    level,
    levelLabel,
    recommendedCols,
    textDensity,
    totalChars,
    itemCount,
    inputBoxCount,
    tierComplexity,
    estimatedContentHeightMm: Math.round(estimatedContentHeightMm),
    totalPageHeightMm: Math.round(totalPageHeightMm),
    a4HeightBudgetMm: printableBudgetMm,
    overflowRisk,
    autoGridClassScreen,
    autoGridClassPrint,
    summaryText
  };
}

