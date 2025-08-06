import { computeDayDiff } from "./compute-day-diff.js";
import { getFirstDayOfWeek } from "./get-first-day-of-week.js";
import { getLastDayOfWeek } from "./get-last-day-of-week.js";
import { isNDaysAgo } from "./is-n-days-ago.js";

export function isNWeeksAgo(n: number, rightDate: Date) {
  const firstWeek = getFirstDayOfWeek(rightDate);
  if (firstWeek > getLastDayOfWeek(new Date())) return false;

  return isNDaysAgo(n * 7 + computeDayDiff(firstWeek, rightDate), firstWeek);
}
