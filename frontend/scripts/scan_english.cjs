const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') && !file.includes('.test.')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));
let issues = [];

const englishRegex = />\s*([A-Za-z][A-Za-z0-9 ,.!?'-]{2,})\s*</g;
const placeholderRegex = /placeholder\s*=\s*["']([^"']+)["']/g;
const titleRegex = /title\s*=\s*["']([^"']+)["']/g;
const ariaRegex = /aria-label\s*=\s*["']([^"']+)["']/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = englishRegex.exec(content)) !== null) {
    const text = m[1].trim();
    if (text && !text.startsWith('http') && !text.startsWith('xmlns') && !text.includes('className') && !text.includes('style') && text.length > 2) {
      // Ignore if it's purely code, numbers or special words like SVG
      if (!/^(svg|path|div|span|button|input|h1|h2|h3|h4|h5|h6|p|label|true|false|null|undefined)$/i.test(text)) {
        issues.push({ file: f, type: 'jsx-text', text });
      }
    }
  }
  while ((m = placeholderRegex.exec(content)) !== null) {
    const text = m[1].trim();
    if (text && /[a-zA-Z]{2,}/.test(text) && !/[\u0600-\u06FF]/.test(text)) {
      issues.push({ file: f, type: 'placeholder', text });
    }
  }
  while ((m = titleRegex.exec(content)) !== null) {
    const text = m[1].trim();
    if (text && /[a-zA-Z]{2,}/.test(text) && !/[\u0600-\u06FF]/.test(text)) {
      issues.push({ file: f, type: 'title', text });
    }
  }
  while ((m = ariaRegex.exec(content)) !== null) {
    const text = m[1].trim();
    if (text && /[a-zA-Z]{2,}/.test(text) && !/[\u0600-\u06FF]/.test(text)) {
      issues.push({ file: f, type: 'aria-label', text });
    }
  }
});

console.log('Total potential hardcoded English strings found:', issues.length);
issues.forEach(i => console.log(`${path.relative(process.cwd(), i.file)} | ${i.type} | "${i.text}"`));
