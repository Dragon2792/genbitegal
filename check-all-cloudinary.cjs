const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAll() {
  const models = [
    { name: 'tbl_galeri', field: 'galeri_gambar' },
    { name: 'tbl_album', field: 'album_cover' },
    { name: 'tbl_pengguna', field: 'pengguna_photo' },
    { name: 'tbl_siswa', field: 'siswa_photo' },
    { name: 'tbl_files', field: 'file_data' },
    { name: 'tbl_komisariat', field: 'komisariat_logo' },
  ];

  for (const m of models) {
    try {
      const records = await prisma[m.name].findMany({
        where: {
          [m.field]: { contains: 'cloudinary' },
        },
        select: { [m.field]: true },
      });
      console.log(`${m.name}: ${records.length} records with cloudinary`);
    } catch (e) {
      console.log(`${m.name}: error - ${e.message}`);
    }
  }
}

checkAll().finally(() => prisma.$disconnect());
