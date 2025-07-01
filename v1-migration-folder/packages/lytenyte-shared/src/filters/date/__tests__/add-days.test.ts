import { describe, expect, test } from "vitest";
import { addDays } from "../add-days.js";

describe("addDays", () => {
  test("should return the correct result", () => {
    expect(addDays(new Date("2025-01-01"), 2)).toMatchInlineSnapshot(`2025-01-03T00:00:00.000Z`);
    expect(addDays(new Date("2025-01-01"), -2)).toMatchInlineSnapshot(`2024-12-30T00:00:00.000Z`);
    expect(addDays(new Date("2025-01-01"), -730)).toMatchInlineSnapshot(`2023-01-02T00:00:00.000Z`);
    expect(addDays(new Date("2025-01-01"), 730)).toMatchInlineSnapshot(`2027-01-01T00:00:00.000Z`);
  });
});
