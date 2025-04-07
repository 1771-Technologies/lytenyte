export type Interval =
  | "today"
  | "tomorrow"
  | "yesterday"
  | "nextWeek"
  | "lastWeek"
  | "thisWeek"
  | "nextMonth"
  | "thisMonth"
  | "lastMonth"
  | "nextQuarter"
  | "thisQuarter"
  | "lastQuarter"
  | "nextYear"
  | "thisYear"
  | "lastYear"
  | "yearToDate";

export function calculateTimeRange(interval: Interval) {
  const currentDate = new Date();

  // Calculate start and end dates based on the specified interval
  let startDate!: Date;
  let endDate!: Date;
  switch (interval) {
    case "today":
      startDate = new Date(currentDate);
      endDate = new Date(currentDate);
      break;
    case "tomorrow":
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() + 1);
      endDate = new Date(startDate);
      break;
    case "yesterday":
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() - 1);
      startDate = new Date(endDate);
      break;
    case "nextWeek":
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() + (7 - currentDate.getDay() + 1)); // Start from next Sunday
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // End on next Saturday
      break;
    case "lastWeek":
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - (currentDate.getDay() + 7)); // Start from the previous week
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // End on the last day of the previous week
      break;
    case "thisWeek":
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from this Sunday
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // End on this Saturday
      break;
    case "nextMonth":
      startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() + 1, 1); // Start from the 1st day of next month
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1, 0); // End on the last day of next month
      break;
    case "thisMonth":
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start from the 1st day of this month
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End on the last day of this month
      break;
    case "lastMonth":
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // End on the last day of last month
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // Start from the 1st day of last month
      break;
    case "nextQuarter": {
      startDate = new Date(currentDate);
      const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3; // Start of current quarter
      startDate.setMonth(quarterStartMonth + 3, 1); // Start from the 1st day of next quarter
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 3, 0); // End on the last day of next quarter
      break;
    }
    case "thisQuarter": {
      startDate = new Date(currentDate);
      const thisQuarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3; // Start of current quarter
      startDate.setMonth(thisQuarterStartMonth, 1); // Start from the 1st day of this quarter
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 3, 0); // End on the last day of this quarter
      break;
    }
    case "lastQuarter": {
      startDate = new Date(currentDate);
      const lastQuarterStartMonth = (Math.floor(currentDate.getMonth() / 3) - 1) * 3; // Start of last quarter
      startDate.setMonth(lastQuarterStartMonth, 1); // Start from the 1st day of last quarter
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 3, 0); // End on the last day of last quarter
      break;
    }
    case "nextYear":
      startDate = new Date(currentDate.getFullYear() + 1, 0, 1); // Start from the 1st day of next year
      endDate = new Date(currentDate.getFullYear() + 1, 11, 31); // End on the last day of next year
      break;
    case "thisYear":
      startDate = new Date(currentDate.getFullYear(), 0, 1); // Start from the 1st day of this year
      endDate = new Date(currentDate.getFullYear(), 11, 31); // End on the last day of this year
      break;
    case "lastYear":
      startDate = new Date(currentDate.getFullYear() - 1, 0, 1); // Start from the 1st day of last year
      endDate = new Date(currentDate.getFullYear() - 1, 11, 31); // End on the last day of last year
      break;
    case "yearToDate":
      startDate = new Date(currentDate.getFullYear(), 0, 1); // Start from January 1st of this year
      endDate = currentDate;
      break;
  }

  return {
    startDate,
    endDate,
  };
}
