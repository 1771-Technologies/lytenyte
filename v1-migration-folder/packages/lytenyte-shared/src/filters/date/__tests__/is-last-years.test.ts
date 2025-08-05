import { describe, expect, test } from "vitest";
import { isLastYear } from "../is-last-year.js";

describe("isLastYear", () => {
  test("should return the correct result", () => {
    expect(isLastYear(new Date("2025-01-20"), new Date("2024-01-02"))).toEqual(true);
    expect(isLastYear(new Date("2025-01-20"), new Date("2023-01-01"))).toEqual(false);
    expect(isLastYear(new Date("2025-01-20"), new Date("2025-01-02"))).toEqual(false);
    expect(isLastYear(new Date("2025-01-20"), new Date("2026-01-01"))).toEqual(false);
  });
});
