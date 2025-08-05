import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNextWeek } from "../is-next-week.js";

describe("isNextWeek", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(isNextWeek(new Date("2025-01-05"), new Date("2025-01-07"))).toEqual(true);
    expect(isNextWeek(new Date("2025-01-05"), new Date("2025-01-06"))).toEqual(true);
    expect(isNextWeek(new Date("2025-01-06"), new Date("2025-01-06"))).toEqual(false);
    expect(isNextWeek(new Date("2025-01-05"), new Date("2025-01-18"))).toEqual(false);
    expect(isNextWeek(new Date("2025-01-05"), new Date("2024-12-29"))).toEqual(false);
  });
});
