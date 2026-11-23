import { Art } from '../art/Art';

/** Tidstågen: glider hen over skærmen ved skift mellem steder på skibet. */
export function Fog({ active }: { active: boolean }) {
  return (
    <div className={`fog ${active ? 'fog--on' : ''}`} aria-hidden>
      <Art id="taage" className="fog__img" />
    </div>
  );
}
