import { PrismaClient } from "@prisma/client";

if (typeof globalThis !== 'undefined') {
  (globalThis as any).EdgeRuntime = undefined;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    datasources: {
      db: {
        // Automatically append connection_limit=1 to prevent exhausting shared hosting MySQL connections on Vercel Serverless
        url: process.env.DATABASE_URL?.includes('?') 
          ? `${process.env.DATABASE_URL}&connection_limit=1&pool_timeout=10` 
          : `${process.env.DATABASE_URL}?connection_limit=1&pool_timeout=10`,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
