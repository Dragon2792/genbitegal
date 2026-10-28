const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TULISAN_JSON = path.join(ROOT_DIR, 'backup', 'database', 'tbl_tulisan_2026-10-26T14-20-24-769Z.json');

const tulisan = JSON.parse(fs.readFileSync(TULISAN_JSON, 'utf8'));

let updatedCover = 0;
let updatedContent = 0;

for (const t of tulisan) {
  // 1. Bersihkan tulisan_gambar
  if (t.tulisan_gambar && t.tulisan_gambar.includes('cloudinary.com')) {
    const filename = path.basename(t.tulisan_gambar.split('?')[0]);
    t.tulisan_gambar = filename;
    updatedCover++;
  }

  // 2. Bersihkan tulisan_isi (Quill HTML)
  if (t.tulisan_isi && t.tulisan_isi.includes('cloudinary.com')) {
    // Ganti format https://res.cloudinary.com/.../genbi/images/filename.ext
    // menjadi /assets/images/filename.ext
    t.tulisan_isi = t.tulisan_isi.replace(
      /https?:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/(?:v\d+\/)?(?:genbi\/images\/)?([^"'\s<>]+)/g,
      '/assets/images/$1'
    );
    updatedContent++;
  }
}

fs.writeFileSync(TULISAN_JSON, JSON.stringify(tulisan, null, 2), 'utf8');

console.log(`✅ Berhasil membersihkan referensi Cloudinary:`);
console.log(`- Cover gambar diperbarui: ${updatedCover}`);
console.log(`- Isi artikel diperbarui: ${updatedContent}`);
