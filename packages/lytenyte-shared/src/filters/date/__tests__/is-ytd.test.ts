import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isYTD } from "../is-ytd.js";

describe("isYtd", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-05"));

    expect(isYTD(new Date("2025-02-03"))).toEqual(true);
    expect(isYTD(new Date("2025-07-03"))).toEqual(false);
    expect(isYTD(new Date("2024-02-03"))).toEqual(false);
    expect(isYTD(new Date("2024-12-03"))).toEqual(false);
    expect(isYTD(new Date("2026-03-03"))).toEqual(false);

    vi.useRealTimers();
  });
});
