const fs = require('fs');
const path = require('path');
const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const publicPages = [
  'about.tsx', 'articles.tsx', 'audio.tsx', 'contactUs.tsx', 'cookies.tsx', 'error.tsx',
  'Gallery.tsx', 'GalleryArticles.tsx', 'GalleryAudios.tsx', 'GalleryBooks.tsx', 'GalleryDocuments.tsx',
  'GalleryImages.tsx', 'GalleryTrees.tsx', 'genealogy-gallery.tsx', 'HelpCenter.tsx', 'home.tsx',
  'library.tsx', 'login.tsx', 'payment.tsx', 'periods.tsx', 'privacy.tsx', 'refund.tsx',
  'Research.tsx', 'resetpassword.tsx', 'signup.tsx', 'SourcesAndArchives.tsx', 'subscriptions.tsx',
  'terms.tsx', 'unsubscribe.tsx'
];

const missing = {};

publicPages.forEach(f => {
  const filePath = path.resolve(__dirname, '../src/pages/' + f);
  if (!fs.existsSync(filePath)) return;
  const c = fs.readFileSync(filePath, 'utf8');
  const tMatches = c.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  for (const m of tMatches) {
    const key = m[1];
    const fallback = m[2];
    if (key.length <= 1) continue;
    if (!arJson[key]) {
      missing[key] = fallback || key;
      console.log(`[${f}] missing: "${key}" (fallback: "${fallback}")`);
    }
  }
});

console.log('Total missing across all public pages:', Object.keys(missing).length);
