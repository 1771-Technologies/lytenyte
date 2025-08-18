export function isWithinYearAndMonthRange(date: Date, startDate: Date, endDate: Date): boolean {
  // Extract year and month for each date
  const yearMonth = (d: Date) => d.getFullYear() * 12 + d.getMonth();

  // Compare the year and month values
  const target = yearMonth(date);
  const start = yearMonth(startDate);
  const end = yearMonth(endDate);

  return target >= start && target <= end;
}
