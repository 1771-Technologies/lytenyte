import { addMonths } from "./add-months.js";

export function isLastMonth(leftDate: Date, rightDate: Date) {
  const lastMonth = addMonths(leftDate, -1);
  return rightDate.getFullYear() === lastMonth.getFullYear() && rightDate.getMonth() === lastMonth.getMonth();
}
