const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const destDir = path.join(root, 'src', 'assets', 'fonts');
const variableScope = path.join(root, 'node_modules', '@fontsource-variable');

fs.mkdirSync(destDir, { recursive: true });

for (const name of fs.readdirSync(destDir)) {
  if (name.endsWith('.woff2')) {
    fs.unlinkSync(path.join(destDir, name));
  }
}

if (!fs.existsSync(variableScope)) {
  console.error('Missing directory:', variableScope);
  process.exit(1);
}

let copied = 0;
for (const ent of fs.readdirSync(variableScope, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const filesDir = path.join(variableScope, ent.name, 'files');
  if (!fs.existsSync(filesDir)) continue;
  for (const file of fs.readdirSync(filesDir)) {
    if (!file.endsWith('.woff2') || !file.includes('latin')) continue;
    fs.copyFileSync(path.join(filesDir, file), path.join(destDir, file));
    copied += 1;
  }
}

if (copied === 0) {
  console.error('No *latin*.woff2 files found under', variableScope);
  process.exit(1);
}
