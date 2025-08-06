export function isNYearsAgo(n: number, rightDate: Date) {
  const year = rightDate.getFullYear();
  const currentYear = new Date().getFullYear();

  return year >= currentYear - n && year <= currentYear;
}
