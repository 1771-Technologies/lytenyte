import { normalizeDate } from "./normalize-date.js";

export function isToday(leftDate: Date, rightDate: Date) {
  const today = normalizeDate(leftDate);
  const compareDate = normalizeDate(rightDate);
  return today.getTime() === compareDate.getTime();
}
