export function getLastDayOfWeek(date: Date): Date {
  const day = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  // Calculate distance to the coming Sunday
  const diff = day === 0 ? 0 : 7 - day;
  const lastDayOfWeek = new Date(date);
  lastDayOfWeek.setDate(date.getDate() + diff);
  return lastDayOfWeek;
}
