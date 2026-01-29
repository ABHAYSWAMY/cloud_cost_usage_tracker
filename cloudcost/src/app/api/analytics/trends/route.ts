import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDateRange } from "@/lib/date";
import { getCurrentUser } from "@/lib/current-user";
import { getUserUploadIds } from "@/lib/user-upload-ids";

export async function GET(req: NextRequest) {
  // 1️⃣ Authenticated user
  const user = await getCurrentUser();

  // 2️⃣ Uploads belonging to this user
  const uploadIds = await getUserUploadIds(user.id);

  // No uploads → empty trend
  if (uploadIds.length === 0) {
    return NextResponse.json([]);
  }

  // 3️⃣ Optional date filter
  const { searchParams } = new URL(req.url);
  const dateRange = getDateRange(searchParams);

  // 4️⃣ Aggregate by date (USER-SCOPED)
  const result = await prisma.costRecord.groupBy({
    by: ["date"],
    where: {
      uploadId: { in: uploadIds },
      ...(dateRange ? { date: dateRange } : {}),
    },
    _sum: {
      cost: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // 5️⃣ Response (chart-friendly)
  return NextResponse.json(
    result.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      cost: r._sum.cost ?? 0,
    }))
  );
}


