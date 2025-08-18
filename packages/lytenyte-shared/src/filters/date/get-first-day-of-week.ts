export function getFirstDayOfWeek(date: Date): Date {
  const day = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  // Calculate distance to the previous Monday (adjusting for Sunday being 0)
  const diff = (day === 0 ? -6 : 1) - day;
  const firstDayOfWeek = new Date(date);
  firstDayOfWeek.setDate(date.getDate() + diff);
  return firstDayOfWeek;
}
