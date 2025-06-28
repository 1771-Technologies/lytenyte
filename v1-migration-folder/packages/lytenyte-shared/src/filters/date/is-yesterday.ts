import { normalizeDate } from "./normalize-date.js";

export function isYesterday(leftDate: Date, rightDate: Date) {
  const today = normalizeDate(leftDate);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Subtract one day
  const compareDate = normalizeDate(rightDate);
  return compareDate.getTime() === yesterday.getTime();
}
