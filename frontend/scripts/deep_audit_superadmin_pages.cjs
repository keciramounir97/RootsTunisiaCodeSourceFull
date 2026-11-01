const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const superAdminFiles = [
  'src/admin/pages/SuperAdminApprovals.tsx',
  'src/admin/pages/AdminManagement.tsx',
  'src/admin/pages/PasswordResetRequests.tsx',
  'src/admin/pages/AccountDeletionRequests.tsx',
  'src/admin/pages/RoleDistribution.tsx',
  'src/admin/pages/SubscriptionPayments.tsx',
  'src/admin/pages/TierFeatures.tsx',
  'src/admin/pages/PaymentSettings.tsx',
  'src/admin/pages/Backups.tsx',
  'src/admin/pages/LegalContent.tsx',
  'src/admin/pages/UserUpgrade.tsx',
  'src/admin/pages/Users.tsx'
];

console.log('=== DEEP AUDIT OF SUPER ADMIN PAGES ===\n');

for (const relFile of superAdminFiles) {
  const fullPath = path.resolve(__dirname, '..', relFile);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  console.log(`========================================`);
  console.log(`FILE: ${relFile}`);
  console.log(`========================================`);

  // Check 1: All t(...) keys
  const tMatches = content.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  let missingKeys = 0;
  for (const m of tMatches) {
    const key = m[1];
    const fallback = m[2];
    if (key.length <= 1) continue;
    if (!ar[key]) {
      console.log(`  [MISSING KEY] "${key}" (fallback: "${fallback}")`);
      missingKeys++;
    } else {
      const val = ar[key];
      if (!/[\u0600-\u06FF]/.test(val)) {
        if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|https?:\/\/|[a-z0-9._%+-]+@|\+?\d+[\s-–\.,\/:a-z]*)$/i.test(val.trim())) {
          console.log(`  [NON-ARABIC VALUE] key: "${key}" => "${val}"`);
          missingKeys++;
        }
      }
    }
  }

  // Check 2: All string literals in JSX elements
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ') || (trimmed.startsWith('const ') && trimmed.includes('require('))) return;

    // Check placeholder="Literal"
    const ph = line.match(/\bplaceholder=["']([^"']+)["']/);
    if (ph) {
      const val = ph[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{2,}/.test(val) && !val.includes('{') && !val.startsWith('http')) {
        console.log(`  Line ${idx + 1}: [HARDCODED PLACEHOLDER] "${val}"`);
      }
    }

    // Check title="Literal"
    const ti = line.match(/\btitle=["']([^"']+)["']/);
    if (ti) {
      const val = ti[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val) && !val.includes('{') && !val.startsWith('http') && !/^(text|button|submit|reset|checkbox|radio)$/i.test(val)) {
        console.log(`  Line ${idx + 1}: [HARDCODED TITLE] "${val}"`);
      }
    }

    // Check button text
    const btn = line.match(/>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/(?:button|Button)>/);
    if (btn) {
      const val = btn[1].trim();
      if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|OK)$/i.test(val)) {
        console.log(`  Line ${idx + 1}: [HARDCODED BUTTON] "${val}"`);
      }
    }

    // Check headings
    const h = line.match(/<h[1-6][^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/h[1-6]>/);
    if (h) {
      const val = h[1].trim();
      console.log(`  Line ${idx + 1}: [HARDCODED HEADING] "${val}"`);
    }

    // Check toasts & alerts
    const toast = line.match(/(?:showToast|toast\.(?:success|error)|alert|confirm|window\.confirm)\(\s*["']([^"']+)["']/);
    if (toast) {
      const val = toast[1].trim();
      if (!/[\u0600-\u06FF]/.test(val) && /[a-zA-Z]{3,}/.test(val)) {
        console.log(`  Line ${idx + 1}: [HARDCODED TOAST/ALERT] "${val}"`);
      }
    }
  });

  console.log(`Done auditing ${relFile}.\n`);
}
