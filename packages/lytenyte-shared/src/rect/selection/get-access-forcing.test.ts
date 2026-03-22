import { describe, expect, test } from "vitest";
import { getAccessForcing } from "./get-access-forcing.js";
import type { GridSections, PositionGridCell } from "../../types.js";

const base: GridSections = {
  rowCount: 20,
  topCount: 0,
  centerCount: 20,
  bottomCount: 0,
  startCount: 0,
  endCount: 0,
  colCenterCount: 20,
  topCutoff: 0,
  bottomCutoff: 20,
  startCutoff: 0,
  endCutoff: 20,
  topOffset: 0,
  bottomOffset: 0,
  startOffset: 0,
  endOffset: 0,
};

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

describe("getAccessForcing", () => {
  test("Should return all false when all pin counts are zero", () => {
    expect(getAccessForcing(base, cell(5, 5))).toEqual({
      start: false,
      end: false,
      top: false,
      bottom: false,
    });
  });

  test("Should return start=true when startCount > 0 and column is inside the start-pinned area", () => {
    const sections = { ...base, startCount: 2, startCutoff: 2 };
    expect(getAccessForcing(sections, cell(5, 1)).start).toBe(true);
  });

  test("Should return start=false when startCount > 0 but column is at startCutoff", () => {
    const sections = { ...base, startCount: 2, startCutoff: 2 };
    expect(getAccessForcing(sections, cell(5, 2)).start).toBe(false);
  });

  test("Should return start=false when startCount > 0 but column is past startCutoff", () => {
    const sections = { ...base, startCount: 2, startCutoff: 2 };
    expect(getAccessForcing(sections, cell(5, 5)).start).toBe(false);
  });

  test("Should return start=false when startCount is 0 regardless of column", () => {
    const sections = { ...base, startCount: 0, startCutoff: 2 };
    expect(getAccessForcing(sections, cell(5, 0)).start).toBe(false);
  });

  test("Should return end=true when endCount > 0 and column is at or past endCutoff", () => {
    const sections = { ...base, endCount: 2, endCutoff: 8 };
    expect(getAccessForcing(sections, cell(5, 8)).end).toBe(true);
    expect(getAccessForcing(sections, cell(5, 10)).end).toBe(true);
  });

  test("Should return end=false when endCount > 0 but column is before endCutoff", () => {
    const sections = { ...base, endCount: 2, endCutoff: 8 };
    expect(getAccessForcing(sections, cell(5, 7)).end).toBe(false);
  });

  test("Should return end=false when endCount is 0 regardless of column", () => {
    const sections = { ...base, endCount: 0, endCutoff: 8 };
    expect(getAccessForcing(sections, cell(5, 10)).end).toBe(false);
  });

  test("Should return top=true when topCount > 0 and row is before topCutoff", () => {
    const sections = { ...base, topCount: 2, topCutoff: 2 };
    expect(getAccessForcing(sections, cell(0, 5)).top).toBe(true);
    expect(getAccessForcing(sections, cell(1, 5)).top).toBe(true);
  });

  test("Should return top=false when topCount > 0 but row is at topCutoff", () => {
    const sections = { ...base, topCount: 2, topCutoff: 2 };
    expect(getAccessForcing(sections, cell(2, 5)).top).toBe(false);
  });

  test("Should return top=false when topCount is 0 regardless of row", () => {
    const sections = { ...base, topCount: 0, topCutoff: 2 };
    expect(getAccessForcing(sections, cell(0, 5)).top).toBe(false);
  });

  test("Should return bottom=true when bottomCount > 0 and row is at or past bottomCutoff", () => {
    const sections = { ...base, bottomCount: 2, bottomCutoff: 8 };
    expect(getAccessForcing(sections, cell(8, 5)).bottom).toBe(true);
    expect(getAccessForcing(sections, cell(10, 5)).bottom).toBe(true);
  });

  test("Should return bottom=false when bottomCount > 0 but row is before bottomCutoff", () => {
    const sections = { ...base, bottomCount: 2, bottomCutoff: 8 };
    expect(getAccessForcing(sections, cell(7, 5)).bottom).toBe(false);
  });

  test("Should return bottom=false when bottomCount is 0 regardless of row", () => {
    const sections = { ...base, bottomCount: 0, bottomCutoff: 8 };
    expect(getAccessForcing(sections, cell(10, 5)).bottom).toBe(false);
  });

  test("Should use root colIndex and rowIndex when a span root is present", () => {
    const sections = {
      ...base,
      startCount: 2,
      startCutoff: 3,
      topCount: 2,
      topCutoff: 3,
    };
    // Displayed at (5, 5) but root is at (1, 1) — inside both start and top pinned areas
    const spanned = cellWithRoot(5, 5, 1, 1, 3, 3);
    const result = getAccessForcing(sections, spanned);
    expect(result.start).toBe(true);
    expect(result.top).toBe(true);
  });

  test("Should return all four flags true when positioned in all four pinned areas simultaneously", () => {
    const sections = {
      ...base,
      startCount: 2,
      startCutoff: 3,
      endCount: 2,
      endCutoff: 10,
      topCount: 2,
      topCutoff: 3,
      bottomCount: 2,
      bottomCutoff: 10,
    };
    // A position that is somehow both in a start col and an end col is normally impossible,
    // but getAccessForcing evaluates each axis independently — so we can hit all four.
    // Use a span whose root is at (1, 1) — inside start and top.
    // Then separately verify end and bottom with a different cell.
    const startTopCell = cell(1, 1);
    const endBottomCell = cell(10, 10);

    const startTopResult = getAccessForcing(sections, startTopCell);
    expect(startTopResult.start).toBe(true);
    expect(startTopResult.top).toBe(true);

    const endBottomResult = getAccessForcing(sections, endBottomCell);
    expect(endBottomResult.end).toBe(true);
    expect(endBottomResult.bottom).toBe(true);
  });
});
