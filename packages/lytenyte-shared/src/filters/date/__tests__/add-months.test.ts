import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { addMonths } from "../add-months.js";

describe("addMonths", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  test("should return the correct result", () => {
    expect(addMonths(new Date("2025-06-03"), 3)).toMatchInlineSnapshot(`2025-09-03T00:00:00.000Z`);
    expect(addMonths(new Date("2025-06-03"), 15)).toMatchInlineSnapshot(`2026-09-03T00:00:00.000Z`);
    expect(addMonths(new Date("2025-01-03"), -1)).toMatchInlineSnapshot(`2024-12-03T00:00:00.000Z`);
    expect(addMonths(new Date("2025-06-03"), -3)).toMatchInlineSnapshot(`2025-03-03T00:00:00.000Z`);
    expect(addMonths(new Date("2025-06-03"), -15)).toMatchInlineSnapshot(
      `2024-03-03T00:00:00.000Z`,
    );
  });
});
