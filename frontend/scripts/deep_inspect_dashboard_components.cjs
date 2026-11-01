const fs = require('fs');
const path = require('path');

const arLocalesPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arLocalesPath, 'utf8'));

const targets = [
  'src/admin/pages/Audios.tsx',
  'src/admin/pages/Documents.tsx',
  'src/admin/pages/Gallery.tsx',
  'src/admin/pages/Individuals.tsx',
  'src/admin/pages/ContactSupport.tsx',
  'src/admin/pages/UserSettings.tsx',
  'src/admin/pages/Settings.tsx'
];

for (const t of targets) {
  const fullPath = path.resolve(__dirname, '..', t);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');

  // Look for any english in button tags
  const btnMatches = content.matchAll(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/(?:button|Button)>/g);
  for (const b of btnMatches) {
    if (!/[\u0600-\u06FF]/.test(b[1]) && !['PDF', 'EPUB', 'MP3', 'GEDCOM'].includes(b[1].trim())) {
      console.log(`[${t}] Hardcoded button: "${b[1].trim()}"`);
    }
  }

  // Look for any english in h1..h6
  const hMatches = content.matchAll(/<h[1-6][^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/h[1-6]>/g);
  for (const h of hMatches) {
    if (!/[\u0600-\u06FF]/.test(h[1])) {
      console.log(`[${t}] Hardcoded heading: "${h[1].trim()}"`);
    }
  }

  // Look for any english in placeholders
  const phMatches = content.matchAll(/placeholder=["']([^"']+)["']/g);
  for (const p of phMatches) {
    if (!/[\u0600-\u06FF]/.test(p[1]) && /[a-zA-Z]{3,}/.test(p[1])) {
      console.log(`[${t}] Hardcoded placeholder: "${p[1].trim()}"`);
    }
  }

  // Look for any toast or alert
  const toastMatches = content.matchAll(/(?:showToast|toast\.(?:success|error)|alert)\(\s*["']([^"']+)["']/g);
  for (const tm of toastMatches) {
    if (!/[\u0600-\u06FF]/.test(tm[1]) && /[a-zA-Z]{3,}/.test(tm[1])) {
      console.log(`[${t}] Hardcoded alert/toast: "${tm[1].trim()}"`);
    }
  }
}
console.log('Target audit complete.');
