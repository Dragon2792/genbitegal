const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DB_BACKUP_DIR = path.join(ROOT_DIR, 'backup', 'database');

// 1. Dapatkan DDL CREATE TABLE dari Prisma
console.log('Generating CREATE TABLE DDL from Prisma schema...');
const ddl = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script', {
  cwd: ROOT_DIR,
  encoding: 'utf8',
});

// Urutan tabel untuk insert
const tableOrder = [
  'tbl_kategori',
  'tbl_kelas',
  'tbl_pengguna',
  'tbl_agenda',
  'tbl_album',
  'tbl_files',
  'tbl_galeri',
  'tbl_guru',
  'tbl_inbox',
  'tbl_komentar',
  'tbl_log_aktivitas',
  'tbl_pengumuman',
  'tbl_siswa',
  'tbl_testimoni',
  'tbl_komisariat',
  'tbl_tulisan',
  'tbl_pengunjung'
];

function escapeSqlString(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  
  // Tangani Date / ISO string
  if (typeof val === 'string') {
    // Cek format ISO Date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mi = String(d.getUTCMinutes()).padStart(2, '0');
        const ss = String(d.getUTCSeconds()).padStart(2, '0');
        return `'${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}'`;
      }
    }
    // Escape string standard MySQL
    const escaped = val
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\0/g, '\\0');
    return `'${escaped}'`;
  }

  if (Buffer.isBuffer(val)) {
    return `X'${val.toString('hex')}'`;
  }

  // Jika object { type: 'Buffer', data: [...] }
  if (typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
    return `X'${Buffer.from(val.data).toString('hex')}'`;
  }

  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

async function buildSqlFiles() {
  const jsonFiles = fs.readdirSync(DB_BACKUP_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${jsonFiles.length} JSON files in backup.`);

  // Kita akan membuat 2 file SQL:
  // 1. genbi_mysql_ready.sql (LENGKAP dengan tbl_pengunjung)
  // 2. genbi_mysql_light.sql (TANPA log pengunjung tbl_pengunjung agar sangat ringan di phpMyAdmin)
  
  const fullSqlPath = path.join(DB_BACKUP_DIR, 'genbi_mysql_ready.sql');
  const lightSqlPath = path.join(DB_BACKUP_DIR, 'genbi_mysql_light.sql');

  const fullStream = fs.createWriteStream(fullSqlPath, { flags: 'w', encoding: 'utf8' });
  const lightStream = fs.createWriteStream(lightSqlPath, { flags: 'w', encoding: 'utf8' });

  const header = `/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ========================================================
-- GenBI Tegal Database Dump (MySQL / MariaDB Compatible)
-- Generated: ${new Date().toISOString()}
-- ========================================================

${ddl}

-- ========================================================
-- DATA INSERTION
-- ========================================================
`;

  fullStream.write(header);
  lightStream.write(header);

  for (const table of tableOrder) {
    const file = jsonFiles.find(f => f.startsWith(`${table}_`));
    if (!file) {
      console.log(`⚠️ File JSON untuk ${table} tidak ditemukan, skipping.`);
      continue;
    }

    console.log(`Processing ${table}...`);
    const rawData = fs.readFileSync(path.join(DB_BACKUP_DIR, file), 'utf8');
    const rows = JSON.parse(rawData);

    if (rows.length === 0) {
      console.log(`  Table ${table} is empty.`);
      continue;
    }

    const cols = Object.keys(rows[0]);
    const colList = cols.map(c => `\`${c}\``).join(', ');

    const BATCH_SIZE = 500;
    
    // Fungsi tulis batch
    const writeBatches = (stream) => {
      stream.write(`\n-- Data for table \`${table}\` (${rows.length} rows)\n`);
      stream.write(`LOCK TABLES \`${table}\` WRITE;\n`);
      stream.write(`ALTER TABLE \`${table}\` DISABLE KEYS;\n`);

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const valueClauses = batch.map(row => {
          const vals = cols.map(c => escapeSqlString(row[c]));
          return `(${vals.join(', ')})`;
        });
        stream.write(`INSERT INTO \`${table}\` (${colList}) VALUES\n${valueClauses.join(',\n')};\n`);
      }

      stream.write(`ALTER TABLE \`${table}\` ENABLE KEYS;\n`);
      stream.write(`UNLOCK TABLES;\n`);
    };

    writeBatches(fullStream);

    if (table !== 'tbl_pengunjung') {
      writeBatches(lightStream);
    } else {
      console.log(`  Skipping tbl_pengunjung in light dump.`);
      lightStream.write(`\n-- Skipped tbl_pengunjung in light dump (133k rows of visitor logs)\n`);
    }
  }

  const footer = `
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
-- Dump completed on ${new Date().toISOString()}
`;

  fullStream.write(footer);
  lightStream.write(footer);

  fullStream.end();
  lightStream.end();

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Gzip the full file for easy phpMyAdmin import
  console.log('Compressing full SQL dump to .gz...');
  const gzip = zlib.createGzip({ level: 9 });
  const inp = fs.createReadStream(fullSqlPath);
  const out = fs.createWriteStream(`${fullSqlPath}.gz`);
  inp.pipe(gzip).pipe(out);

  await new Promise(resolve => out.on('finish', resolve));

  const fullStats = fs.statSync(fullSqlPath);
  const lightStats = fs.statSync(lightSqlPath);
  const gzStats = fs.statSync(`${fullSqlPath}.gz`);

  console.log('\n--- SUCCESS ---');
  console.log(`1. Full SQL: ${fullSqlPath} (${(fullStats.size / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`2. Full GZ (Recommended for phpMyAdmin!): ${fullSqlPath}.gz (${(gzStats.size / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`3. Light SQL (Tanpa log pengunjung): ${lightSqlPath} (${(lightStats.size / (1024 * 1024)).toFixed(2)} MB)`);
}

buildSqlFiles().catch(console.error);
