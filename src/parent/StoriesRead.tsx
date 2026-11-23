import { useEffect, useState } from 'react';
import { STORIES, TREASURE } from '../content/stories';
import { getStoriesRead, setStoryRead } from '../storage/db';

/** Den voksne markerer, hvilke historier der er læst. Først da låses de op i skattekisten. */
export function StoriesRead() {
  const [read, setRead] = useState<Set<number>>(new Set());
  useEffect(() => void getStoriesRead().then(setRead), []);
  return (
    <ul className="stories-list">
      {STORIES.map((s) => (
        <li key={s.nr}>
          <label>
            <input
              type="checkbox"
              checked={read.has(s.nr)}
              onChange={(e) => {
                const on = e.target.checked;
                setRead((prev) => {
                  const next = new Set(prev);
                  if (on) next.add(s.nr);
                  else next.delete(s.nr);
                  return next;
                });
                void setStoryRead(s.nr, on);
              }}
            />
            <span>
              {s.nr}. {s.title} <span aria-hidden>{TREASURE[s.nr].emoji}</span>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
