import { readyForNewItem } from './mastery';
import type { ItemId, ItemProgress } from './types';

export interface ScheduleInput {
  /** Alle items i sporet, i den pædagogiske rækkefølge (fx m, s, l, r, a, …). */
  curriculum: ItemId[];
  progress: Map<ItemId, ItemProgress>;
  now: number;
  /** Antal opgaver i sessionen. */
  count: number;
  /** Er der allerede introduceret et nyt item i denne session? */
  newIntroducedThisSession?: boolean;
  rng?: () => number;
}

/**
 * Vælger opgaverne til en session. Groft regnet: ca. 70 % items, der skal gentages,
 * ca. 20 % items i gang og højst ét nyt item pr. session.
 */
export function planSession({
  curriculum,
  progress,
  now,
  count,
  newIntroducedThisSession = false,
  rng = Math.random,
}: ScheduleInput): ItemId[] {
  const introduced = curriculum.filter((id) => (progress.get(id)?.attempts ?? 0) > 0);
  const introducedProgress = introduced.map((id) => progress.get(id)!);

  const due = introducedProgress
    .filter((p) => p.dueAt <= now)
    .sort((a, b) => a.box - b.box || a.dueAt - b.dueAt)
    .map((p) => p.id);
  const notDue = introducedProgress
    .filter((p) => p.dueAt > now)
    .sort((a, b) => a.box - b.box)
    .map((p) => p.id);

  const picks: ItemId[] = [];

  // Højst ét nyt item, og kun når det eksisterende sidder godt nok.
  const nextNew = curriculum.find((id) => (progress.get(id)?.attempts ?? 0) === 0);
  if (nextNew && !newIntroducedThisSession && readyForNewItem(introducedProgress)) {
    // Det nye item optræder to gange, så barnet møder det igen samme session.
    picks.push(nextNew, nextNew);
  }

  const pool = [...due, ...notDue];
  let i = 0;
  while (picks.length < count && pool.length > 0) {
    picks.push(pool[i % pool.length]);
    i++;
  }

  // Helt fra start (intet introduceret) fylder vi op med det nye item.
  while (picks.length < count && nextNew) picks.push(nextNew);

  return shuffleAvoidingRepeats(picks.slice(0, count), rng);
}

/** Bland, men undgå så vidt muligt samme item to gange i træk. */
export function shuffleAvoidingRepeats<T>(items: T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) {
      const k = a.findIndex((x, idx) => idx > i && x !== a[i] && a[idx - 1] !== x && a[idx + 1] !== a[i]);
      if (k > -1) [a[i], a[k]] = [a[k], a[i]];
    }
  }
  return a;
}

/** Antal svarmuligheder: 2 → 3 → 4 efter tre rigtige i træk, ned igen efter to forkerte. */
export function nextChoiceCount(current: number, recent: boolean[]): number {
  const last3 = recent.slice(-3);
  const last2 = recent.slice(-2);
  if (last3.length === 3 && last3.every(Boolean)) return Math.min(4, current + 1);
  if (last2.length === 2 && last2.every((x) => !x)) return Math.max(2, current - 1);
  return current;
}
