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

const allFiles = [...getFiles(path.join(process.cwd(), 'app')), ...getFiles(path.join(process.cwd(), 'components'))];

allFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Check if the file has /assets/images/ or /assets/files/
  if (content.includes('/assets/images/') || content.includes('/assets/files/')) {
    
    // Ensure import getStorageUrl exists
    if (!content.includes('getStorageUrl')) {
      // Add import at the top
      content = `import { getStorageUrl } from "@/lib/storageUrl";\n` + content;
    }

    // Replace template strings: `/assets/images/${var}` -> getStorageUrl(var)
    content = content.replace(/`\/assets\/images\/\$\{([^}]+)\}`/g, "getStorageUrl($1) || ''");
    content = content.replace(/`\/assets\/files\/\$\{([^}]+)\}`/g, "getStorageUrl($1, 'files') || ''");

    // Replace hardcoded strings in attributes (like src="...")
    content = content.replace(/src="\/assets\/images\/([^"]+)"/g, "src={getStorageUrl('$1') || ''}");
    content = content.replace(/href="\/assets\/files\/([^"]+)"/g, "href={getStorageUrl('$1', 'files') || ''}");

    // Some generic string replacements inside components if they use '/assets/images/'
    content = content.replace(/'\/assets\/images\/' \+ ([a-zA-Z0-9_.]+)/g, "getStorageUrl($1) || ''");
    content = content.replace(/"\/assets\/images\/" \+ ([a-zA-Z0-9_.]+)/g, "getStorageUrl($1) || ''");

    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated frontend: ${filePath}`);
    }
  }
});
