import { describe, expect, test } from "vitest";
import type { PositionUnion } from "../types.js";
import { expandRectToFullSpans } from "./expand-rect-to-full-spans.js";

// Returns a cellRoot that resolves spanned cells for any of the given span
// regions and returns plain 1×1 cells for everything else.
function makeSpannedCellRoot(
  spans: Array<{ rowStart: number; rowEnd: number; colStart: number; colEnd: number }>,
) {
  return (row: number, col: number): PositionUnion => {
    const span = spans.find(
      (s) => row >= s.rowStart && row < s.rowEnd && col >= s.colStart && col < s.colEnd,
    );
    if (span) {
      return {
        kind: "cell",
        rowIndex: row,
        colIndex: col,
        root: {
          rowIndex: span.rowStart,
          colIndex: span.colStart,
          rowSpan: span.rowEnd - span.rowStart,
          colSpan: span.colEnd - span.colStart,
        },
      };
    }
    return { kind: "cell", rowIndex: row, colIndex: col, root: null };
  };
}

const plainCellRoot = (row: number, col: number): PositionUnion => ({
  kind: "cell",
  rowIndex: row,
  colIndex: col,
  root: null,
});

describe("expandRectToFullSpans", () => {
  test("Should return the rect unchanged when no cells are spanned", () => {
    const rect = { rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 4 };
    expect(expandRectToFullSpans(rect, plainCellRoot)).toEqual(rect);
  });

  test("Should expand rowStart upward when a span at the top boundary starts above the rect", () => {
    // Span covers rows 0–2, col 1. Rect top boundary (row 2) touches it.
    const cellRoot = makeSpannedCellRoot([{ rowStart: 0, rowEnd: 3, colStart: 1, colEnd: 2 }]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 3 }, cellRoot)).toEqual(
      { rowStart: 0, rowEnd: 5, columnStart: 1, columnEnd: 3 },
    );
  });

  test("Should expand rowEnd downward when a span at the bottom boundary ends below the rect", () => {
    // Span covers rows 4–6, col 1. Rect bottom boundary (row 4) touches it.
    const cellRoot = makeSpannedCellRoot([{ rowStart: 4, rowEnd: 7, colStart: 1, colEnd: 2 }]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 3 }, cellRoot)).toEqual(
      { rowStart: 2, rowEnd: 7, columnStart: 1, columnEnd: 3 },
    );
  });

  test("Should expand columnStart leftward when a span at the left boundary starts before the rect", () => {
    // Span covers row 2, cols 0–1. Rect left boundary (col 1) touches it.
    const cellRoot = makeSpannedCellRoot([{ rowStart: 2, rowEnd: 3, colStart: 0, colEnd: 2 }]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 4 }, cellRoot)).toEqual(
      { rowStart: 2, rowEnd: 5, columnStart: 0, columnEnd: 4 },
    );
  });

  test("Should expand columnEnd rightward when a span at the right boundary ends beyond the rect", () => {
    // Span covers row 2, cols 3–5. Rect right boundary (col 3) touches it.
    const cellRoot = makeSpannedCellRoot([{ rowStart: 2, rowEnd: 3, colStart: 3, colEnd: 6 }]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 4 }, cellRoot)).toEqual(
      { rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 6 },
    );
  });

  test("Should expand in all four directions simultaneously when each boundary touches a span", () => {
    // Rect cols 1–3: col 1 is in the left span (colEnd:2), col 2 is in the top/bottom spans,
    // col 3 (columnEnd-1) is in the right span (colStart:3).
    const cellRoot = makeSpannedCellRoot([
      { rowStart: 0, rowEnd: 3, colStart: 2, colEnd: 3 }, // top
      { rowStart: 4, rowEnd: 7, colStart: 2, colEnd: 3 }, // bottom
      { rowStart: 2, rowEnd: 5, colStart: 0, colEnd: 2 }, // left
      { rowStart: 2, rowEnd: 5, colStart: 3, colEnd: 5 }, // right
    ]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 4 }, cellRoot)).toEqual(
      { rowStart: 0, rowEnd: 7, columnStart: 0, columnEnd: 5 },
    );
  });

  test("Should cascade: expanding one boundary reveals a new partial span that also gets expanded", () => {
    // Cell1: rows 0–2, col 0. Cell2: rows 3–4, col 0.
    // Rect r2r4c0c2: top boundary at row 2 touches Cell1 (starts at 0) → rowStart expands to 0.
    // After that, bottom boundary at row 3 now touches Cell2 (ends at 5) → rowEnd expands to 5.
    const cellRoot = makeSpannedCellRoot([
      { rowStart: 0, rowEnd: 3, colStart: 0, colEnd: 1 },
      { rowStart: 3, rowEnd: 5, colStart: 0, colEnd: 1 },
    ]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 4, columnStart: 0, columnEnd: 2 }, cellRoot)).toEqual(
      { rowStart: 0, rowEnd: 5, columnStart: 0, columnEnd: 2 },
    );
  });

  test("Should cascade across axes: a row expansion triggers a column expansion", () => {
    // CellA: rows 2–4, cols 0–2. CellB: rows 2–4, cols 3–5.
    // Rect r2r4c2c4: left boundary at col 2 touches CellA (starts at 0) → columnStart expands to 0.
    // After that, right boundary at col 3 now touches CellB (ends at 6) → columnEnd expands to 6.
    const cellRoot = makeSpannedCellRoot([
      { rowStart: 2, rowEnd: 5, colStart: 0, colEnd: 3 },
      { rowStart: 2, rowEnd: 5, colStart: 3, colEnd: 6 },
    ]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 5, columnStart: 2, columnEnd: 4 }, cellRoot)).toEqual(
      { rowStart: 2, rowEnd: 5, columnStart: 0, columnEnd: 6 },
    );
  });

  test("Should not expand when all touched spans are fully contained within the rect", () => {
    // Span entirely inside the rect: rows 3–4, cols 2–3.
    const cellRoot = makeSpannedCellRoot([{ rowStart: 3, rowEnd: 5, colStart: 2, colEnd: 4 }]);
    const rect = { rowStart: 2, rowEnd: 6, columnStart: 1, columnEnd: 5 };
    expect(expandRectToFullSpans(rect, cellRoot)).toEqual(rect);
  });

  test("Should handle a span that extends in both row and column directions simultaneously", () => {
    // Span covers rows 0–4, cols 0–4. Rect partially overlaps at top-left corner.
    const cellRoot = makeSpannedCellRoot([{ rowStart: 0, rowEnd: 5, colStart: 0, colEnd: 5 }]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 6, columnStart: 2, columnEnd: 7 }, cellRoot)).toEqual(
      { rowStart: 0, rowEnd: 6, columnStart: 0, columnEnd: 7 },
    );
  });

  test("Should stabilise after multiple cascade rounds until no boundary touches a partial span", () => {
    // Chain: Span A → row expansion → Span B → column expansion → Span C → row expansion.
    // SpanA: rows 3–5, col 1 (touches top boundary at row 3, expands rowStart to 3... wait)
    // Simpler chain:
    // SpanA: rows 0–3, col 2 — touches top at row 2, pushes rowStart to 0.
    // SpanB: rows 0–3, col 0–1 — now touched at left col 1 (newly exposed), pushes columnStart to 0, colEnd stays.
    // SpanC: rows 0–3, col 4–5 — touched at right boundary col 3, pushes columnEnd to 6 (wait col 3 is colEnd-1=3).
    // Let's use: SpanA at top, SpanB revealed by SpanA's column expansion.
    // SpanA: rows 0–3, cols 2–4. Rect r2r5c2c5: top touches SpanA → rowStart→0, colEnd→max(4,5)=5.
    // SpanB: rows 0–3, cols 4–7. After SpanA expands colEnd to 4...
    // Actually let me keep it simpler.
    // Three spans in a column chain: span1 r0r3c0c1, span2 r3r6c0c1, span3 r6r9c0c1.
    // Rect r2r7c0c2: top at row 2 (span1 starts at 0, rowStart→0), bottom at row 6 (span3 starts at 6, rowEnd→9).
    const cellRoot = makeSpannedCellRoot([
      { rowStart: 0, rowEnd: 3, colStart: 0, colEnd: 1 },
      { rowStart: 3, rowEnd: 6, colStart: 0, colEnd: 1 },
      { rowStart: 6, rowEnd: 9, colStart: 0, colEnd: 1 },
    ]);
    expect(expandRectToFullSpans({ rowStart: 2, rowEnd: 7, columnStart: 0, columnEnd: 2 }, cellRoot)).toEqual(
      { rowStart: 0, rowEnd: 9, columnStart: 0, columnEnd: 2 },
    );
  });
});
