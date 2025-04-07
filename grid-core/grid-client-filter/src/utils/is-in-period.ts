export type Period =
  | "quarter-1"
  | "quarter-2"
  | "quarter-3"
  | "quarter-4"
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export function isInPeriod(date: Date, period: Period): boolean {
  // Extract the month and quarter information from the date
  const month = date.getMonth() + 1; // Note: getMonth() returns 0-based month (0 = January)
  const quarter = Math.ceil(month / 3);

  switch (period) {
    case "quarter-1":
      return quarter === 1;
    case "quarter-2":
      return quarter === 2;
    case "quarter-3":
      return quarter === 3;
    case "quarter-4":
      return quarter === 4;
    case "january":
      return month === 1;
    case "february":
      return month === 2;
    case "march":
      return month === 3;
    case "april":
      return month === 4;
    case "may":
      return month === 5;
    case "june":
      return month === 6;
    case "july":
      return month === 7;
    case "august":
      return month === 8;
    case "september":
      return month === 9;
    case "october":
      return month === 10;
    case "november":
      return month === 11;
    case "december":
      return month === 12;
    default:
      return false; // If an invalid period is provided, return false
  }
}
