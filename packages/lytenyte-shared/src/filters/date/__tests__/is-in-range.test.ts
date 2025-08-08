import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isInRange } from "../is-in-range.js";

describe("isInRange", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(
      isInRange(new Date("2025-01-01"), new Date("2024-12-30"), new Date("2025-02-01")),
    ).toEqual(true);
    expect(
      isInRange(new Date("2025-03-01"), new Date("2024-12-30"), new Date("2025-02-01")),
    ).toEqual(false);
  });
});
