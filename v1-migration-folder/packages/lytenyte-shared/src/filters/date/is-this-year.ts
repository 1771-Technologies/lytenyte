import { isInRange } from "./is-in-range.js";

export function isThisYear(leftDate: Date, rightDate: Date) {
  const startOfThisYear = new Date(leftDate.getFullYear(), 0, 1);
  const endOfThisYear = new Date(leftDate.getFullYear(), 11, 31, 23, 59, 59, 999);

  return isInRange(rightDate, startOfThisYear, endOfThisYear);
}
