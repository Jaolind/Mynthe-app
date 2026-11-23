# Mynthe-appen 🌞

Et roligt, dansk og offline læringsspil til Mynthe (5½ år), med to spor: **Lyde** og **Tal**.
Der er ingen reklamer, intet login og ingen streaks, og der sendes ingen data nogen steder hen.

- 📄 Research: [`docs/research-rapport.md`](docs/research-rapport.md) (noter i [`research/`](research/))
- 🐱 Univers: [`docs/KNURHAAR-KONCEPT.md`](docs/KNURHAAR-KONCEPT.md)
- 🧭 Roadmap: [`docs/ROADMAP.md`](docs/ROADMAP.md)
- 🗺️ Teknisk plan: [`docs/BYGGEPLAN.md`](docs/BYGGEPLAN.md)

## Status

Se [`docs/ROADMAP.md`](docs/ROADMAP.md). Fase 0 (fundamentet) er færdig:

| Del | Status |
|---|---|
| React + Vite + TypeScript PWA (offline via service worker) | ✅ |
| Andika-font, selvhostet | ✅ |
| Lydmotor (Howler) med tryk-for-at-starte og plan B (HTML5-lyd) | ✅ |
| IndexedDB-lagring + `storage.persist()` + JSON-eksport/-import | ✅ |
| Forældrelås (talord) + forældreområde med **lydtest** | ✅ |
| Sengetidslås (standard kl. 19–06) | ✅ |
| Adaptiv motor (Leitner-bokse, sessionsplan, svarmuligheder 2→4) med tests | ✅ |
| TTS-script til danske lydfiler (Azure) | ✅ (kræver nøgle) |
| Lyde- og Tal-aktiviteterne | ⏳ fase 1–2 |

## Kom i gang

```bash
npm install
npm run dev        # åbn adressen på telefonen (samme wifi)
npm test           # logik-tests
npm run build      # produktion i dist/
```

### Danske lydfiler
1. Opret en gratis **Azure Speech**-ressource (vælg en EU-region, fx North Europe).
2. `cp .env.example .env` og indsæt nøglen. `.env` committes aldrig.
3. `npm run tts` genererer MP3'er til `public/audio/` ud fra `src/content/phrases.ts`.

Bogstav-**lydene** (/m/, /s/ …) indtaler du selv. Computerstemmer siger "æm" i stedet for /m/.

## Fase 0-test på telefonen

1. Udgiv med GitHub Pages (se nedenfor), og åbn adressen i Safari på telefonen.
2. **Del → Føj til hjemmeskærm**, og åbn appen fra ikonet.
3. Tryk på solen, gå til ⚙︎ nederst til højre, tryk talordene i rækkefølge og åbn **Lydtest**.
4. Afspil lydene **online, i flytilstand og med lydløs-knappen både til og fra**.
5. Fejler lyden, skift **Lydmotor → HTML5-lyd** og prøv igen.
6. Slå **Guided Access** til (Indstillinger → Tilgængelighed → Guidet adgang).

Bestået = lyd i alle kombinationer + "Startet fra hjemmeskærm ✅" + "Varig lagring ✅".

## Udgivelse (GitHub Pages)
Repo → **Settings → Pages → Source: GitHub Actions**. Hvert push til `main` bygger, tester og udgiver appen til
`https://jaolind.github.io/Mynthe-app/`.

## Struktur
```
src/app/       skærme og navigation
src/audio/     lydmotor
src/engine/    mestring, sessionsplan, sengetid (ren logik, testet)
src/storage/   IndexedDB, backup
src/parent/    forældrelås og forældreområde
src/content/   indhold som data (sætninger, ord …)
src/ui/        store knapper, hjem, højttaler
scripts/       TTS, testlyde, ikoner
```
