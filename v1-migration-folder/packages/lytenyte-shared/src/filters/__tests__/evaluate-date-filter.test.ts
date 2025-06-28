import { describe, expect, test, vi } from "vitest";
import { evaluateDateFilter } from "../evaluate-date-filter.js";
import type { FilterDateSetting } from "../get-date-filter-settings.js";
import type { FilterDate } from "../../+types.js";

describe("evaluateDateFilter", () => {
  test("should handle nulls correctly", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "equals",
      value: null,
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, null, opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(false);
    expect(evaluateDateFilter({ ...base, value: "2025-02-02" }, null, opts)).toEqual(false);
    expect(
      evaluateDateFilter({ ...base, value: "2025-02-02" }, null, { ...opts, includeNulls: true }),
    ).toEqual(true);

    expect(
      evaluateDateFilter({ ...base, operator: "not_equals", value: "2025-02-02" }, null, {
        ...opts,
      }),
    ).toEqual(false);
    expect(
      evaluateDateFilter({ ...base, operator: "not_equals", value: null }, null, {
        ...opts,
      }),
    ).toEqual(false);
    expect(
      evaluateDateFilter({ ...base, operator: "not_equals", value: null }, "2025-02-02", {
        ...opts,
      }),
    ).toEqual(true);

    expect(
      evaluateDateFilter({ ...base, operator: "after", value: null }, "2025-02-02", {
        ...opts,
      }),
    ).toEqual(false);
    expect(
      evaluateDateFilter({ ...base, operator: "after", value: "2025-02-02" }, null, {
        ...opts,
        includeNulls: true,
      }),
    ).toEqual(true);
    expect(
      evaluateDateFilter({ ...base, operator: "after", value: "2025-02-02" }, null, {
        ...opts,
      }),
    ).toEqual(false);
  });

  test("should return false for invalid data types", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "equals",
      value: new Date() as any,
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(false);
    expect(evaluateDateFilter({ ...base, value: "2025-02-01" }, 23 as any, opts)).toEqual(false);
  });

  test("equals", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "equals",
      value: "2025-02-01T02:30:00",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-01T02:30:00", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-01T02:30:00", { ...opts, includeTime: true })).toEqual(
      true,
    );
    expect(evaluateDateFilter(base, "2025-02-01T02:40:00", { ...opts, includeTime: true })).toEqual(
      false,
    );
  });

  test("not_equals", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "not_equals",
      value: "2025-02-01T02:30:00",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-01T02:30:00", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-01T02:30:00", { ...opts, includeTime: true })).toEqual(
      false,
    );
    expect(evaluateDateFilter(base, "2025-02-01T02:40:00", { ...opts, includeTime: true })).toEqual(
      true,
    );
  });

  test("after", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "after",
      value: "2025-02-01T02:30:00",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-18", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-01T03:30", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-01T03:30", { ...opts, includeTime: true })).toEqual(
      true,
    );
  });

  test("after_or_equals", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "after_or_equals",
      value: "2025-02-01T02:30:00",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-18", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-01T03:30", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-01T01:30", { ...opts, includeTime: true })).toEqual(
      false,
    );
  });

  test("before", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "before",
      value: "2025-02-02T02:30:00",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-18", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-18", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-02T03:30", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-02T01:30", { ...opts, includeTime: true })).toEqual(
      true,
    );
  });

  test("before_or_equals", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "before_or_equals",
      value: "2025-02-02T02:30:00",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-18", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-02T03:30", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-02T03:30", { ...opts, includeTime: true })).toEqual(
      false,
    );
  });

  test("is_weekday", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "is_weekday",
      value: "",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-01-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-05", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-04", opts)).toEqual(false);
  });

  test("is_weekend", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "is_weekend",
      value: "",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };

    expect(evaluateDateFilter(base, "2025-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-04", opts)).toEqual(true);
  });

  test("last_month", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "last_month",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-12-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(false);
  });

  test("this_month", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "this_month",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-12-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(false);
  });

  test("next_month", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "next_month",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-12-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-02-02", opts)).toEqual(true);
  });

  test("last_week", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "last_week",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-12-29", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-06", opts)).toEqual(false);
  });

  test("this_week", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "this_week",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-12-29", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-06", opts)).toEqual(false);
  });

  test("next_week", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "next_week",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-12-29", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-06", opts)).toEqual(true);
  });

  test("last_year", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "last_year",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-01-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2026-01-06", opts)).toEqual(false);
  });

  test("this_year", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "this_year",
      value: "2025-01-03",
      options: {},
    };
    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2026-01-06", opts)).toEqual(false);
  });

  test("next_year", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "next_year",
      value: "2025-01-03",
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2026-01-06", opts)).toEqual(true);
  });

  test("today", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "today",
      value: "2025-01-02",
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-03", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2024-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2026-01-02", opts)).toEqual(false);
  });

  test("yesterday", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "yesterday",
      value: "2025-01-02",
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-01-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-03", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2024-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2026-01-01", opts)).toEqual(false);
  });

  test("yesterday", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "tomorrow",
      value: "2025-01-02",
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-02", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-01-03", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2024-01-03", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2026-01-03", opts)).toEqual(false);
  });

  test("year_to_date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "year_to_date",
      value: "",
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2024-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-03-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-07-03", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("quarter_of_year", () => {
    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "quarter_of_year",
      value: 1,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-01-01", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-04-02", opts)).toEqual(false);
    expect(evaluateDateFilter({ ...base, value: 2 }, "2025-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter({ ...base, value: 2 }, "2025-04-02", opts)).toEqual(true);
    expect(evaluateDateFilter({ ...base, value: 3 }, "2025-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter({ ...base, value: 3 }, "2025-07-02", opts)).toEqual(true);
    expect(evaluateDateFilter({ ...base, value: 4 }, "2025-01-01", opts)).toEqual(false);
    expect(evaluateDateFilter({ ...base, value: 4 }, "2025-10-02", opts)).toEqual(true);
  });

  test("n_days_ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_days_ago",
      value: 3,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-06-07", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("n_days_ahead", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_days_ahead",
      value: 3,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-07", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-06-10", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("n_months_ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_months_ago",
      value: 2,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-04-07", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-05-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-08-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-03-10", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("n_months_ahead", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_months_ahead",
      value: 2,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-07-07", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-08-05", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-09-01", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-03-10", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("n_weeks_ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_weeks_ago",
      value: 2,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-05-29", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-05-23", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-05-16", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-06-20", opts)).toEqual(false);

    vi.useRealTimers();
  });
  test("n_weeks_ahead", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_weeks_ahead",
      value: 2,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-13", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-22", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2025-06-23", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2025-05-20", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("n_years_ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_years_ago",
      value: 2,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2024-06-13", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2023-06-22", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2022-06-23", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2026-05-20", opts)).toEqual(false);

    vi.useRealTimers();
  });
  test("n_years_ahead", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_years_ahead",
      value: 2,
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-02", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2026-06-13", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2027-06-22", opts)).toEqual(true);
    expect(evaluateDateFilter(base, "2028-06-23", opts)).toEqual(false);
    expect(evaluateDateFilter(base, "2023-05-20", opts)).toEqual(false);

    vi.useRealTimers();
  });

  test("bad_inputs", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    const base: FilterDate = {
      field: "x",
      kind: "date",
      operator: "n_years_ahead",
      value: "2",
      options: {},
    };

    const opts: FilterDateSetting = { includeNulls: false, includeTime: false };
    expect(evaluateDateFilter(base, "2025-06-02", opts)).toEqual(false);
    expect(
      evaluateDateFilter({ ...base, value: 2, operator: "x" as any }, "2025-06-02", opts),
    ).toEqual(false);

    vi.useRealTimers();
  });
});
