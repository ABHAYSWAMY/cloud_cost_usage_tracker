import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDateRange } from "@/lib/date";
import { getCurrentUser } from "@/lib/current-user";
import { getUserUploadIds } from "@/lib/user-upload-ids";

export async function GET(req: NextRequest) {
  // 1️⃣ Authenticated user
  const user = await getCurrentUser();

  // 2️⃣ Get this user's uploads
  const uploadIds = await getUserUploadIds(user.id);

  // No uploads → no data
  if (uploadIds.length === 0) {
    return NextResponse.json([]);
  }

  // 3️⃣ Date filters (optional)
  const { searchParams } = new URL(req.url);
  const dateRange = getDateRange(searchParams);

  // 4️⃣ Aggregate by region (USER-SCOPED)
  const result = await prisma.costRecord.groupBy({
    by: ["region"],
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
      region: r.region,
      totalCost: r._sum.cost ?? 0,
    }))
  );
}


