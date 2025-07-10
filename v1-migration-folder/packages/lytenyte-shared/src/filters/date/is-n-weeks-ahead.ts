import { getFirstDayOfWeek } from "./get-first-day-of-week.js";
import { isInRange } from "./is-in-range.js";
import { isNDaysAhead } from "./is-n-days-ahead.js";

export function isNWeeksAhead(n: number, rightDate: Date) {
  const firstWeek = getFirstDayOfWeek(rightDate);
  const currentWeek = getFirstDayOfWeek(new Date());
  if (firstWeek < currentWeek) return false;
  if (isInRange(firstWeek, firstWeek, currentWeek)) return true;

  return isNDaysAhead(n * 7, firstWeek);
}
