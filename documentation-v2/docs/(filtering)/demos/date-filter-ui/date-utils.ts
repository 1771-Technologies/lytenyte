// date-buckets.ts
import {
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";

/**
 * Excel-like behavior:
 * - Uses TODAY as the base date.
 * - Weeks start on Sunday.
 * - Calendar-based week/month/quarter/year buckets.
 */

type DateInput = Date | string;

const toDate = (input: DateInput): Date => (input instanceof Date ? input : parseISO(input));

const inInterval = (date: Date, start: Date, end: Date) => isWithinInterval(date, { start, end });

const today = () => new Date();

// -------------------- WEEK --------------------
const weekBounds = (base: Date) => {
  const start = startOfWeek(base, { weekStartsOn: 0 });
  const end = endOfWeek(base, { weekStartsOn: 0 });
  return { start, end };
};

export function isThisWeek(input: DateInput): boolean {
  const date = toDate(input);
  const { start, end } = weekBounds(today());
  return inInterval(date, start, end);
}

export function isNextWeek(input: DateInput): boolean {
  const date = toDate(input);
  const next = addWeeks(today(), 1);
  const { start, end } = weekBounds(next);
  return inInterval(date, start, end);
}

export function isLastWeek(input: DateInput): boolean {
  const date = toDate(input);
  const last = addWeeks(today(), -1);
  const { start, end } = weekBounds(last);
  return inInterval(date, start, end);
}

// -------------------- MONTH --------------------
export function isThisMonth(input: DateInput): boolean {
  const date = toDate(input);
  const base = today();
  return inInterval(date, startOfMonth(base), endOfMonth(base));
}

export function isNextMonth(input: DateInput): boolean {
  const date = toDate(input);
  const base = addMonths(today(), 1);
  return inInterval(date, startOfMonth(base), endOfMonth(base));
}

export function isLastMonth(input: DateInput): boolean {
  const date = toDate(input);
  const base = addMonths(today(), -1);
  return inInterval(date, startOfMonth(base), endOfMonth(base));
}

// -------------------- QUARTER --------------------
export function isThisQuarter(input: DateInput): boolean {
  const date = toDate(input);
  const base = today();
  return inInterval(date, startOfQuarter(base), endOfQuarter(base));
}

export function isNextQuarter(input: DateInput): boolean {
  const date = toDate(input);
  const base = addQuarters(today(), 1);
  return inInterval(date, startOfQuarter(base), endOfQuarter(base));
}

export function isLastQuarter(input: DateInput): boolean {
  const date = toDate(input);
  const base = addQuarters(today(), -1);
  return inInterval(date, startOfQuarter(base), endOfQuarter(base));
}

// -------------------- YEAR --------------------
export function isThisYear(input: DateInput): boolean {
  const date = toDate(input);
  const base = today();
  return inInterval(date, startOfYear(base), endOfYear(base));
}

export function isNextYear(input: DateInput): boolean {
  const date = toDate(input);
  const base = addYears(today(), 1);
  return inInterval(date, startOfYear(base), endOfYear(base));
}

export function isLastYear(input: DateInput): boolean {
  const date = toDate(input);
  const base = addYears(today(), -1);
  return inInterval(date, startOfYear(base), endOfYear(base));
}

// -------------------- YTD --------------------
export function isYtd(input: DateInput): boolean {
  const date = toDate(input);
  const start = startOfYear(today());
  const end = today();
  return inInterval(date, start, end);
}

// -------------------- IS IN PERIOD --------------------

type MonthPeriod =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

type QuarterPeriod = "q1" | "q2" | "q3" | "q4";

export type Period = MonthPeriod | QuarterPeriod;

const MONTH_INDEX: Record<MonthPeriod, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const QUARTER_START_MONTH: Record<QuarterPeriod, number> = {
  q1: 0, // Jan
  q2: 3, // Apr
  q3: 6, // Jul
  q4: 9, // Oct
};

/**
 * Returns true if `date` falls within the given `period`.
 *
 * Excel-like interpretation:
 * - Month period ("jan".."dec"): checks month match (in the date's own year).
 * - Quarter period ("q1".."q4"): checks quarter match (in the date's own year).
 *
 * Examples:
 *   isInPeriod("2026-02-10", "feb") => true
 *   isInPeriod("2026-02-10", "q1")  => true
 *   isInPeriod("2026-10-01", "q4")  => true
 */
export function isInPeriod(dateInput: DateInput, period: Period): boolean {
  const date = toDate(dateInput);
  const p = period.toLowerCase() as Period;

  if (p.startsWith("q")) {
    const startMonth = QUARTER_START_MONTH[p as QuarterPeriod];
    const year = date.getFullYear();
    const start = startOfQuarter(new Date(year, startMonth, 1));
    const end = endOfQuarter(new Date(year, startMonth, 1));
    return inInterval(date, start, end);
  }

  const monthIndex = MONTH_INDEX[p as MonthPeriod];
  const year = date.getFullYear();
  const start = startOfMonth(new Date(year, monthIndex, 1));
  const end = endOfMonth(new Date(year, monthIndex, 1));
  return inInterval(date, start, end);
}
