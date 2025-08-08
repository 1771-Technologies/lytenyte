import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNYearsAgo } from "../is-n-years-ago.js";

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

    expect(isNYearsAgo(2, new Date("2024-12-30"))).toEqual(true);
    expect(isNYearsAgo(2, new Date("2024-12-29"))).toEqual(true);
    expect(isNYearsAgo(2, new Date("2021-01-17"))).toEqual(false);
    expect(isNYearsAgo(2, new Date("2023-01-22"))).toEqual(true);
    expect(isNYearsAgo(3, new Date("2027-12-22"))).toEqual(false);

    vi.useRealTimers();
  });
});
