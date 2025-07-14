import { describe, expect, test } from "vitest";
import { getCellRootRowAndColIndex } from "../get-cell-root-row-and-col-index";

describe("getCellRootRowAndColIndex", () => {
  test("should return the correct result", () => {
    expect(getCellRootRowAndColIndex([2, 3], 0, 1)).toMatchInlineSnapshot(`
      [
        0,
        1,
      ]
    `);
    expect(getCellRootRowAndColIndex([0, 2, 3], 0, 1)).toMatchInlineSnapshot(`
      [
        2,
        3,
      ]
    `);
  });
});
