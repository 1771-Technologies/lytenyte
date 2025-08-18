import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isNextMonth } from "../is-next-month.js";

describe("isNextMonth", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("should return the correct result", () => {
    expect(isNextMonth(new Date("2025-01-05"), new Date("2025-02-11"))).toEqual(true);
    expect(isNextMonth(new Date("2025-01-05"), new Date("2025-01-11"))).toEqual(false);
    expect(isNextMonth(new Date("2025-01-05"), new Date("2024-12-11"))).toEqual(false);
  });
});
