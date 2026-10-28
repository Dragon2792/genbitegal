const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const all = await prisma.tbl_tulisan.findMany({
    select: { tulisan_id: true, tulisan_judul: true, tulisan_gambar: true }
  });
  const cloudinaryCount = all.filter(a => a.tulisan_gambar && a.tulisan_gambar.includes('cloudinary')).length;
  const localCount = all.filter(a => a.tulisan_gambar && !a.tulisan_gambar.includes('cloudinary')).length;
  const emptyCount = all.filter(a => !a.tulisan_gambar).length;
  console.log({ total: all.length, cloudinaryCount, localCount, emptyCount });
  console.log('Sample Cloudinary:', all.filter(a => a.tulisan_gambar && a.tulisan_gambar.includes('cloudinary')).slice(0, 5));
  console.log('Sample Local:', all.filter(a => a.tulisan_gambar && !a.tulisan_gambar.includes('cloudinary')).slice(0, 5));
}

run().finally(() => prisma.$disconnect());
