const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const publicPages = [
  'about.tsx',
  'articles.tsx',
  'audio.tsx',
  'contactUs.tsx',
  'cookies.tsx',
  'error.tsx',
  'Gallery.tsx',
  'GalleryArticles.tsx',
  'GalleryAudios.tsx',
  'GalleryBooks.tsx',
  'GalleryDocuments.tsx',
  'GalleryImages.tsx',
  'GalleryTrees.tsx',
  'genealogy-gallery.tsx',
  'HelpCenter.tsx',
  'home.tsx',
  'library.tsx',
  'login.tsx',
  'payment.tsx',
  'periods.tsx',
  'privacy.tsx',
  'refund.tsx',
  'Research.tsx',
  'resetpassword.tsx',
  'signup.tsx',
  'SourcesAndArchives.tsx',
  'subscriptions.tsx',
  'terms.tsx',
  'unsubscribe.tsx'
];

const publicComponents = [
  'TreeCard.tsx',
  'Navbar.tsx',
  'Footer.tsx',
  'Header.tsx',
  'Hero.tsx',
  'SEO.tsx'
];

const allFilesToAudit = [
  ...publicPages.map(p => ({ name: p, path: path.resolve(__dirname, '../src/pages', p) })),
  ...publicComponents.map(c => ({ name: `components/${c}`, path: path.resolve(__dirname, '../src/components/site', c) }))
];

const results = {};

function isLatinWord(str) {
  if (!str) return false;
  // Ignore imports, urls, standard codes, css classes, HTML entities, variable names
  const clean = str.replace(/https?:\/\/\S+/g, '').replace(/\{[^}]+\}/g, '').trim();
  // Check for sequences of latin letters that look like English/French words
  return /[a-zA-Z]{3,}/.test(clean);
}

// 1. Audit missing keys used in t(...) across files
for (const item of allFilesToAudit) {
  const filePath = item.path;
  const file = item.name;
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  const fileReport = {
    missingArKeys: [],
    latinFallbacksInT: [],
    hardcodedAttributes: [],
    hardcodedJsxText: [],
    potentialHardcodedArrays: []
  };

  // Find t("key", ...) or t('key', ...)
  const tRegex = /\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']+)["'])?/g;
  let match;
  while ((match = tRegex.exec(content)) !== null) {
    const key = match[1];
    const fallback = match[2];
    if (!arJson[key]) {
      fileReport.missingArKeys.push({ key, fallback });
    } else if (isLatinWord(arJson[key])) {
      // Key exists in ar.json but translation contains latin words
      // Check if it's not a technical term
      const val = arJson[key];
      if (!val.includes('GEDCOM') && !val.includes('MP3') && !val.includes('WAV') && !val.includes('M4A') && !val.includes('PDF') && !val.includes('URL') && !val.includes('DNA') && !val.includes('JWT') && !val.includes('RootsTunisia') && !val.includes('Roots Tunisia')) {
        fileReport.missingArKeys.push({ key, issue: 'ar.json value contains latin: ' + val });
      }
    }
    if (fallback && isLatinWord(fallback)) {
      fileReport.latinFallbacksInT.push({ key, fallback });
    }
  }

  // Find hardcoded placeholder, title, aria-label, alt
  const attrRegex = /\b(placeholder|title|aria-label|alt)=["']([^"']+)["']/g;
  while ((match = attrRegex.exec(content)) !== null) {
    const attr = match[1];
    const val = match[2];
    if (isLatinWord(val)) {
      fileReport.hardcodedAttributes.push({ attr, val });
    }
  }

  // Find JSX text between tags: >Some Text<
  const jsxTextRegex = />\s*([A-Za-z][A-Za-z0-9\s,.'’\-–—:;!?]{3,})\s*</g;
  while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    // Ignore html tags, react snippets, single words that might be CSS or identifiers
    if (text && !text.startsWith('{') && !text.startsWith('/*')) {
      fileReport.hardcodedJsxText.push(text);
    }
  }

  results[file] = fileReport;
}

// Write audit result
fs.writeFileSync(path.resolve(__dirname, 'public_pages_audit.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('Public pages audit complete. Written to public_pages_audit.json');

// Summarize
let totalMissing = 0;
let totalLatinFallbacks = 0;
let totalHardcodedAttrs = 0;
let totalHardcodedJsx = 0;

for (const [file, rep] of Object.entries(results)) {
  const m = rep.missingArKeys.length;
  const lf = rep.latinFallbacksInT.length;
  const ha = rep.hardcodedAttributes.length;
  const hj = rep.hardcodedJsxText.length;
  totalMissing += m;
  totalLatinFallbacks += lf;
  totalHardcodedAttrs += ha;
  totalHardcodedJsx += hj;
  if (m > 0 || lf > 0 || ha > 0 || hj > 0) {
    console.log(`[${file}] Missing keys: ${m}, Latin fallbacks: ${lf}, Hardcoded attrs: ${ha}, Hardcoded JSX: ${hj}`);
  }
}

console.log('--- TOTALS ---');
console.log(`Missing keys in ar.json: ${totalMissing}`);
console.log(`Latin fallbacks in t(): ${totalLatinFallbacks}`);
console.log(`Hardcoded attributes (placeholder/title/etc): ${totalHardcodedAttrs}`);
console.log(`Hardcoded JSX text: ${totalHardcodedJsx}`);
