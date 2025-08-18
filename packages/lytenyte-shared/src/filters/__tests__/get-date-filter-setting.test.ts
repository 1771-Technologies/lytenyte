import { describe, expect, test } from "vitest";
import { getDateFilterSettings } from "../get-date-filter-settings.js";
import type { FilterDate } from "../../+types.js";

describe("getDateFilterSettings", () => {
  const base: FilterDate = {
    kind: "date",
    operator: "after",
    value: "2025-01-01",
    options: {},
  };
  test("should return the correct result", () => {
    expect(getDateFilterSettings(base)).toMatchInlineSnapshot(`
      {
        "includeNulls": false,
        "includeTime": false,
      }
    `);

    expect(
      getDateFilterSettings({
        ...base,
        options: { includeTime: true, nullHandling: "include" },
      }),
    ).toMatchInlineSnapshot(`
      {
        "includeNulls": true,
        "includeTime": true,
      }
    `);
  });
});
