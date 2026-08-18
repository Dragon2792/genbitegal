// Script untuk upload semua file dari public/assets ke Supabase Storage
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://vczmodqqnjwynvdgihsg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjem1vZHFxbmp3eW52ZGdpaHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODUyMTAsImV4cCI6MjEwMjU2MTIxMH0.7qLB9Qv8H-Pmj06KXbQJDdgY-eiLJakbTQwsdhMOoDI";
const BUCKET = "genbi-asset";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimes = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', bmp: 'image/bmp', webp: 'image/webp',
    svg: 'image/svg+xml', pdf: 'application/pdf',
    doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint', zip: 'application/zip',
  };
  return mimes[ext] || 'application/octet-stream';
}

async function uploadFolder(localFolder, supabasePrefix) {
  if (!fs.existsSync(localFolder)) {
    console.log(`⚠️  Folder tidak ditemukan: ${localFolder}`);
    return { success: 0, failed: 0, skipped: 0 };
  }

  const files = fs.readdirSync(localFolder).filter(f => {
    const stat = fs.statSync(path.join(localFolder, f));
    return stat.isFile();
  });

  let success = 0, failed = 0, skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const localPath = path.join(localFolder, filename);
    const supabasePath = `${supabasePrefix}/${filename}`;

    process.stdout.write(`\r[${i + 1}/${files.length}] Uploading: ${filename.slice(0, 40).padEnd(40)}`);

    const fileBuffer = fs.readFileSync(localPath);
    const contentType = getMimeType(filename);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(supabasePath, fileBuffer, {
        contentType,
        upsert: true // overwrite jika sudah ada
      });

    if (error) {
      if (error.message && error.message.includes('already exists')) {
        skipped++;
      } else {
        failed++;
        // Log error ke file
        fs.appendFileSync('upload-errors.log', `FAILED: ${filename} - ${error.message}\n`);
      }
    } else {
      success++;
    }
  }

  console.log(''); // newline setelah progress
  return { success, failed, skipped };
}

async function main() {
  console.log('🚀 Memulai upload semua asset ke Supabase Storage...');
  console.log(`📦 Bucket: ${BUCKET}`);
  console.log('');

  // Upload folder images
  console.log('📸 Mengupload folder images (965 file)...');
  const imagesResult = await uploadFolder(
    path.join(process.cwd(), 'public', 'assets', 'images'),
    'images'
  );
  console.log(`   ✅ Berhasil: ${imagesResult.success} | ❌ Gagal: ${imagesResult.failed} | ⏩ Dilewati: ${imagesResult.skipped}`);

  console.log('');
  // Upload folder files
  console.log('📄 Mengupload folder files (9 file)...');
  const filesResult = await uploadFolder(
    path.join(process.cwd(), 'public', 'assets', 'files'),
    'files'
  );
  console.log(`   ✅ Berhasil: ${filesResult.success} | ❌ Gagal: ${filesResult.failed} | ⏩ Dilewati: ${filesResult.skipped}`);

  console.log('');
  console.log('🎉 Upload selesai!');
  
  const totalFailed = imagesResult.failed + filesResult.failed;
  if (totalFailed > 0) {
    console.log(`⚠️  ${totalFailed} file gagal diupload. Lihat upload-errors.log untuk detailnya.`);
  } else {
    console.log('✅ Semua file berhasil diupload ke Supabase!');
    console.log(`🔗 URL contoh: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/images/<namafile.jpg>`);
  }
}

main().catch(console.error);
