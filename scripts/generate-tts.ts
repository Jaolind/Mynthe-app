// Genererer danske lydfiler med Azure Speech (REST) ud fra src/content/phrases.ts.
// Kør på din egen computer: `npm run tts`. Nøglen ligger i .env og committes aldrig.
// Filer, der allerede findes, springes over. Slet en fil for at generere den igen.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { PHRASES } from '../src/content/phrases.ts';

function loadEnv() {
  const p = new URL('../.env', import.meta.url);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION ?? 'northeurope';
const voice = process.env.AZURE_SPEECH_VOICE ?? 'da-DK-ChristelNeural';
if (!key) {
  console.error('Mangler AZURE_SPEECH_KEY i .env (se .env.example).');
  process.exit(1);
}

const escapeXml = (s: string) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

let made = 0;
for (const p of PHRASES) {
  const dir = new URL(`../public/audio/${p.folder}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  const file = new URL(`${p.id}.mp3`, dir);
  if (existsSync(file)) continue;

  // Lidt langsommere tale er lettere at forstå for 5-7-årige.
  const ssml = `<speak version="1.0" xml:lang="da-DK"><voice name="${voice}"><prosody rate="-10%">${escapeXml(p.text)}</prosody></voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'mynthe-app-tts',
    },
    body: ssml,
  });
  if (!res.ok) {
    console.error(`Fejl for "${p.id}": ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  made++;
  console.log(`✔ ${p.folder}/${p.id}.mp3`);
}
console.log(made ? `${made} nye lydfiler.` : 'Alle lydfiler findes allerede.');
