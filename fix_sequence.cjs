const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`
      SELECT MAX(tulisan_id) FROM tbl_tulisan;
    `;
    const maxId = result[0].max || 0;
    
    console.log("Max ID in tbl_tulisan:", maxId);

    if (maxId > 0) {
      // Postgres sequence names usually follow the pattern tablename_columnname_seq
      await prisma.$executeRawUnsafe(`SELECT setval('tbl_tulisan_tulisan_id_seq', ${maxId + 1}, false)`);
      console.log("Sequence reset successfully to", maxId + 1);
    } else {
      console.log("No data in table, no need to reset sequence.");
    }
  } catch (error) {
    console.error("Error checking/resetting sequence:", error);
    // Let's try to find sequence names if it fails
    const sequences = await prisma.$queryRaw`
      SELECT c.relname FROM pg_class c WHERE c.relkind = 'S';
    `;
    console.log("Available sequences:", sequences);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
