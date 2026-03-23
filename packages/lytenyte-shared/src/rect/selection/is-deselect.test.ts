import { describe, expect, test } from "vitest";
import { isDeselect } from "./is-deselect.js";
import type { PositionGridCell } from "../../types.js";
import type { DataRect } from "../types.js";

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
  return {
    kind: "cell",
    rowIndex,
    colIndex,
    root: { rowIndex: rootRow, colIndex: rootCol, rowSpan, colSpan },
  };
}

const rect: DataRect = { rowStart: 2, rowEnd: 8, columnStart: 3, columnEnd: 10 };

describe("isDeselect", () => {
  test("Should return false when ctrlOnly is false", () => {
    expect(isDeselect(cell(4, 5), [rect], true, false, false)).toBe(false);
  });

  test("Should return false when isMultiRange is false", () => {
    expect(isDeselect(cell(4, 5), [rect], false, true, false)).toBe(false);
  });

  test("Should return false when both ctrlOnly and isMultiRange are false", () => {
    expect(isDeselect(cell(4, 5), [rect], false, false, false)).toBe(false);
  });

  test("Should return false when selections array is empty", () => {
    expect(isDeselect(cell(4, 5), [], true, true, false)).toBe(false);
  });

  test("Should return true when ctrlOnly, isMultiRange, and position is inside a selection", () => {
    expect(isDeselect(cell(4, 5), [rect], true, true, false)).toBe(true);
  });

  test("Should return false when position is not contained in any selection", () => {
    expect(isDeselect(cell(0, 0), [rect], true, true, false)).toBe(false);
  });

  test("Should return false when column is exactly at columnEnd (exclusive boundary)", () => {
    // rect.columnEnd = 10 — the cell at col 10 is outside
    expect(isDeselect(cell(4, 10), [rect], true, true, false)).toBe(false);
  });

  test("Should return false when row is exactly at rowEnd (exclusive boundary)", () => {
    // rect.rowEnd = 8 — the cell at row 8 is outside
    expect(isDeselect(cell(8, 5), [rect], true, true, false)).toBe(false);
  });

  test("Should return true when position is at the last valid column (columnEnd - 1)", () => {
    expect(isDeselect(cell(4, 9), [rect], true, true, false)).toBe(true);
  });

  test("Should return true when position is at the last valid row (rowEnd - 1)", () => {
    expect(isDeselect(cell(7, 5), [rect], true, true, false)).toBe(true);
  });

  test("Should return false when position is at column 0 and ignoreFirst is true", () => {
    const leftRect: DataRect = { rowStart: 0, rowEnd: 10, columnStart: 0, columnEnd: 5 };
    expect(isDeselect(cell(2, 0), [leftRect], true, true, true)).toBe(false);
  });

  test("Should return true when position is at column 1 and ignoreFirst is true", () => {
    const leftRect: DataRect = { rowStart: 0, rowEnd: 10, columnStart: 0, columnEnd: 5 };
    expect(isDeselect(cell(2, 1), [leftRect], true, true, true)).toBe(true);
  });

  test("Should return false when position is at column 0 and ignoreFirst is false", () => {
    const leftRect: DataRect = { rowStart: 0, rowEnd: 10, columnStart: 0, columnEnd: 5 };
    // column 0 is treated as effective start — included when ignoreFirst=false
    expect(isDeselect(cell(2, 0), [leftRect], true, true, false)).toBe(true);
  });

  test("Should return true when position matches the second of multiple selections", () => {
    const first: DataRect = { rowStart: 0, rowEnd: 3, columnStart: 0, columnEnd: 4 };
    const second: DataRect = { rowStart: 5, rowEnd: 9, columnStart: 6, columnEnd: 12 };
    expect(isDeselect(cell(6, 8), [first, second], true, true, false)).toBe(true);
  });

  test("Should use root colIndex and rowIndex when a span root is present", () => {
    // Position displayed at (10, 10), but root is at (4, 5) — which is inside rect
    const spanned = cellWithRoot(10, 10, 4, 5, 2, 2);
    expect(isDeselect(spanned, [rect], true, true, false)).toBe(true);
  });

  test("Should return false when span root is outside all selections", () => {
    // Root at (0, 0) — outside rect
    const spanned = cellWithRoot(4, 5, 0, 0, 2, 2);
    expect(isDeselect(spanned, [rect], true, true, false)).toBe(false);
  });
});
