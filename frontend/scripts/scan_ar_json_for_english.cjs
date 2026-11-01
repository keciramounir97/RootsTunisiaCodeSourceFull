const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

console.log(`Total keys in ar.json: ${Object.keys(ar).length}`);

const hasEnglishWords = [];
const nonArabic = [];

for (const [key, val] of Object.entries(ar)) {
  if (typeof val !== 'string') continue;

  // 1. Does not contain any Arabic at all
  if (!/[\u0600-\u06FF]/.test(val)) {
    // Allow technical acronyms, URLs, emails
    if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|https?:\/\/|[a-z0-9._%+-]+@|\d+[\s-–\.,\/:a-z]+)$/i.test(val.trim())) {
      nonArabic.push({ key, val });
    }
  } else {
    // 2. Contains Arabic BUT also contains English words of length >= 3
    // Find all Latin words
    const latinWords = val.match(/[a-zA-Z]{3,}/g);
    if (latinWords) {
      // Filter out technical acronyms
      const realEnglish = latinWords.filter(w => !['PDF', 'EPUB', 'GEDCOM', 'MP3', 'CSV', 'JSON', 'API', 'URL', 'TND', 'TTC', 'USD', 'EUR', 'HTTP', 'HTTPS', 'HTML', 'CSS', 'DOM'].includes(w.toUpperCase()));
      if (realEnglish.length > 0) {
        hasEnglishWords.push({ key, val, words: realEnglish });
      }
    }
  }
}

console.log(`Keys with 0 Arabic: ${nonArabic.length}`);
nonArabic.forEach(item => {
  console.log(`  [NO ARABIC] key: "${item.key}" => "${item.val}"`);
});

console.log(`\nKeys with Arabic + English words: ${hasEnglishWords.length}`);
hasEnglishWords.slice(0, 50).forEach(item => {
  console.log(`  [MIXED] key: "${item.key}" => "${item.val}" (words: ${item.words.join(', ')})`);
});
if (hasEnglishWords.length > 50) {
  console.log(`  ... and ${hasEnglishWords.length - 50} more`);
}
