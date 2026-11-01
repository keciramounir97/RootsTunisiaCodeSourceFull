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
  'src/admin/pages/Users.tsx',
  'src/admin/pages/UserApprovals.tsx'
];

console.log('=== COMPREHENSIVE AUDIT OF ALL SUPER ADMIN PAGES ===\n');

let totalIssues = 0;

for (const relFile of superAdminFiles) {
  const fullPath = path.resolve(__dirname, '..', relFile);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const issues = [];

  // 1. Multiline and singleline t("key", "fallback")
  const tMatches = content.matchAll(/\bt\(\s*["'`]([^"'`]+)["'`]\s*(?:,\s*["'`]([\s\S]*?)["'`])?\s*\)/g);
  for (const m of tMatches) {
    const key = m[1].trim();
    const fallback = (m[2] || '').trim();
    if (key.length <= 1 || key.startsWith('$') || key.includes('${')) continue;

    if (!ar[key]) {
      issues.push(`[MISSING AR KEY]: "${key}" | Fallback: "${fallback.replace(/\n/g, ' ')}"`);
    } else {
      const val = ar[key];
      if (!/[\u0600-\u06FF]/.test(val)) {
        if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|https?:\/\/|[a-z0-9._%+-]+@|\+?\d+[\s-–\.,\/:a-z]*)$/i.test(val.trim())) {
          issues.push(`[NON-AR VALUE IN AR.JSON]: key: "${key}" => "${val}"`);
        }
      }
    }
  }

  // 2. Hardcoded texts in notify, alert, confirm
  const notifyMatches = content.matchAll(/(?:notify|showToast|alert|confirm|window\.confirm)\s*\(\s*["']([^"']+)["']/g);
  for (const m of notifyMatches) {
    const txt = m[1].trim();
    if (/[a-zA-Z]{3,}/.test(txt) && !/[\u0600-\u06FF]/.test(txt)) {
      issues.push(`[HARDCODED NOTIFY/ALERT]: "${txt}"`);
    }
  }

  // 3. Hardcoded English placeholders
  const phMatches = content.matchAll(/placeholder\s*=\s*["']([^"']+)["']/g);
  for (const m of phMatches) {
    const txt = m[1].trim();
    if (/[a-zA-Z]{2,}/.test(txt) && !/[\u0600-\u06FF]/.test(txt) && !txt.startsWith('http') && !/^\+?\d+$/.test(txt)) {
      issues.push(`[HARDCODED PLACEHOLDER]: "${txt}"`);
    }
  }

  // 4. Hardcoded English title / aria-label
  const titleMatches = content.matchAll(/(?:title|aria-label)\s*=\s*["']([^"']+)["']/g);
  for (const m of titleMatches) {
    const txt = m[1].trim();
    if (/[a-zA-Z]{2,}/.test(txt) && !/[\u0600-\u06FF]/.test(txt) && !/^(text|button|submit|reset|checkbox|radio)$/i.test(txt)) {
      issues.push(`[HARDCODED TITLE/ARIA]: "${txt}"`);
    }
  }

  // 5. Hardcoded English tags (th, td, button, h1-h6)
  const tagMatches = content.matchAll(/<(?:th|td|button|h[1-6]|span|p|label)[^>]*>\s*([A-Za-z][A-Za-z0-9\s,\.!\?'-]{2,})\s*<\/(?:th|td|button|h[1-6]|span|p|label)>/g);
  for (const m of tagMatches) {
    const txt = m[1].trim();
    if (!/^(PDF|EPUB|GEDCOM|MP3|CSV|JSON|API|URL|ID|TND|TTC|USD|EUR|OK|IBAN)$/i.test(txt)) {
      issues.push(`[HARDCODED TAG TEXT]: "${txt}"`);
    }
  }

  console.log(`PAGE: ${relFile}`);
  if (issues.length === 0) {
    console.log(`  -> 100% CLEAN! Zero foreign/missing translations found.\n`);
  } else {
    totalIssues += issues.length;
    issues.forEach((iss) => console.log(`  ! ${iss}`));
    console.log(`  Found ${issues.length} issue(s).\n`);
  }
}

console.log(`\n=== AUDIT COMPLETE: ${totalIssues} total issue(s) across super admin pages ===`);
