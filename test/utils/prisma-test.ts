import { PrismaClient } from '@prisma/client';
export const cleanDb = async (prisma: PrismaClient) => {
  const models = Object.keys(prisma).filter(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (m) => typeof prisma[m]?.deleteMany === 'function',
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await prisma.$transaction(models.map((m) => prisma[m].deleteMany({})));
};
