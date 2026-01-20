export function parseAwsRow(row: any) {
  const cost = parseFloat(row["cost"]);

  if (Number.isNaN(cost)) {
    throw new Error(`Invalid cost value: ${row["cost"]}`);
  }

  return {
    date: new Date(), // aggregated data → use upload time
    service: row["service"],
    region: row["region"] || "global",
    usageType: row["type"],
    cost,
  };
}

