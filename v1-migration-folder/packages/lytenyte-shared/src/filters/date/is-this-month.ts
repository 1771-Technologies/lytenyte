import { isInRange } from "./is-in-range.js";

export function isThisMonth(leftDate: Date, rightDate: Date) {
  const startOfThisMonth = new Date(leftDate.getFullYear(), leftDate.getMonth(), 1);
  const endOfThisMonth = new Date(leftDate.getFullYear(), leftDate.getMonth() + 1, 0); // Last day of the month
  endOfThisMonth.setHours(23, 59, 59, 999);

  return isInRange(rightDate, startOfThisMonth, endOfThisMonth);
}
