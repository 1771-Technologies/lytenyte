import { describe, expect, test, vi } from "vitest";
import type { DataRect } from "../types.js";
import type { ColumnView } from "../../columns/index.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { expandRectsInDirection } from "./expand-rects-in-direction.js";

const view = { visibleColumns: new Array(20).fill(null) } as unknown as ColumnView;
const plainCellRoot = vi.fn(
  (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
);

describe("expandRectsInDirection", () => {
  test("Should return null when there are no selections", () => {
    expect(
      expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: () => null,
        selections: [],
        direction: "down",
        meta: false,
        pos: { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      }),
    ).toEqual(null);
  });

  test("Should expand the top boundary upward when the position is strictly interior (span-grown rect)", () => {
    expect(
      expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: plainCellRoot,
        selections: [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        direction: "up",
        meta: false,
        pos: { kind: "cell", rowIndex: 5, colIndex: 4, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      }),
    ).toEqual([{ rowStart: 3, rowEnd: 8, columnStart: 3, columnEnd: 8 }]);
  });

  test("Should expand upward when direction is up", () => {
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 1, columnEnd: 3 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 4, colIndex: 1, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "up",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should expand downward when direction is down", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "down",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should expand toward the start when direction is start", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "start",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 2,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should expand toward the end when direction is end", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 3, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "end",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 7,
          "columnStart": 3,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should prevent expanding to the first column when ignoreFirst is true and direction is start", () => {
    // rect.columnStart === 1 === first (when excludeMarker=true), so returns null
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 2, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "start",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: true,
    });

    expect(result).toEqual(null);
  });

  test("Should not be affected by ignoreFirst when direction is end", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 3, root: null };

    const withIgnoreFirst = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "end",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: true,
    });

    const withoutIgnoreFirst = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "end",
      meta: false,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(withIgnoreFirst).toEqual(withoutIgnoreFirst);
    expect(withIgnoreFirst).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 7,
          "columnStart": 3,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should expand fully to row zero when meta is true and direction is up", () => {
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 1, columnEnd: 3 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 4, colIndex: 1, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "up",
      meta: true,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 0,
        },
      ]
    `);
  });

  test("Should expand fully to the last row when meta is true and direction is down", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "down",
      meta: true,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 20,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should expand fully to the first column when meta is true and direction is start", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "start",
      meta: true,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 0,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });

  // Builds a cellRoot that returns span info for cells within any of the given
  // span regions, and a plain no-root cell for everything else.
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

  describe("span expansion", () => {
    // Row-spanning cells in col 0:
    //   Cell1: r0–r2 (rowEnd=3), col 0
    //   Cell2: r3–r4 (rowEnd=5), col 0
    const rowSpanCellRoot = makeSpannedCellRoot([
      { rowStart: 0, rowEnd: 3, colStart: 0, colEnd: 1 },
      { rowStart: 3, rowEnd: 5, colStart: 0, colEnd: 1 },
    ]);

    // Col-spanning cells in row 5:
    //   CellA: row 5, c0–c2 (colEnd=3)
    //   CellB: row 5, c3–c5 (colEnd=6)
    const colSpanCellRoot = makeSpannedCellRoot([
      { rowStart: 5, rowEnd: 6, colStart: 0, colEnd: 3 },
      { rowStart: 5, rowEnd: 6, colStart: 3, colEnd: 6 },
    ]);

    test("Should fully expand across cascading row spans when expanding start", () => {
      // Selection r2r4c1c2 expands left into col 0.
      // Cell1 pushes rowStart to 0 but its rowEnd=3 leaves Cell2 (r3r5) partially covered.
      // expandRectToFullSpans must push rowEnd to 5.
      const result = expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: rowSpanCellRoot,
        selections: [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 2 }],
        direction: "start",
        meta: false,
        pos: { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      });
      expect(result).toEqual([{ rowStart: 0, rowEnd: 5, columnStart: 0, columnEnd: 2 }]);
    });

    test("Should fully expand across cascading row spans when expanding end", () => {
      // Mirror of the start test: col-3 has Cell1/Cell2 row spans.
      const cellRoot = makeSpannedCellRoot([
        { rowStart: 0, rowEnd: 3, colStart: 3, colEnd: 4 },
        { rowStart: 3, rowEnd: 5, colStart: 3, colEnd: 4 },
      ]);
      const result = expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot,
        selections: [{ rowStart: 2, rowEnd: 4, columnStart: 2, columnEnd: 3 }],
        direction: "end",
        meta: false,
        pos: { kind: "cell", rowIndex: 2, colIndex: 2, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      });
      expect(result).toEqual([{ rowStart: 0, rowEnd: 5, columnStart: 2, columnEnd: 4 }]);
    });

    test("Should fully expand across cascading column spans when expanding up", () => {
      // Col-spanning cells at row 2: CellA c0–c2, CellB c3–c5.
      // Expanding up from r3r5c2c4 reaches row 2. CellA pushes columnStart to 0
      // but columnEnd stays at 4, partially covering CellB (c3–c6).
      // expandRectToFullSpans must push columnEnd to 6.
      const cellRoot = makeSpannedCellRoot([
        { rowStart: 2, rowEnd: 3, colStart: 0, colEnd: 3 },
        { rowStart: 2, rowEnd: 3, colStart: 3, colEnd: 6 },
      ]);
      const result = expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot,
        selections: [{ rowStart: 3, rowEnd: 5, columnStart: 2, columnEnd: 4 }],
        direction: "up",
        meta: false,
        pos: { kind: "cell", rowIndex: 4, colIndex: 2, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      });
      expect(result).toEqual([{ rowStart: 2, rowEnd: 5, columnStart: 0, columnEnd: 6 }]);
    });

    test("Should fully expand across cascading column spans when expanding down", () => {
      // Col-spanning cells at row 5: CellA c0–c2, CellB c3–c5.
      // Expanding down from r3r5c2c4 reaches row 5. CellA pushes columnStart to 0
      // but columnEnd stays at 4, partially covering CellB (c3–c6).
      // expandRectToFullSpans must push columnEnd to 6.
      const result = expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: colSpanCellRoot,
        selections: [{ rowStart: 3, rowEnd: 5, columnStart: 2, columnEnd: 4 }],
        direction: "down",
        meta: false,
        pos: { kind: "cell", rowIndex: 3, colIndex: 2, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      });
      expect(result).toEqual([{ rowStart: 3, rowEnd: 6, columnStart: 0, columnEnd: 6 }]);
    });

    test("Should fully expand across cascading row spans when using meta (jump to edge)", () => {
      // meta=true jump: columnStart jumps to 0, landing on Cell1/Cell2 in col 0.
      // expandRectToFullSpans must expand rowStart to 0 and rowEnd to 5.
      const result = expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: rowSpanCellRoot,
        selections: [{ rowStart: 2, rowEnd: 4, columnStart: 2, columnEnd: 3 }],
        direction: "start",
        meta: true,
        pos: { kind: "cell", rowIndex: 2, colIndex: 2, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      });
      expect(result).toEqual([{ rowStart: 0, rowEnd: 5, columnStart: 0, columnEnd: 3 }]);
    });
  });

  test("Should return null when direction is an unrecognised value", () => {
    expect(
      expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: () => null,
        selections: [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }],
        direction: "diagonal" as never,
        meta: false,
        pos: { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      }),
    ).toEqual(null);
  });

  test("Should expand fully to the last column when meta is true and direction is end", () => {
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const pos: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 3, root: null };

    const result = expandRectsInDirection({
      scrollIntoView: () => {},
      cellRoot: plainCellRoot,
      selections,
      direction: "end",
      meta: true,
      pos,
      rowCount: 20,
      view,
      ignoreFirst: false,
    });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 20,
          "columnStart": 3,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });
});
