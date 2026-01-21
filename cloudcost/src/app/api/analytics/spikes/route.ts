import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SPIKE_THRESHOLD_PERCENT = 30;
const DEV_USER_ID = "32468f30-2702-48cb-b2ac-823378204146";

export async function GET() {
  // 1️⃣ Fetch daily totals
  const daily = await prisma.costRecord.groupBy({
    by: ["date"],
    _sum: {
      cost: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // 2️⃣ Fetch existing spike insights ONCE
  const existingInsights = await prisma.insight.findMany({
    where: {
      userId: DEV_USER_ID,
      type: "SPIKE",
    },
    select: {
      metadata: true,
    },
  });

  // 3️⃣ Build a set of existing spike dates
  const existingDates = new Set(
    existingInsights
      .map((i) => (i.metadata as any)?.date)
      .filter(Boolean)
  );

  const newInsightsData = [];

  // 4️⃣ Detect spikes (pure in-memory logic)
  for (let i = 1; i < daily.length; i++) {
    const prev = daily[i - 1]._sum.cost ?? 0;
    const curr = daily[i]._sum.cost ?? 0;

    if (prev === 0) continue;

    const percentIncrease = ((curr - prev) / prev) * 100;
    if (percentIncrease < SPIKE_THRESHOLD_PERCENT) continue;

    const dateStr = daily[i].date.toISOString().split("T")[0];

    if (existingDates.has(dateStr)) continue;

    newInsightsData.push({
      userId: DEV_USER_ID,
      type: "SPIKE" as const,
      summary: `Daily cloud cost spiked by ${percentIncrease.toFixed(
        1
      )}% on ${dateStr}`,
      metadata: {
        date: dateStr,
        baseline: Number(prev.toFixed(2)),
        actual: Number(curr.toFixed(2)),
        percentIncrease: Number(percentIncrease.toFixed(2)),
      },
    });
  }

  // 5️⃣ Bulk insert (fast & safe)
  if (newInsightsData.length > 0) {
    await prisma.insight.createMany({
      data: newInsightsData,
    });
  }

  return NextResponse.json({
    created: newInsightsData.length,
  });
}


