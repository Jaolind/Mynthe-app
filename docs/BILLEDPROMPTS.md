# Billedprompts til appen (v0.2)

Laves i **ChatGPT**, det samme værktøj som bogen, så stilen bliver den samme.

## Sådan gør du
1. Åbn en ny ChatGPT-samtale, og vedhæft **REF-figurark.png**, **REF-pip.png** og **REF-skib.png** fra `Billeder/Referencer`.
2. Indsæt én prompt ad gangen. Lav 2–3 bud, og vælg det bedste.
3. Gem det valgte billede som **PNG** i en ny Drive-mappe, **`Billeder/App`**, med filnavnet fra tabellen.
4. Sig til, så henter jeg billederne, skærer dem til, gør dem små (WebP) og lægger dem i appen.

**Billedtjek (som i bogen):** Samme kat og samme mus som i referencerne? Ingen bogstaver eller tal i billedet? Gennemsigtig baggrund, hvor der står det? Intet uhyggeligt?

> Bogstaver, tal og knapper lægger appen selv ovenpå. Billederne må derfor aldrig indeholde tekst.

---

## Fast start og slutning

Hver prompt **starter** med:

```
Use the attached reference images for Captain Whiskers, Pip the mouse and the ship, and keep their design exactly the same.
```

og **slutter** med enten A eller B:

**A. Figurer og ting (gennemsigtig baggrund):**
```
Same soft watercolour and gouache picture-book style with fine ink lines. Warm and calm, never scary. Full figure, nothing cropped, centred with some empty space around it. Transparent background, PNG, no shadow on the ground. No text, no letters, no numbers.
```

**B. Baggrunde (stående format):**
```
Same soft watercolour and gouache picture-book style with fine ink lines. Warm and calm, never scary. Portrait format 9:16. No characters. No text, no letters, no numbers.
```

---

## 1. Baggrunde

| Fil | Prompt (midten) | Slut |
|---|---|---|
| `APP-bg-daek-dag.png` | The deck of the small round wooden ship "Hvorfor" seen from the stern, looking forward towards the bow, on a calm sunny morning sea. One mast with patched cream sails and a painted question mark. The striped hammock hangs at the very front of the deck. The steering wheel is at the bottom left. Keep the middle and lower half of the deck open and uncluttered: empty wooden planks with room to place objects later. Soft blue sky, a few small clouds. | B |
| `APP-bg-daek-nat.png` | The same deck of the ship "Hvorfor" at night on a still, dark sea, seen from the same angle. A warm lantern glows softly near the mast. A glittering moon path on the water. The striped hammock at the front. Cosy and safe, not dark or gloomy. | B |
| `APP-taage.png` | A soft band of glittering fog, like sparkling stardust, drifting sideways. Pale cream and light lilac with tiny golden sparkles. Seamless on the left and right edges. Transparent background. | A |

## 2. Kaptajn Knurhår

| Fil | Prompt (midten) | Slut |
|---|---|---|
| `APP-knurhaar-hilser.png` | Captain Whiskers standing on her hind legs, smiling, lifting her far too big dark blue captain's hat politely with one paw, as if saying hello. | A |
| `APP-knurhaar-nysgerrig.png` | Captain Whiskers sitting, head tilted, one paw on her chin, curious and thinking, big green eyes looking up. | A |
| `APP-knurhaar-glad.png` | Captain Whiskers laughing happily with her eyes closed, both front paws raised in joy. | A |
| `APP-knurhaar-lytter.png` | Captain Whiskers with one paw behind her ear, listening carefully to a sound far away, calm and focused. | A |
| `APP-knurhaar-sover.png` | Captain Whiskers fast asleep, curled up in the striped hammock, hat tipped over her eyes. The hammock is included in the image. | A |

## 3. Pip

| Fil | Prompt (midten) | Slut |
|---|---|---|
| `APP-pip-kigger.png` | Pip the mouse peeking out curiously, only his head, big round ears and front paws visible, as if peeking over an edge. | A |
| `APP-pip-jubler.png` | Pip the mouse jumping with joy, arms in the air, tail curled happily. | A |
| `APP-pip-ups.png` | Pip the mouse looking a little sheepish and funny, holding a small piece of yellow cheese, as if he has just said something wrong. Friendly, not sad. | A |
| `APP-pip-skriver.png` | Pip the mouse holding a small reed stick, about to scratch on something in front of him, concentrating with his tongue out a little. | A |

## 4. Ting om bord

| Fil | Prompt (midten) | Slut |
|---|---|---|
| `APP-lertavle.png` | Pip's small rectangular clay tablet lying flat, seen from straight above, light brown and smooth, completely blank with no marks at all. A thin reed stick lies next to it. | A |
| `APP-ostekasse.png` | A small wooden box seen from straight above, divided into exactly ten equal square compartments in two rows of five. All compartments are empty. | A |
| `APP-ostebid.png` | One small yellow wedge of cheese with a few round holes, seen from slightly above. | A |
| `APP-skattekiste-lukket.png` | A small, friendly wooden treasure chest with brass corners, closed, seen from the front. | A |
| `APP-skattekiste-aaben.png` | The same small wooden treasure chest, open, with a soft warm glow inside, seen from the front. Empty inside. | A |
| `APP-kompas-hus.png` | The Question Compass: a round brass compass housing seen from straight above, with a cream face and small decorative marks around the edge, only suggested, not letters. **No needle.** | A |
| `APP-kompas-naal.png` | Only the needle of a brass compass, seen from straight above, pointing straight up, thin and elegant with a small round centre. Nothing else. | A |

Kompasset er delt i hus og nål, så appen kan dreje nålen ("svirrr!").

---

## Animationer: hvem laver hvad

| Hvad | Hvem |
|---|---|
| Illustrationer (akvarel) | ChatGPT, ud fra prompterne her |
| Bevægelse | Appen, i kode: figurerne vugger og ånder, Pip kigger frem, nålen snurrer, tågen glider ind og ud, hatten vipper, ting hopper ved rigtigt svar. Flere positurer pr. figur skiftes blødt |

Billederne er "dukker", og appen trækker i trådene. Så forbliver stilen præcis som i bogen.
