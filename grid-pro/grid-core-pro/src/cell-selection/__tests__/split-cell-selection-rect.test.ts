import { test, expect } from "vitest";
import { formatTable } from "@1771technologies/js-utils";
import { splitCellSelectionRect } from "../split-cell-selection-rect.js";
import type { CellSelectionRectPro } from "@1771technologies/grid-types/pro";

function splitTable(c: CellSelectionRectPro[]) {
  const values = c.map((c) => [c.rowStart, c.rowEnd, c.columnStart, c.columnEnd].map(String));
  return formatTable(values, ["Row Start", "Row End", "Col Start", "Col End"]);
}

// Common grid configuration
const bounds = {
  colStartCount: 2,
  colCenterCount: 5,
  rowTopCount: 2,
  rowCenterCount: 5,
};

test("should not split when selection is within bounds", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 0, rowEnd: 1, columnStart: 0, columnEnd: 1 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    0         | 1       | 0         | 1      
    "
  `);
});

test("should split across column start boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 0, rowEnd: 1, columnStart: 1, columnEnd: 4 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    0         | 1       | 1         | 2      
    0         | 1       | 2         | 4      
    "
  `);
});

test("should handle selection exactly at bounds", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 2, rowEnd: 7, columnStart: 2, columnEnd: 7 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    2         | 7       | 2         | 7      
    "
  `);
});

test("should split selection across start boundary to center boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 3, rowEnd: 4, columnStart: 1, columnEnd: 5 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    3         | 4       | 1         | 2      
    3         | 4       | 2         | 5      
    "
  `);
});

test("should split selection across start boundary to end boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 3, rowEnd: 4, columnStart: 1, columnEnd: 8 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    3         | 4       | 1         | 2      
    3         | 4       | 2         | 7      
    3         | 4       | 7         | 8      
    "
  `);
});

test("should split selection across top boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 1, rowEnd: 3, columnStart: 3, columnEnd: 4 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    1         | 2       | 3         | 4      
    2         | 3       | 3         | 4      
    "
  `);
});

test("should split selection across top to bottom boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 1, rowEnd: 8, columnStart: 3, columnEnd: 4 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    1         | 2       | 3         | 4      
    2         | 7       | 3         | 4      
    7         | 8       | 3         | 4      
    "
  `);
});

test("should split selection across center to end boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 3, rowEnd: 4, columnStart: 5, columnEnd: 8 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    3         | 4       | 5         | 7      
    3         | 4       | 7         | 8      
    "
  `);
});

test("should split selection across center to bottom boundary", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 5, rowEnd: 8, columnStart: 3, columnEnd: 4 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    5         | 7       | 3         | 4      
    7         | 8       | 3         | 4      
    "
  `);
});

test("should handle selection spanning all boundaries", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 1, rowEnd: 8, columnStart: 1, columnEnd: 8 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    1         | 2       | 1         | 2      
    1         | 2       | 2         | 7      
    1         | 2       | 7         | 8      
    2         | 7       | 1         | 2      
    2         | 7       | 2         | 7      
    2         | 7       | 7         | 8      
    7         | 8       | 1         | 2      
    7         | 8       | 2         | 7      
    7         | 8       | 7         | 8      
    "
  `);
});

test("should handle single cell selection", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 0, rowEnd: 0, columnStart: 0, columnEnd: 0 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    0         | 0       | 0         | 0      
    "
  `);
});

test("should handle selection exactly at corners", () => {
  expect(
    splitTable(
      splitCellSelectionRect({
        rect: { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 2 },
        ...bounds,
      }),
    ),
  ).toMatchInlineSnapshot(`
    "
    Row Start | Row End | Col Start | Col End
    -----------------------------------------
    0         | 2       | 0         | 2      
    "
  `);
});
