import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isTomorrow } from "../is-tomorrow.js";

describe("isTomorrow", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(isTomorrow(new Date("2025-01-01"), new Date("2025-01-01"))).toEqual(false);
    expect(isTomorrow(new Date("2025-02-01"), new Date("2025-02-02"))).toEqual(true);
    expect(isTomorrow(new Date("2025-02-01"), new Date("2025-02-02T01:00:00+03:00"))).toEqual(
      false,
    );
  });
});
