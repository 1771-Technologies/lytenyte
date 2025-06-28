import { describe, expect, test } from "vitest";
import { isToday } from "../is-today.js";

describe("isToday", () => {
  test("should return the correct result", () => {
    expect(isToday(new Date("2025-01-01"), new Date("2025-01-01"))).toEqual(true);
    expect(isToday(new Date("2025-02-01"), new Date("2025-01-01"))).toEqual(false);
    expect(isToday(new Date("2025-02-01"), new Date("2025-02-02T01:00:00+03:00"))).toEqual(true);
  });
});
