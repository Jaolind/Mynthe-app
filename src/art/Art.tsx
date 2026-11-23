import { useState, type CSSProperties } from 'react';
import { ART, artUrl, type ArtId } from './assets';

interface Props {
  id: ArtId;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

/** Viser en illustration, eller en pladsholder, hvis billedet endnu ikke findes. */
export function Art({ id, className = '', style, alt = '' }: Props) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <span className={`art art--placeholder ${className}`} style={style} aria-hidden={!alt} aria-label={alt || undefined}>
        {ART[id].fallback}
      </span>
    );
  }
  return (
    <img
      className={`art ${className}`}
      style={style}
      src={artUrl(id)}
      alt={alt}
      draggable={false}
      onError={() => setMissing(true)}
    />
  );
}

/** Baggrund: billede hvis det findes, ellers en malet CSS-pladsholder. */
export function Backdrop({ id }: { id: 'bg-daek-dag' | 'bg-daek-nat' }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className={`backdrop backdrop--${ART[id].fallback}`} aria-hidden>
      {!missing && <img src={artUrl(id)} alt="" draggable={false} onError={() => setMissing(true)} />}
      {missing && (
        <>
          <div className="backdrop__sky" />
          <div className="backdrop__sea" />
          <div className="backdrop__deck" />
          <div className="backdrop__mast" />
          <div className="backdrop__sail">?</div>
        </>
      )}
    </div>
  );
}
