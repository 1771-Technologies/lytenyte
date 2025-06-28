import { computeDayDiff } from "./compute-day-diff.js";

export function isNDaysAhead(n: number, rightDate: Date) {
  const diff = computeDayDiff(new Date(), rightDate);

  return diff <= n && diff >= 0;
}
