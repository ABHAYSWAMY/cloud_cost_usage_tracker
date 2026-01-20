export function detectProvider(headers: string[]) {
  if (headers.includes("lineItem/UnblendedCost")) {
    return "AWS";
  }

  if (headers.includes("usage_start_time") && headers.includes("service.description")) {
    return "GCP";
  }

  if (headers.includes("UsageDate") && headers.includes("ServiceName")) {
    return "AZURE";
  }

  throw new Error("Unsupported billing format");
}
