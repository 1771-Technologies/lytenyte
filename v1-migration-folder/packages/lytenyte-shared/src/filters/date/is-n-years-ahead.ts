export function isNYearsAhead(n: number, rightDate: Date) {
  const year = rightDate.getFullYear();
  const currentYear = new Date().getFullYear();

  return year >= currentYear && year <= currentYear + n;
}
