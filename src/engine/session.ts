/** Sengetidslås: appen "sover" fra et klokkeslæt til kl. 06. */
export function isBedtime(now: Date, lockFrom: string, wakeAt = '06:00'): boolean {
  const toMin = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };
  const cur = now.getHours() * 60 + now.getMinutes();
  const from = toMin(lockFrom);
  const wake = toMin(wakeAt);
  return from > wake ? cur >= from || cur < wake : cur >= from && cur < wake;
}
