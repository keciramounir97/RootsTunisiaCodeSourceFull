const fs = require('fs');
const path = require('path');

const arLocalesPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arLocalesPath, 'utf8'));

const userDashboardFiles = [
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
  'src/admin/components/AdminHeader.tsx',
  'src/admin/components/AdminSidebar.tsx',
  'src/admin/components/Breadcrumb.tsx'
];

console.log('=== PRECISE AUDIT OF USER DASHBOARD PAGES ===\n');

let totalIssues = 0;

for (const relFile of userDashboardFiles) {
  const fullPath = path.resolve(__dirname, '..', relFile);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  // Check 1: Missing keys in \bt\("...")
  const tMatches = content.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  for (const match of tMatches) {
    const key = match[1];
    const fallback = match[2];
    if (key.length <= 1) continue; // single char punctuation
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

  // Check 2: showToast("Literal English")
  const toastMatches = content.matchAll(/showToast\(\s*["']([^"']+)["']/g);
  for (const match of toastMatches) {
    const msg = match[1];
    if (!/[\u0600-\u06FF]/.test(msg) && /[a-zA-Z]{3,}/.test(msg)) {
      issues.push({ type: 'HARDCODED_TOAST_ENGLISH', text: msg });
    }
  }

  // Check 3: Line by line JSX strings
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

    // placeholder="Literal English"
    const phMatch = line.match(/placeholder=["']([A-Za-z][^"']{2,})["']/);
    if (phMatch) {
      issues.push({ line: idx + 1, type: 'HARDCODED_PLACEHOLDER', text: phMatch[1] });
    }

    // title="Literal English"
    const titleMatch = line.match(/title=["']([A-Za-z][^"']{2,})["']/);
    if (titleMatch && !titleMatch[1].startsWith('http') && !titleMatch[1].includes('{') && !/^(text|button|submit|reset|checkbox|radio)$/i.test(titleMatch[1])) {
      issues.push({ line: idx + 1, type: 'HARDCODED_TITLE_ATTR', text: titleMatch[1] });
    }

    // alt="Literal English"
    const altMatch = line.match(/alt=["']([A-Za-z][^"']{2,})["']/);
    if (altMatch) {
      issues.push({ line: idx + 1, type: 'HARDCODED_ALT_ATTR', text: altMatch[1] });
    }

    // aria-label="Literal English"
    const ariaMatch = line.match(/aria-label=["']([A-Za-z][^"']{2,})["']/);
    if (ariaMatch) {
      issues.push({ line: idx + 1, type: 'HARDCODED_ARIA_LABEL', text: ariaMatch[1] });
    }

    // Hardcoded button content: >English Button</button>
    const btnTextMatch = line.match(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?-]{2,})\s*<\/(?:button|Button)>/);
    if (btnTextMatch) {
      issues.push({ line: idx + 1, type: 'HARDCODED_BUTTON_TEXT', text: btnTextMatch[1].trim() });
    }

    // Hardcoded headings: <h1>...<h6>
    const headingMatch = line.match(/<h[1-6][^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?-]{2,})\s*<\/h[1-6]>/);
    if (headingMatch) {
      issues.push({ line: idx + 1, type: 'HARDCODED_HEADING', text: headingMatch[1].trim() });
    }

    // Hardcoded sentences inside elements
    const pMatch = line.match(/<(?:p|span|label|h[1-6])[^>]*>\s*([A-Z][a-z]{2,}(?:\s+[a-z0-9]+){2,}[\.!]?)\s*<\/(?:p|span|label|h[1-6])>/);
    if (pMatch) {
      issues.push({ line: idx + 1, type: 'HARDCODED_PARAGRAPH_OR_LABEL', text: pMatch[1].trim() });
    }
  });

  if (issues.length > 0) {
    console.log(`[FILE] ${relFile} (${issues.length} issues)`);
    issues.forEach(iss => {
      if (iss.line) {
        console.log(`  Line ${iss.line}: [${iss.type}] "${iss.text}"`);
      } else if (iss.type === 'MISSING_AR_KEY') {
        console.log(`  [MISSING_AR_KEY] "${iss.key}" (fallback: "${iss.fallback}")`);
      } else if (iss.type === 'HARDCODED_TOAST_ENGLISH') {
        console.log(`  [HARDCODED_TOAST_ENGLISH] "${iss.text}"`);
      } else {
        console.log(`  [${iss.type}] key="${iss.key}", val="${iss.val}"`);
      }
    });
    totalIssues += issues.length;
    console.log('');
  } else {
    console.log(`[OK] ${relFile} - 0 issues found!`);
  }
}

console.log(`\n=== TOTAL ISSUES DETECTED: ${totalIssues} ===`);
