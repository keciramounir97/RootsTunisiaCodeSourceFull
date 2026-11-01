const fs = require('fs');
const path = require('path');

const files = [
  'GalleryBooks.tsx',
  'GalleryDocuments.tsx',
  'GalleryAudios.tsx',
  'GalleryImages.tsx',
  'GalleryTrees.tsx',
  'GalleryArticles.tsx',
  'Gallery.tsx',
  'genealogy-gallery.tsx',
  'HelpCenter.tsx',
  'Research.tsx',
  'contactUs.tsx',
  'about.tsx',
  'payment.tsx',
  'refund.tsx',
  'unsubscribe.tsx',
  'terms.tsx',
  'privacy.tsx',
  'cookies.tsx',
  'login.tsx',
  'signup.tsx',
  'resetpassword.tsx',
  'error.tsx'
];

for (const f of files) {
  const p = path.resolve(__dirname, '../src/pages', f);
  if (!fs.existsSync(p)) continue;
  const c = fs.readFileSync(p, 'utf8');
  console.log(`\n================== ${f} ==================`);
  
  // Look for hardcoded arrays
  const lines = c.split('\n');
  lines.forEach((line, idx) => {
    if (line.match(/const\s+[A-Za-z0-9_]+\s*:\s*[A-Za-z0-9_<>[\]]+\s*=\s*\[/) || line.match(/const\s+[A-Za-z0-9_]+\s*=\s*\[/)) {
      console.log(`  Line ${idx+1}: ${line.trim()}`);
    }
  });

  // Look for buttons, titles, placeholders
  const plMatches = c.match(/placeholder=\{[^}]+\}|placeholder="[^"]+"/g);
  if (plMatches) {
    console.log(`  Placeholders (${plMatches.length}):`, plMatches.slice(0, 5));
  }

  // Look for card buttons or titles
  const cardMatches = c.match(/<(button|h1|h2|h3|h4|h5|h6)[^>]*>([^<]+)<\/\1>/g);
  if (cardMatches) {
    const latinCards = cardMatches.filter(m => /[a-zA-Z]{3,}/.test(m));
    if (latinCards.length > 0) {
      console.log(`  Hardcoded tag contents with Latin (${latinCards.length}):`, latinCards.slice(0, 5));
    }
  }
}
