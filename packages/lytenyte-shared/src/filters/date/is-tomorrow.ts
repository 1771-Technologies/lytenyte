import { normalizeDate } from "./normalize-date.js";

export function isTomorrow(leftDate: Date, rightDate: Date) {
  const today = normalizeDate(leftDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Add one day
  const compareDate = normalizeDate(rightDate);
  return compareDate.getTime() === tomorrow.getTime();
}
