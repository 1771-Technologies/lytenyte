import { describe, test, expect } from "vitest";
import { builtIns, validBuiltIns } from "../built-ins.js";
import { avg } from "../avg.js";
import { count } from "../count.js";
import { first } from "../first.js";
import { last } from "../last.js";
import { max } from "../max.js";
import { min } from "../min.js";
import { sum } from "../sum.js";

describe("builtIns", () => {
  test("should export all utility functions", () => {
    expect(builtIns).toEqual({
      sum,
      count,
      avg,
      first,
      last,
      min,
      max,
    });
  });

  test("should maintain reference equality for exported functions", () => {
    expect(builtIns.sum).toBe(sum);
    expect(builtIns.count).toBe(count);
    expect(builtIns.avg).toBe(avg);
    expect(builtIns.first).toBe(first);
    expect(builtIns.last).toBe(last);
    expect(builtIns.min).toBe(min);
    expect(builtIns.max).toBe(max);
  });

  test("validBuiltIns should contain all function names", () => {
    const expectedNames = ["sum", "count", "avg", "first", "last", "min", "max"];
    expect(validBuiltIns.size).toBe(expectedNames.length);
    expectedNames.forEach((name) => {
      expect(validBuiltIns.has(name)).toBe(true);
    });
  });

  test("validBuiltIns should match builtIns keys exactly", () => {
    const builtInKeys = Object.keys(builtIns);
    expect(validBuiltIns.size).toBe(builtInKeys.length);
    builtInKeys.forEach((key) => {
      expect(validBuiltIns.has(key)).toBe(true);
    });
  });

  test("should have working functions in builtIns", () => {
    const testArray = [1, 2, null, 3];
    expect(builtIns.sum(testArray)).toBe(6);
    expect(builtIns.count(testArray)).toBe(3);
    expect(builtIns.avg(testArray)).toBe(1.5);
    expect(builtIns.first(testArray)).toBe(1);
    expect(builtIns.last(testArray)).toBe(3);
    expect(builtIns.min(testArray)).toBe(1);
    expect(builtIns.max(testArray)).toBe(3);
  });
});
