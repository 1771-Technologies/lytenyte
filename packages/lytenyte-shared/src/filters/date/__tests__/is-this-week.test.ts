import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isThisWeek } from "../is-this-week.js";

describe("isThisWeek", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(isThisWeek(new Date("2025-01-05"), new Date("2025-01-03"))).toEqual(true);
    expect(isThisWeek(new Date("2025-01-05"), new Date("2025-01-03"))).toEqual(true);
    expect(isThisWeek(new Date("2025-01-05"), new Date("2024-12-29"))).toEqual(false);
    expect(isThisWeek(new Date("2025-01-05"), new Date("2024-12-30"))).toEqual(true);
    expect(isThisWeek(new Date("2025-01-05"), new Date("2025-01-06"))).toEqual(false);
  });
});
