const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf8');

// Match all Route definitions
const routeMatches = appContent.matchAll(/<Route\s+[^>]*path=["']([^"']+)["'][^>]*element={<([A-Za-z0-9]+)/g);
console.log('--- Routes in App.tsx ---');
for (const m of routeMatches) {
  console.log(`Path: ${m[1].padEnd(30)} Component: ${m[2]}`);
}

// Check what directories exist in frontend/src
console.log('\n--- Frontend src directories ---');
const srcDirs = fs.readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);
console.log(srcDirs);
