import { useMemo, useState } from 'react';
import { HomeButton } from '../ui/HomeButton';

/**
 * Forældrelås: et gangestykke, som en 5-7-årig ikke kan løse, med fire svarmuligheder.
 * (I fase 1 tilføjes en indtalt "Hent en voksen".)
 */
export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const q = useMemo(() => makeQuestion(), [attempt]);
  const [wrong, setWrong] = useState(false);

  return (
    <div className="screen parent-gate">
      <HomeButton onHome={onCancel} />
      <p className="gate-hint">For voksne</p>
      <h1 className="gate-q">
        {q.a} × {q.b} = ?
      </h1>
      <div className="gate-choices">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            className="gate-choice"
            onClick={() => {
              if (c === q.a * q.b) onPass();
              else {
                setWrong(true);
                setAttempt((n) => n + 1);
              }
            }}
          >
            {c}
          </button>
        ))}
      </div>
      {wrong && <p className="gate-hint">Prøv igen</p>}
    </div>
  );
}

function makeQuestion() {
  const r = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
  const a = r(6, 9);
  const b = r(6, 9);
  const answer = a * b;
  const set = new Set<number>([answer]);
  while (set.size < 4) {
    const d = answer + r(-12, 12);
    if (d > 20 && d !== answer) set.add(d);
  }
  const choices = [...set].sort(() => Math.random() - 0.5);
  return { a, b, choices };
}
