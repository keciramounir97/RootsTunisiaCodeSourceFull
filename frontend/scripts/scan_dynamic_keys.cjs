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
  'src/admin/components/TreesBuilder.tsx',
  'src/admin/components/AdminHeader.tsx',
  'src/admin/components/AdminSidebar.tsx',
  'src/admin/components/Breadcrumb.tsx'
];

console.log('=== SCANNING FOR ALL DYNAMIC KEYS IN CONFIG OBJECTS ===\n');

for (const relFile of userDashboardFiles) {
  const fullPath = path.resolve(__dirname, '..', relFile);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');

  // Find all *Key: "string" or key: "string"
  const keyMatches = content.matchAll(/(?:\w+Key|key)\s*:\s*["']([a-zA-Z0-9_\.-]+)["']/g);
  const missingKeys = [];

  for (const match of keyMatches) {
    const key = match[1];
    // ignore standard react keys or simple enum values
    if (['todo', 'in_progress', 'done', 'custom', 'birthday', 'event', 'task', 'id', 'key', 'index'].includes(key)) continue;

    // Check if key is passed to t()
    if (!arJson[key]) {
      // Check if it looks like an i18n translation key
      if (key.includes('_') || key.startsWith('nav') || key.startsWith('plan') || key.startsWith('feat') || key.startsWith('task') || key.startsWith('note') || key.startsWith('status')) {
        missingKeys.push(key);
      }
    }
  }

  if (missingKeys.length > 0) {
    console.log(`[FILE] ${relFile}`);
    console.log(`  Missing dynamic keys:`, [...new Set(missingKeys)]);
  }
}
