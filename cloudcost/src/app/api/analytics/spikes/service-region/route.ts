import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { getUserUploadIds } from "@/lib/user-upload-ids";

const SPIKE_THRESHOLD_PERCENT = 30;
const MIN_BASELINE = 5; // noise control

export async function GET() {
  // 1️⃣ Current user
  const user = await getCurrentUser();

  // 2️⃣ Uploads belonging to this user
  const uploadIds = await getUserUploadIds(user.id);

  if (uploadIds.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  // 3️⃣ Daily cost per service + region (USER-SCOPED)
  const rows = await prisma.costRecord.groupBy({
    by: ["date", "service", "region"],
    where: {
      uploadId: { in: uploadIds },
    },
    _sum: { cost: true },
    orderBy: [
      { service: "asc" },
      { region: "asc" },
      { date: "asc" },
    ],
  });

  // 4️⃣ Fetch existing SERVICE_REGION spikes for this user
  const existing = await prisma.insight.findMany({
    where: {
      userId: user.id,
      type: "SPIKE",
    },
    select: { metadata: true },
  });

  const existingKeys = new Set(
    existing
      .map((i) => {
        const m = i.metadata as any;
        return m?.level === "SERVICE_REGION"
          ? `${m.service}:${m.region}:${m.date}`
          : null;
      })
      .filter(Boolean)
  );

  const newInsights = [];

  // 5️⃣ Detect spikes (pure deterministic logic)
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1];
    const curr = rows[i];

    // Must be same service + region
    if (
      prev.service !== curr.service ||
      prev.region !== curr.region
    ) {
      continue;
    }

    const prevCost = prev._sum.cost ?? 0;
    const currCost = curr._sum.cost ?? 0;

    if (prevCost < MIN_BASELINE) continue;

    const percentIncrease =
      ((currCost - prevCost) / prevCost) * 100;

    if (percentIncrease < SPIKE_THRESHOLD_PERCENT) continue;

    const dateStr = curr.date.toISOString().split("T")[0];
    const key = `${curr.service}:${curr.region}:${dateStr}`;

    // Skip duplicates
    if (existingKeys.has(key)) continue;

    newInsights.push({
      userId: user.id,
      type: "SPIKE" as const,
      summary: `${curr.service} in ${curr.region} spiked by ${percentIncrease.toFixed(
        1
      )}% on ${dateStr}`,
      metadata: {
        level: "SERVICE_REGION",
        service: curr.service,
        region: curr.region,
        date: dateStr,
        baseline: Number(prevCost.toFixed(2)),
        actual: Number(currCost.toFixed(2)),
        percentIncrease: Number(percentIncrease.toFixed(2)),
      },
    });
  }

  // 6️⃣ Bulk insert new insights
  if (newInsights.length > 0) {
    await prisma.insight.createMany({
      data: newInsights,
    });
  }

  return NextResponse.json({
    created: newInsights.length,
  });
}

