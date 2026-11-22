/** Altid synlig hjem-knap. */
export function HomeButton({ onHome }: { onHome: () => void }) {
  return (
    <button type="button" className="icon-btn home-btn" aria-label="Hjem" onClick={onHome}>
      <span aria-hidden>🏠</span>
    </button>
  );
}
