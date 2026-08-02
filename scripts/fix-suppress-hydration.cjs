const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const path = require('path');

const ROOT = 'c:/xampp/htdocs/genbi-nextjs/app';

function walkSync(dir, ext, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walkSync(full, ext, results);
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

const files = walkSync(ROOT, '.tsx');
let patchedCount = 0;

for (const fullPath of files) {
  let content = readFileSync(fullPath, 'utf8');
  const original = content;

  // Fix broken <button`n                    suppressHydrationWarning -> <button\n                    suppressHydrationWarning
  // The PowerShell script inserted literal backtick-n instead of real newlines
  content = content.replace(/<button`n\s*suppressHydrationWarning/g, '<button\n                    suppressHydrationWarning');
  content = content.replace(/<input`n\s*suppressHydrationWarning/g, '<input\n              suppressHydrationWarning');

  // Also remove any duplicate suppressHydrationWarning that got added multiple times
  content = content.replace(/(suppressHydrationWarning\s*\n?\s*)+suppressHydrationWarning/g, 'suppressHydrationWarning');

  if (content !== original) {
    writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed: ' + path.relative(ROOT, fullPath));
    patchedCount++;
  }
}

console.log('\nDone. Fixed ' + patchedCount + ' files.');
