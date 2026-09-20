const { Client } = require('pg');

async function testConnection() {
  const connectionString = "postgresql://postgres.vczmodqqnjwynvdgihsg:keluargagenbitegal@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const client = new Client({
    connectionString,
  });

  try {
    console.log("Mencoba koneksi ke database Supabase...");
    await client.connect();
    console.log("Berhasil terkoneksi ke database!");
    
    // Ambil daftar tabel
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
    console.log("Tabel yang ditemukan:", res.rows.map(r => r.table_name));
    
  } catch (err) {
    console.error("Gagal koneksi ke database:", err.message);
  } finally {
    await client.end();
  }
}

testConnection();
