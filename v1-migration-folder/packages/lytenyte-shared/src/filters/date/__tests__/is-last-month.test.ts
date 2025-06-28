import { describe, expect, test } from "vitest";
import { isLastMonth } from "../is-last-month.js";

describe("isLastMonth", () => {
  test("should return the correct result", () => {
    expect(isLastMonth(new Date("2025-01-05"), new Date("2024-12-01"))).toEqual(true);
    expect(isLastMonth(new Date("2025-01-05"), new Date("2024-11-01"))).toEqual(false);
    expect(isLastMonth(new Date("2025-01-05"), new Date("2025-02-01"))).toEqual(false);
  });
});
