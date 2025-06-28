export function computeDayDiff(left: Date, right: Date): number {
  // Convert dates to milliseconds since epoch
  const time1 = left.getTime();
  const time2 = right.getTime();

  const diffInMilliseconds = time2 - time1;
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
}
