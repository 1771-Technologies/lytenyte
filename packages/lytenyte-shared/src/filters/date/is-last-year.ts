import { isInRange } from "./is-in-range.js";

export function isLastYear(leftDate: Date, rightDate: Date) {
  const startOfLastYear = new Date(leftDate.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(leftDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

  return isInRange(rightDate, startOfLastYear, endOfLastYear);
}
