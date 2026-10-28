const { Client } = require('pg');

async function testOldDB() {
  const pgClient = new Client({
    connectionString: "postgresql://postgres.vczmodqqnjwynvdgihsg:keluargagenbitegal@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  });

  try {
    await pgClient.connect();
    console.log("Connected to old DB!");
    const res = await pgClient.query("SELECT tulisan_id, tulisan_judul, tulisan_gambar FROM tbl_tulisan WHERE tulisan_id IN (218, 217, 216, 215, 214, 213, 212, 210, 209, 3, 22, 2)");
    console.log(res.rows);
  } catch (err) {
    console.error("Old DB error:", err.message);
  } finally {
    await pgClient.end();
  }
}

testOldDB();
