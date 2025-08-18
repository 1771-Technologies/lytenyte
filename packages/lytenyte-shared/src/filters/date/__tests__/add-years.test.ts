import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addYears } from "../add-years.js";

describe("addYears", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(addYears(new Date("2025-01-01"), 3)).toMatchInlineSnapshot(`2028-01-01T00:00:00.000Z`);
    expect(addYears(new Date("2025-01-01"), -3)).toMatchInlineSnapshot(`2022-01-01T00:00:00.000Z`);
    expect(addYears(new Date("2025-01-01"), 0)).toMatchInlineSnapshot(`2025-01-01T00:00:00.000Z`);
  });
});
