import { addMonths } from "./add-months.js";
import { isWithinYearAndMonthRange } from "./is-within-year-and-month-range.js";

export function isNMonthsAgo(n: number, rightDate: Date) {
  const s = addMonths(new Date(), -n);

  return isWithinYearAndMonthRange(rightDate, s, new Date());
}
