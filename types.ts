
export type Screen = 'HOME' | 'PRACTICE' | 'REWARDS';

export interface WordItem {
  word: string;
  image?: string;
}

export interface UserProgress {
  currentWordIndex: number;
  completedWordIndices: Set<number>;
  userRecordings: Record<number, string>; // Maps index to Blob URL
  stars: number;
}
