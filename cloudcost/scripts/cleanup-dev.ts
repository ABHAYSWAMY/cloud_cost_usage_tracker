import { prisma } from "@/lib/db";

async function main() {
  const USER_ID = "32468f30-2702-48cb-b2ac-823378204146";

  await prisma.insight.deleteMany({ where: { userId: USER_ID } });
  await prisma.costRecord.deleteMany({
    where: { upload: { userId: USER_ID } },
  });
  await prisma.upload.deleteMany({ where: { userId: USER_ID } });

  console.log("Dev data cleaned");
}

main().finally(() => prisma.$disconnect());
