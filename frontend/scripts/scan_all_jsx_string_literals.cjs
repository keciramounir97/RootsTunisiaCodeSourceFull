const fs = require('fs');
const path = require('path');

const adminPagesDir = path.resolve(__dirname, '../src/admin/pages');
const adminFiles = fs.readdirSync(adminPagesDir).filter(f => f.endsWith('.tsx'));

console.log('=== DEEP SCAN OF ALL JSX STRING LITERALS IN ADMIN PAGES ===\n');

// Words that are purely technical, css, or non-translatable
const safeTechnicalWords = new Set([
  'id', 'key', 'index', 'type', 'name', 'value', 'class', 'className', 'style', 'color',
  'true', 'false', 'null', 'undefined', 'auto', 'none', 'hidden', 'visible', 'text',
  'button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'image', 'number', 'email', 'password',
  'date', 'time', 'search', 'url', 'tel', 'range', 'color', 'select', 'textarea',
  'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
  'top', 'bottom', 'left', 'right', 'center', 'start', 'end', 'between', 'around', 'evenly',
  'flex', 'grid', 'inline', 'block', 'table', 'row', 'col', 'span',
  'red', 'blue', 'green', 'yellow', 'purple', 'gray', 'white', 'black', 'amber', 'teal', 'emerald',
  'pdf', 'epub', 'gedcom', 'mp3', 'csv', 'json', 'api', 'url', 'id', 'tnd', 'ttc', 'usd', 'eur',
  'iban', 'bic', 'swift', 'get', 'post', 'put', 'delete', 'patch'
]);

let issuesFound = 0;

adminFiles.forEach(file => {
  const filePath = path.join(adminPagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fileIssues = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.startsWith('const ') && trimmed.includes('require(')) return;

    // Check for any JSX attribute like: label="English", placeholder="English", title="English", helper="English", desc="English"
    const attrMatch = line.match(/\b(label|placeholder|title|helper|desc|description|subtitle|eyebrow|heading|caption|text|emptyText)=["']([^"']+)["']/g);
    if (attrMatch) {
      attrMatch.forEach(m => {
        const parts = m.match(/\b([a-zA-Z]+)=["']([^"']+)["']/);
        if (parts) {
          const attr = parts[1];
          const val = parts[2].trim();
          if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.startsWith('http') && !val.includes('{') && !safeTechnicalWords.has(val.toLowerCase())) {
            fileIssues.push({ line: idx + 1, type: `ATTR:${attr}`, text: val });
          }
        }
      });
    }

    // Check for text inside tags: >Some English<
    // Match > Some Text < where text has English letters
    const textMatches = line.matchAll(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*</g);
    for (const tm of textMatches) {
      const val = tm[1].trim();
      // Skip if it's pure CSS or HTML/JS token
      if (!/[\u0600-\u06FF]/.test(val) && !safeTechnicalWords.has(val.toLowerCase()) && !val.startsWith('http')) {
        // If it's a known single technical acronym
        if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|IBAN|BIC|SWIFT)$/i.test(val)) {
          fileIssues.push({ line: idx + 1, type: 'JSX_TEXT', text: val });
        }
      }
    }
  });

  if (fileIssues.length > 0) {
    console.log(`[FILE] ${file} (${fileIssues.length} potential issues)`);
    fileIssues.forEach(iss => {
      console.log(`  Line ${iss.line}: [${iss.type}] "${iss.text}"`);
    });
    issuesFound += fileIssues.length;
    console.log('');
  }
});

console.log(`\n=== SCAN COMPLETE. TOTAL SUSPICIOUS STRINGS: ${issuesFound} ===`);
