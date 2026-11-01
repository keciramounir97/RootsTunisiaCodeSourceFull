const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

// All user dashboard pages and admin dashboard pages
const userPages = [
  { name: 'pages/MyDownloadRequests.tsx', path: path.resolve(__dirname, '../src/pages/MyDownloadRequests.tsx') },
  { name: 'pages/tasks.tsx', path: path.resolve(__dirname, '../src/pages/tasks.tsx') },
  { name: 'pages/notes.tsx', path: path.resolve(__dirname, '../src/pages/notes.tsx') },
  { name: 'pages/reminders.tsx', path: path.resolve(__dirname, '../src/pages/reminders.tsx') },
];

const adminPagesDir = path.resolve(__dirname, '../src/admin/pages');
const adminPageFiles = fs.readdirSync(adminPagesDir)
  .filter(f => f.endsWith('.tsx'))
  .map(f => ({ name: `admin/pages/${f}`, path: path.resolve(adminPagesDir, f) }));

const adminComponentsDir = path.resolve(__dirname, '../src/admin/components');
const adminComponentFiles = fs.readdirSync(adminComponentsDir)
  .filter(f => f.endsWith('.tsx'))
  .map(f => ({ name: `admin/components/${f}`, path: path.resolve(adminComponentsDir, f) }));

const allDashboardFiles = [
  ...userPages,
  ...adminPageFiles,
  ...adminComponentFiles
];

function isLatinWord(str) {
  if (!str) return false;
  // Ignore imports, urls, standard codes, css classes, HTML entities, variable names
  const clean = str.replace(/https?:\/\/\S+/g, '')
    .replace(/\{[^}]+\}/g, '')
    .replace(/GEDCOM[0-9.]*/g, '')
    .replace(/MP3|WAV|M4A|PDF|URL|DNA|JWT|RootsTunisia|Roots Tunisia|API|JSON|CIN|ID|TND|RIB|IBAN/g, '')
    .trim();
  return /[a-zA-Z]{3,}/.test(clean);
}

const auditResults = {};

for (const item of allDashboardFiles) {
  if (!fs.existsSync(item.path)) continue;
  const content = fs.readFileSync(item.path, 'utf8');

  const fileReport = {
    missingArKeys: [],
    latinFallbacksInT: [],
    hardcodedAttributes: [],
    hardcodedButtons: [],
    hardcodedHeadings: []
  };

  // Find t("key", ...)
  const tRegex = /\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']+)["'])?/g;
  let match;
  while ((match = tRegex.exec(content)) !== null) {
    const key = match[1];
    const fallback = match[2];
    if (!arJson[key]) {
      fileReport.missingArKeys.push({ key, fallback });
    } else if (isLatinWord(arJson[key])) {
      fileReport.missingArKeys.push({ key, issue: 'ar.json contains latin: ' + arJson[key] });
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

  // Find hardcoded button tags: <button ...>Some English Text</button>
  const btnRegex = /<button[^>]*>\s*([A-Za-z][A-Za-z0-9\s,.'’\-–—:;!?]{2,})\s*<\/button>/g;
  while ((match = btnRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (isLatinWord(text)) {
      fileReport.hardcodedButtons.push(text);
    }
  }

  // Find hardcoded headings: <h1..h6 ...>Some English Text</h1..h6>
  const headRegex = /<h[1-6][^>]*>\s*([A-Za-z][A-Za-z0-9\s,.'’\-–—:;!?]{3,})\s*<\/h[1-6]>/g;
  while ((match = headRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (isLatinWord(text)) {
      fileReport.hardcodedHeadings.push(text);
    }
  }

  auditResults[item.name] = fileReport;
}

fs.writeFileSync(path.resolve(__dirname, 'dashboard_audit_report.json'), JSON.stringify(auditResults, null, 2), 'utf8');

let totalMissing = 0;
let totalLatinFallbacks = 0;
let totalHardcodedAttrs = 0;
let totalHardcodedBtns = 0;
let totalHardcodedHeads = 0;

for (const [name, rep] of Object.entries(auditResults)) {
  const m = rep.missingArKeys.length;
  const lf = rep.latinFallbacksInT.length;
  const ha = rep.hardcodedAttributes.length;
  const hb = rep.hardcodedButtons.length;
  const hh = rep.hardcodedHeadings.length;
  totalMissing += m;
  totalLatinFallbacks += lf;
  totalHardcodedAttrs += ha;
  totalHardcodedBtns += hb;
  totalHardcodedHeads += hh;
  if (m > 0 || lf > 0 || ha > 0 || hb > 0 || hh > 0) {
    console.log(`[${name}] Missing keys: ${m}, Latin fallbacks: ${lf}, Hardcoded attrs: ${ha}, Hardcoded buttons: ${hb}, Headings: ${hh}`);
  }
}

console.log('\n--- DASHBOARD PAGES AUDIT SUMMARY ---');
console.log(`Missing keys in ar.json: ${totalMissing}`);
console.log(`Latin fallbacks in t(): ${totalLatinFallbacks}`);
console.log(`Hardcoded attributes: ${totalHardcodedAttrs}`);
console.log(`Hardcoded button texts: ${totalHardcodedBtns}`);
console.log(`Hardcoded heading texts: ${totalHardcodedHeads}`);
