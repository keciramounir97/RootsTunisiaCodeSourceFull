const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf8');

// Find all Route blocks with roles={[3]} or roles={[1, 3]} or privileges
const lines = appContent.split('\n');
const superAdminRoutes = [];

let currentPath = '';
let currentRoles = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const pathMatch = line.match(/path=["']([^"']+)["']/);
  if (pathMatch) {
    currentPath = pathMatch[1];
  }
  const roleMatch = line.match(/roles=\{\[([^\]]+)\]\}/);
  if (roleMatch) {
    currentRoles = roleMatch[1];
  }
  const compMatch = line.match(/<([A-Z][a-zA-Z0-9]+)\s*\/>/);
  if (compMatch && currentRoles.includes('3')) {
    superAdminRoutes.push({
      path: currentPath,
      roles: currentRoles,
      component: compMatch[1]
    });
    currentRoles = '';
  }
}

console.log('=== SUPER ADMIN ROUTES & COMPONENTS ===');
superAdminRoutes.forEach(r => {
  console.log(`Path: /admin/${r.path} | Roles: [${r.roles}] | Component: <${r.component} />`);
});
