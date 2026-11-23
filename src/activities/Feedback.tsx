import { Art } from '../art/Art';

/** Pip reagerer: jubler ved rigtigt svar, "ups" ved forkert. Fejlen er Pips, ikke barnets. */
export function PipReaction({ mood }: { mood: 'idle' | 'yes' | 'oops' }) {
  const id = mood === 'yes' ? 'pip-jubler' : mood === 'oops' ? 'pip-ups' : 'pip-kigger';
  return (
    <div className={`pip-reaction pip-reaction--${mood}`} aria-hidden>
      <Art id={id} />
    </div>
  );
}
