import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const result = await prisma.costRecord.groupBy({
    by: ["region"],
    _sum: {
      cost: true,
    },
    orderBy: {
      _sum: {
        cost: "desc",
      },
    },
  });

  return NextResponse.json(
    result.map((row) => ({
      region: row.region,
      totalCost: row._sum.cost ?? 0,
    }))
  );
}
