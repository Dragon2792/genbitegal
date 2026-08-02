import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = await glob('app/**/*.tsx', { cwd: 'c:/xampp/htdocs/genbi-nextjs' });

let patchedCount = 0;

for (const file of files) {
  const fullPath = `c:/xampp/htdocs/genbi-nextjs/${file}`;
  let content = readFileSync(fullPath, 'utf8');
  const original = content;

  // Add suppressHydrationWarning to <button (not already having it)
  content = content.replace(/<button(?!\s[^>]*suppressHydrationWarning)(\s)/g, '<button\n                    suppressHydrationWarning$1');

  // Add suppressHydrationWarning to <input (not already having it)
  content = content.replace(/<input(?!\s[^>]*suppressHydrationWarning)(\s)/g, '<input\n              suppressHydrationWarning$1');

  if (content !== original) {
    writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Patched: ${file}`);
    patchedCount++;
  }
}

console.log(`\nDone. Patched ${patchedCount} files.`);
