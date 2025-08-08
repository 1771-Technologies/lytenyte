import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isLastWeek } from "../is-last-week.js";

describe("isLastWeek", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(isLastWeek(new Date("2025-01-06"), new Date("2025-01-08"))).toEqual(false);
    expect(isLastWeek(new Date("2025-01-04"), new Date("2025-01-08"))).toEqual(false);
    expect(isLastWeek(new Date("2025-01-03"), new Date("2024-12-29"))).toEqual(true);
    expect(isLastWeek(new Date("2025-01-01"), new Date("2024-12-21"))).toEqual(false);
    expect(isLastWeek(new Date("2024-12-29"), new Date("2025-01-08"))).toEqual(false);
  });
});
