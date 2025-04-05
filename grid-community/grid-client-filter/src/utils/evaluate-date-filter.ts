import type { FilterDate } from "@1771technologies/grid-types/core";
import { calculateTimeRange } from "./calculate-time-range";
import { isInPeriod } from "./is-in-period";
import { isValidDate } from "./is-valid-date";

function isDateBetweenInclusive(left: Date, d: Date, right: Date): boolean {
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const leftStr = formatDate(left);
  const dStr = formatDate(d);
  const rightStr = formatDate(right);

  return leftStr <= dStr && dStr <= rightStr;
}

export function evaluateDate(date: Date, filter: FilterDate): boolean {
  if (!isValidDate(date)) return false;

  const getFilterDate = () => new Date(filter.value);

  switch (filter.operator) {
    case "after": {
      const afterDate = getFilterDate();
      return date > afterDate;
    }
    case "before": {
      const beforeDate = getFilterDate();
      return date < beforeDate;
    }
    case "equal": {
      const targetDate = getFilterDate();
      return targetDate.getTime() === date.getTime();
    }
    case "last_month": {
      const targets = calculateTimeRange("lastMonth");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "this_month": {
      const targets = calculateTimeRange("thisMonth");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "next_month": {
      const targets = calculateTimeRange("nextMonth");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "last_week": {
      const targets = calculateTimeRange("lastWeek");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "next_week": {
      const targets = calculateTimeRange("nextWeek");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "this_week": {
      const targets = calculateTimeRange("thisWeek");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "last_year": {
      const targets = calculateTimeRange("lastYear");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "this_year": {
      const targets = calculateTimeRange("thisYear");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "next_year": {
      const targets = calculateTimeRange("nextYear");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "last_quarter": {
      const targets = calculateTimeRange("lastQuarter");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "next_quarter": {
      const targets = calculateTimeRange("nextQuarter");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "this_quarter": {
      const targets = calculateTimeRange("thisQuarter");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "today": {
      const targets = calculateTimeRange("today");

      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "tomorrow": {
      const targets = calculateTimeRange("tomorrow");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "yesterday": {
      const targets = calculateTimeRange("yesterday");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "ytd": {
      const targets = calculateTimeRange("yearToDate");
      return isDateBetweenInclusive(targets.startDate, date, targets.endDate);
    }
    case "all_dates_in_the_period": {
      if (filter.datePeriod === null) return false;

      return isInPeriod(date, filter.datePeriod);
    }
    default: {
      return false;
    }
  }
}
