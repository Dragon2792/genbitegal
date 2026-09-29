const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT column_name, data_type, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_name = 'tbl_tulisan';
  `;
  console.log(result);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
