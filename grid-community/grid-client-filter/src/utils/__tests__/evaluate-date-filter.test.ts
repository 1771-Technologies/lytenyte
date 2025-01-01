import type { FilterDate, FilterDateOperator } from "@1771technologies/grid-types/community";
import { evaluateDate } from "../evaluate-date-filter";

const t: FilterDate = {
  datePeriod: null,
  columnId: "",
  operator: "equal",
  value: "2023-01-06",
  kind: "date",
};

const fixedDate = new Date("2023-08-09");
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(fixedDate);
});

afterEach(() => {
  vi.clearAllTimers();
});

describe("evaluateDateFilter", () => {
  test("evaluateDateFilter", () => {
    const date = new Date("ad");
    expect(evaluateDate(date, t)).toBe(false);
  });

  test.each([
    { date: "2023-03-05", filter: { ...t, value: "2023-03-05" }, is: true },
    { date: "2023-03-05", filter: { ...t, value: "2024-03-05" }, is: false },
    {
      date: "2023-04-05",
      filter: { ...t, value: "2023-04-05" },
      is: true,
    },
    { date: "2023-03-05", filter: { ...t, value: "2023-04-05", operator: "before" }, is: true },
    { date: "2023-03-05", filter: { ...t, value: "2023-02-05", operator: "before" }, is: false },
    { date: "2023-03-05", filter: { ...t, value: "2023-02-05", operator: "after" }, is: true },
    { date: "2023-03-05", filter: { ...t, value: "2023-04-05", operator: "after" }, is: false },

    { date: "2023-07-11", filter: { ...t, operator: "last_month" }, is: true },
    { date: "2023-08-11", filter: { ...t, operator: "last_month" }, is: false },

    { date: "2023-08-11", filter: { ...t, operator: "this_month" }, is: true },
    { date: "2023-07-11", filter: { ...t, operator: "this_month" }, is: false },

    { date: "2023-09-11", filter: { ...t, operator: "next_month" }, is: true },
    { date: "2023-08-11", filter: { ...t, operator: "next_month" }, is: false },

    { date: "2023-08-03", filter: { ...t, operator: "last_week" }, is: true },
    { date: "2023-08-19", filter: { ...t, operator: "last_week" }, is: false },

    { date: "2023-08-06", filter: { ...t, operator: "this_week" }, is: true },
    { date: "2023-08-03", filter: { ...t, operator: "this_week" }, is: false },

    { date: "2023-08-19", filter: { ...t, operator: "next_week" }, is: true },
    { date: "2023-08-03", filter: { ...t, operator: "next_week" }, is: false },

    { date: "2022-08-03", filter: { ...t, operator: "last_year" }, is: true },
    { date: "2024-08-19", filter: { ...t, operator: "last_year" }, is: false },

    { date: "2023-08-03", filter: { ...t, operator: "this_year" }, is: true },
    { date: "2024-08-19", filter: { ...t, operator: "this_year" }, is: false },

    { date: "2024-08-03", filter: { ...t, operator: "next_year" }, is: true },
    { date: "2023-08-19", filter: { ...t, operator: "next_year" }, is: false },

    { date: "2023-06-03", filter: { ...t, operator: "last_quarter" }, is: true },
    { date: "2023-08-19", filter: { ...t, operator: "last_quarter" }, is: false },

    { date: "2023-07-03", filter: { ...t, operator: "this_quarter" }, is: true },
    { date: "2023-03-19", filter: { ...t, operator: "this_quarter" }, is: false },

    { date: "2023-11-03", filter: { ...t, operator: "next_quarter" }, is: true },
    { date: "2023-08-19", filter: { ...t, operator: "next_quarter" }, is: false },

    { date: "2023-08-09", filter: { ...t, operator: "today" }, is: true },
    { date: "2023-08-12", filter: { ...t, operator: "today" }, is: false },

    { date: "2023-08-10", filter: { ...t, operator: "tomorrow" }, is: true },
    { date: "2023-08-12", filter: { ...t, operator: "tomorrow" }, is: false },

    { date: "2023-08-08", filter: { ...t, operator: "yesterday" }, is: true },
    { date: "2023-08-12", filter: { ...t, operator: "yesterday" }, is: false },

    { date: "2023-06-07", filter: { ...t, operator: "ytd" }, is: true },
    { date: "2023-11-07", filter: { ...t, operator: "ytd" }, is: false },

    {
      date: "2023-11-07",
      filter: { ...t, operator: "all_dates_in_the_period", datePeriod: null },
      is: false,
    },
    {
      date: "2023-11-07",
      filter: { ...t, operator: "all_dates_in_the_period", datePeriod: "quarter-4" },
      is: true,
    },
    {
      date: "2023-11-07",
      filter: { ...t, operator: "all_dates_in_the_period", datePeriod: "quarter-3" },
      is: false,
    },
    {
      date: "2023-11-07",
      filter: { ...t, operator: "xx" as unknown as FilterDateOperator },
      is: false,
    },
  ] satisfies { date: string; filter: FilterDate; is: boolean }[])(
    `evaluateDateFilter -- $date - $filter.operator`,
    ({ date, filter, is }) => {
      expect(evaluateDate(new Date(date), filter)).toBe(is);
    },
  );
});
