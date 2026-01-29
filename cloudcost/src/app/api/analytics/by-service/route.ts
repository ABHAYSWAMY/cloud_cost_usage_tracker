import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDateRange } from "@/lib/date";
import { getCurrentUser } from "@/lib/current-user";
import { getUserUploadIds } from "@/lib/user-upload-ids";

export async function GET(req: NextRequest) {
  // 1️⃣ Get authenticated user
  const user = await getCurrentUser();

  // 2️⃣ Get upload IDs belonging to this user
  const uploadIds = await getUserUploadIds(user.id);

  // No uploads → no analytics
  if (uploadIds.length === 0) {
    return NextResponse.json([]);
  }

  // 3️⃣ Optional date filter
  const { searchParams } = new URL(req.url);
  const dateRange = getDateRange(searchParams);

  // 4️⃣ Aggregate by service (USER-SCOPED)
  const result = await prisma.costRecord.groupBy({
    by: ["service"],
    where: {
      uploadId: { in: uploadIds },
      ...(dateRange ? { date: dateRange } : {}),
    },
    _sum: {
      cost: true,
    },
    orderBy: {
      _sum: {
        cost: "desc",
      },
    },
  });

  // 5️⃣ Response
  return NextResponse.json(
    result.map((r) => ({
      service: r.service,
      totalCost: r._sum.cost ?? 0,
    }))
  );
}



