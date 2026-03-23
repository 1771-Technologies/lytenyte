import { describe, expect, test, vi } from "vitest";
import type { DataRect } from "../types.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { expandRectsUp } from "./expand-rects-up.js";

describe("expandRectsUp", () => {
  test("Should return null when there are no selections", () => {
    expect(
      expandRectsUp(
        () => {},
        () => null,
        [],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        20,
      ),
    ).toEqual(null);
  });

  test("Should return null when the position does not overlap the last selection", () => {
    expect(
      expandRectsUp(
        () => {},
        () => null,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        20,
      ),
    ).toEqual(null);
  });

  test("Should expand the top boundary upward when the position is strictly interior (span-grown rect)", () => {
    const cellRoot = (row: number, col: number) =>
      ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion;
    expect(
      expandRectsUp(
        () => {},
        cellRoot,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 5, colIndex: 4, root: null },
        20,
      ),
    ).toEqual([{ rowStart: 3, rowEnd: 8, columnStart: 3, columnEnd: 8 }]);
  });

  test("Should return null when the selection is already at row zero and expanding further up", () => {
    expect(
      expandRectsUp(
        () => {},
        () => null,
        [{ rowStart: 0, rowEnd: 3, columnStart: 1, columnEnd: 3 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        20,
      ),
    ).toEqual(null);
  });

  test("Should expand to row zero when the meta key is pressed", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 6, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 5, colIndex: 1, root: null };

    const expanded = expandRectsUp(scrollIntoView, vi.fn(), selections, true, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 6,
          "rowStart": 0,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ row: 0 });
  });

  test("Should expand to row zero without scrolling when the pivot is at the last row", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 15, rowEnd: 20, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 19, colIndex: 1, root: null };

    const expanded = expandRectsUp(scrollIntoView, vi.fn(), selections, true, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 20,
          "rowStart": 0,
        },
      ]
    `);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test("Should use the position's full rowEnd when the position is a spanning cell and meta is pressed", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 5, rowEnd: 12, columnStart: 2, columnEnd: 4 }];
    // root.rowSpan = 3, so pos.rowEnd = 5 + 3 = 8, not pos.rowStart + 1 = 6
    const position: PositionGridCell = {
      kind: "cell",
      rowIndex: 5,
      colIndex: 2,
      root: { rowIndex: 5, colIndex: 2, rowSpan: 3, colSpan: 2 },
    };

    const expanded = expandRectsUp(scrollIntoView, vi.fn(), selections, true, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 4,
          "columnStart": 2,
          "rowEnd": 8,
          "rowStart": 0,
        },
      ]
    `);
  });

  test("Should expand the top of the selection when the pivot is at the bottom edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 3, rowEnd: 5, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 4, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ row: 2 });
  });

  test("Should widen the column bounds when expanding upward into a spanning cell above the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 4, rowEnd: 6, columnStart: 2, columnEnd: 4 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 5, colIndex: 2, root: null };

    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row === 3 ? { rowIndex: 3, colIndex: 1, rowSpan: 1, colSpan: 5 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 1,
          "rowEnd": 6,
          "rowStart": 3,
        },
      ]
    `);
  });

  test("Should jump past a full-width span rooted above the rect when expanding the top of the selection", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 5, rowEnd: 8, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 7, colIndex: 1, root: null };

    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row === 4 ? { rowIndex: 2, colIndex: 1, rowSpan: 3, colSpan: 2 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 8,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ row: 2 });
  });

  test("Should shrink the bottom of the selection when the pivot is at the top edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 6, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ row: 4 });
  });

  test("Should widen the column bounds when shrinking the bottom of the selection into a spanning cell", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 8, columnStart: 2, columnEnd: 4 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 2, root: null };

    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row === 7 ? { rowIndex: 6, colIndex: 1, rowSpan: 2, colSpan: 5 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 1,
          "rowEnd": 6,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ row: 5 });
  });

  test("Should treat a mid-rect spanning cell as part of the pivot and expand upward instead of shrinking", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 8, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 6, colIndex: 1, root: null };

    // Span at row 6 is rooted at row 5 with rowSpan 3, making pivotEnd reach rect's rowEnd (8).
    // This switches the branch from shrink to expand.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row === 6 ? { rowIndex: 5, colIndex: 1, rowSpan: 3, colSpan: 2 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 8,
          "rowStart": 1,
        },
      ]
    `);
  });

  test("Should use the span root bounds when the position itself is a spanning cell", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 6, columnStart: 1, columnEnd: 3 }];
    // root spans rows 4-5 (rowEnd=6), matching rect.rowEnd — isAtEdge becomes true via rowEnd
    const position: PositionGridCell = {
      kind: "cell",
      rowIndex: 4,
      colIndex: 1,
      root: { rowIndex: 4, colIndex: 1, rowSpan: 2, colSpan: 2 },
    };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 6,
          "rowStart": 1,
        },
      ]
    `);
  });

  test("Should only modify the last selection when multiple selections are present", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [
      { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 1 },
      { rowStart: 3, rowEnd: 5, columnStart: 1, columnEnd: 3 },
    ];
    const position: PositionGridCell = { kind: "cell", rowIndex: 4, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsUp(scrollIntoView, cellRoot, selections, false, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 1,
          "columnStart": 0,
          "rowEnd": 2,
          "rowStart": 0,
        },
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
  });
});
