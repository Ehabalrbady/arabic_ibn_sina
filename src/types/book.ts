export type UnitId = 
  | 'intro'
  | 'letters'
  | 'two_letters'
  | 'three_letter_words'
  | 'madd'
  | 'tanween'
  | 'shaddah'
  | 'lam'
  | 'ta_and_ha'
  | 'evaluation';

export interface UnitInfo {
  id: UnitId;
  number: number;
  title: string;
  shortTitle: string;
  startPage: number;
  endPage: number;
  description: string;
  icon: string;
  badgeColor: string;
}

export type PageType = 
  | 'cover'
  | 'intro'
  | 'toc'
  | 'unit_cover'
  | 'letter_vowels'
  | 'letter_random'
  | 'written_tracing'
  | 'dictation_board'
  | 'two_letters_reading'
  | 'words_reading'
  | 'analysis_syllables'
  | 'connect_and_read'
  | 'sentences_reading'
  | 'rule_explanation'
  | 'madd_comparison'
  | 'madd_identification'
  | 'tanween_types'
  | 'shaddah_extraction'
  | 'shaddah_sorting'
  | 'lam_comparison'
  | 'lam_sorting'
  | 'ta_ha_rule'
  | 'ta_ha_picture_blanks'
  | 'ta_ha_coloring'
  | 'conclusion';

export interface AnalysisWord {
  word: string;
  syllables: string[];
  explanation?: string;
}

export interface ConnectExercise {
  separated: string;
  combined: string;
  syllablesDetailed?: string[];
}

export interface SortingItem {
  word: string;
  category: string;
}

export interface PictureBlankItem {
  id: number;
  wordStart: string;
  wordEnd?: string;
  options: string[];
  correct: string;
  imageEmoji: string;
  wordComplete: string;
}

export interface ColorClassifyItem {
  word: string;
  type: 'open_ta' | 'tied_ta' | 'ha';
}

export interface BookPage {
  pageNumber: number;
  unitId: UnitId;
  unitTitle: string;
  title: string;
  subtitle?: string;
  pageType: PageType;
  goal?: string;
  procedure?: string;
  ruleNotice?: string;
  skillId?: number; // Maps to one of the 15 evaluation skills
  content?: {
    text?: string;
    items?: string[];
    gridItems?: string[];
    analysisWords?: AnalysisWord[];
    connectExercises?: ConnectExercise[];
    sentences?: string[];
    tracingItems?: Array<{ prompt: string; traceGuide: string; example?: string }>;
    sortingItems?: SortingItem[];
    pictureBlanks?: PictureBlankItem[];
    colorItems?: ColorClassifyItem[];
    ruleBoxes?: Array<{ title: string; body: string; example: string; badge?: string }>;
    tableData?: any;
    dictationSuggestedWords?: string[];
  };
}

export interface EvaluationSkill {
  id: number;
  name: string;
  category: string;
  pageRef: number;
  unitId: UnitId;
  attempts: [boolean, boolean, boolean, boolean];
  evaluatedDate?: string;
}
