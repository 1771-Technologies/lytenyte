import { describe, expect, test } from "vitest";
import { isInQuarter } from "../is-in-quarter.js";

describe("isInQuarter", () => {
  test("should return the correct result", () => {
    expect(isInQuarter(1, new Date("2025-01-02"))).toEqual(true);
    expect(isInQuarter(1, new Date("2025-03-02"))).toEqual(true);
    expect(isInQuarter(1, new Date("2025-04-02"))).toEqual(false);
    expect(isInQuarter(2, new Date("2025-04-02"))).toEqual(true);
    expect(isInQuarter(2, new Date("2025-06-02"))).toEqual(true);
    expect(isInQuarter(2, new Date("2025-07-02"))).toEqual(false);
    expect(isInQuarter(3, new Date("2025-07-02"))).toEqual(true);
    expect(isInQuarter(3, new Date("2025-09-02"))).toEqual(true);
    expect(isInQuarter(3, new Date("2025-10-02"))).toEqual(false);
    expect(isInQuarter(4, new Date("2025-10-02"))).toEqual(true);
    expect(isInQuarter(4, new Date("2025-12-02"))).toEqual(true);
  });
});
