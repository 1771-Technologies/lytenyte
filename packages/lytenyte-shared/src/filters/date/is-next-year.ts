import { isInRange } from "./is-in-range.js";

export function isNextYear(leftDate: Date, rightDate: Date) {
  const startOfNextYear = new Date(leftDate.getFullYear() + 1, 0, 1);
  const endOfNextYear = new Date(leftDate.getFullYear() + 1, 11, 31, 23, 59, 59, 999);

  return isInRange(rightDate, startOfNextYear, endOfNextYear);
}
