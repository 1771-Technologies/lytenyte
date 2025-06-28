import { describe, expect, test } from "vitest";
import { isThisYear } from "../is-this-year.js";

describe("isThisYear", () => {
  test("should return the correct result", () => {
    expect(isThisYear(new Date("2025-02-01"), new Date("2025-01-04"))).toEqual(true);
    expect(isThisYear(new Date("2024-02-01"), new Date("2025-01-04"))).toEqual(false);
    expect(isThisYear(new Date("2025-01-01"), new Date("2024-01-04"))).toEqual(false);
    expect(isThisYear(new Date("2025-01-01"), new Date("2026-01-04"))).toEqual(false);
  });
});
