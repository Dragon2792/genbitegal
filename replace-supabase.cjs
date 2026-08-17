const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/admin/(dashboard)/pengguna/actions.ts',
  'app/admin/(dashboard)/galeri/actions.ts',
  'app/admin/(dashboard)/files/actions.ts',
  'app/admin/(dashboard)/anggota/actions.ts',
  'app/admin/(dashboard)/album/actions.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace imports
  content = content.replace(/import\s+\{\s*writeFile\s*\}\s+from\s+['"]fs\/promises['"];\r?\nimport\s+path\s+from\s+['"]path['"];/, 'import { supabase } from "@/lib/supabase";');
  
  // Replace delete imports
  content = content.replace(/import\s+\{\s*unlink\s*\}\s+from\s+['"]fs\/promises['"];\r?\n?/, '');

  // 1. Replace let photoName/filefoto declaration & assignment
  content = content.replace(/const bytes = await ([a-zA-Z0-9_]+)\.arrayBuffer\(\);\s*const buffer = Buffer\.from\(bytes\);\s*photoName = .*?;\s*const uploadPath = path\.join.*?;\s*await writeFile\(uploadPath, buffer\);/gs, (match, varName) => {
    return `// Generate short unique name that fits VarChar(40) in DB
    const ext = ${varName}.name.split('.').pop()?.toLowerCase() || 'jpg';
    photoName = \`\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}.\${ext}\`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("genbi-assets")
      .upload(\`images/\${photoName}\`, ${varName}, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("Failed to upload image:", error);
    }`;
  });

  // 2. Replace const photoName declaration & assignment
  content = content.replace(/const bytes = await ([a-zA-Z0-9_]+)\.arrayBuffer\(\);\s*const buffer = Buffer\.from\(bytes\);\s*const photoName = .*?;\s*const uploadPath = path\.join.*?;\s*await writeFile\(uploadPath, buffer\);\s*(dataToUpdate\.[a-zA-Z0-9_]+ = photoName;)?/gs, (match, varName, dataToUpdateStr) => {
    return `// Generate short unique name that fits VarChar(40) in DB
    const ext = ${varName}.name.split('.').pop()?.toLowerCase() || 'jpg';
    const photoName = \`\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}.\${ext}\`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("genbi-assets")
      .upload(\`images/\${photoName}\`, ${varName}, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("Failed to upload image:", error);
    } else {
      ${dataToUpdateStr || ''}
    }`;
  });

  // 3. Replace unlink calls
  content = content.replace(/await unlink\(path\.join.*?,\s*([^)]+)\)\);/g, (match, filenameVar) => {
    return `await supabase.storage.from("genbi-assets").remove([\`images/\${${filenameVar}}\`]);`;
  });

  // Write back
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
