import { describe, expect, test } from "vitest";
import { isSelectSelfClick } from "./is-select-self-click.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";

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

const startPos = cell(3, 5);
const matchingFocus: PositionUnion = cell(3, 5);

describe("isSelectSelfClick", () => {
  test("Should return false when clearOnSelfSelect is true", () => {
    expect(isSelectSelfClick(startPos, matchingFocus, true, false)).toBe(false);
  });

  test("Should return false when shiftOnly is true", () => {
    expect(isSelectSelfClick(startPos, matchingFocus, false, true)).toBe(false);
  });

  test("Should return false when currentFocus is null", () => {
    expect(isSelectSelfClick(startPos, null, false, false)).toBe(false);
  });

  test("Should return false when currentFocus kind is not cell", () => {
    const nonCell = { kind: "header" } as unknown as PositionUnion;
    expect(isSelectSelfClick(startPos, nonCell, false, false)).toBe(false);
  });

  test("Should return true when all conditions match — same plain cell, clearOnSelfSelect=false, shiftOnly=false", () => {
    expect(isSelectSelfClick(startPos, matchingFocus, false, false)).toBe(true);
  });

  test("Should return false when rows match but columns differ", () => {
    const focus: PositionUnion = cell(3, 6);
    expect(isSelectSelfClick(startPos, focus, false, false)).toBe(false);
  });

  test("Should return false when columns match but rows differ", () => {
    const focus: PositionUnion = cell(4, 5);
    expect(isSelectSelfClick(startPos, focus, false, false)).toBe(false);
  });

  test("Should use root colIndex and rowIndex for startPosition when it has a span root", () => {
    // startPosition is displayed at (5, 6) but root is at (3, 5) — matches matchingFocus
    const spannedStart = cellWithRoot(5, 6, 3, 5, 2, 2);
    expect(isSelectSelfClick(spannedStart, matchingFocus, false, false)).toBe(true);
  });

  test("Should use root colIndex and rowIndex for currentFocus when it has a span root", () => {
    // focus is displayed at (5, 6) but root is at (3, 5) — matches startPos
    const spannedFocus = cellWithRoot(5, 6, 3, 5, 2, 2);
    expect(isSelectSelfClick(startPos, spannedFocus as PositionUnion, false, false)).toBe(true);
  });

  test("Should return true when both positions resolve to the same root cell", () => {
    const spannedStart = cellWithRoot(3, 5, 2, 4, 3, 3);
    const spannedFocus = cellWithRoot(4, 6, 2, 4, 3, 3);
    expect(isSelectSelfClick(spannedStart, spannedFocus as PositionUnion, false, false)).toBe(true);
  });

  test("Should return false when both have span roots that differ in position", () => {
    const spannedStart = cellWithRoot(3, 5, 2, 4, 3, 3);
    const spannedFocus = cellWithRoot(3, 5, 6, 8, 2, 2); // different root
    expect(isSelectSelfClick(spannedStart, spannedFocus as PositionUnion, false, false)).toBe(false);
  });

  test("Should return false when clearOnSelfSelect and shiftOnly are both true", () => {
    expect(isSelectSelfClick(startPos, matchingFocus, true, true)).toBe(false);
  });
});
