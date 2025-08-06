import { describe, expect, test } from "vitest";
import { evaluateNumberFilter as ev } from "../evaluate-number-filter.js";
import type { FilterNumberSettings } from "../get-number-filter-settings.js";
import type { FilterNumber, FilterNumberOperator } from "../../+types.js";

describe("evaluateNumberFilter", () => {
  test("equals", () => {
    const f: FilterNumber = {
      kind: "number",
      operator: "equals",
      value: 11,
      options: {},
    };

    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };

    expect(ev(f, 11, opts)).toEqual(true);
    expect(ev(f, 11.002, opts)).toEqual(false);
    expect(ev(f, 11.000002, opts)).toEqual(true);
    expect(ev({ ...f }, 11.000002, { ...opts, epsilon: 0.00000001 })).toEqual(false);
    expect(ev({ ...f }, -11, { ...opts, absolute: true })).toEqual(true);
    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: false })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: null }, 2, { ...opts, includeNulls: true })).toEqual(false);
    expect(ev({ ...f, value: -12 }, 12, { ...opts, absolute: true })).toEqual(true);
  });

  test("not_equals", () => {
    const f: FilterNumber = {
      kind: "number",
      operator: "not_equals",
      value: 11,
      options: {},
    };
    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };

    expect(ev(f, 11, opts)).toEqual(false);
    expect(ev(f, 11.002, opts)).toEqual(true);
    expect(ev(f, 11.000002, opts)).toEqual(false);
    expect(ev({ ...f }, 11.000002, { ...opts, epsilon: 0.00000001 })).toEqual(true);
    expect(ev({ ...f }, -11, { ...opts, absolute: true })).toEqual(false);
    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: null }, 2, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: -12 }, 12, { ...opts, absolute: true })).toEqual(false);
  });

  test("greater_than", () => {
    const f: FilterNumber = {
      kind: "number",
      operator: "greater_than",
      value: 11,
      options: {},
    };
    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };

    expect(ev(f, 11, opts)).toEqual(false);
    expect(ev(f, 13, opts)).toEqual(true);
    expect(ev(f, 9, opts)).toEqual(false);

    expect(ev(f, -12, { ...opts, absolute: true })).toEqual(true);
    expect(ev(f, -9, { ...opts, absolute: true })).toEqual(false);

    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: null }, 2, { ...opts, includeNulls: true })).toEqual(false);
  });

  test("greater_than_or_equals", () => {
    const f: FilterNumber = {
      kind: "number",
      operator: "greater_than_or_equals",
      value: 11,
      options: {},
    };
    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };

    expect(ev(f, 11, opts)).toEqual(true);
    expect(ev(f, 13, opts)).toEqual(true);
    expect(ev(f, 9, opts)).toEqual(false);

    expect(ev(f, -12, { ...opts, absolute: true })).toEqual(true);
    expect(ev(f, -9, { ...opts, absolute: true })).toEqual(false);

    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: false })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: null }, 2, { ...opts, includeNulls: true })).toEqual(false);
  });

  test("less_than", () => {
    const f: FilterNumber = {
      kind: "number",
      operator: "less_than",
      value: 11,
      options: {},
    };
    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };

    expect(ev(f, 11, opts)).toEqual(false);
    expect(ev(f, 13, opts)).toEqual(false);
    expect(ev(f, 9, opts)).toEqual(true);

    expect(ev(f, -12, { ...opts, absolute: true })).toEqual(false);
    expect(ev(f, -9, { ...opts, absolute: true })).toEqual(true);

    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: null }, 2, { ...opts, includeNulls: true })).toEqual(false);
  });

  test("less_than_or_equals", () => {
    const f: FilterNumber = {
      kind: "number",
      operator: "less_than_or_equals",
      value: 11,
      options: {},
    };
    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };

    expect(ev(f, 11, opts)).toEqual(true);
    expect(ev(f, 13, opts)).toEqual(false);
    expect(ev(f, 9, opts)).toEqual(true);

    expect(ev(f, -12, { ...opts, absolute: true })).toEqual(false);
    expect(ev(f, -9, { ...opts, absolute: true })).toEqual(true);

    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: false })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: 11 }, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev({ ...f, value: null }, 2, { ...opts, includeNulls: true })).toEqual(false);
  });

  test("bad data values", () => {
    const base: FilterNumber = {
      kind: "number",
      operator: "less_than_or_equals",
      value: 11,
      options: {},
    };

    const opts: FilterNumberSettings = { absolute: false, epsilon: 0.0001, includeNulls: false };
    const operators: FilterNumberOperator[] = [
      "equals",
      "greater_than",
      "greater_than_or_equals",
      "less_than",
      "less_than_or_equals",
      "not_equals",
    ];

    for (const op of operators) {
      const filter = { ...base, operator: op };
      expect(ev({ ...base, value: new Date() as any }, 11, opts)).toEqual(false);
      expect(ev(filter, new Date() as any, opts)).toEqual(false);
    }
  });
});
