// Konverterer illustrationer fra art-src/ (PNG fra ChatGPT) til små WebP-filer i public/art/.
// Filnavne: APP-<id>.png eller <id>.png, fx APP-knurhaar-hilser.png → public/art/knurhaar-hilser.webp
import { mkdirSync, readdirSync } from 'node:fs';
import sharp from 'sharp';

const src = new URL('../art-src/', import.meta.url).pathname;
const out = new URL('../public/art/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

for (const file of readdirSync(src).filter((f) => /\.png$/i.test(f))) {
  const id = file.replace(/^APP-/, '').replace(/\.png$/i, '');
  const isBg = id.startsWith('bg-') || id === 'taage';
  const img = sharp(src + file).trim({ threshold: 1 }); // skær gennemsigtige kanter væk
  await (isBg ? sharp(src + file) : img)
    .resize(isBg ? { width: 1080, height: 1920, fit: 'cover' } : { width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(`${out}${id}.webp`);
  console.log(`✔ ${file} → public/art/${id}.webp`);
}
