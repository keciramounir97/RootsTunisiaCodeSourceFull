const fs = require('fs');
const path = require('path');
const arJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/ar.json'), 'utf8'));

const files = [
  'GalleryBooks.tsx', 'GalleryImages.tsx', 'GalleryTrees.tsx', 'login.tsx', 'resetpassword.tsx', 'signup.tsx', 'unsubscribe.tsx'
];

files.forEach(f => {
  const c = fs.readFileSync(path.resolve(__dirname, '../src/pages/' + f), 'utf8');
  const tMatches = c.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  for (const m of tMatches) {
    if (!arJson[m[1]]) {
      console.log(`${f} => key: "${m[1]}", fallback: "${m[2]}"`);
    }
  }
});
