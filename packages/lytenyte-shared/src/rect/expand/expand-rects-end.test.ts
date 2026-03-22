import { describe, expect, test, vi } from "vitest";
import type { DataRect } from "../types.js";
import type { ColumnView } from "../../columns/index.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { expandRectsEnd } from "./expand-rects-end.js";

const view = { visibleColumns: new Array(20).fill(null) } as unknown as ColumnView;

describe("expandRectsEnd", () => {
  test("Should return null when there are no selections", () => {
    expect(
      expandRectsEnd(
        () => {},
        () => null,
        [],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 4, root: null },
        view,
      ),
    ).toEqual(null);
  });

  test("Should return null when the position does not overlap the last selection", () => {
    expect(
      expandRectsEnd(
        () => {},
        () => null,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        view,
      ),
    ).toEqual(null);
  });

  test("Should expand the end boundary outward when the position is strictly interior (span-grown rect)", () => {
    const cellRoot = (row: number, col: number) =>
      ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion;
    expect(
      expandRectsEnd(
        () => {},
        cellRoot,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 5, colIndex: 4, root: null },
        view,
      ),
    ).toEqual([{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 9 }]);
  });

  test("Should return null when the selection already reaches the last column", () => {
    expect(
      expandRectsEnd(
        () => {},
        () => null,
        [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 20 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 3, root: null },
        view,
      ),
    ).toEqual(null);
  });

  test("Should expand to the last column when the meta key is pressed", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };

    const expanded = expandRectsEnd(scrollIntoView, vi.fn(), selections, true, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 20,
          "columnStart": 5,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 19 });
  });

  test("Should expand to the last column without scrolling when the pivot is at the first column", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 0, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 0, root: null };

    const expanded = expandRectsEnd(scrollIntoView, vi.fn(), selections, true, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 20,
          "columnStart": 0,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test("Should expand the right edge of the selection when the pivot is at the left edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 3, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 7,
          "columnStart": 3,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 6 });
  });

  test("Should include the full extent of a spanning cell when expanding the right edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 5 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 3, root: null };

    // Span at rect.columnEnd (col 5) extends to col 9
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 5 ? { rowIndex: 2, colIndex: 5, rowSpan: 2, colSpan: 4 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 9,
          "columnStart": 3,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 8 });
  });

  test("Should widen the row bounds when expanding rightward into a spanning cell taller than the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 2, columnEnd: 5 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 2, root: null };

    // At col 5 (rect.columnEnd): row 3 is a plain cell, row 4 has a taller spanning cell.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 5 && row === 4 ? { rowIndex: 1, colIndex: 5, rowSpan: 5, colSpan: 3 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 8,
          "columnStart": 2,
          "rowEnd": 6,
          "rowStart": 1,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 7 });
  });

  test("Should shrink the left edge of the selection when the pivot is at the right edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 4,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 4 });
  });

  test("Should jump past a span rooted at the left edge when shrinking from the left", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 8 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 7, root: null };

    // Span at col 4 (columnStart + 1) is rooted at rect.columnStart (col 3), extending to col 7.
    // With the fix, boundary = cell.columnEnd = 7, jumping past the whole span.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 4 ? { rowIndex: 2, colIndex: 3, rowSpan: 2, colSpan: 4 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 8,
          "columnStart": 7,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 7 });
  });

  test("Should widen the row bounds when shrinking the left edge into a spanning cell taller than the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 3, columnEnd: 10 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 9, root: null };

    // At col 4 (columnStart + 1): row 3 is a plain cell; row 4 has a span rooted at rect.columnStart
    // that extends beyond the rect's row bounds.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 4 && row === 4 ? { rowIndex: 1, colIndex: 3, rowSpan: 5, colSpan: 5 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 10,
          "columnStart": 8,
          "rowEnd": 6,
          "rowStart": 1,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 8 });
  });

  test("Should treat a mid-rect spanning cell as part of the pivot and shrink from the left instead of expanding right", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 9 }];
    // Position is on the rowStart edge but not a column edge — isAtEdge=false, enters pivot block.
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };

    // col===5 && row < 5: span whose columnStart equals rect.columnStart (1),
    // pulling pivotStart down to 1. This makes rect.columnStart < pivotStart false,
    // switching from shrink-from-left to expand-right.
    // Correct cellRoot(row, 5) hits the span; buggy cellRoot(5, row) misses it.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 5 && row < 5 ? { rowIndex: 2, colIndex: 1, rowSpan: 3, colSpan: 5 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 10,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 9 });
  });

  test("Should use the span root bounds when the position itself is a spanning cell", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 5, columnStart: 3, columnEnd: 6 }];
    // Root spans cols 3-5 (columnEnd=6), matching rect.columnEnd — isAtEdge becomes true via columnEnd,
    // triggering expand-right rather than shrink-from-left.
    const position: PositionGridCell = {
      kind: "cell",
      rowIndex: 3,
      colIndex: 3,
      root: { rowIndex: 3, colIndex: 3, rowSpan: 1, colSpan: 3 },
    };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 7,
          "columnStart": 3,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 6 });
  });

  test("Should only modify the last selection when multiple selections are present", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [
      { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 1 },
      { rowStart: 3, rowEnd: 5, columnStart: 3, columnEnd: 6 },
    ];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 3, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsEnd(scrollIntoView, cellRoot, selections, false, position, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 1,
          "columnStart": 0,
          "rowEnd": 2,
          "rowStart": 0,
        },
        {
          "columnEnd": 7,
          "columnStart": 3,
          "rowEnd": 5,
          "rowStart": 3,
        },
      ]
    `);
  });
});
