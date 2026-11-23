import type { Box, ItemId, ItemProgress } from './types';

const DAY = 24 * 60 * 60 * 1000;

/** Hvornår et item skal gentages, efter hvilken boks det står i. */
export const INTERVALS: Record<Box, number> = {
  0: 0,
  1: 0, // samme session
  2: 1 * DAY,
  3: 3 * DAY,
  4: 7 * DAY,
};

export function newProgress(id: ItemId, now: number): ItemProgress {
  return { id, attempts: 0, correct: 0, runInItem: 0, box: 0, lastSeen: 0, dueAt: now };
}

/**
 * Opdaterer et items fremskridt efter et svar.
 * Rigtigt → én boks op, men KUN hvis itemet var "due" (ellers ville man kunne
 * "mestre" noget på én aften). Forkert → én boks ned, men aldrig under 1.
 * Ny (boks 0) → boks 1 → boks 2 kan ske samme dag; højere kræver gentagelse over flere dage.
 */
export function applyAnswer(p: ItemProgress, correct: boolean, now: number): ItemProgress {
  const wasDue = p.box <= 1 || p.dueAt <= now;
  const up = correct && wasDue;
  const box = (correct ? (up ? Math.min(4, p.box + 1) : p.box) : Math.max(1, p.box - 1)) as Box;
  return {
    ...p,
    attempts: p.attempts + 1,
    correct: p.correct + (correct ? 1 : 0),
    runInItem: correct ? p.runInItem + 1 : 0,
    box,
    lastSeen: now,
    dueAt: up || !correct ? now + INTERVALS[box] : p.dueAt,
  };
}

export function isMastered(p: ItemProgress) {
  return p.box >= 4;
}

/** Nyt indhold åbnes, når mindst 80 % af de introducerede items står i boks ≥ 2. */
export function readyForNewItem(introduced: ItemProgress[], threshold = 0.8) {
  if (introduced.length === 0) return true;
  const solid = introduced.filter((p) => p.box >= 2).length;
  return solid / introduced.length >= threshold;
}
