export function addMonths(date: Date, n: number) {
  const d = new Date(date);

  d.setMonth(d.getMonth() + n);

  return d;
}
