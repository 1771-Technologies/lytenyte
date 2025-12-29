import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getLastDayOfWeek } from "../get-last-day-of-week.js";

describe("getLastDayOfWeek", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(getLastDayOfWeek(new Date("2025-01-06"))).toMatchInlineSnapshot(`2025-01-12T00:00:00.000Z`);
    expect(getLastDayOfWeek(new Date("2025-01-08"))).toMatchInlineSnapshot(`2025-01-12T00:00:00.000Z`);
    expect(getLastDayOfWeek(new Date("2025-01-03"))).toMatchInlineSnapshot(`2025-01-05T00:00:00.000Z`);
    expect(getLastDayOfWeek(new Date("2024-12-30"))).toMatchInlineSnapshot(`2025-01-05T00:00:00.000Z`);
    expect(getLastDayOfWeek(new Date("2024-12-29"))).toMatchInlineSnapshot(`2024-12-29T00:00:00.000Z`);
  });
});
