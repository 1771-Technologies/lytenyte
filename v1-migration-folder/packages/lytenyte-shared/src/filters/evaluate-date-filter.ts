import type { FilterDate } from "../+types.js";
import { isInQuarter } from "./date/is-in-quarter.js";
import { isLastMonth } from "./date/is-last-month.js";
import { isLastWeek } from "./date/is-last-week.js";
import { isLastYear } from "./date/is-last-year.js";
import { isNDaysAgo } from "./date/is-n-days-ago.js";
import { isNDaysAhead } from "./date/is-n-days-ahead.js";
import { isNMonthsAgo } from "./date/is-n-months-ago.js";
import { isNMonthsAhead } from "./date/is-n-months-ahead.js";
import { isNWeeksAgo } from "./date/is-n-weeks-ago.js";
import { isNWeeksAhead } from "./date/is-n-weeks-ahead.js";
import { isNYearsAgo } from "./date/is-n-years-ago.js";
import { isNYearsAhead } from "./date/is-n-years-ahead.js";
import { isNextMonth } from "./date/is-next-month.js";
import { isNextWeek } from "./date/is-next-week.js";
import { isNextYear } from "./date/is-next-year.js";
import { isThisMonth } from "./date/is-this-month.js";
import { isThisWeek } from "./date/is-this-week.js";
import { isThisYear } from "./date/is-this-year.js";
import { isToday } from "./date/is-today.js";
import { isTomorrow } from "./date/is-tomorrow.js";
import { isYesterday } from "./date/is-yesterday.js";
import { isYTD } from "./date/is-ytd.js";
import type { FilterDateSetting } from "./get-date-filter-settings.js";

export function evaluateDateFilter(
  filter: FilterDate,
  cv: string | null,
  { includeNulls, includeTime }: FilterDateSetting,
) {
  const v = filter.value;

  if (v != null && typeof v !== "number" && typeof v !== "string") return false;
  if (cv != null && typeof cv !== "string") return false;

  const op = filter.operator;
  if (cv == null || v == null) {
    if (op === "equals") {
      if (cv == null && v == null) return true;
      if (v == null && cv != null) return false;
      return includeNulls;
    }
    if (op === "not_equals") {
      if (cv == null && v == null) return false;
      if (v == null && cv != null) return true;
      return includeNulls;
    }

    if (v == null) return false;
    else return includeNulls;
  }

  const leftDate = !v
    ? new Date()
    : typeof v === "number"
      ? new Date(v)
      : includeTime
        ? new Date(v)
        : new Date(v.substring(0, 10));

  const rightDate = includeTime ? new Date(cv) : new Date(cv.substring(0, 10));

  const lTime = leftDate.getTime();
  const rTime = rightDate.getTime();

  if (op === "equals") return lTime === rTime;
  if (op === "not_equals") return lTime !== rTime;
  if (op === "after") return lTime < rTime;
  if (op === "after_or_equals") return lTime <= rTime;
  if (op === "before") return lTime > rTime;
  if (op === "before_or_equals") return lTime >= rTime;
  if (op === "is_weekday") return rightDate.getDay() >= 1 && rightDate.getDay() < 6;
  if (op === "is_weekend") return rightDate.getDay() === 0 || rightDate.getDay() === 6;

  if (op === "last_month") return isLastMonth(leftDate, rightDate);
  if (op === "last_week") return isLastWeek(leftDate, rightDate);
  if (op === "last_year") return isLastYear(leftDate, rightDate);
  if (op === "this_month") return isThisMonth(leftDate, rightDate);
  if (op === "this_week") return isThisWeek(leftDate, rightDate);
  if (op === "this_year") return isThisYear(leftDate, rightDate);
  if (op === "next_month") return isNextMonth(leftDate, rightDate);
  if (op === "next_week") return isNextWeek(leftDate, rightDate);
  if (op === "next_year") return isNextYear(leftDate, rightDate);

  if (op === "today") return isToday(leftDate, rightDate);
  if (op === "yesterday") return isYesterday(leftDate, rightDate);
  if (op === "tomorrow") return isTomorrow(leftDate, rightDate);
  if (op === "year_to_date") return isYTD(rightDate);

  if (typeof v !== "number") return false;

  if (op === "quarter_of_year") return isInQuarter(v, rightDate);
  if (op === "n_days_ago") return isNDaysAgo(v, rightDate);
  if (op === "n_days_ahead") return isNDaysAhead(v, rightDate);
  if (op === "n_months_ago") return isNMonthsAgo(v, rightDate);
  if (op === "n_months_ahead") return isNMonthsAhead(v, rightDate);
  if (op === "n_weeks_ago") return isNWeeksAgo(v, rightDate);
  if (op === "n_weeks_ahead") return isNWeeksAhead(v, rightDate);
  if (op === "n_years_ago") return isNYearsAgo(v, rightDate);
  if (op === "n_years_ahead") return isNYearsAhead(v, rightDate);

  return false;
}
