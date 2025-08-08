import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isThisMonth } from "../is-this-month.js";

describe("isThisMonth", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(isThisMonth(new Date("2025-02-01"), new Date("2025-02-01"))).toEqual(true);
    expect(isThisMonth(new Date("2024-02-01"), new Date("2025-02-01"))).toEqual(false);
    expect(isThisMonth(new Date("2025-01-01"), new Date("2025-02-01"))).toEqual(false);
    expect(isThisMonth(new Date("2025-03-01"), new Date("2025-02-01"))).toEqual(false);
  });
});
