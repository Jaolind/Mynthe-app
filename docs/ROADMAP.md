# Roadmap: Mynthe-appen

Levende dokument. Appen bygges i **Kaptajn Knurhårs univers**, se [`KNURHAAR-KONCEPT.md`](KNURHAAR-KONCEPT.md). Den tekniske plan står i [`BYGGEPLAN.md`](BYGGEPLAN.md), og baggrunden står i [`research-rapport.md`](research-rapport.md).

**Princip:** Hver leverance skal kunne spilles af Mynthe, før vi bygger den næste. Tre gode aktiviteter slår ti halve.

---

## Overblik

| | Leverance | Indhold | Status |
|---|---|---|---|
| ✅ | **v0.1 Fundament** | PWA, lyd, lagring, forældreområde, sengetidslås, adaptiv motor | Færdig, lydtest bestået på iPhone |
| ✅ | v0.1.1 | Ny forældrelås med talord ("tryk på fire, otte, to") | Færdig |
| ✅ | **v0.2 Om bord på Hvorfor** | Dækket som hjemskærm, Knurhår og Pip (fra referencearkene), optager til stemmer og bogstavlyde | Klar med pladsholdere. Mangler billeder og stemmer |
| ✅ | v0.3 Pips skrivetavle (Lyde) | "Hvilket tegn skal Pip ridse?" og "Hvad starter med …?" (forlyd), de første lyde | Klar, skal testes med Mynthe |
| ✅ | v0.4 Skattekisten (Bogen) | Forælderen markerer læste historier. "Ret Pip" (huskesætning) og morgenspørgsmål pr. historie | Klar, skal testes med Mynthe |
| ✅ | v0.5 Pips ostelager (Tal) | "Hvor mange ostebidder?" og "Læg i ostekassen" (10-ramme). "Hvor mange mangler?" kommer senere | Klar, skal testes med Mynthe |
| | v0.6 Spørgekompasset | Kompasset vælger dagens leg, så sessionen bliver én rolig rejse | |
| | v0.7 Forældreoverblik | Mestring, papirtest-log og kolonnen "Brugt i appen" til bogens måling | |
| | v1.0 Hele 0. klasse | Hele alfabetet (uden q/w/x/z), tal til 20, alle 12 historier fra bog 1 | |
| | Senere | Byg ord på lertavlen, bog 2 (historie 13-24), vokalvariation, plus/minus | |
| | Måske | PIN-lås, Capacitor/App Store, flere børn | |

---

## Nu: test med Mynthe

**Klar i appen (med pladsholdere):** dækket, optageren, Pips skrivetavle, Pips ostelager og skattekisten.

| # | Hvem | Opgave |
|---|---|---|
| 1 | Janus | Indtal stemmer i forældreområdet → Stemmer. Vigtigst: Knurhårs og Pips replikker og de 10 bogstavlyde. Resten læses af computerstemmen indtil videre |
| 2 | Janus | Markér læste historier i forældreområdet (historie 1 og 2) |
| 3 | Janus | Spil 3 gange med Mynthe. Notér, hvor hun går i stå |
| 4 | Janus | Billeder i ChatGPT, når der er tid (Drive: "05 App-billeder") |
| 5 | Claude | Henter billederne ind og retter ud fra Mynthes test |
| 6 | Claude | Næste: v0.6 Spørgekompasset (dagens leg) og "Hvor mange mangler?" |

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
