import { addDays } from "./add-days.js";
import { getFirstDayOfWeek } from "./get-first-day-of-week.js";
import { getLastDayOfWeek } from "./get-last-day-of-week.js";
import { isInRange } from "./is-in-range.js";

export function isLastWeek(leftDate: Date, rightDate: Date) {
  const firstOfWeek = getFirstDayOfWeek(addDays(leftDate, -7));
  const lastOfWeek = getLastDayOfWeek(firstOfWeek);

  return isInRange(rightDate, firstOfWeek, lastOfWeek);
}
