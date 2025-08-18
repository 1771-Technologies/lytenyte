import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isLastMonth } from "../is-last-month.js";

describe("isLastMonth", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(isLastMonth(new Date("2025-01-05"), new Date("2024-12-01"))).toEqual(true);
    expect(isLastMonth(new Date("2025-01-05"), new Date("2024-11-01"))).toEqual(false);
    expect(isLastMonth(new Date("2025-01-05"), new Date("2025-02-01"))).toEqual(false);
  });
});
