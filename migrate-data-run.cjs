const { Client } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function migrateData() {
  const pgClient = new Client({
    connectionString: "postgresql://postgres.vczmodqqnjwynvdgihsg:keluargagenbitegal@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  });
  
  const prisma = new PrismaClient();

  try {
    console.log("Menghubungkan ke Supabase (PostgreSQL)...");
    await pgClient.connect();
    
    // Daftar tabel yang akan dimigrasi, diurutkan berdasarkan dependensi (tabel tanpa foreign key dulu)
    // Di schema.prisma yang ada, relasi tidak didefinisikan secara strict (hanya index/integer field).
    // Tapi kita urutkan secara logis.
    const tables = [
      'tbl_kategori',
      'tbl_kelas',
      'tbl_pengguna',
      'tbl_komisariat',
      'tbl_album',
      'tbl_agenda',
      'tbl_files',
      'tbl_guru',
      'tbl_inbox',
      'tbl_pengumuman',
      'tbl_pengunjung',
      'tbl_testimoni',
      'tbl_siswa',
      'tbl_tulisan',
      'tbl_galeri',
      'tbl_komentar',
      'tbl_log_aktivitas'
    ];

    for (const table of tables) {
      console.log(`\nMemigrasi tabel: ${table}...`);
      
      const res = await pgClient.query(`SELECT * FROM ${table}`);
      const rows = res.rows;
      
      console.log(`- Ditemukan ${rows.length} baris di Supabase.`);
      
      if (rows.length > 0) {
        // Membersihkan data null pada string dan date jika ada perbedaan perlakuan
        // Tapi createMany Prisma biasanya aman dengan native pg types
        
        try {
          await prisma[table].createMany({
            data: rows,
            skipDuplicates: true // Mengabaikan jika ID sudah ada
          });
          console.log(`- Berhasil memindahkan ${rows.length} baris ke MySQL.`);
        } catch (insertErr) {
          console.error(`- GAGAL memindahkan data untuk ${table}:`, insertErr.message);
        }
      }
    }
    
    console.log("\n✅ MIGRASI DATABASE SELESAI!");
    
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  } finally {
    await pgClient.end();
    await prisma.$disconnect();
  }
}

migrateData();
