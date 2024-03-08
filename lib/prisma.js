import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

let prisma = globalForPrisma.prisma;

export default prisma;
