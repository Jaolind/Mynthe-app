import { useEffect, useMemo, useRef, useState } from 'react';
import { Art } from '../art/Art';
import { audio } from '../audio/AudioEngine';
import { say, sayAll, stopVoice } from '../audio/voice';
import { LETTER_IDS, type Word } from '../content/letters';
import { nextChoiceCount } from '../engine/scheduler';
import type { ItemId } from '../engine/types';
import { ActivityShell } from './ActivityShell';
import { letterChoices, onsetChoices } from './choices';
import { EndScreen } from './EndScreen';
import { PipReaction } from './Feedback';
import { useSession } from './useSession';

/** Forlyd før bogstav: for hvert bogstav kommer "Hvad starter med …?" før "Hvilket tegn …?". */
const CURRICULUM: ItemId[] = LETTER_IDS.flatMap((id) => [`onset:${id}`, `letter:${id}`] as ItemId[]);

type Mood = 'idle' | 'yes' | 'oops';

/** Pips skrivetavle (Lyde). */
export function LydeStation({ onHome }: { onHome: () => void }) {
  const s = useSession('lyde', CURRICULUM);
  const [choiceCount, setChoiceCount] = useState(2);

  if (!s.plan) return <div className="screen" />;
  if (s.done) return <EndScreen onHome={onHome} />;

  const [kind, letter] = s.current!.split(':') as ['onset' | 'letter', string];
  const known = [...s.progress.keys()].filter((k) => k.startsWith('letter:')).map((k) => k.slice(7));

  const finish = async (firstTryCorrect: boolean) => {
    await s.record(s.current!, firstTryCorrect);
    setChoiceCount((c) => nextChoiceCount(c, s.recent));
    s.next();
  };

  return kind === 'onset' ? (
    <OnsetRound key={s.index} letter={letter} count={choiceCount} onDone={finish} onHome={onHome} total={s.plan.length} index={s.index} />
  ) : (
    <LetterRound
      key={s.index}
      letter={letter}
      count={choiceCount}
      known={known}
      onDone={finish}
      onHome={onHome}
      total={s.plan.length}
      index={s.index}
    />
  );
}

interface RoundProps {
  letter: string;
  count: number;
  onDone: (firstTryCorrect: boolean) => void;
  onHome: () => void;
  total: number;
  index: number;
}

/** Fælles logik: første forsøg tæller; efter to fejl vises det rigtige svar blidt. */
function useRound(onDone: (ok: boolean) => void, prompt: () => Promise<void>) {
  const [mood, setMood] = useState<Mood>('idle');
  const [misses, setMisses] = useState(0);
  const [locked, setLocked] = useState(true);
  const firstTry = useRef(true);

  useEffect(() => {
    void prompt().then(() => setLocked(false));
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = async (correct: boolean) => {
    if (locked) return;
    setLocked(true);
    if (correct) {
      setMood('yes');
      void audio.play('test-3');
      await say('pip-jubel');
      onDone(firstTry.current);
      return;
    }
    firstTry.current = false;
    setMood('oops');
    setMisses((m) => m + 1);
    await say('pip-ups');
    await prompt();
    setMood('idle');
    setLocked(false);
  };

  return { mood, misses, locked, answer };
}

function OnsetRound({ letter, count, onDone, onHome, total, index }: RoundProps) {
  const { answer: target, options } = useMemo(() => onsetChoices(letter, count), [letter, count]);
  const [lit, setLit] = useState<string | null>(null);

  const prompt = async () => {
    await sayAll(['knurhaar-starter-med', `lyd-${letter}`]);
    for (const w of options) {
      setLit(w.id);
      await say(`ord-${w.id}`);
    }
    setLit(null);
  };
  const r = useRound(onDone, prompt);

  return (
    <ActivityShell onHome={onHome} onRepeat={() => !r.locked && void prompt()} total={total} index={index}>
      <div className="round-head">
        <Art id="knurhaar-lytter" className="round-head__cat" />
        {/* Forlyd trænes på lyden alene, uden at vise bogstavet. */}
        <div className="sound-bubble" aria-hidden>
          👂
        </div>
      </div>
      <div className={`cards cards--${options.length}`}>
        {options.map((w: Word) => (
          <button
            key={w.id}
            type="button"
            aria-label={w.text}
            data-correct={w.id === target.id}
            className={`card-btn ${lit === w.id ? 'card-btn--lit' : ''} ${r.misses >= 2 && w.id === target.id ? 'card-btn--hint' : ''}`}
            onClick={() => void r.answer(w.id === target.id)}
          >
            <span className="card-emoji">{w.emoji}</span>
          </button>
        ))}
      </div>
      <PipReaction mood={r.mood} />
    </ActivityShell>
  );
}

function LetterRound({ letter, count, known, onDone, onHome, total, index }: RoundProps & { known: string[] }) {
  const options = useMemo(() => letterChoices(letter, count, known), [letter, count, known]);
  const [scratched, setScratched] = useState(false);
  const prompt = () => sayAll(['knurhaar-hvilket-tegn', `lyd-${letter}`]);
  const r = useRound((ok) => {
    setScratched(true);
    setTimeout(() => onDone(ok), 900);
  }, prompt);

  return (
    <ActivityShell onHome={onHome} onRepeat={() => !r.locked && void prompt()} total={total} index={index}>
      <div className="tablet-big" aria-hidden>
        <Art id="lertavle" className="tablet-big__art" />
        <span className={`tablet-big__letter ${scratched ? 'tablet-big__letter--on' : ''}`}>{letter}</span>
      </div>
      <div className={`letters letters--${options.length}`}>
        {options.map((l) => (
          <button
            key={l}
            type="button"
            aria-label={`Bogstavet ${l}`}
            data-correct={l === letter}
            className={`letter-btn ${r.misses >= 2 && l === letter ? 'letter-btn--hint' : ''}`}
            onClick={() => void r.answer(l === letter)}
          >
            {l}
          </button>
        ))}
      </div>
      <PipReaction mood={r.mood} />
    </ActivityShell>
  );
}

