const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.tbl_tulisan.findMany({
    select: {
      tulisan_id: true,
      tulisan_judul: true,
      tulisan_gambar: true,
    },
    take: 10,
    orderBy: { tulisan_tanggal: 'desc' },
  });
  console.log(JSON.stringify(articles, null, 2));
}

main().finally(() => prisma.$disconnect());
