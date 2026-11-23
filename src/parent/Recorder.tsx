import { useEffect, useRef, useState } from 'react';
import { invalidateVoice, say, stopVoice } from '../audio/voice';
import { SPEAKER_LABEL, VOICE_LINES, type Speaker } from '../content/voices';
import { deleteRecording, getAllRecordingIds, saveRecording } from '../storage/db';

const GROUPS: Speaker[] = ['knurhaar', 'pip', 'lyd', 'bog', 'ord', 'tal'];
const HINT: Record<Speaker, string> = {
  knurhaar: 'Rolig og nysgerrig.',
  pip: 'Lidt lysere og kvik.',
  bog: 'Ordret som i bogen. Pip siger den forkert, Knurhår rigtigt.',
  lyd: 'Sig kun LYDEN, ikke navnet: "mmm", ikke "æm". Korte vokaler: "a", ikke "aaa".',
  ord: 'Sig ordet tydeligt én gang.',
  tal: 'Sig tallet tydeligt én gang.',
};

function pickMime() {
  const options = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];
  return options.find((m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m));
}

/** Optager i forældreområdet: den voksne indtaler figurernes replikker og bogstavlydene. */
export function Recorder() {
  const [have, setHave] = useState<Set<string>>(new Set());
  const [recording, setRecording] = useState<string | null>(null);
  const [open, setOpen] = useState<Speaker | null>('knurhaar');
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);

  const refresh = () => void getAllRecordingIds().then(setHave);
  useEffect(refresh, []);
  useEffect(() => () => rec.current?.stream.getTracks().forEach((t) => t.stop()), []);

  const start = async (id: string) => {
    setError(null);
    stopVoice();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mimeType = pickMime();
      const r = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: r.mimeType || mimeType || 'audio/mp4' });
        if (blob.size > 0) {
          await saveRecording({ id, blob, recordedAt: Date.now() });
          invalidateVoice(id);
          refresh();
          void say(id);
        }
        setRecording(null);
      };
      rec.current = r;
      r.start();
      setRecording(id);
    } catch (e) {
      setError(`Mikrofonen kunne ikke startes: ${String(e)}. Tjek, at appen må bruge mikrofonen.`);
      setRecording(null);
    }
  };

  const stop = () => rec.current?.state === 'recording' && rec.current.stop();

  return (
    <div className="recorder">
      <p className="muted">
        Tryk ● og tal, tryk ■ når du er færdig. Optagelsen afspilles bagefter. Det, du ikke har indtalt, læser telefonen op med
        computerstemmen.
      </p>
      {error && <p className="error">{error}</p>}
      {GROUPS.map((g) => {
        const lines = VOICE_LINES.filter((l) => l.speaker === g);
        const done = lines.filter((l) => have.has(l.id)).length;
        return (
          <div key={g} className="rec-group">
            <button type="button" className="rec-group__head" onClick={() => setOpen(open === g ? null : g)}>
              <span>{SPEAKER_LABEL[g]}</span>
              <span className="muted">
                {done}/{lines.length} {open === g ? '▾' : '▸'}
              </span>
            </button>
            {open === g && (
              <>
                <p className="muted small">{HINT[g]}</p>
                <ul className="rec-list">
                  {lines.map((l) => (
                    <li key={l.id} className={have.has(l.id) ? 'rec--done' : ''}>
                      <span className="rec-text">
                        {have.has(l.id) ? '✅ ' : ''}
                        {l.text}
                      </span>
                      <span className="rec-actions">
                        {recording === l.id ? (
                          <button type="button" className="small-btn rec-stop" onClick={stop} aria-label="Stop optagelse">
                            ■
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="small-btn rec-start"
                            disabled={!!recording}
                            onClick={() => void start(l.id)}
                            aria-label={`Optag: ${l.text}`}
                          >
                            ●
                          </button>
                        )}
                        <button type="button" className="small-btn" onClick={() => void say(l.id)} aria-label={`Afspil: ${l.text}`}>
                          ▶
                        </button>
                        {have.has(l.id) && (
                          <button
                            type="button"
                            className="small-btn"
                            aria-label={`Slet: ${l.text}`}
                            onClick={async () => {
                              await deleteRecording(l.id);
                              invalidateVoice(l.id);
                              refresh();
                            }}
                          >
                            🗑
                          </button>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
