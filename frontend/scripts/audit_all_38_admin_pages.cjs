const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const adminPagesDir = path.resolve(__dirname, '../src/admin/pages');
const adminFiles = fs.readdirSync(adminPagesDir).filter(f => f.endsWith('.tsx'));

const adminComponents = [
  '../src/admin/AdminLayout.tsx',
  '../src/admin/components/AdminHeader.tsx',
  '../src/admin/components/AdminSidebar.tsx',
  '../src/admin/components/Breadcrumb.tsx',
  '../src/admin/components/TreesBuilder.tsx'
];

const allTargets = [
  ...adminFiles.map(f => path.join(adminPagesDir, f)),
  ...adminComponents.map(f => path.resolve(__dirname, f))
];

console.log(`=== THOROUGH AUDIT OF ALL ${allTargets.length} ADMIN PAGES & COMPONENTS ===\n`);

const ignoredExactTokens = new Set([
  'PDF', 'EPUB', 'GEDCOM', 'MP3', 'CSV', 'JSON', 'API', 'URL', 'ID', 'TND', 'TTC', 'UI', 'OK',
  'true', 'false', 'null', 'undefined', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
  'my', 'public', 'all', 'todo', 'in_progress', 'done', 'low', 'medium', 'high', 'custom',
  'birthday', 'event', 'task', 'tree', 'book', 'audio', 'document', 'gallery', 'article',
  'USD', 'EUR', 'IBAN', 'BIC', 'SWIFT', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH'
]);

let totalIssues = 0;
const resultsByFile = {};

allTargets.forEach(fullPath => {
  const fileName = path.basename(fullPath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  // Check 1: Missing keys in t(...)
  const tMatches = content.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  for (const m of tMatches) {
    const key = m[1];
    const fallback = m[2];
    if (key.length <= 1) continue;
    if (!arJson[key]) {
      const hasArFallback = fallback && /[\u0600-\u06FF]/.test(fallback);
      if (!hasArFallback) {
        issues.push({ type: 'MISSING_AR_KEY', key, fallback });
      }
    } else {
      if (!/[\u0600-\u06FF]/.test(arJson[key])) {
        if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|v\d+(\.\d+)*)$/i.test(arJson[key].trim())) {
          issues.push({ type: 'NON_ARABIC_IN_AR_JSON', key, val: arJson[key] });
        }
      }
    }
  }

  // Check 2: alert / confirm / showToast
  const alertMatches = content.matchAll(/(?:showToast|alert|confirm|window\.confirm)\(\s*["']([^"']+)["']/g);
  for (const m of alertMatches) {
    const text = m[1];
    if (!/[\u0600-\u06FF]/.test(text) && /[a-zA-Z]{3,}/.test(text)) {
      issues.push({ type: 'HARDCODED_ALERT_TOAST', text });
    }
  }

  // Check 3: Line by line JSX strings
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ') || (trimmed.startsWith('const ') && trimmed.includes('require('))) return;

    // Check placeholder="Literal"
    const ph = line.match(/\bplaceholder=["']([^"']+)["']/);
    if (ph) {
      const val = ph[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{2,}/.test(val) && !val.includes('{') && !val.includes('http')) {
        issues.push({ line: idx + 1, type: 'HARDCODED_PLACEHOLDER', text: val });
      }
    }

    // Check title="Literal"
    const ti = line.match(/\btitle=["']([^"']+)["']/);
    if (ti) {
      const val = ti[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{') && !val.includes('http') && !/^(text|button|submit|reset|checkbox|radio)$/i.test(val)) {
        issues.push({ line: idx + 1, type: 'HARDCODED_TITLE_ATTR', text: val });
      }
    }

    // Check alt="Literal"
    const al = line.match(/\balt=["']([^"']+)["']/);
    if (al) {
      const val = al[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{')) {
        issues.push({ line: idx + 1, type: 'HARDCODED_ALT_ATTR', text: val });
      }
    }

    // Check aria-label="Literal"
    const ar = line.match(/\baria-label=["']([^"']+)["']/);
    if (ar) {
      const val = ar[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{')) {
        issues.push({ line: idx + 1, type: 'HARDCODED_ARIA_LABEL', text: val });
      }
    }

    // Check hardcoded button text: >Some English Text</button> or >Some English Text</Button>
    const btnMatch = line.match(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/(?:button|Button)>/);
    if (btnMatch) {
      const val = btnMatch[1].trim();
      if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val)) {
        issues.push({ line: idx + 1, type: 'HARDCODED_BUTTON_TEXT', text: val });
      }
    }

    // Check hardcoded headings: <h1>...<h6>
    const hMatch = line.match(/<h[1-6][^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/h[1-6]>/);
    if (hMatch) {
      const val = hMatch[1].trim();
      if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val)) {
        issues.push({ line: idx + 1, type: 'HARDCODED_HEADING', text: val });
      }
    }

    // Check hardcoded standalone elements: <p>Text</p>, <span>Text</span>, <label>Text</label>, <th>Text</th>, <td>Text</td>, <option>Text</option>
    const elMatch = line.match(/<(?:p|span|label|th|td|strong|b|em|div|option)[^>]*>\s*([A-Z][A-Za-z0-9\s,\.!\?'-]{3,})\s*<\/(?:p|span|label|th|td|strong|b|em|div|option)>/);
    if (elMatch) {
      const val = elMatch[1].trim();
      if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val) && !val.startsWith('http') && !val.includes('{') && !val.includes('(') && !val.includes(':') && val.split(' ').length >= 2) {
        issues.push({ line: idx + 1, type: 'HARDCODED_JSX_TEXT', text: val });
      }
    }
  });

  // Check 4: Check if any options in <select> have hardcoded text
  const optionMatches = content.matchAll(/<option[^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/option>/g);
  for (const om of optionMatches) {
    const val = om[1].trim();
    if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val)) {
      issues.push({ type: 'HARDCODED_OPTION_TEXT', text: val });
    }
  }

  if (issues.length > 0) {
    resultsByFile[fileName] = issues;
    totalIssues += issues.length;
    console.log(`[FILE] ${fileName} (${issues.length} issues)`);
    issues.forEach(iss => {
      if (iss.line) {
        console.log(`  Line ${iss.line}: [${iss.type}] "${iss.text}"`);
      } else if (iss.type === 'MISSING_AR_KEY') {
        console.log(`  [MISSING_AR_KEY] "${iss.key}" (fallback: "${iss.fallback}")`);
      } else if (iss.type === 'HARDCODED_ALERT_TOAST') {
        console.log(`  [HARDCODED_ALERT_TOAST] "${iss.text}"`);
      } else if (iss.type === 'HARDCODED_OPTION_TEXT') {
        console.log(`  [HARDCODED_OPTION_TEXT] "${iss.text}"`);
      } else {
        console.log(`  [${iss.type}] key="${iss.key}", val="${iss.val}"`);
      }
    });
    console.log('');
  } else {
    console.log(`[OK] ${fileName} - 0 issues found!`);
  }
});

console.log(`\n=== TOTAL ISSUES DETECTED ACROSS ADMIN PAGES: ${totalIssues} ===`);
