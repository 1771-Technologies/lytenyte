export function isInQuarter(quarter: number, rightDate: Date) {
  const year = rightDate.getFullYear();
  const startMonths = [0, 3, 6, 9]; // Start months for Q1, Q2, Q3, Q4
  const startOfQuarter = new Date(year, startMonths[quarter - 1], 1); // First day of the quarter
  const endOfQuarter = new Date(year, startMonths[quarter - 1] + 3, 0); // Last day of the quarter
  endOfQuarter.setHours(23, 59, 59, 999); // End of the day for the last day of the quarter

  return rightDate >= startOfQuarter && rightDate <= endOfQuarter;
}
