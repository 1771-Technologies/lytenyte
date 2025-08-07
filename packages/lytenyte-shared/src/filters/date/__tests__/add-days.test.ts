import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addDays } from "../add-days.js";

describe("addDays", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test.only("should return the correct result", () => {
    expect(addDays(new Date("2025-01-01"), 2)).toMatchInlineSnapshot(`2025-01-03T00:00:00.000Z`);
    expect(addDays(new Date("2025-01-01"), -2)).toMatchInlineSnapshot(`2024-12-30T00:00:00.000Z`);
    expect(addDays(new Date("2025-01-01"), -730)).toMatchInlineSnapshot(`2023-01-02T00:00:00.000Z`);
    expect(addDays(new Date("2025-01-01"), 730)).toMatchInlineSnapshot(`2027-01-01T00:00:00.000Z`);
  });
});
