export function isYTD(date: Date) {
  const today = new Date(); // Current date (today)
  const startOfYear = new Date(today.getFullYear(), 0, 1); // January 1 of the current year

  // Check if the given date falls within the YTD range
  return date >= startOfYear && date <= today;
}
