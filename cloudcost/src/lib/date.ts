export function getDateRange(searchParams: URLSearchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from && !to) return null;

  const range: any = {};

  if (from) {
    range.gte = new Date(from);
  }

  if (to) {
    // include the full day
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    range.lte = end;
  }

  return range;
}
