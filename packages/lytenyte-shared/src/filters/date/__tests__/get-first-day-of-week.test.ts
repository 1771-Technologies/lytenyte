import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getFirstDayOfWeek } from "../get-first-day-of-week.js";

describe("getFirstDayOfWeek", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(getFirstDayOfWeek(new Date("2025-01-06"))).toMatchInlineSnapshot(
      `2025-01-06T00:00:00.000Z`,
    );
    expect(getFirstDayOfWeek(new Date("2025-01-08"))).toMatchInlineSnapshot(
      `2025-01-06T00:00:00.000Z`,
    );
    expect(getFirstDayOfWeek(new Date("2025-01-03"))).toMatchInlineSnapshot(
      `2024-12-30T00:00:00.000Z`,
    );
  });
});
