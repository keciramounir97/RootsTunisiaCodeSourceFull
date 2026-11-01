const fs = require('fs');
const path = 'frontend/src/utils/sourceFallbackTranslations.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('"legacy.user":')) {
  code = code.replace('"ar": {', '"ar": {\n    "legacy.user": "مستخدم",');
  fs.writeFileSync(path, code, 'utf8');
  console.log('Added legacy.user to sourceFallbackTranslations.ts');
}
