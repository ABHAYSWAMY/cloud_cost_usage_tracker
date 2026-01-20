// src/services/csv/azureParser.ts

export function parseAzureRow(row: any) {
  const cost = parseFloat(row["Cost"]);
  if (Number.isNaN(cost)) {
    throw new Error("Invalid Azure cost value");
  }

  const date = new Date(row["UsageDate"]);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid Azure usage date");
  }

  return {
    date,
    service: row["ServiceName"],
    region: row["ResourceLocation"] || "global",
    usageType: row["MeterCategory"],
    cost,
  };
}
