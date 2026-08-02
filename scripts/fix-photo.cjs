const { PrismaClient } = require('@prisma/client');
const { renameSync, existsSync } = require('fs');
const path = require('path');

const p = new PrismaClient();

const oldName = '1785428408762-Vina-Rokhmatul-Fajriyah,-S.M.,-AWP-(1).png';
const newName = '1785428408762-k9xp2a.png'; // short name fits VarChar(40)

const imagesDir = path.join('c:/xampp/htdocs/genbi-nextjs/public/assets/images');
const oldPath = path.join(imagesDir, oldName);
const newPath = path.join(imagesDir, newName);

if (existsSync(oldPath)) {
  renameSync(oldPath, newPath);
  console.log('File renamed:', oldName, '->', newName);
} else {
  console.log('File not found (may already be renamed):', oldPath);
}

p.tbl_siswa.update({
  where: { siswa_id: 552 },
  data: { siswa_photo: newName }
}).then(r => {
  console.log('DB updated:', r.siswa_nama, '->', r.siswa_photo);
}).finally(() => p.$disconnect());
