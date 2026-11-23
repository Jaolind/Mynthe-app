# Roadmap: Mynthe-appen

Levende dokument. Appen bygges i **Kaptajn Knurhårs univers**, se [`KNURHAAR-KONCEPT.md`](KNURHAAR-KONCEPT.md). Den tekniske plan står i [`BYGGEPLAN.md`](BYGGEPLAN.md), og baggrunden står i [`research-rapport.md`](research-rapport.md).

**Princip:** Hver leverance skal kunne spilles af Mynthe, før vi bygger den næste. Tre gode aktiviteter slår ti halve.

---

## Overblik

| | Leverance | Indhold | Status |
|---|---|---|---|
| ✅ | **v0.1 Fundament** | PWA, lyd, lagring, forældreområde, sengetidslås, adaptiv motor | Færdig, lydtest bestået på iPhone |
| ✅ | v0.1.1 | Ny forældrelås med talord ("tryk på fire, otte, to") | Færdig |
| 🔜 | **v0.2 Om bord på Hvorfor** | Dækket som hjemskærm, Knurhår og Pip (fra referencearkene), optager til stemmer og bogstavlyde | **Næste** |
| | v0.3 Pips skrivetavle (Lyde) | "Hvilket tegn skal Pip ridse?" og "Hvad starter med …?" (forlyd), de første lyde | |
| | v0.4 Skattekisten (Bogen) | Forælderen markerer læste historier. "Ret Pip" (huskesætning) og morgenspørgsmål pr. historie | |
| | v0.5 Pips ostelager (Tal) | "Hvor mange ostebidder?", "Læg i ostekassen", "Ostekassen til 10" | |
| | v0.6 Spørgekompasset | Kompasset vælger dagens leg, så sessionen bliver én rolig rejse | |
| | v0.7 Forældreoverblik | Mestring, papirtest-log og kolonnen "Brugt i appen" til bogens måling | |
| | v1.0 Hele 0. klasse | Hele alfabetet (uden q/w/x/z), tal til 20, alle 12 historier fra bog 1 | |
| | Senere | Byg ord på lertavlen, bog 2 (historie 13-24), vokalvariation, plus/minus | |
| | Måske | PIN-lås, Capacitor/App Store, flere børn | |

---

## Nu: v0.2 "Om bord på Hvorfor"

**Mål:** Mynthe genkender skibet, Knurhår og Pip i appen, og stemmerne er på plads.
**Done når:** Hun åbner appen, møder Knurhår og Pip på dækket, og de siger hej med rigtige stemmer.

| # | Opgave | Detaljer |
|---|---|---|
| 1 | **Grafik** | Janus laver med samme værktøj som bogen: dækket i stående format, Knurhår og Pip i 4-5 positurer på gennemsigtig baggrund. Claude skriver prompterne |
| 2 | **Hjemskærm = dækket** | Tre steder at trykke på: lertavlen (Lyde), ostekassen (Tal) og skattekisten (Bogen). Hængekøjen er sengetidslåsen |
| 3 | **Optager** i forældreområdet | Optag replikker til Knurhår og Pip og bogstavlyde. Gemmes på telefonen |
| 4 | **Figurer med stemme** | Tryk på Knurhår → hun hilser. Tryk på Pip → han kigger frem under hatten |
| 5 | **Kanon som data** | `src/content/canon.ts`: figurer, skatte og huskesætninger fra Verdensbiblen. Historier markeres som læst i forældreområdet |
| 6 | **Tests + udgivelse** | Smoke-test på iPhone-profil, deploy |

---

## Beslutninger og åbne spørgsmål

| Emne | Beslutning / spørgsmål |
|---|---|
| Forældrelås | Talord (fra v0.1.1). Skift til en PIN, når Mynthe kan læse talord |
| Instruktionsstemme | **Åbent:** din stemme hele vejen (mere personligt, ingen Azure) eller TTS (hurtigere at udvide)? |
| Billeder | Bogens akvarelstil og referenceark. Emoji kun som pladsholder |
| Univers | Kaptajn Knurhår. Drive-mappen er kilden til sandhed |
| Fjollekameraet | Separat kamera-app. Deler kun universet (Drive-kanon), ikke kode, data eller fremskridt |
| Alder | Mynthe er 5½. Start med forlyd, rim, første lyde og tal til 10 |
| Måling | Papirtest hver 4. uge fra v0.2: sig lyden for 10 bogstaver |

## Bevidst IKKE på roadmappen
Streaks, point, nedtællinger, reklamer, køb, push-beskeder, login, cloud-sync, talegenkendelse.
