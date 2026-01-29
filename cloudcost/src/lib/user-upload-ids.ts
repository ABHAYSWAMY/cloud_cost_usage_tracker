import { prisma } from "@/lib/db";

export async function getUserUploadIds(userId: string) {
  const uploads = await prisma.upload.findMany({
    where: { userId },
    select: { id: true },
  });

  return uploads.map((u) => u.id);
}
