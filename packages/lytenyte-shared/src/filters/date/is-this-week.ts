import { getFirstDayOfWeek } from "./get-first-day-of-week.js";
import { getLastDayOfWeek } from "./get-last-day-of-week.js";
import { isInRange } from "./is-in-range.js";

export function isThisWeek(leftDate: Date, rightDate: Date) {
  const firstOfWeek = getFirstDayOfWeek(leftDate);
  const lastOfWeek = getLastDayOfWeek(firstOfWeek);

  return isInRange(rightDate, firstOfWeek, lastOfWeek);
}
