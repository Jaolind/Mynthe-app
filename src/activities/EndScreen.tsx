import { useEffect } from 'react';
import { Art } from '../art/Art';
import { say } from '../audio/voice';
import { BigButton } from '../ui/BigButton';

/** Slutskærm: en rolig afslutning og hjem. Intet "spil igen". */
export function EndScreen({ onHome }: { onHome: () => void }) {
  useEffect(() => {
    void say('knurhaar-godt-arbejde');
  }, []);
  return (
    <div className="screen end">
      <Art id="knurhaar-glad" className="end__cat idle-bob" />
      <p className="big-text">Godt arbejde i dag!</p>
      <BigButton tone="sea" size="md" aria-label="Tilbage til skibet" onClick={onHome}>
        ⚓
      </BigButton>
    </div>
  );
}
