// src/services/csv/awsParser.ts

export function parseAwsRow(row: any) {
  const cost = parseFloat(row["lineItem/UnblendedCost"]);
  if (Number.isNaN(cost)) {
    throw new Error("Invalid AWS cost value");
  }

  const date = new Date(row["lineItem/UsageStartDate"]);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid AWS usage start date");
  }

  return {
    date,
    service: row["product/ProductName"],
    region: row["product/region"] || "global",
    usageType: row["lineItem/ProductCode"],
    cost,
  };
}


