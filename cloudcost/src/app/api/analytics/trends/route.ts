import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const result = await prisma.costRecord.groupBy({
    by: ["date"],
    _sum: {
      cost: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return NextResponse.json(
    result.map((row) => ({
      date: row.date.toISOString().split("T")[0], // YYYY-MM-DD
      cost: row._sum.cost ?? 0,
    }))
  );
}
