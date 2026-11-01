const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const adminPagesDir = path.resolve(__dirname, '../src/admin/pages');
const adminFiles = fs.readdirSync(adminPagesDir).filter(f => f.endsWith('.tsx'));

console.log('=== PAGE PER PAGE AUDIT OF ALL 38 ADMIN DASHBOARD PAGES ===\n');

let failedPages = 0;

adminFiles.forEach((file, index) => {
  const filePath = path.join(adminPagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Find all t(...) calls in this file
  const tMatches = [...content.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g)];
  const missingInAr = [];
  const latinValues = [];

  for (const m of tMatches) {
    const key = m[1];
    if (key.length <= 1) continue;
    if (!ar[key]) {
      missingInAr.push(key);
    } else {
      const val = ar[key];
      // Check if value has no Arabic at all
      if (!/[\u0600-\u06FF]/.test(val)) {
        if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|https?:\/\/|[a-z0-9._%+-]+@|\+?\d+[\s-–\.,\/:a-z]*)$/i.test(val.trim())) {
          latinValues.push({ key, val });
        }
      }
    }
  }

  // Find any raw English in buttons or placeholders
  const rawButtons = [];
  const btnMatches = content.matchAll(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/(?:button|Button)>/g);
  for (const bm of btnMatches) {
    const val = bm[1].trim();
    if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|OK)$/i.test(val)) {
      rawButtons.push(val);
    }
  }

  const rawPlaceholders = [];
  const phMatches = content.matchAll(/\bplaceholder=["']([^"']+)["']/g);
  for (const pm of phMatches) {
    const val = pm[1].trim();
    if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{') && !val.startsWith('http')) {
      rawPlaceholders.push(val);
    }
  }

  const rawToasts = [];
  const toastMatches = content.matchAll(/(?:showToast|toast\.(?:success|error)|alert)\(\s*["']([^"']+)["']/g);
  for (const tm of toastMatches) {
    const val = tm[1].trim();
    if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val)) {
      rawToasts.push(val);
    }
  }

  const issuesCount = missingInAr.length + latinValues.length + rawButtons.length + rawPlaceholders.length + rawToasts.length;

  if (issuesCount === 0) {
    console.log(`[PASS] (${index + 1}/38) ${file} - 100% Arabic (${tMatches.length} keys validated)`);
  } else {
    failedPages++;
    console.log(`[FAIL] (${index + 1}/38) ${file}:`);
    if (missingInAr.length) console.log(`   - Missing keys in ar.json:`, missingInAr);
    if (latinValues.length) console.log(`   - Latin values in ar.json:`, latinValues);
    if (rawButtons.length) console.log(`   - Raw English buttons:`, rawButtons);
    if (rawPlaceholders.length) console.log(`   - Raw English placeholders:`, rawPlaceholders);
    if (rawToasts.length) console.log(`   - Raw English toasts:`, rawToasts);
  }
});

console.log(`\n=== AUDIT SUMMARY: ${38 - failedPages}/38 PAGES PASSED 100% ARABIC VERIFICATION ===`);
