import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNYearsAhead } from "../is-n-years-ahead.js";

describe("isNYearsAgo", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-05"));

    expect(isNYearsAhead(2, new Date("2024-12-30"))).toEqual(false);
    expect(isNYearsAhead(2, new Date("2024-12-29"))).toEqual(false);
    expect(isNYearsAhead(2, new Date("2021-01-17"))).toEqual(false);
    expect(isNYearsAhead(2, new Date("2026-01-22"))).toEqual(true);
    expect(isNYearsAhead(3, new Date("2027-12-22"))).toEqual(true);
    expect(isNYearsAhead(3, new Date("2025-12-22"))).toEqual(true);
    expect(isNYearsAhead(3, new Date("2030-12-22"))).toEqual(false);

    vi.useRealTimers();
  });
});
