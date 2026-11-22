import { useMemo, useState } from 'react';
import { HomeButton } from '../ui/HomeButton';
import { makeGateChallenge } from './gate';

/**
 * Forældrelås: "Tryk på fire, otte, to".
 * Let for en voksen, der kan læse. Svært for et barn, der endnu ikke læser,
 * fordi tallene står som ord, og der er ingen oplæsning.
 * Når Mynthe begynder at læse talord, kan låsen skiftes til en PIN-kode (se ROADMAP).
 */
export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [round, setRound] = useState(0);
  const challenge = useMemo(() => makeGateChallenge(), [round]);
  const [entered, setEntered] = useState<number[]>([]);
  const [wrong, setWrong] = useState(false);

  const press = (n: number) => {
    const next = [...entered, n];
    if (challenge.digits[next.length - 1] !== n) {
      setWrong(true);
      setEntered([]);
      setRound((r) => r + 1);
      return;
    }
    if (next.length === challenge.digits.length) onPass();
    else setEntered(next);
  };

  return (
    <div className="screen parent-gate">
      <HomeButton onHome={onCancel} />
      <p className="gate-hint">For voksne: tryk på tallene i rækkefølge</p>
      <h1 className="gate-q">{challenge.words.join(', ')}</h1>
      <div className="gate-dots" aria-hidden>
        {challenge.digits.map((_, i) => (
          <span key={i} className={i < entered.length ? 'dot dot--on' : 'dot'} />
        ))}
      </div>
      <div className="gate-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} type="button" className="gate-choice" onClick={() => press(n)}>
            {n}
          </button>
        ))}
      </div>
      {wrong && <p className="gate-hint">Prøv igen</p>}
    </div>
  );
}
