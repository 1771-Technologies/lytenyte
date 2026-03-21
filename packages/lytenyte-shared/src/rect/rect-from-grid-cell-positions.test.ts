import { describe, expect, test } from "vitest";
import { rectFromGridCellPositions } from "./rect-from-grid-cell-positions.js";
import type { PositionGridCell } from "../types.js";

function cell(rowIndex: number, colIndex: number): PositionGridCell {
  return { kind: "cell", rowIndex, colIndex, root: null };
}

function cellWithRoot(
  rowIndex: number,
  colIndex: number,
  rootRow: number,
  rootCol: number,
  rowSpan: number,
  colSpan: number,
): PositionGridCell {
  return { kind: "cell", rowIndex, colIndex, root: { rowIndex: rootRow, colIndex: rootCol, rowSpan, colSpan } };
}

describe("rectFromGridCellPositions", () => {
  describe("no spans", () => {
    test("two single cells — a top-left of b", () => {
      const a = cell(1, 2);
      const b = cell(4, 6);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 1,
        rowEnd: 5,
        columnStart: 2,
        columnEnd: 7,
      });
    });

    test("two single cells — a bottom-right of b (reversed order)", () => {
      const a = cell(4, 6);
      const b = cell(1, 2);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 1,
        rowEnd: 5,
        columnStart: 2,
        columnEnd: 7,
      });
    });

    test("same cell — rect covers exactly one cell", () => {
      const a = cell(3, 5);
      expect(rectFromGridCellPositions(a, a)).toEqual({
        rowStart: 3,
        rowEnd: 4,
        columnStart: 5,
        columnEnd: 6,
      });
    });

    test("cells on the same row", () => {
      const a = cell(2, 1);
      const b = cell(2, 5);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 2,
        rowEnd: 3,
        columnStart: 1,
        columnEnd: 6,
      });
    });

    test("cells in the same column", () => {
      const a = cell(0, 3);
      const b = cell(7, 3);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 0,
        rowEnd: 8,
        columnStart: 3,
        columnEnd: 4,
      });
    });
  });

  describe("with spans", () => {
    test("a has a span — rect stretches to cover the full span extent", () => {
      // a sits inside a 3-row × 2-col span rooted at (2, 4)
      const a = cellWithRoot(3, 5, 2, 4, 3, 2);
      const b = cell(1, 1);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 1,
        rowEnd: 5, // root.rowIndex(2) + rowSpan(3)
        columnStart: 1,
        columnEnd: 6, // root.colIndex(4) + colSpan(2)
      });
    });

    test("b has a span — rect stretches to cover the full span extent", () => {
      const a = cell(0, 0);
      // b sits inside a 2-row × 4-col span rooted at (3, 2)
      const b = cellWithRoot(3, 4, 3, 2, 2, 4);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 0,
        rowEnd: 5, // root.rowIndex(3) + rowSpan(2)
        columnStart: 0,
        columnEnd: 6, // root.colIndex(2) + colSpan(4)
      });
    });

    test("both cells have spans — rect covers both full extents", () => {
      // a: 2×3 span rooted at (0, 0)
      const a = cellWithRoot(0, 1, 0, 0, 2, 3);
      // b: 3×2 span rooted at (5, 6)
      const b = cellWithRoot(6, 7, 5, 6, 3, 2);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 0,
        rowEnd: 8, // root.rowIndex(5) + rowSpan(3)
        columnStart: 0,
        columnEnd: 8, // root.colIndex(6) + colSpan(2)
      });
    });

    test("span at a extends further than b's position in both axes", () => {
      // a: 4×5 span rooted at (1, 1) — extends to row 5, col 6
      const a = cellWithRoot(2, 3, 1, 1, 4, 5);
      // b is inside the span's region — rect should be driven entirely by the span
      const b = cell(3, 4);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 1,
        rowEnd: 5,
        columnStart: 1,
        columnEnd: 6,
      });
    });

    test("same cell with a span — rect equals the span's bounds", () => {
      const a = cellWithRoot(2, 3, 1, 2, 3, 4);
      expect(rectFromGridCellPositions(a, a)).toEqual({
        rowStart: 1,
        rowEnd: 4,
        columnStart: 2,
        columnEnd: 6,
      });
    });

    test("reversed — b is top-left span, a is bottom-right plain cell", () => {
      // b: 2×2 span rooted at (0, 0)
      const b = cellWithRoot(0, 1, 0, 0, 2, 2);
      const a = cell(5, 5);
      expect(rectFromGridCellPositions(a, b)).toEqual({
        rowStart: 0,
        rowEnd: 6,
        columnStart: 0,
        columnEnd: 6,
      });
    });
  });
});
