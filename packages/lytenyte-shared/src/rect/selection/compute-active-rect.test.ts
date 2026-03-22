import { describe, expect, test } from "vitest";
import { computeActiveRect } from "./compute-active-rect.js";
import type { GridSections, PositionGridCell } from "../../types.js";
import type { ForceSettings } from "./get-access-forcing.js";

const noSections: GridSections = {
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

const withPins: GridSections = {
  ...noSections,
  startCount: 2,
  startCutoff: 2,
  endCount: 2,
  endCutoff: 18,
  topCount: 2,
  topCutoff: 2,
  bottomCount: 2,
  bottomCutoff: 18,
};

const noForce: ForceSettings = { start: false, end: false, top: false, bottom: false };
const forceStart: ForceSettings = { ...noForce, start: true };

function makeViewport(scrollLeft = 0, scrollTop = 0): HTMLElement {
  return {
    scrollLeft,
    scrollTop,
    scrollWidth: 1000,
    clientWidth: 500,
    scrollHeight: 1000,
    clientHeight: 500,
  } as unknown as HTMLElement;
}

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

describe("computeActiveRect", () => {
  test("Should return the bounding rect of two plain cells when no sections are inaccessible", () => {
    const result = computeActiveRect(cell(1, 2), cell(5, 8), noSections, makeViewport(), noForce);
    expect(result).toEqual({ rowStart: 1, rowEnd: 6, columnStart: 2, columnEnd: 9 });
  });

  test("Should return a single-cell rect when anchor and current are the same cell", () => {
    const result = computeActiveRect(cell(3, 4), cell(3, 4), noSections, makeViewport(), noForce);
    expect(result).toEqual({ rowStart: 3, rowEnd: 4, columnStart: 4, columnEnd: 5 });
  });

  test("Should expand rect to cover full span extent when anchor has a span root", () => {
    // anchor root at (0, 0) spanning 3 rows × 3 cols; current at (5, 5)
    const anchor = cellWithRoot(1, 1, 0, 0, 3, 3);
    const result = computeActiveRect(anchor, cell(5, 5), noSections, makeViewport(), noForce);
    expect(result).toEqual({ rowStart: 0, rowEnd: 6, columnStart: 0, columnEnd: 6 });
  });

  test("Should expand rect to cover full span extent when current has a span root", () => {
    // current root at (4, 4) spanning 2 rows × 4 cols
    const current = cellWithRoot(4, 5, 4, 4, 2, 4);
    const result = computeActiveRect(cell(0, 0), current, noSections, makeViewport(), noForce);
    expect(result).toEqual({ rowStart: 0, rowEnd: 6, columnStart: 0, columnEnd: 8 });
  });

  test("Should return null when the computed rect falls entirely within an inaccessible start-pinned area", () => {
    // startCutoff=2, startCount=2 → start not accessible when scrollLeft > 1
    // Rect from cell(3,0) to cell(5,1) → columnStart=0, columnEnd=2 → entirely in start pins
    const vp = makeViewport(100, 0); // scrollLeft=100 → startAccessible=false
    const result = computeActiveRect(cell(3, 0), cell(5, 1), withPins, vp, noForce);
    expect(result).toBeNull();
  });

  test("Should clamp start side but not return null when rect straddles the start-pin boundary", () => {
    // Rect from cell(3,0) to cell(5,5) → columnStart=0→clamped to 2, columnEnd=6
    const vp = makeViewport(100, 0);
    const result = computeActiveRect(cell(3, 0), cell(5, 5), withPins, vp, noForce);
    expect(result).toEqual({ rowStart: 3, rowEnd: 6, columnStart: 2, columnEnd: 6 });
  });

  test("Should not clamp when force flag overrides inaccessible start section", () => {
    // Same scenario as above, but force.start=true → startAccessible=true → no clamping
    const vp = makeViewport(100, 0);
    const result = computeActiveRect(cell(3, 0), cell(5, 5), withPins, vp, forceStart);
    expect(result).toEqual({ rowStart: 3, rowEnd: 6, columnStart: 0, columnEnd: 6 });
  });
});
