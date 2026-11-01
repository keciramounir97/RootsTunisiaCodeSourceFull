const fs = require('fs');
const path = require('path');

const arLocalesPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arLocalesPath, 'utf8'));

const filesToAudit = [
  'src/pages/MyDownloadRequests.tsx',
  'src/pages/tasks.tsx',
  'src/pages/notes.tsx',
  'src/pages/reminders.tsx',
  'src/pages/subscriptions.tsx',
  'src/pages/payment.tsx',
  'src/admin/pages/Dashboard.tsx',
  'src/admin/pages/Usage.tsx',
  'src/admin/pages/Trees.tsx',
  'src/admin/pages/Individuals.tsx',
  'src/admin/pages/SourcesAndArchives.tsx',
  'src/admin/pages/AdminTasks.tsx',
  'src/admin/pages/AdminNotes.tsx',
  'src/admin/pages/Gallery.tsx',
  'src/admin/pages/Audios.tsx',
  'src/admin/pages/Documents.tsx',
  'src/admin/pages/UserUpgrade.tsx',
  'src/admin/pages/ContactSupport.tsx',
  'src/admin/pages/UserSettings.tsx',
  'src/admin/pages/Settings.tsx',
  'src/admin/components/TreesBuilder.tsx',
  'src/admin/components/FamilyMemberModal.tsx',
  'src/admin/components/AdminHeader.tsx',
  'src/admin/components/AdminSidebar.tsx',
  'src/admin/components/Breadcrumb.tsx'
];

console.log('=== ULTRA-COMPREHENSIVE AUDIT OF ALL USER DASHBOARD PAGES & COMPONENTS ===\n');

let totalIssues = 0;
const issuesByFile = {};

// Common technical or code tokens that are not user visible English text
const ignoredExactTokens = new Set([
  'PDF', 'EPUB', 'GEDCOM', 'MP3', 'CSV', 'JSON', 'API', 'URL', 'ID', 'TND', 'TTC', 'UI', 'OK',
  'true', 'false', 'null', 'undefined', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
  'my', 'public', 'all', 'todo', 'in_progress', 'done', 'low', 'medium', 'high', 'custom',
  'birthday', 'event', 'task', 'tree', 'book', 'audio', 'document', 'gallery', 'article'
]);

for (const relFile of filesToAudit) {
  const fullPath = path.resolve(__dirname, '..', relFile);
  if (!fs.existsSync(fullPath)) {
    console.log(`[FILE MISSING] ${relFile}`);
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const fileIssues = [];

  // Check 1: t("key", "fallback")
  const tMatches = content.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  for (const match of tMatches) {
    const key = match[1];
    const fallback = match[2];
    if (key.length <= 1) continue;
    if (!arJson[key]) {
      const hasArFallback = fallback && /[\u0600-\u06FF]/.test(fallback);
      if (!hasArFallback) {
        fileIssues.push({ type: 'MISSING_AR_KEY', key, fallback });
      }
    } else {
      if (!/[\u0600-\u06FF]/.test(arJson[key])) {
        if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|v\d+(\.\d+)*)$/i.test(arJson[key].trim())) {
          fileIssues.push({ type: 'NON_ARABIC_IN_AR_JSON', key, val: arJson[key] });
        }
      }
    }
  }

  // Check 2: showToast / toast.error / toast.success
  const toastMatches = content.matchAll(/(?:showToast|toast\.(?:success|error|warning|info))\(\s*["']([^"']+)["']/g);
  for (const match of toastMatches) {
    const msg = match[1];
    if (!/[\u0600-\u06FF]/.test(msg) && /[a-zA-Z]{3,}/.test(msg)) {
      fileIssues.push({ type: 'HARDCODED_TOAST', text: msg });
    }
  }

  // Check 3: line by line checks
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.startsWith('const ') && trimmed.includes('require(')) return;

    // Check placeholder="Literal"
    const ph = line.match(/placeholder=["']([^"']+)["']/);
    if (ph) {
      const val = ph[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{2,}/.test(val) && !val.includes('{') && !val.includes('http')) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_PLACEHOLDER', text: val });
      }
    }

    // Check title="Literal"
    const ti = line.match(/\btitle=["']([^"']+)["']/);
    if (ti) {
      const val = ti[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{') && !val.includes('http') && !/^(text|button|submit|reset|checkbox|radio)$/i.test(val)) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_TITLE_ATTR', text: val });
      }
    }

    // Check alt="Literal"
    const al = line.match(/\balt=["']([^"']+)["']/);
    if (al) {
      const val = al[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{')) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_ALT_ATTR', text: val });
      }
    }

    // Check aria-label="Literal"
    const ar = line.match(/aria-label=["']([^"']+)["']/);
    if (ar) {
      const val = ar[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{')) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_ARIA_LABEL', text: val });
      }
    }

    // Check hardcoded button text: >Some English Text</button> or >Some English Text</Button>
    const btnMatch = line.match(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/(?:button|Button)>/);
    if (btnMatch) {
      const val = btnMatch[1].trim();
      if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val)) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_BUTTON_TEXT', text: val });
      }
    }

    // Check hardcoded headings: <h1>...<h6>
    const hMatch = line.match(/<h[1-6][^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/h[1-6]>/);
    if (hMatch) {
      const val = hMatch[1].trim();
      if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val)) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_HEADING', text: val });
      }
    }

    // Check standalone text inside JSX tags: <p>Text</p>, <span>Text</span>, <label>Text</label>, <th>Text</th>
    const tagMatch = line.match(/<(?:p|span|label|th|td|strong|b|em|div)[^>]*>\s*([A-Z][A-Za-z0-9\s,\.!\?'-]{3,})\s*<\/(?:p|span|label|th|td|strong|b|em|div)>/);
    if (tagMatch) {
      const val = tagMatch[1].trim();
      if (!ignoredExactTokens.has(val) && !/[\u0600-\u06FF]/.test(val) && !val.startsWith('http') && !val.includes('{') && !val.includes('(') && !val.includes(':') && val.split(' ').length >= 2) {
        fileIssues.push({ line: idx + 1, type: 'HARDCODED_JSX_TEXT', text: val });
      }
    }
  });

  if (fileIssues.length > 0) {
    issuesByFile[relFile] = fileIssues;
    totalIssues += fileIssues.length;
    console.log(`[FILE] ${relFile} (${fileIssues.length} issues)`);
    fileIssues.forEach(iss => {
      if (iss.line) {
        console.log(`  Line ${iss.line}: [${iss.type}] "${iss.text}"`);
      } else if (iss.type === 'MISSING_AR_KEY') {
        console.log(`  [MISSING_AR_KEY] "${iss.key}" (fallback: "${iss.fallback}")`);
      } else if (iss.type === 'HARDCODED_TOAST') {
        console.log(`  [HARDCODED_TOAST] "${iss.text}"`);
      } else {
        console.log(`  [${iss.type}] key="${iss.key}", val="${iss.val}"`);
      }
    });
    console.log('');
  } else {
    console.log(`[OK] ${relFile} - 0 issues found!`);
  }
}

console.log(`\n=== TOTAL ISSUES DETECTED: ${totalIssues} ===`);
