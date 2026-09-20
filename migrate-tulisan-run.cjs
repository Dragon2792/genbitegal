const { Client } = require('pg');
const { PrismaClient } = require('@prisma/client');

async function migrateTulisan() {
  const pgClient = new Client({
    connectionString: "postgresql://postgres.vczmodqqnjwynvdgihsg:keluargagenbitegal@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  });
  
  const prisma = new PrismaClient();

  try {
    console.log("Menghubungkan ke Supabase (PostgreSQL)...");
    await pgClient.connect();
    
    console.log("Memigrasi tabel khusus: tbl_tulisan...");
    
    const res = await pgClient.query(`SELECT * FROM tbl_tulisan`);
    const rows = res.rows;
    
    console.log(`Ditemukan ${rows.length} baris artikel di Supabase.`);
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await prisma.tbl_tulisan.create({
          data: row,
        });
        successCount++;
        process.stdout.write(`\rProgress: ${successCount}/${rows.length} berhasil`);
      } catch (insertErr) {
        // Coba lagi dengan membersihkan data jika ada error karakter
        try {
           // Prisma kadang error kalau ada unhandled characters atau ID conflict
           // Coba update jika sudah ada
           await prisma.tbl_tulisan.upsert({
              where: { tulisan_id: row.tulisan_id },
              update: row,
              create: row
           });
           successCount++;
           process.stdout.write(`\rProgress: ${successCount}/${rows.length} berhasil (upsert)`);
        } catch (e2) {
           console.error(`\nGagal insert artikel ID ${row.tulisan_id}: ${e2.message}`);
           failCount++;
        }
      }
    }
    
    console.log(`\n\n✅ MIGRASI TBL_TULISAN SELESAI! Berhasil: ${successCount}, Gagal: ${failCount}`);
    
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
  } finally {
    await pgClient.end();
    await prisma.$disconnect();
  }
}

migrateTulisan();
