import { useEffect, useRef, useState } from 'react';
import { applyAnswer, newProgress } from '../engine/mastery';
import { planSession } from '../engine/scheduler';
import type { ItemId, ItemProgress } from '../engine/types';
import { getAllProgress, logSession, saveProgress } from '../storage/db';

export const ROUNDS_PER_SESSION = 6;

/**
 * En session: vælger opgaver med motoren, gemmer svar og logger sessionen.
 * Kun første forsøg på en opgave tæller i mestringen.
 */
export function useSession(activity: string, curriculum: ItemId[], count = ROUNDS_PER_SESSION) {
  const [plan, setPlan] = useState<ItemId[] | null>(null);
  const [index, setIndex] = useState(0);
  const progress = useRef<Map<ItemId, ItemProgress>>(new Map());
  const startedAt = useRef(Date.now());
  const results = useRef<boolean[]>([]);

  useEffect(() => {
    void getAllProgress().then((p) => {
      progress.current = p;
      setPlan(planSession({ curriculum, progress: p, now: Date.now(), count }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const record = async (id: ItemId, correct: boolean) => {
    const now = Date.now();
    const prev = progress.current.get(id) ?? newProgress(id, now);
    const next = applyAnswer(prev, correct, now);
    progress.current.set(id, next);
    results.current.push(correct);
    await saveProgress(next);
  };

  const done = plan !== null && index >= plan.length;

  useEffect(() => {
    if (!done) return;
    void logSession({
      id: `${activity}-${startedAt.current}`,
      startedAt: startedAt.current,
      endedAt: Date.now(),
      activity,
      items: plan!.length,
    });
  }, [done, activity, plan]);

  return {
    plan,
    index,
    current: plan?.[index] ?? null,
    done,
    recent: results.current,
    progress: progress.current,
    record,
    next: () => setIndex((i) => i + 1),
  };
}

/** Bland en liste (Fisher-Yates). */
export function shuffle<T>(xs: T[], rng = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
