import { ALL_BOOK_PAGES } from '../curriculum/bookData';

/**
 * Extracts and deduplicates all essential vocabulary, letters, syllables, words,
 * and sentences across the entire Ibn Sina curriculum.
 */
export function extractAllCurriculumVocabulary(): string[] {
  const vocabSet = new Set<string>();

  // Helper to clean and add strings
  function addWord(raw?: string) {
    if (!raw) return;
    const clean = raw.replace(/[،,.;:!?()\[\]{}"'\-_]/g, ' ').trim();
    if (clean) {
      vocabSet.add(clean);
      // If contains multiple words, also add individual words
      if (clean.includes(' ')) {
        const parts = clean.split(/\s+/);
        for (const p of parts) {
          const sub = p.trim();
          if (sub.length > 0) {
            vocabSet.add(sub);
          }
        }
      }
    }
  }

  // Extract from all curriculum book pages
  for (const page of ALL_BOOK_PAGES) {
    const c = page.content;
    if (!c) continue;

    // Grid items (letters, 2-letter combos, words)
    if (c.gridItems) {
      for (const item of c.gridItems) {
        addWord(item);
      }
    }

    // Suggested dictation words
    if (c.dictationSuggestedWords) {
      for (const item of c.dictationSuggestedWords) {
        addWord(item);
      }
    }

    // Analysis syllables & words
    if (c.analysisWords) {
      for (const item of c.analysisWords) {
        addWord(item.word);
        if (item.syllables) {
          for (const s of item.syllables) {
            addWord(s);
          }
        }
      }
    }

    // Connect & Read exercises
    if (c.connectExercises) {
      for (const item of c.connectExercises) {
        addWord(item.separated);
        addWord(item.combined);
        if (item.syllablesDetailed) {
          for (const s of item.syllablesDetailed) {
            addWord(s);
          }
        }
      }
    }

    // Sentences
    if (c.sentences) {
      for (const s of c.sentences) {
        addWord(s);
      }
    }

    // Sorting items
    if (c.sortingItems) {
      for (const item of c.sortingItems) {
        addWord(item.word);
      }
    }

    // Picture blanks
    if (c.pictureBlanks) {
      for (const item of c.pictureBlanks) {
        addWord(item.wordComplete);
        addWord(item.correct);
      }
    }

    // Color classification items
    if (c.colorItems) {
      for (const item of c.colorItems) {
        addWord(item.word);
      }
    }

    // Rule boxes & examples
    if (c.ruleBoxes) {
      for (const b of c.ruleBoxes) {
        addWord(b.example);
      }
    }

    // Tracing items
    if (c.tracingItems) {
      for (const t of c.tracingItems) {
        addWord(t.prompt);
        if (t.example) addWord(t.example);
      }
    }
  }

  // Core pedagogical phrases and compliments
  const essentialPhrases = [
    'أَحْسَنْتَ!',
    'بَطَلٌ مُتَمَيِّزٌ!',
    'إِجَابَةٌ صَحِيحَةٌ وَرَائِعَةٌ',
    'حَاوِلْ مَرَّةً أُخْرَى',
    'اِسْتَمِعْ جَيِّدًا',
    'اقْرَأْ بِطَلَاقَةٍ',
    'كِتَابٌ مُفِيدٌ',
    'مَدْرَسَةُ الْعِلْمِ وَالْإِبْدَاعِ',
    'أَنَا أُحِبُّ الْقِرَاءَةَ',
    'مَرْحَبًا بِكُمْ فِي مَدَارِسِ ابْنِ سِينَاءَ'
  ];
  for (const p of essentialPhrases) {
    addWord(p);
  }

  return Array.from(vocabSet).filter(w => w.length > 0);
}
