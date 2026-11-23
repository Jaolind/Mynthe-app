import { useState } from 'react';
import { Art, Backdrop } from '../art/Art';
import type { ArtId } from '../art/assets';
import { audio } from '../audio/AudioEngine';

export type Station = 'lyde' | 'tal' | 'bog';

/**
 * Hjemskærmen: dækket på skibet Hvorfor.
 * Lertavlen = Lyde, ostekassen = Tal, skattekisten = Bogen.
 * Knurhår og Pip reagerer, når man trykker på dem.
 */
export function DeckScreen({ onGo, onParent }: { onGo: (s: Station) => void; onParent: () => void }) {
  const [cat, setCat] = useState<ArtId>('knurhaar-nysgerrig');
  const [pip, setPip] = useState<'pip-kigger' | 'pip-jubler'>('pip-kigger');
  const [spin, setSpin] = useState(0);

  const pose = <T extends string>(set: (v: T) => void, active: T, rest: T, ms = 1600) => {
    set(active);
    setTimeout(() => set(rest), ms);
  };

  return (
    <div className="stage deck">
      <Backdrop id="bg-daek-dag" />

      <button
        type="button"
        className="deck__item deck__compass"
        aria-label="Spørgekompasset"
        onClick={() => {
          setSpin((s) => s + 1);
          void audio.play('test-melodi');
        }}
      >
        <Art id="kompas-hus" className="compass__body" />
        <span className="compass__needle" style={{ transform: `rotate(${spin * 720 + 30}deg)` }}>
          <Art id="kompas-naal" />
        </span>
      </button>

      <button
        type="button"
        className="deck__item deck__cat"
        aria-label="Kaptajn Knurhår"
        onClick={() => {
          pose(setCat, 'knurhaar-hilser' as ArtId, 'knurhaar-nysgerrig' as ArtId);
          void audio.play('test-1');
        }}
      >
        <Art id={cat} className="idle-bob" />
      </button>

      <button
        type="button"
        className={`deck__item deck__pip ${pip === 'pip-jubler' ? 'pip--up' : ''}`}
        aria-label="Pip"
        onClick={() => {
          pose(setPip, 'pip-jubler', 'pip-kigger', 1200);
          void audio.play('test-3');
        }}
      >
        <Art id={pip} />
      </button>

      <button type="button" className="deck__item deck__station deck__tablet" aria-label="Pips skrivetavle" onClick={() => onGo('lyde')}>
        <Art id="lertavle" />
      </button>
      <button type="button" className="deck__item deck__station deck__cheese" aria-label="Pips ostelager" onClick={() => onGo('tal')}>
        <Art id="ostekasse" />
      </button>
      <button type="button" className="deck__item deck__station deck__chest" aria-label="Skattekisten" onClick={() => onGo('bog')}>
        <Art id="skattekiste-lukket" />
      </button>

      <button type="button" className="parent-corner" aria-label="For voksne" onClick={onParent}>
        ⚙︎
      </button>
    </div>
  );
}
