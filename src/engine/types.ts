export type ItemId = `letter:${string}` | `word:${string}` | `num:${string}`;

/** Leitner-boks: 0 = ny, 1 = i gang, 4 = mestret. */
export type Box = 0 | 1 | 2 | 3 | 4;

export interface ItemProgress {
  id: ItemId;
  attempts: number;
  correct: number;
  /** Rigtige i træk på DETTE item. Internt tal, vises aldrig som "streak" for barnet. */
  runInItem: number;
  box: Box;
  lastSeen: number;
  dueAt: number;
}
