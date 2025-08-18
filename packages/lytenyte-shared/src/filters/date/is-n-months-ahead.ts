import { addMonths } from "./add-months.js";
import { isWithinYearAndMonthRange } from "./is-within-year-and-month-range.js";

export function isNMonthsAhead(n: number, rightDate: Date) {
  const s = addMonths(new Date(), n);

  return isWithinYearAndMonthRange(rightDate, new Date(), s);
}
