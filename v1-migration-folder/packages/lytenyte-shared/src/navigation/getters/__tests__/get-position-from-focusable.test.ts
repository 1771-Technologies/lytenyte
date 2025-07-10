import { describe, expect, test } from "vitest";
import { getPositionFromFocusable } from "../get-position-from-focusable";

describe("getPositionFromFocusable", () => {
  test("should return the correct result for cells", () => {
    const cell = document.createElement("div");
    cell.setAttribute("data-ln-cell", "true");
    cell.setAttribute("data-ln-rowindex", "1");
    cell.setAttribute("data-ln-colindex", "3");
    cell.setAttribute("data-ln-rowspan", "2");
    cell.setAttribute("data-ln-colspan", "4");

    expect(getPositionFromFocusable(cell)).toMatchInlineSnapshot(`
      {
        "colIndex": 3,
        "kind": "cell",
        "root": {
          "colIndex": 3,
          "colSpan": 4,
          "rowIndex": 1,
          "rowSpan": 2,
        },
        "rowIndex": 1,
      }
    `);
  });

  test("should return the correct result for full width rows", () => {
    const full = document.createElement("div");
    full.setAttribute("data-ln-row", "true");
    full.setAttribute("data-ln-rowtype", "full-width");
    full.setAttribute("data-ln-rowindex", "3");

    expect(getPositionFromFocusable(full)).toMatchInlineSnapshot(`
      {
        "colIndex": 0,
        "kind": "full-width",
        "rowIndex": 3,
      }
    `);
  });
  test("should return the correct result for header cells", () => {
    const header = document.createElement("div");
    header.setAttribute("data-ln-header-cell", "true");
    header.setAttribute("data-ln-colindex", "2");

    expect(getPositionFromFocusable(header)).toMatchInlineSnapshot(`
      {
        "colIndex": 2,
        "kind": "header-cell",
      }
    `);
  });

  test("should return the correct result for header group cells", () => {
    const header = document.createElement("div");
    header.setAttribute("data-ln-header-group", "true");
    header.setAttribute("data-ln-colindex", "2");
    header.setAttribute("data-ln-colspan", "3");
    header.setAttribute("data-ln-rowindex", "1");

    expect(getPositionFromFocusable(header)).toMatchInlineSnapshot(`
      {
        "colIndex": 2,
        "columnEndIndex": 5,
        "columnStartIndex": 2,
        "hierarchyRowIndex": 1,
        "kind": "header-group-cell",
      }
    `);
  });
});
