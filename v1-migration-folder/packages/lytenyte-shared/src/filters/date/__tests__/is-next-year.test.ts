import { describe, expect, test } from "vitest";
import { isNextYear } from "../is-next-year.js";

describe("isNextYear", () => {
  test("should return the correct result", () => {
    expect(isNextYear(new Date("2025-01-04"), new Date("2026-02-23"))).toEqual(true);
    expect(isNextYear(new Date("2025-01-04"), new Date("2027-02-23"))).toEqual(false);
    expect(isNextYear(new Date("2025-01-04"), new Date("2026-01-01"))).toEqual(true);
    expect(isNextYear(new Date("2025-01-04"), new Date("2024-01-01"))).toEqual(false);
  });
});
