const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const articles = await prisma.tbl_tulisan.findMany({
    where: {
      tulisan_gambar: {
        contains: 'cloudinary',
      },
    },
    select: {
      tulisan_id: true,
      tulisan_judul: true,
      tulisan_gambar: true,
      tulisan_tanggal: true,
    },
    orderBy: { tulisan_id: 'desc' },
  });
  console.log(`Found ${articles.length} articles with Cloudinary URLs:`);
  console.log(articles);
}

check().finally(() => prisma.$disconnect());
