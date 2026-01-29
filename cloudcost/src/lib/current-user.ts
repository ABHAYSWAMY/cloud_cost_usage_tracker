import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const email = session.user.email;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email },
    });
  }

  return user;
}
