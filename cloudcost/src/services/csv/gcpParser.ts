// src/services/csv/gcpParser.ts

export function parseGcpRow(row: any) {
  const cost = parseFloat(row["cost"]);
  if (Number.isNaN(cost)) {
    throw new Error("Invalid GCP cost value");
  }

  const date = new Date(row["usage_start_time"]);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid GCP usage start time");
  }

  return {
    date,
    service: row["service.description"],
    region: row["location.region"] || "global",
    usageType: row["sku.description"],
    cost,
  };
}
