import { computeDayDiff } from "./compute-day-diff.js";

export function isNDaysAgo(n: number, rightDate: Date) {
  const diff = computeDayDiff(rightDate, new Date());

  return diff <= n && diff >= 0;
}
