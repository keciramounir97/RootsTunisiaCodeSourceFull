const fs = require('fs');
const path = require('path');
const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const adminPagesDir = path.resolve(__dirname, '../src/admin/pages');
const adminFiles = fs.readdirSync(adminPagesDir).filter(f => f.endsWith('.tsx'));

const missing = {};

adminFiles.forEach(f => {
  const c = fs.readFileSync(path.join(adminPagesDir, f), 'utf8');
  const tMatches = c.matchAll(/\bt\(\s*["']([^"']+)["'](?:\s*,\s*["']([^"']*)["'])?\s*\)/g);
  for (const m of tMatches) {
    const key = m[1];
    const fallback = m[2];
    if (key.length <= 1) continue;
    if (!arJson[key]) {
      missing[key] = fallback || key;
      console.log(`[admin/${f}] missing: "${key}" (fallback: "${fallback}")`);
    }
  }
});

console.log('Total missing across all admin pages:', Object.keys(missing).length);
