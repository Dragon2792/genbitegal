const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      files.push(filePath);
    }
  }
  return files;
}

const allFiles = [
  ...getFiles(path.join(process.cwd(), 'app')),
  ...getFiles(path.join(process.cwd(), 'components'))
];

let fixCount = 0;

allFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Check if first line is an import but "use client" exists elsewhere
  const hasUseClient = lines.some(l => l.trim() === '"use client";' || l.trim() === "'use client';");
  const firstLineIsImport = lines[0] && lines[0].startsWith('import');
  
  if (hasUseClient && firstLineIsImport) {
    // Remove existing "use client" line
    const filtered = lines.filter(l => l.trim() !== '"use client";' && l.trim() !== "'use client';");
    // Remove leading blank lines
    while (filtered.length > 0 && filtered[0].trim() === '') filtered.shift();
    // Prepend "use client"
    filtered.unshift('"use client";', '');
    const newContent = filtered.join('\n');
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed: ${filePath}`);
    fixCount++;
  }
});

console.log(`Total fixed: ${fixCount}`);
