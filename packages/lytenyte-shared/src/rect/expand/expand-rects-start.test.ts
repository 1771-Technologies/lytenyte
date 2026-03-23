import { describe, expect, test, vi } from "vitest";
import type { DataRect } from "../types.js";
import type { ColumnView } from "../../columns/index.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { expandRectsStart } from "./expand-rects-start.js";

const view = { visibleColumns: new Array(20).fill(null) } as unknown as ColumnView;

describe("expandRectsStart", () => {
  test("Should return null when there are no selections", () => {
    expect(
      expandRectsStart(
        () => {},
        () => null,
        [],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 4, root: null },
        false,
        view,
      ),
    ).toEqual(null);
  });

  test("Should return null when the position does not overlap the last selection", () => {
    expect(
      expandRectsStart(
        () => {},
        () => null,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        false,
        view,
      ),
    ).toEqual(null);
  });

  test("Should expand the start boundary outward when the position is strictly interior (span-grown rect)", () => {
    const cellRoot = (row: number, col: number) =>
      ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion;
    expect(
      expandRectsStart(
        () => {},
        cellRoot,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 5, colIndex: 4, root: null },
        false,
        view,
      ),
    ).toEqual([{ rowStart: 4, rowEnd: 8, columnStart: 2, columnEnd: 8 }]);
  });

  test("Should return null when the selection is already at the first column and cannot expand further left", () => {
    expect(
      expandRectsStart(
        () => {},
        () => null,
        [{ rowStart: 2, rowEnd: 4, columnStart: 0, columnEnd: 3 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 2, root: null },
        false,
        view,
      ),
    ).toEqual(null);
  });

  test("Should return null when excludeMarker is true and the selection is already at column 1", () => {
    expect(
      expandRectsStart(
        () => {},
        () => null,
        [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 2, root: null },
        true,
        view,
      ),
    ).toEqual(null);
  });

  test("Should expand to the first column when the meta key is pressed", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };

    const expanded = expandRectsStart(scrollIntoView, vi.fn(), selections, true, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 0,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 0 });
  });

  test("Should expand to column 1 instead of 0 when excludeMarker is true and meta is pressed", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };

    const expanded = expandRectsStart(scrollIntoView, vi.fn(), selections, true, position, true, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 1,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 1 });
  });

  test("Should expand to the first column without scrolling when the pivot is at the last column", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 15, columnEnd: 20 }];
    // colIndex 19 = view.visibleColumns.length - 1 = 19
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 19, root: null };

    const expanded = expandRectsStart(scrollIntoView, vi.fn(), selections, true, position, false, view);

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

  test("Should use the position's full columnEnd when the position is a spanning cell and meta is pressed", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 12 }];
    // root.colSpan = 3, so pos.columnEnd = 5 + 3 = 8, not pos.columnStart + 1 = 6
    const position: PositionGridCell = {
      kind: "cell",
      rowIndex: 2,
      colIndex: 5,
      root: { rowIndex: 2, colIndex: 5, rowSpan: 1, colSpan: 3 },
    };

    const expanded = expandRectsStart(scrollIntoView, vi.fn(), selections, true, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 8,
          "columnStart": 0,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should expand the left edge of the selection when the pivot is at the right edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 5, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 2,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 2 });
  });

  test("Should jump past a full-width span when expanding the left edge of the selection", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 6, columnEnd: 9 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 8, root: null };

    // Span at column 5 (columnStart - 1) rooted further left
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 5 ? { rowIndex: 2, colIndex: 2, rowSpan: 2, colSpan: 4 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 9,
          "columnStart": 2,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 2 });
  });

  test("Should widen the row bounds when expanding leftward into a spanning cell wider than the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 5, columnEnd: 8 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 7, root: null };

    // At col 4 (columnStart - 1): row 3 is a plain cell, row 4 has a span that starts further left
    // and extends beyond the rect's row bounds.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 4 && row === 4 ? { rowIndex: 1, colIndex: 2, rowSpan: 4, colSpan: 3 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 8,
          "columnStart": 2,
          "rowEnd": 5,
          "rowStart": 1,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 2 });
  });

  test("Should shrink the right edge of the selection when the pivot is at the left edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 3, columnEnd: 6 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 3, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 5,
          "columnStart": 3,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 4 });
  });

  test("Should widen the row bounds when shrinking the right edge into a spanning cell wider than the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 2, columnEnd: 8 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 2, root: null };

    // At col 7 (columnEnd - 1): row 3 is a plain cell, row 4 has a span that starts further left
    // and extends beyond the rect's row bounds.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 7 && row === 4 ? { rowIndex: 1, colIndex: 5, rowSpan: 4, colSpan: 3 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 5,
          "columnStart": 2,
          "rowEnd": 5,
          "rowStart": 1,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 4 });
  });

  test("Should treat a mid-rect spanning cell as part of the pivot and expand left instead of shrinking", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 9 }];
    // Position is on the rowStart edge but not a column edge — isAtEdge=false, enters pivot block.
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 4, root: null };

    // col===4 && row < 4: span that pushes pivotEnd up to rect.columnEnd (9).
    // Correct cellRoot(row, 4) hits the span for rows 2 and 3; buggy cellRoot(4, row) misses it.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 4 && row < 4 ? { rowIndex: 2, colIndex: 2, rowSpan: 3, colSpan: 7 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 9,
          "columnStart": 0,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 0 });
  });

  test("Should use the span root bounds when the position itself is a spanning cell", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 5, columnStart: 3, columnEnd: 8 }];
    // Root spans cols 5-7 (columnEnd=8), matching rect.columnEnd — isAtEdge becomes true via columnEnd.
    const position: PositionGridCell = {
      kind: "cell",
      rowIndex: 3,
      colIndex: 5,
      root: { rowIndex: 3, colIndex: 5, rowSpan: 1, colSpan: 3 },
    };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 8,
          "columnStart": 2,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ column: 2 });
  });

  test("Should only modify the last selection when multiple selections are present", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [
      { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 1 },
      { rowStart: 3, rowEnd: 5, columnStart: 3, columnEnd: 6 },
    ];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 5, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsStart(scrollIntoView, cellRoot, selections, false, position, false, view);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 1,
          "columnStart": 0,
          "rowEnd": 2,
          "rowStart": 0,
        },
        {
          "columnEnd": 6,
          "columnStart": 2,
          "rowEnd": 5,
          "rowStart": 3,
        },
      ]
    `);
  });
});
