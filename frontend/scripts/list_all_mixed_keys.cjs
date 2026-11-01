const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const mixedKeys = {};

for (const [key, val] of Object.entries(ar)) {
  if (typeof val !== 'string') continue;
  if (/[\u0600-\u06FF]/.test(val)) {
    const latinWords = val.match(/[a-zA-Z]{2,}/g);
    if (latinWords) {
      // Filter out technical acronyms that are allowed
      const realEnglish = latinWords.filter(w => !['PDF', 'EPUB', 'GEDCOM', 'MP3', 'WAV', 'M4A', 'CSV', 'JSON', 'API', 'URL', 'TND', 'TTC', 'USD', 'EUR', 'HTTP', 'HTTPS', 'HTML', 'CSS', 'DOM', 'JWT', 'OTP', 'XML', 'DOC', 'DOCX', 'TXT', 'XLS', 'XLSX', 'JPG', 'PNG', 'GIF', 'WEBP', 'GEDX', 'INDI', 'FAM', 'DATE', 'PLAC'].includes(w.toUpperCase()));
      if (realEnglish.length > 0) {
        mixedKeys[key] = { val, words: realEnglish };
      }
    }
  }
}

console.log(`TOTAL REAL MIXED KEYS: ${Object.keys(mixedKeys).length}\n`);
for (const [k, obj] of Object.entries(mixedKeys)) {
  console.log(`${k} : "${obj.val}" (words: ${obj.words.join(', ')})`);
}
