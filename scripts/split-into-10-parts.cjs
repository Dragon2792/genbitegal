const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DB_BACKUP_DIR = path.join(ROOT_DIR, 'backup', 'database');
const OUTPUT_DIR = path.join(DB_BACKUP_DIR, 'split_10_parts');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Generating CREATE TABLE DDL from Prisma schema...');
let ddl = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script', {
  cwd: ROOT_DIR,
  encoding: 'utf8',
});

// Ubah CREATE TABLE menjadi CREATE TABLE IF NOT EXISTS agar aman jika diimpor ulang
ddl = ddl.replace(/CREATE TABLE /g, 'CREATE TABLE IF NOT EXISTS ');

function escapeSqlString(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  
  if (typeof val === 'string') {
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

  if (typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
    return `X'${Buffer.from(val.data).toString('hex')}'`;
  }

  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

function writeTableData(stream, tableName, rows, batchSize = 100) {
  if (!rows || rows.length === 0) return;

  const cols = Object.keys(rows[0]);
  const colList = cols.map(c => `\`${c}\``).join(', ');

  stream.write(`\n-- -----------------------------------------------------\n`);
  stream.write(`-- Data untuk \`${tableName}\` (${rows.length} baris)\n`);
  stream.write(`-- -----------------------------------------------------\n`);
  stream.write(`LOCK TABLES \`${tableName}\` WRITE;\n`);
  stream.write(`ALTER TABLE \`${tableName}\` DISABLE KEYS;\n`);

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const valueClauses = batch.map(row => {
      const vals = cols.map(c => escapeSqlString(row[c]));
      return `(${vals.join(', ')})`;
    });
    stream.write(`INSERT INTO \`${tableName}\` (${colList}) VALUES\n${valueClauses.join(',\n')};\n`);
  }

  stream.write(`ALTER TABLE \`${tableName}\` ENABLE KEYS;\n`);
  stream.write(`UNLOCK TABLES;\n`);
}

function getHeader(partNumber, totalParts, description) {
  return `/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ========================================================
-- BAGIAN ${partNumber} DARI ${totalParts}: ${description}
-- Database GenBI Tegal (MySQL / MariaDB)
-- Tanggal: ${new Date().toISOString()}
-- ========================================================

`;
}

function getFooter() {
  return `
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
`;
}

function loadJson(tableName) {
  const files = fs.readdirSync(DB_BACKUP_DIR).filter(f => f.startsWith(`${tableName}_`) && f.endsWith('.json'));
  if (files.length === 0) return [];
  const raw = fs.readFileSync(path.join(DB_BACKUP_DIR, files[0]), 'utf8');
  return JSON.parse(raw);
}

async function run() {
  console.log('Loading JSON data from backup/database...');
  
  // PART 1: Schema (CREATE TABLE all 17 tables) + Master Data
  console.log('Writing Part 01: Struktur Tabel & Master Data...');
  const part1Path = path.join(OUTPUT_DIR, 'part_01_struktur_tabel_dan_master.sql');
  const part1 = fs.createWriteStream(part1Path, { flags: 'w', encoding: 'utf8' });
  part1.write(getHeader(1, 10, 'STRUKTUR SEMUA TABEL & DATA MASTER'));
  part1.write(ddl);
  
  const masterTables = [
    { name: 'tbl_kategori', batch: 50 },
    { name: 'tbl_kelas', batch: 50 },
    { name: 'tbl_pengguna', batch: 50 },
    { name: 'tbl_agenda', batch: 50 },
    { name: 'tbl_album', batch: 50 },
    { name: 'tbl_files', batch: 50 },
    { name: 'tbl_galeri', batch: 50 },
    { name: 'tbl_guru', batch: 50 },
    { name: 'tbl_pengumuman', batch: 50 },
    { name: 'tbl_komisariat', batch: 50 },
    { name: 'tbl_testimoni', batch: 50 },
    { name: 'tbl_log_aktivitas', batch: 50 },
  ];

  for (const t of masterTables) {
    const data = loadJson(t.name);
    writeTableData(part1, t.name, data, t.batch);
  }
  part1.write(getFooter());
  part1.end();

  // PART 2: Tulisan / Berita (189 rows with HTML contents) - small batch to avoid query length limit
  console.log('Writing Part 02: Data Tulisan / Artikel...');
  const part2Path = path.join(OUTPUT_DIR, 'part_02_tulisan_artikel.sql');
  const part2 = fs.createWriteStream(part2Path, { flags: 'w', encoding: 'utf8' });
  part2.write(getHeader(2, 10, 'DATA TULISAN & ARTIKEL'));
  const tulisanData = loadJson('tbl_tulisan');
  writeTableData(part2, 'tbl_tulisan', tulisanData, 10); // 10 rows per insert to keep query length safe
  part2.write(getFooter());
  part2.end();

  // PART 3: Inbox, Komentar, Siswa
  console.log('Writing Part 03: Inbox, Komentar, & Siswa...');
  const part3Path = path.join(OUTPUT_DIR, 'part_03_inbox_komentar_siswa.sql');
  const part3 = fs.createWriteStream(part3Path, { flags: 'w', encoding: 'utf8' });
  part3.write(getHeader(3, 10, 'DATA INBOX, KOMENTAR & SISWA'));
  writeTableData(part3, 'tbl_komentar', loadJson('tbl_komentar'), 50);
  writeTableData(part3, 'tbl_siswa', loadJson('tbl_siswa'), 50);
  writeTableData(part3, 'tbl_inbox', loadJson('tbl_inbox'), 50);
  part3.write(getFooter());
  part3.end();

  // PARTS 4-10: tbl_pengunjung (133,974 rows split into 7 chunks)
  console.log('Writing Parts 04-10: Data Log Pengunjung...');
  const pengunjungData = loadJson('tbl_pengunjung');
  const totalPengunjung = pengunjungData.length;
  const numChunks = 7;
  const chunkSize = Math.ceil(totalPengunjung / numChunks);

  for (let c = 0; c < numChunks; c++) {
    const partNum = 4 + c;
    const padNum = String(partNum).padStart(2, '0');
    const startIdx = c * chunkSize;
    const endIdx = Math.min((c + 1) * chunkSize, totalPengunjung);
    const chunkRows = pengunjungData.slice(startIdx, endIdx);

    const partPath = path.join(OUTPUT_DIR, `part_${padNum}_pengunjung_baris_${startIdx + 1}_sd_${endIdx}.sql`);
    const partStream = fs.createWriteStream(partPath, { flags: 'w', encoding: 'utf8' });
    partStream.write(getHeader(partNum, 10, `DATA LOG PENGUNJUNG (BARIS ${startIdx + 1} s/d ${endIdx})`));
    writeTableData(partStream, 'tbl_pengunjung', chunkRows, 100);
    partStream.write(getFooter());
    partStream.end();
  }

  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log('\n✅ Sukses membagi menjadi 10 file SQL di folder:');
  console.log(OUTPUT_DIR);
  
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.sql'));
  files.sort().forEach((f, idx) => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`${idx + 1}. ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

run().catch(console.error);
