const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.tbl_siswa.findMany({ select: { siswa_id: true, siswa_nama: true, siswa_photo: true } })
  .then(r => { console.log(JSON.stringify(r, null, 2)); })
  .finally(() => p.$disconnect());
