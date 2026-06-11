const { execFileSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');

const roots = [join(__dirname, '..', 'src')];

function collectJsFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectJsFiles(fullPath, files);
    } else if (entry.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

for (const file of roots.flatMap((root) => collectJsFiles(root))) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

console.log('syntax ok');
