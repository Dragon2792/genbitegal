const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tables = [
  { table: 'tbl_agenda', id: 'agenda_id' },
  { table: 'tbl_album', id: 'album_id' },
  { table: 'tbl_files', id: 'file_id' },
  { table: 'tbl_galeri', id: 'galeri_id' },
  { table: 'tbl_guru', id: 'guru_id' },
  { table: 'tbl_inbox', id: 'inbox_id' },
  { table: 'tbl_kategori', id: 'kategori_id' },
  { table: 'tbl_kelas', id: 'kelas_id' },
  { table: 'tbl_komentar', id: 'komentar_id' },
  { table: 'tbl_log_aktivitas', id: 'log_id' },
  { table: 'tbl_pengguna', id: 'pengguna_id' },
  { table: 'tbl_pengumuman', id: 'pengumuman_id' },
  { table: 'tbl_pengunjung', id: 'pengunjung_id' },
  { table: 'tbl_siswa', id: 'siswa_id' },
  { table: 'tbl_testimoni', id: 'testimoni_id' },
  { table: 'tbl_komisariat', id: 'komisariat_id' },
  { table: 'tbl_tulisan', id: 'tulisan_id' },
];

async function main() {
  console.log("Checking and syncing PostgreSQL sequences...");
  for (const { table, id } of tables) {
    try {
      const maxResult = await prisma.$queryRawUnsafe(`SELECT COALESCE(MAX(${id}), 0) as max_id FROM "${table}"`);
      const maxId = Number(maxResult[0]?.max_id || 0);

      // Reset sequence
      const seqQuery = `
        SELECT setval(
          pg_get_serial_sequence('${table}', '${id}'),
          ${Math.max(maxId, 1)},
          ${maxId > 0 ? 'true' : 'false'}
        ) as current_seq;
      `;
      const seqResult = await prisma.$queryRawUnsafe(seqQuery);
      console.log(`✓ ${table}.${id}: max_id=${maxId}, new seq=${seqResult[0]?.current_seq}`);
    } catch (err) {
      console.error(`✗ Error on ${table}.${id}:`, err.message);
    }
  }
  console.log("Finished syncing sequences.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
