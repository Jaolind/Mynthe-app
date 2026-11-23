import { useEffect, useMemo, useRef, useState } from 'react';
import { Art } from '../art/Art';
import { audio } from '../audio/AudioEngine';
import { say, sayAll, stopVoice } from '../audio/voice';
import type { ItemId } from '../engine/types';
import { ActivityShell } from './ActivityShell';
import { pickN } from './choices';
import { EndScreen } from './EndScreen';
import { PipReaction } from './Feedback';
import { useSession } from './useSession';

/**
 * Pips ostelager (Tal).
 * count:n = "Hvor mange ostebidder kiggede frem?" (subitizing 1-5)
 * fill:n  = "Læg n ostebidder i ostekassen" (tælle til 10 med en 10-ramme)
 */
const CURRICULUM: ItemId[] = [
  'num:count:2', 'num:fill:2', 'num:count:3', 'num:fill:3', 'num:count:1', 'num:count:4', 'num:fill:4',
  'num:count:5', 'num:fill:5', 'num:fill:6', 'num:fill:7', 'num:fill:8', 'num:fill:9', 'num:fill:10',
];

type Mood = 'idle' | 'yes' | 'oops';

export function TalStation({ onHome }: { onHome: () => void }) {
  const s = useSession('tal', CURRICULUM);
  if (!s.plan) return <div className="screen" />;
  if (s.done) return <EndScreen onHome={onHome} />;
  const [, kind, n] = s.current!.split(':');
  const finish = async (ok: boolean) => {
    await s.record(s.current!, ok);
    s.next();
  };
  const props = { n: Number(n), onDone: finish, onHome, total: s.plan.length, index: s.index };
  return kind === 'count' ? <HowManyRound key={s.index} {...props} /> : <FillRound key={s.index} {...props} />;
}

interface RoundProps {
  n: number;
  onDone: (firstTryCorrect: boolean) => void;
  onHome: () => void;
  total: number;
  index: number;
}

/** Terningmønstre gør små mængder lette at se på én gang. */
const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
};

function HowManyRound({ n, onDone, onHome, total, index }: RoundProps) {
  const options = useMemo(() => {
    const pool = [1, 2, 3, 4, 5].filter((x) => x !== n);
    const count = n <= 2 ? 2 : 3;
    return pickN([n, ...pickN(pool, count - 1)], count).sort((a, b) => a - b);
  }, [n]);
  const [visible, setVisible] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [locked, setLocked] = useState(true);
  const firstTry = useRef(true);

  const show = async () => {
    setLocked(true);
    setVisible(true);
    await say('knurhaar-hvor-mange');
    await new Promise((r) => setTimeout(r, 1200));
    setVisible(false);
    setLocked(false);
  };

  useEffect(() => {
    void show();
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = async (x: number) => {
    if (locked) return;
    setLocked(true);
    if (x === n) {
      setVisible(true);
      setMood('yes');
      void audio.play('test-3');
      await sayAll([`tal-${n}`, 'pip-ost']);
      onDone(firstTry.current);
    } else {
      firstTry.current = false;
      setMood('oops');
      await say('pip-ups');
      setMood('idle');
      await show();
    }
  };

  return (
    <ActivityShell onHome={onHome} onRepeat={() => !locked && void show()} total={total} index={index}>
      <div className="cheese-field" aria-hidden>
        <div className={`cheese-field__cover ${visible ? '' : 'cheese-field__cover--on'}`}>
          <Art id="pip-kigger" />
        </div>
        {DICE[n].map(([x, y], i) => (
          <span key={i} className={`cheese ${visible ? 'cheese--on' : ''}`} style={{ left: `${x}%`, top: `${y}%` }}>
            <Art id="ostebid" />
          </span>
        ))}
      </div>
      <div className="numbers">
        {options.map((x) => (
          <button key={x} type="button" className="number-btn" aria-label={`${x}`} data-correct={x === n} onClick={() => void answer(x)}>
            {x}
          </button>
        ))}
      </div>
      <PipReaction mood={mood} />
    </ActivityShell>
  );
}

function FillRound({ n, onDone, onHome, total, index }: RoundProps) {
  const [placed, setPlaced] = useState(0);
  const [mood, setMood] = useState<Mood>('idle');
  const [locked, setLocked] = useState(true);
  const firstTry = useRef(true);

  const prompt = () => sayAll(['knurhaar-laeg-i-kassen', `tal-${n}`]);
  useEffect(() => {
    void prompt().then(() => setLocked(false));
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = () => {
    if (locked || placed >= 10) return;
    const k = placed + 1;
    setPlaced(k);
    stopVoice();
    void say(`tal-${k}`);
  };
  const remove = () => {
    if (locked || placed === 0) return;
    setPlaced(placed - 1);
  };
  const check = async () => {
    if (locked) return;
    setLocked(true);
    if (placed === n) {
      setMood('yes');
      void audio.play('test-3');
      await sayAll(['pip-jubel']);
      onDone(firstTry.current);
    } else {
      firstTry.current = false;
      setMood('oops');
      await say('pip-ups');
      await prompt();
      setMood('idle');
      setLocked(false);
    }
  };

  return (
    <ActivityShell onHome={onHome} onRepeat={() => !locked && void prompt()} total={total} index={index}>
      <div className="target-number" aria-label={`Læg ${n}`} data-n={n}>
        {n}
      </div>
      <div className="ten-frame" role="group" aria-label="Ostekassen">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`ten-frame__slot ${i < placed ? 'ten-frame__slot--full' : ''}`}
            aria-label={i < placed ? 'Tag en ostebid op' : 'Tom plads'}
            onClick={() => i < placed && remove()}
          >
            {i < placed && <Art id="ostebid" />}
          </button>
        ))}
      </div>
      <div className="fill-actions">
        <button type="button" className="cheese-pile" aria-label="Læg en ostebid i kassen" onClick={add}>
          <Art id="ostebid" />
          <Art id="ostebid" />
          <Art id="ostebid" />
        </button>
        <button type="button" className="done-btn" aria-label="Færdig" onClick={() => void check()}>
          ✓
        </button>
      </div>
      <PipReaction mood={mood} />
    </ActivityShell>
  );
}
