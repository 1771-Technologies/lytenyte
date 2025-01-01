import { isInPeriod, type Period } from "../is-in-period";

describe("isInPeriod", () => {
  test.each([
    { date: "2023-01-01", period: "quarter-1", is: true },
    { date: "2023-01-01", period: "quarter-2", is: false },
    { date: "2023-01-01", period: "january", is: true },
    { date: "2023-01-01", period: "august", is: false },

    { date: "2023-04-01", period: "quarter-2", is: true },
    { date: "2023-07-01", period: "quarter-3", is: true },
    { date: "2023-011-01", period: "quarter-4", is: true },

    { date: "2023-01-01", period: "january", is: true },
    { date: "2023-02-01", period: "february", is: true },
    { date: "2023-03-01", period: "march", is: true },
    { date: "2023-04-01", period: "april", is: true },
    { date: "2023-05-01", period: "may", is: true },
    { date: "2023-06-01", period: "june", is: true },
    { date: "2023-07-01", period: "july", is: true },
    { date: "2023-08-01", period: "august", is: true },
    { date: "2023-09-01", period: "september", is: true },
    { date: "2023-10-01", period: "october", is: true },
    { date: "2023-11-01", period: "november", is: true },
    { date: "2023-12-01", period: "december", is: true },
    { date: "2023-12-01", period: "xx" as Period, is: false },
  ] satisfies {
    date: string;
    period: Period;
    is: boolean;
  }[])(`isInPeriod - $period`, ({ date, period, is }) => {
    const b = new Date(date);
    const timeZoneOffset = b.getTimezoneOffset();
    const adjustedDate = new Date(b.getTime() + timeZoneOffset * 60 * 1000);

    expect(isInPeriod(adjustedDate, period)).toBe(is);
  });
});
