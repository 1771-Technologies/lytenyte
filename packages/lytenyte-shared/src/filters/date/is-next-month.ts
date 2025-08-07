import { isInRange } from "./is-in-range.js";

export function isNextMonth(leftDate: Date, rightDate: Date) {
  const startOfNextMonth = new Date(leftDate.getFullYear(), leftDate.getMonth() + 1, 1);
  const endOfNextMonth = new Date(leftDate.getFullYear(), leftDate.getMonth() + 2, 0); // Last day of next month
  endOfNextMonth.setHours(23, 59, 59, 999);

  return isInRange(rightDate, startOfNextMonth, endOfNextMonth);
}
