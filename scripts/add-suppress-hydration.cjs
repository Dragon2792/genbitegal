const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const path = require('path');

const ROOTS = [
  'c:/xampp/htdocs/genbi-nextjs/app',
  'c:/xampp/htdocs/genbi-nextjs/components',
];

function walkSync(dir, ext, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walkSync(full, ext, results);
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

const files = ROOTS.flatMap(r => walkSync(r, '.tsx'));
let patchedCount = 0;

for (const fullPath of files) {
  let content = readFileSync(fullPath, 'utf8');
  const original = content;

  // Tags that browser extensions inject fdprocessedid into
  const tags = ['button', 'input', 'select', 'textarea'];

  for (const tag of tags) {
    // Match opening tag that does NOT already have suppressHydrationWarning
    // Use a regex that finds <tag followed by whitespace (attributes), not already patched
    const re = new RegExp(`<${tag}(?![^>]*suppressHydrationWarning)(\\s)`, 'g');
    content = content.replace(re, `<${tag}\n              suppressHydrationWarning$1`);
  }

  if (content !== original) {
    writeFileSync(fullPath, content, 'utf8');
    console.log('Patched: ' + fullPath);
    patchedCount++;
  }
}

console.log('\nDone. Patched ' + patchedCount + ' files.');
