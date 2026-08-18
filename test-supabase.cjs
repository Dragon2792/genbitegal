// Test koneksi Supabase - dengan auth header
const https = require('https');

const SUPABASE_URL = "vczmodqqnjwynvdgihsg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjem1vZHFxbmp3eW52ZGdpaHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODUyMTAsImV4cCI6MjEwMjU2MTIxMH0.7qLB9Qv8H-Pmj06KXbQJDdgY-eiLJakbTQwsdhMOoDI";

const options = {
  hostname: SUPABASE_URL,
  path: '/storage/v1/bucket',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY
  }
};

console.log("🔍 Mengecek bucket di Supabase...\n");

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    if (!Array.isArray(result)) {
      console.log("❌ Response tidak dikenali:", data);
      return;
    }
    if (result.length === 0) {
      console.log("⚠️  Tidak ada bucket yang ditemukan.");
      console.log("   Kemungkinan bucket belum dibuat atau anon key tidak punya izin membaca daftar bucket.");
    } else {
      console.log("✅ Daftar bucket yang ditemukan:");
      result.forEach(b => {
        console.log(`   - "${b.name}" (public: ${b.public})`);
      });
      
      const hasGenbi = result.find(b => b.name === 'genbi-asset' || b.name === 'genbi-assets');
      if (hasGenbi) {
        console.log(`\n✅ Bucket "${hasGenbi.name}" DITEMUKAN dan siap digunakan!`);
        console.log(`   Public: ${hasGenbi.public}`);
      } else {
        console.log('\n❌ Tidak ada bucket bernama "genbi-asset" atau "genbi-assets"!');
      }
    }
  });
});

req.on('error', (e) => console.error("Error:", e));
req.end();
