const fs = require('fs');
const path = require('path');
const https = require('https');
const { Client } = require('pg');

const ROOT_DIR = path.resolve(__dirname, '..');
const BACKUP_DIR = path.join(ROOT_DIR, 'backup');
const DB_BACKUP_DIR = path.join(BACKUP_DIR, 'database');
const ENV_BACKUP_DIR = path.join(BACKUP_DIR, 'env');
const MEDIA_BACKUP_DIR = path.join(BACKUP_DIR, 'media', 'cloudinary');

// Pastikan folder backup tersedia
[BACKUP_DIR, DB_BACKUP_DIR, ENV_BACKUP_DIR, MEDIA_BACKUP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper format date
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

// 1. BACKUP ENV
function backupEnv(timestamp) {
  console.log('\n[1/3] 🔐 Membackup Environment Variables...');
  const envPath = path.join(ROOT_DIR, '.env');
  const targetPath = path.join(ENV_BACKUP_DIR, `.env.backup_${timestamp}`);
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, targetPath);
    console.log(`  ✅ .env berhasil disalin ke: ${targetPath}`);
  } else {
    console.log('  ⚠️ File .env tidak ditemukan di root!');
  }
}

// 2. BACKUP DATABASE KE SQL & JSON
async function backupDatabase(timestamp) {
  console.log('\n[2/3] 🗄️ Membackup Database PostgreSQL (Supabase)...');
  
  // Baca koneksi dari .env
  const envContent = fs.readFileSync(path.join(ROOT_DIR, '.env'), 'utf8');
  const directMatch = envContent.match(/DIRECT_URL=["'](.*?)["']/);
  const dbMatch = envContent.match(/DATABASE_URL=["'](.*?)["']/);
  const connString = (directMatch && directMatch[1]) || (dbMatch && dbMatch[1]);

  if (!connString) {
    throw new Error('DATABASE_URL / DIRECT_URL tidak ditemukan di .env');
  }

  const client = new Client({ connectionString: connString });
  await client.connect();
  console.log('  ✅ Terhubung ke database Supabase');

  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  const tables = tablesRes.rows.map(r => r.table_name);
  console.log(`  📋 Ditemukan ${tables.length} tabel: ${tables.join(', ')}`);

  const sqlFilePath = path.join(DB_BACKUP_DIR, `database_dump_${timestamp}.sql`);
  const sqlStream = fs.createWriteStream(sqlFilePath, { flags: 'a', encoding: 'utf8' });

  sqlStream.write(`-- Backup Database GenBI Next.js\n-- Tanggal: ${new Date().toISOString()}\n\n`);
  sqlStream.write(`SET client_encoding = 'UTF8';\n\n`);

  const summary = {};

  for (const table of tables) {
    process.stdout.write(`  ⏳ Membackup tabel ${table}... `);
    const countRes = await client.query(`SELECT COUNT(*) FROM "${table}"`);
    const count = parseInt(countRes.rows[0].count, 10);
    summary[table] = count;

    sqlStream.write(`-- -----------------------------------------------------\n`);
    sqlStream.write(`-- Data untuk tabel: ${table} (Total: ${count} baris)\n`);
    sqlStream.write(`-- -----------------------------------------------------\n`);

    const jsonFilePath = path.join(DB_BACKUP_DIR, `${table}_${timestamp}.json`);
    const jsonStream = fs.createWriteStream(jsonFilePath, { flags: 'w', encoding: 'utf8' });
    jsonStream.write('[\n');

    const CHUNK_SIZE = 5000;
    let offset = 0;
    let isFirstJsonItem = true;

    while (offset < count || count === 0) {
      const rowsRes = await client.query(`SELECT * FROM "${table}" LIMIT ${CHUNK_SIZE} OFFSET ${offset}`);
      const rows = rowsRes.rows;

      if (rows.length === 0) break;

      for (const row of rows) {
        // Write JSON
        const jsonStr = JSON.stringify(row);
        if (!isFirstJsonItem) {
          jsonStream.write(',\n');
        }
        jsonStream.write('  ' + jsonStr);
        isFirstJsonItem = false;

        // Write SQL INSERT
        const keys = Object.keys(row).map(k => `"${k}"`).join(', ');
        const values = Object.values(row).map(val => {
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number' || typeof val === 'boolean') return val;
          if (val instanceof Date) return `'${val.toISOString()}'`;
          if (Buffer.isBuffer(val)) return `'\\x${val.toString('hex')}'`;
          // Escape single quote
          const escaped = String(val).replace(/'/g, "''");
          return `'${escaped}'`;
        }).join(', ');

        sqlStream.write(`INSERT INTO "${table}" (${keys}) VALUES (${values});\n`);
      }

      offset += CHUNK_SIZE;
      if (count === 0) break;
    }

    jsonStream.write('\n]\n');
    jsonStream.end();

    console.log(`Berhasil (${count} baris)`);
  }

  sqlStream.end();
  await client.end();
  console.log(`  ✅ SQL Dump tersimpan di: ${sqlFilePath}`);
  return summary;
}

// 3. BACKUP MEDIA CLOUDINARY
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function backupCloudinaryMedia() {
  console.log('\n[3/3] ☁️ Mengunduh Media Cloudinary ke backup lokal...');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const articles = await prisma.tbl_tulisan.findMany({
      where: {
        tulisan_gambar: {
          contains: 'cloudinary'
        }
      },
      select: {
        tulisan_id: true,
        tulisan_gambar: true
      }
    });

    console.log(`  📷 Ditemukan ${articles.length} gambar Cloudinary di database.`);

    for (const item of articles) {
      const url = item.tulisan_gambar;
      const filename = path.basename(url.split('?')[0]);
      const destPath = path.join(MEDIA_BACKUP_DIR, filename);

      if (fs.existsSync(destPath)) {
        console.log(`  ⏩ [Terkoleksi] ${filename}`);
        continue;
      }

      try {
        await downloadFile(url, destPath);
        console.log(`  ⬇️ [Tersimpan] ${filename}`);
      } catch (err) {
        console.error(`  ❌ Gagal unduh ${url}: ${err.message}`);
      }
    }
    console.log(`  ✅ Semua media Cloudinary berhasil di-backup ke: ${MEDIA_BACKUP_DIR}`);
  } finally {
    await prisma.$disconnect();
  }
}

// RUNNER
async function main() {
  const timestamp = getTimestamp();
  console.log(`====================================================`);
  console.log(`🚀 MEMULAI PROSES BACKUP LENGKAP PROJEK GENBI TEGAL`);
  console.log(`Waktu: ${new Date().toLocaleString()}`);
  console.log(`====================================================`);

  try {
    backupEnv(timestamp);
    const summary = await backupDatabase(timestamp);
    await backupCloudinaryMedia();

    console.log(`\n====================================================`);
    console.log(`🎉 BACKUP SELESAI SEMPURNA!`);
    console.log(`Folder Penyimpanan: ${BACKUP_DIR}`);
    console.log(`Ringkasan Baris Data:`);
    Object.entries(summary).forEach(([tbl, count]) => {
      console.log(`  - ${tbl.padEnd(20)}: ${count} baris`);
    });
    console.log(`====================================================\n`);
  } catch (err) {
    console.error(`\n❌ ERROR saat backup:`, err);
  }
}

main();
