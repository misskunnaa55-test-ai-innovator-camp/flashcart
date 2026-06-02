export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  partOfSpeech: string; // e.g. "noun", "verb", "adjective", "adverb"
  pronunciation: string; // e.g. "/məˈtɪkjələs/"
  example: string;
  exampleTranslation: string;
  isCustom?: boolean;
  status: 'learning' | 'mastered'; // status for active recall tracking
  correctCount: number; // consecutive correct reviews
  wrongCount: number; // review failures
}

export type CardFilter = 'all' | 'learning' | 'mastered' | 'custom';
