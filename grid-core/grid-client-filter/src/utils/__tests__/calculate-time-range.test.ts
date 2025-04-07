import type { Interval } from "../calculate-time-range";
import { calculateTimeRange } from "../calculate-time-range";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const fixedDate = new Date(2023, 7, 10);
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(fixedDate);
});

afterEach(() => {
  vi.clearAllTimers();
});

test.each([
  { interval: "tomorrow", expected: ["2023-08-11", "2023-08-11"] },
  { interval: "today", expected: ["2023-08-10", "2023-08-10"] },
  { interval: "yesterday", expected: ["2023-08-09", "2023-08-09"] },
  { interval: "nextWeek", expected: ["2023-08-14", "2023-08-20"] },
  { interval: "thisWeek", expected: ["2023-08-06", "2023-08-12"] },
  { interval: "lastWeek", expected: ["2023-07-30", "2023-08-05"] },
  { interval: "nextMonth", expected: ["2023-09-01", "2023-09-30"] },
  { interval: "thisMonth", expected: ["2023-08-01", "2023-08-31"] },
  { interval: "lastMonth", expected: ["2023-07-01", "2023-07-31"] },
  { interval: "nextQuarter", expected: ["2023-10-01", "2023-12-31"] },
  { interval: "thisQuarter", expected: ["2023-07-01", "2023-09-30"] },
  { interval: "lastQuarter", expected: ["2023-04-01", "2023-06-30"] },
  { interval: "nextYear", expected: ["2024-01-01", "2024-12-31"] },
  { interval: "thisYear", expected: ["2023-01-01", "2023-12-31"] },
  { interval: "lastYear", expected: ["2022-01-01", "2022-12-31"] },
  { interval: "yearToDate", expected: ["2023-01-01", "2023-08-10"] },
] satisfies {
  interval: Interval;
  expected: [string, string];
}[])(`calculateTimeInterval - $interval`, ({ interval, expected }) => {
  const result = calculateTimeRange(interval);
  const start = formatDate(result.startDate);
  const end = formatDate(result.endDate);
  expect([start, end]).toEqual(expected);
});
