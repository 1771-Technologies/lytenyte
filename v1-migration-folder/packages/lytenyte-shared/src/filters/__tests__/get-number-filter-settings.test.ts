import { describe, expect, test } from "vitest";
import { getNumberFilterSettings } from "../get-number-filter-settings.js";
import type { FilterNumber } from "../../+types.js";

describe("getNumberFilterSettings", () => {
  const base: FilterNumber = {
    field: "x",
    kind: "number",
    value: null,
    operator: "equals",
    options: {},
  };
  test("should return the correct value", () => {
    expect(getNumberFilterSettings(base)).toMatchInlineSnapshot(`
      {
        "absolute": false,
        "epsilon": 0.00001,
        "includeNulls": false,
      }
    `);

    expect(
      getNumberFilterSettings({
        ...base,
        options: { absolute: true, epsilon: 1, nullHandling: "include" },
      }),
    ).toMatchInlineSnapshot(`
      {
        "absolute": true,
        "epsilon": 1,
        "includeNulls": true,
      }
    `);
  });
});
