const fs = require('fs');
const c = fs.readFileSync('frontend/src/admin/pages/Individuals.tsx', 'utf8');
const lines = c.split('\n');
const englishRegex = />\s*([A-Za-z][A-Za-z0-9 ,.!?'-]{2,})\s*</;
const placeholderRegex = /placeholder\s*=\s*["']([^"']+)["']/;
lines.forEach((l, i) => {
  const m1 = l.match(englishRegex);
  const m2 = l.match(placeholderRegex);
  if (m1 && !/^(svg|path|div|span|button|input|h1|h2|h3|h4|h5|h6|p|label|true|false|null|undefined)$/i.test(m1[1].trim()) && !m1[1].includes('className') && !m1[1].includes('style')) {
    console.log((i+1) + ' [TEXT]: ' + m1[1].trim() + ' | LINE: ' + l.trim());
  }
  if (m2 && /[a-zA-Z]{2,}/.test(m2[1]) && !/[\u0600-\u06FF]/.test(m2[1])) {
    console.log((i+1) + ' [PH]: ' + m2[1].trim() + ' | LINE: ' + l.trim());
  }
});
