# Byggeplan: Mynthe-appen

> Et dansk, offline og reklamefrit læringsspil til en 5–7-årig, med to spor: **Lyde** og **Tal**.
> Bygger på rapporten [`docs/research-rapport.md`](research-rapport.md).

---

## 1. Produktet på én side

| | |
|---|---|
| **Hvem** | Mynthe (5–7 år, 0.–1. klasse) og en voksen ved siden af |
| **Hvad** | Korte daglige sessioner (ca. 10 min) med én tydelig afslutning |
| **Spor** | **Lyde** (forlyd, bogstavlyde, lydering) og **Tal** (subitizing, tælle, mængder, tals venner) |
| **Platform** | PWA på familiens telefon, lagt på hjemmeskærmen og låst med Guided Access |
| **Data** | Kun lokalt på telefonen (IndexedDB). Ingen server, analytics, login eller reklamer |
| **Stemme** | Forælderen indtaler bogstavlydene. Ord og sætninger laves på forhånd med dansk TTS (Azure/Google) |

### Fem faste designregler (gælder for hver eneste skærm)
1. **Ét læringsmål pr. aktivitet.** Ingen pynt-animationer, der stjæler opmærksomheden.
2. **Alt er indtalt.** Barnet skal aldrig læse en instruktion. 🔊-knappen gentager altid.
3. **Trykflader på mindst 2 × 2 cm.** Tryk og træk, ingen knib, langt tryk eller multitouch.
4. **Ingen manipulation.** Ingen streaks, nedtællinger, tabte liv, push-beskeder, autoplay af næste bane eller figurer, der "bliver kede af det".
5. **Voksenting bag forældrelås.** Det gælder indstillinger, data, optagelse og eksport.

---

## 2. Teknisk arkitektur

```
React 19 + Vite + TypeScript
├── vite-plugin-pwa (Workbox)  → offline + precache af lyd, font og billeder
├── Howler.js                  → lydafspilning (robust på iOS, med fallback til HTML5-lyd)
├── idb (lille wrapper)        → IndexedDB til fremskridt og optagelser
├── Pointer Events             → træk-og-slip med "snap"-zoner (touch-action: none)
├── Framer Motion (eller CSS)  → rolige overgange
└── Vitest + Playwright        → logik-tests + mobil-e2e
```

**Bevidst fravalgt i MVP:** PixiJS, Capacitor, Expo, Supabase, talegenkendelse.
Det kommer kun ind, hvis et konkret problem kræver det (se risici i afsnit 7).

### Mappestruktur

```
mynthe-app/
├── public/
│   ├── audio/
│   │   ├── lyde/            # forælderens optagelser: m.m4a, s.m4a, …  (fallback)
│   │   ├── ord/             # TTS: mus.mp3, sol.mp3, …
│   │   └── instruktioner/   # TTS: "hvilket-bogstav-siger.mp3", "godt-klaret.mp3", …
│   ├── billeder/            # Kenney CC0 + egne illustrationer (SVG/WebP)
│   └── fonts/andika/        # Andika WOFF2, selvhostet
├── scripts/
│   └── generate-tts.ts      # læser content/*.ts → kalder Azure/Google → public/audio/
├── src/
│   ├── app/                 # App.tsx, router (hjem → spor → aktivitet → slut)
│   ├── audio/               # AudioEngine: unlock, preload, play, queue, optagelse
│   ├── content/             # Indhold som data (ikke kode)
│   │   ├── letters.ts       # bogstaver, rækkefølge, lydfil, eksempelord
│   │   ├── words.ts         # ord, stavelser, billede, lydfil
│   │   └── numbers.ts       # talområder og aktivitetsparametre
│   ├── activities/          # én mappe pr. aktivitet (se afsnit 4)
│   ├── engine/
│   │   ├── mastery.ts       # mestringsmodel pr. "item" (bogstav/tal/ord)
│   │   ├── scheduler.ts     # vælger næste opgave (adaptiv + gentagelse af svage items)
│   │   └── session.ts       # sessionslængde, naturligt stop, sengetidslås
│   ├── storage/             # db.ts (IndexedDB-skema), export.ts, import.ts
│   ├── parent/              # ParentGate, Dashboard, Recorder, Settings
│   └── ui/                  # BigButton, DragTile, DropZone, SpeakerButton, HomeButton
└── tests/                   # vitest (engine) + playwright (iPhone/Pixel-profiler)
```

### Datamodel (IndexedDB)

```ts
type ItemId = `letter:${string}` | `word:${string}` | `num:${string}`;

interface ItemProgress {
  id: ItemId;
  attempts: number;
  correct: number;
  streakInItem: number;    // rigtige i træk på DETTE item (intern, vises aldrig som streak)
  box: 0 | 1 | 2 | 3 | 4;  // Leitner-boks: 0 = ny, 4 = mestret
  lastSeen: number;        // timestamp
  dueAt: number;           // hvornår det skal gentages
}

interface SessionLog { id: string; startedAt: number; endedAt: number; activity: string; items: number; }

interface Settings {
  bedtimeLockFrom: string;   // "19:00"
  sessionMinutes: number;    // 10
  parentPin?: string;        // valgfri ekstra lås udover regnestykket
  useParentVoice: boolean;   // true = brug optagelser frem for fallback-lyd
}

interface Recording { letter: string; blob: Blob; recordedAt: number; } // forbliver på enheden
```

### Adaptiv motor (enkel og forklarlig)
- **Leitner-bokse:** rigtigt svar → item rykker én boks op. Forkert → én ned (aldrig under 1, når det først er introduceret).
- **Gentagelsesintervaller:** boks 1 = samme session, 2 = næste dag, 3 = om 3 dage, 4 = om 7 dage.
- **Scheduler:** ca. 70 % items, der skal gentages ("due"), ca. 20 % items i gang og ca. 10 % nye. Der introduceres højst ét nyt item pr. session.
- **Sværhedsgrad:** antal svarmuligheder 2 → 3 → 4 efter fx 3 rigtige i træk i aktiviteten. Ved 2 forkerte i træk går det ned igen.
- **Fejl:** rolig feedback ("Lyt igen …") og den rigtige lyd afspilles. Ingen straf.
- **Åbning af nyt indhold:** et nyt bogstav åbner, når ≥ 80 % af de eksisterende er i boks ≥ 2.

### Lydpipeline
1. Indholdet står som data i `src/content/*.ts` (ord, sætninger, instruktioner).
2. `npm run tts` kører `scripts/generate-tts.ts` lokalt på din computer. Scriptet:
   - kalder Azure (`da-DK-ChristelNeural`) eller Google Chirp 3 HD med en API-nøgle fra `.env`, som **aldrig** committes
   - springer filer over, der allerede findes (hash af tekst + stemme i filnavnet)
   - skriver til `public/audio/ord` og `public/audio/instruktioner`.
3. Bogstav*lyde* (/m/, /s/ …) optages af forælderen i appens forældreområde (Recorder) og gemmes i IndexedDB. Filerne i `public/audio/lyde/` er en fallback.
4. Service workeren precacher alt, så appen virker 100 % offline.
5. `AudioEngine.unlock()` køres ved det første tryk på startskærmen ("Tryk på solen for at starte"), så lydkonteksten er låst op.

---

## 3. Indholdsprogression

### Lyde
| Trin | Indhold |
|---|---|
| L1 | Forlyd med billeder (hører barnet /s/ i "sol"?), uden bogstaver |
| L2 | Første 10 stabile lyde: **m, s, l, r, a, i, o, u, f, n** |
| L3 | Byg 2–3-bogstavsord: *is, os, mus, sol, ris, ral, fil, ni, nu, mor, far* |
| L4 | Resten af alfabetet (uden q, w, x, z), introduceret ét ad gangen |
| L5 | Vokalvariation (lang/kort, e/æ), *hv-*, *-nd*, lille bank af hyppige ord (*jeg, og, er, en, det*) |

### Tal
| Trin | Indhold |
|---|---|
| T1 | Subitizing 1–5 (prikker vises kort): "Hvor mange?" |
| T2 | Tæl og træk objekter 1–10, én-til-én |
| T3 | Sammenlign mængder: "Hvor er der flest?" |
| T4 | Tals venner til 10 med klodser (5+5, 7+3 …) |
| T5 | 11–20, tallinje, plus/minus inden for 20 |

---

## 4. Aktiviteter i MVP

Alle aktiviteter deler samme skabelon: **instruktion (lyd) → opgave → feedback → næste** (5–8 opgaver), og derefter en slutskærm.

| ID | Spor | Mekanik | Gestus |
|---|---|---|---|
| `forlyd` | Lyde | Hør et ord + se 2–4 billeder: "Hvad starter med /s/?" | Tryk |
| `hvilket-bogstav` | Lyde | Hør en lyd + vælg mellem 2–4 store bogstaver | Tryk |
| `byg-ordet` | Lyde | Se et billede + hør ordet, træk bogstaverne på plads. Hvert bogstav siger sin lyd, når det rører feltet | Træk |
| `hvor-mange` | Tal | Prikker vises i 1,5 sek. Vælg det rigtige tal | Tryk |
| `tael-og-traek` | Tal | "Læg 6 æbler i kurven." Tallet tælles højt for hvert æble | Træk |
| `tals-venner` | Tal | Fyld en 10-ramme med to farver klodser | Træk |

**Slutskærm:** Et rolig "Godt arbejde i dag!" og et klistermærke, der kun gives, når et item når en ny boks (mestring, ikke tid). Derefter **hjem**, ikke "spil igen".

---

## 5. Faseplan med opgaver

Hver fase har et **slutkriterium**. Gå ikke videre, før det er opfyldt.

### Fase 0: Fundament (1 weekend)
- [ ] Nyt repo `mynthe-app` (Vite React-TS skabelon), ESLint, Prettier, Vitest
- [ ] `vite-plugin-pwa`: manifest (navn, ikon, `display: standalone`, `orientation: portrait`), precache
- [ ] Andika WOFF2 selvhostet, grundtema (stor tekst, høj kontrast, rolige farver)
- [ ] `AudioEngine` med unlock, preload og play via Howler. Test med 3 testlyde
- [ ] `db.ts`: IndexedDB-skema + `navigator.storage.persist()`
- [ ] UI-primitiver: `BigButton`, `SpeakerButton`, `HomeButton`
- [ ] Deploy til GitHub Pages eller Netlify (gratis HTTPS, kræves for PWA)
- [ ] **Test på familiens telefon:** læg på hjemmeskærmen, slå flytilstand til, prøv lydløs-kontakten til/fra, slå Guided Access til

**Slutkriterium:** Lyd afspilles pålideligt fra hjemmeskærmsikonet, også offline og med lydløs-kontakten i begge positioner. Hvis ikke → prøv HTML5-lyd. Hvis det stadig fejler → Capacitor (se risici).

### Fase 1: Lyde v1 (2–3 weekender)
- [ ] `content/letters.ts` + `content/words.ts` for L1–L3
- [ ] `scripts/generate-tts.ts` + generér ord og instruktioner
- [ ] Forældrelås (regnestykke + indtalt "Hent en voksen") og simpel `Recorder` til bogstavlyde
- [ ] `engine/mastery.ts` + `engine/scheduler.ts` med unit-tests
- [ ] Aktiviteter: `forlyd`, `hvilket-bogstav`, `byg-ordet` (`DragTile` + `DropZone` med generøs snap)
- [ ] Sessionsflow: hjem → Lyde → 6 opgaver → slutskærm
- [ ] **Brugertest med Mynthe:** 3 sessioner. Se uden at hjælpe. Notér, hvor hun går i stå

**Slutkriterium:** Mynthe navigerer selv, og du kan (internt) se, hvilke lyde der sidder.

### Fase 2: Tal v1 (2 weekender)
- [ ] `content/numbers.ts` (T1–T4)
- [ ] Aktiviteter: `hvor-mange`, `tael-og-traek`, `tals-venner`
- [ ] Hjemskærm med to store spor-knapper (🔤 Lyde / 🔢 Tal) og et illustreret valg uden tekst
- [ ] Brugertest med Mynthe

**Slutkriterium:** Sikker til 10 → appen åbner selv 11–20.

### Fase 3: Forældreområde og rytme (1 weekend)
- [ ] Dashboard: mestring pr. bogstav og tal (grøn/gul/grå + ikon, ikke kun farve), seneste sessioner
- [ ] Optag/genoptag lyde, afspil til kontrol
- [ ] JSON-eksport/-import (fremskridt + indstillinger; optagelser valgfrit som zip)
- [ ] Sengetidslås ("Nu sover appen, vi ses i morgen" + illustration) og sessionslængde
- [ ] "Gør det sammen"-kort: et forslag til en offline-aktivitet efter hver session

**Slutkriterium:** Data overlever en uge uden tab. Eksport → slet → import er testet.

### Fase 4: Udvidelse (løbende)
- [ ] L4–L5 og T5, nye ord og billeder
- [ ] Klistermærkebog (kun knyttet til mestring)
- [ ] Følg med i Mynthes skoleforløb. Tilpas rækkefølgen efter, hvad klassen arbejder med

### Fase 5: Valgfri deling (kun hvis I ønsker det)
- [ ] Capacitor-wrapper, privatlivspolitik ("Data Not Collected")
- [ ] Apple Kids Category (6–8 år) / Google Play Families
- [ ] Skift eventuelt TTS-licens (Azure/Google er OK til udgivelse, ElevenLabs' gratis niveau er ikke)

---

## 6. Test og evaluering

| Hvad | Hvordan |
|---|---|
| Motorlogik | Vitest: mastery, scheduler, sessionsstop, sengetidslås |
| UI på mobil | Playwright med `iPhone 13`- og `Pixel 7`-profiler: trykflader ≥ 2 cm, træk virker, offline-load |
| Rigtig enhed | Hver fase slutter på familiens telefon fra hjemmeskærmen |
| Læring | **Papirtest hver 4. uge** (ikke appens egne tal): vis 10 bogstaver → sig lyden. Lydér 5 ord. Tæl til X. Skriv resultatet ind i forældreområdet |
| Trivsel | Notér, om sessionen slutter roligt. Hvis afleveringen af telefonen giver konflikt, er noget forkert i designet |

---

## 7. Risici og plan B

| Risiko | Tegn | Plan B |
|---|---|---|
| iOS-lyd fejler i PWA | Ingen lyd efter vækning, lydløs-kontakten dræber lyden | HTML5-lydmode i Howler → Capacitor-wrapper (samme kode) |
| iOS sletter data | Fremskridt forsvinder | Start altid fra ikonet, `storage.persist()`, ugentlig eksport → Capacitor |
| TTS lyder forkert | Mærkelig udtale af enkeltord | Ret med SSML/fonetik, eller indtal selv ordet |
| Mynthe keder sig | Vil ikke spille | Kortere sessioner, flere billeder hun selv har valgt, spil sammen med hende. **Ikke** belønninger/streaks |
| Scope creep | Fase 1 tager > 4 weekender | Skær aktiviteter fra. Tre gode aktiviteter slår ti halve |

---

## 8. Første konkrete skridt (i denne rækkefølge)

1. Opret repoet `mynthe-app` på GitHub, og giv mig navnet. Så scaffolder jeg Fase 0.
2. Opret en gratis Azure Speech-ressource (EU-region) og læg nøglen lokalt i `.env`. Den skal aldrig i git.
3. Find 15 minutter med en god mikrofon (telefonen er fin) til at indtale de 10 første bogstavlyde.
4. Vælg sammen med Mynthe en "makker"-figur til appen. Det giver ejerskab og koster ingenting.
