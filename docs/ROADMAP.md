# Roadmap: Mynthe-appen

Levende dokument. Den detaljerede tekniske plan står i [`BYGGEPLAN.md`](BYGGEPLAN.md), og baggrunden står i [`research-rapport.md`](research-rapport.md).

**Princip:** Hver leverance skal kunne spilles af Mynthe, før vi bygger den næste. Tre gode aktiviteter slår ti halve.

---

## Overblik

| | Leverance | Indhold | Status |
|---|---|---|---|
| ✅ | **v0.1 Fundament** | PWA, lyd, lagring, forældreområde, sengetidslås, adaptiv motor | Færdig, lydtest bestået på iPhone |
| ✅ | v0.1.1 | Ny forældrelås med talord ("tryk på fire, otte, to") | Færdig |
| 🔜 | **v0.2 Lyde: første spil** | Optager til bogstavlyde + aktiviteten "Hvilket bogstav siger …?" | **Næste** |
| | v0.3 Lyde komplet | "Hvad starter ordet med?" + "Byg ordet", ordbilleder, TTS-ord | |
| | v0.4 Tal | "Hvor mange?", "Tæl og træk", "Tals venner til 10" | |
| | v0.5 Forældreoverblik | Mestring pr. bogstav/tal, papirtest-log, "gør det sammen"-kort | |
| | v0.6 Makker og klistermærker | En figur Mynthe selv vælger, klistermærkebog knyttet til mestring | |
| | v1.0 Hele 0. klasse | Hele alfabetet (uden q/w/x/z), tal til 20 | |
| | Senere | Vokalvariation, hyppige ord, tallinje til 100, plus/minus til 20 | |
| | Måske | PIN-lås, Capacitor/App Store, flere børn | |

---

## Nu: v0.2 "Lyde: første spil"

**Mål:** Mynthe kan spille én rigtig læringsaktivitet med din stemme.
**Done når:** Hun gennemfører 3 sessioner uden hjælp til navigationen, og motoren flytter bogstaverne op i boksene.

### Implementering (i rækkefølge)

| # | Opgave | Detaljer |
|---|---|---|
| 1 | **Indhold** `src/content/letters.ts` | De 10 første lyde i rækkefølgen m, s, a, l, i, r, o, f, u, n, med emoji/billede pr. bogstav |
| 2 | **Optager** i forældreområdet | Liste over bogstaver → 🎙 optag → ▶ afspil → ✓ gem. Gemmes i IndexedDB (`recordings`). Bruger `MediaRecorder` (m4a/webm). Viser hvilke der mangler |
| 3 | **Lyd fra optagelser** | `AudioEngine` kan afspille en Blob-URL. Fallback: syntetisk "bip" + bogstavet stort på skærmen, hvis en lyd mangler |
| 4 | **Aktivitetsskabelon** `src/activities/Activity.tsx` | Fælles flow: instruktion → opgave → feedback → næste, 6 opgaver → slutskærm. Logger session |
| 5 | **"Hvilket bogstav siger …?"** | Afspil /m/ → vis 2–4 store bogstaver → tryk. Rigtigt: bogstavet hopper og siger lyden igen. Forkert: "Lyt igen" og lyden afspilles, ingen straf |
| 6 | **Kobl motoren på** | `planSession` vælger bogstaver, `applyAnswer` gemmer, `nextChoiceCount` styrer antal svarmuligheder |
| 7 | **Slutskærm** | "Godt arbejde i dag!" → hjem. Intet "spil igen" |
| 8 | **Indtalte instruktioner** | Optag selv eller brug TTS: "Hvilket bogstav siger …", "Godt arbejde", "Lyt igen" |
| 9 | **Tests + udgivelse** | Unit-tests af aktivitetsflow, Playwright-smoke på iPhone-profil, deploy |

**Det skal du levere:** 10 bogstavlyde (ca. 15 min, indtales direkte i appen, når optageren er klar) og evt. 3 instruktioner.

---

## Beslutninger og åbne spørgsmål

| Emne | Beslutning / spørgsmål |
|---|---|
| Forældrelås | Talord (fra v0.1.1). Skift til en PIN, når Mynthe kan læse talord |
| Instruktionsstemme | **Åbent:** din stemme hele vejen (mere personligt, ingen Azure) eller TTS (hurtigere at udvide)? |
| Billeder | Emoji i v0.2–0.3 (gratis, tydelige). Rigtige illustrationer fra v0.6 |
| Makker-figur | Vælges sammen med Mynthe før v0.6 |
| Måling | Papirtest hver 4. uge fra v0.2: sig lyden for 10 bogstaver |

## Bevidst IKKE på roadmappen
Streaks, point, nedtællinger, reklamer, køb, push-beskeder, login, cloud-sync, talegenkendelse.
