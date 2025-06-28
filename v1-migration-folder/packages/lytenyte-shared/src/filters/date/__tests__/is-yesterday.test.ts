import { describe, expect, test } from "vitest";
import { isYesterday } from "../is-yesterday.js";

describe("isYesterday", () => {
  test("should return the correct result", () => {
    expect(isYesterday(new Date("2025-01-02"), new Date("2025-01-01"))).toEqual(true);
    expect(isYesterday(new Date("2025-02-01"), new Date("2025-02-02"))).toEqual(false);
    expect(isYesterday(new Date("2025-02-02"), new Date("2025-02-01T11:00:00-03:00"))).toEqual(
      true,
    );
  });
});
