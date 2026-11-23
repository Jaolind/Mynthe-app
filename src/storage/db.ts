import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ItemId, ItemProgress } from '../engine/types';
import type { AudioMode } from '../audio/AudioEngine';

export interface Settings {
  bedtimeLockFrom: string; // "19:00"
  sessionMinutes: number; // 10
  useParentVoice: boolean;
  audioMode: AudioMode;
}

export const DEFAULT_SETTINGS: Settings = {
  bedtimeLockFrom: '19:00',
  sessionMinutes: 10,
  useParentVoice: true,
  audioMode: 'webaudio',
};

export interface SessionLog {
  id: string;
  startedAt: number;
  endedAt: number;
  activity: string;
  items: number;
}

/** Forælderens optagelser bliver på enheden og sendes aldrig nogen steder hen. */
export interface Recording {
  id: string; // fx "knurhaar-hej" eller "lyd-m" (se src/content/voices.ts)
  blob: Blob;
  recordedAt: number;
}

/** En historie fra bogen, som den voksne har læst for Mynthe. */
export interface StoryRead {
  nr: number;
  readAt: number;
}

interface MyntheDB extends DBSchema {
  progress: { key: ItemId; value: ItemProgress };
  sessions: { key: string; value: SessionLog; indexes: { byStart: number } };
  settings: { key: 'settings'; value: Settings };
  recordings: { key: string; value: Recording };
  storiesRead: { key: number; value: StoryRead };
}

let dbPromise: Promise<IDBPDatabase<MyntheDB>> | null = null;

export function db() {
  dbPromise ??= openDB<MyntheDB>('mynthe', 2, {
    upgrade(d, oldVersion) {
      if (oldVersion < 1) {
        d.createObjectStore('progress', { keyPath: 'id' });
        const s = d.createObjectStore('sessions', { keyPath: 'id' });
        s.createIndex('byStart', 'startedAt');
        d.createObjectStore('settings');
      }
      if (oldVersion < 2) {
        // v1 havde en tom optagelses-store med nøglen "letter". Den erstattes.
        if (d.objectStoreNames.contains('recordings')) d.deleteObjectStore('recordings');
        d.createObjectStore('recordings', { keyPath: 'id' });
        d.createObjectStore('storiesRead', { keyPath: 'nr' });
      }
    },
  });
  return dbPromise;
}

export async function getSettings(): Promise<Settings> {
  const s = await (await db()).get('settings', 'settings');
  return { ...DEFAULT_SETTINGS, ...s };
}

export async function saveSettings(s: Settings) {
  await (await db()).put('settings', s, 'settings');
}

export async function getAllProgress(): Promise<Map<ItemId, ItemProgress>> {
  const all = await (await db()).getAll('progress');
  return new Map(all.map((p) => [p.id, p]));
}

export async function saveProgress(p: ItemProgress) {
  await (await db()).put('progress', p);
}

export async function logSession(s: SessionLog) {
  await (await db()).put('sessions', s);
}

/** Beder browseren om ikke at slette data under pladspres (vigtigt på iOS). */
export async function requestPersistence(): Promise<boolean | null> {
  if (!navigator.storage?.persist) return null;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}

export async function isPersisted(): Promise<boolean | null> {
  if (!navigator.storage?.persisted) return null;
  return navigator.storage.persisted();
}

export async function getRecording(id: string) {
  return (await db()).get('recordings', id);
}

export async function getAllRecordingIds(): Promise<Set<string>> {
  return new Set(await (await db()).getAllKeys('recordings'));
}

export async function saveRecording(r: Recording) {
  await (await db()).put('recordings', r);
}

export async function deleteRecording(id: string) {
  await (await db()).delete('recordings', id);
}

export async function getStoriesRead(): Promise<Set<number>> {
  return new Set(await (await db()).getAllKeys('storiesRead'));
}

export async function setStoryRead(nr: number, read: boolean) {
  const d = await db();
  if (read) await d.put('storiesRead', { nr, readAt: Date.now() });
  else await d.delete('storiesRead', nr);
}
