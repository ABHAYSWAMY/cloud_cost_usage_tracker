import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEV_USER_ID = "32468f30-2702-48cb-b2ac-823378204146";

export async function GET() {
  const insights = await prisma.insight.findMany({
    where: {
      userId: DEV_USER_ID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(insights);
}

export async function DELETE() {
  const result = await prisma.insight.deleteMany({
    where: {
      userId: DEV_USER_ID,
    },
  });

  return NextResponse.json({
    success: true,
    deletedCount: result.count,
  });
}

