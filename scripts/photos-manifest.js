#!/usr/bin/env node
/**
 * Génère src/assets/data/photos.json : { "<nom de fichier sans extension>": "assets/joueurs/<fichier>" }
 * pour toutes les images de src/assets/joueurs, quelle que soit leur extension.
 * L'app résout ainsi "polo" + "-lions" sans connaître l'extension du fichier.
 * Lancé automatiquement avant `ng serve`, `build` et `test` (voir package.json).
 */
const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, '..', 'src', 'assets', 'joueurs');
const OUTPUT = path.join(__dirname, '..', 'src', 'assets', 'data', 'photos.json');
/** Ordre de préférence quand un même nom existe en plusieurs formats (transparence d'abord). */
const EXTENSIONS = ['png', 'webp', 'avif', 'jpg', 'jpeg', 'gif'];

const manifest = {};
const duplicates = [];

for (const file of fs.readdirSync(PHOTOS_DIR).sort()) {
  const ext = path.extname(file).slice(1).toLowerCase();
  if (!EXTENSIONS.includes(ext)) continue;
  const stem = path.basename(file, path.extname(file));
  const current = manifest[stem];
  if (current) {
    const currentExt = path.extname(current).slice(1).toLowerCase();
    const keepCurrent = EXTENSIONS.indexOf(ext) >= EXTENSIONS.indexOf(currentExt);
    duplicates.push(`${stem} : .${keepCurrent ? currentExt : ext} utilisé, .${keepCurrent ? ext : currentExt} ignoré`);
    if (keepCurrent) continue;
  }
  manifest[stem] = `assets/joueurs/${file}`;
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(OUTPUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(`photos.json : ${Object.keys(sorted).length} photos`);
for (const d of duplicates) console.warn(`  ⚠ plusieurs formats pour ${d}`);
