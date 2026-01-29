import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDateRange } from "@/lib/date";
import { getCurrentUser } from "@/lib/current-user";

const DEV_USER_ID = "32468f30-2702-48cb-b2ac-823378204146";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateRange = getDateRange(searchParams);
  const user = await getCurrentUser();

  const insights = await prisma.insight.findMany({
    where: {
      userId: user.id,
      ...(dateRange && {
        metadata: {
          path: ["date"],
          gte: searchParams.get("from") ?? undefined,
          lte: searchParams.get("to") ?? undefined,
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(insights);
}

export async function DELETE() {
  const user = await getCurrentUser();
  const result = await prisma.insight.deleteMany({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json({
    success: true,
    deletedCount: result.count,
  });
}

