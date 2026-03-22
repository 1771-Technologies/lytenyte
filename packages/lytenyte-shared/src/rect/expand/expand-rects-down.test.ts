import { describe, expect, test, vi } from "vitest";
import type { DataRect } from "../types.js";
import type { PositionGridCell, PositionUnion } from "../../types.js";
import { expandRectsDown } from "./expand-rects-down.js";

describe("expandRectsDown", () => {
  test("Should return null when there are no selections", () => {
    expect(
      expandRectsDown(
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
      expandRectsDown(
        () => {},
        () => null,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
        20,
      ),
    ).toEqual(null);
  });

  test("Should expand the bottom boundary downward when the position is strictly interior (span-grown rect)", () => {
    const cellRoot = (row: number, col: number) =>
      ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion;
    expect(
      expandRectsDown(
        () => {},
        cellRoot,
        [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        false,
        { kind: "cell", rowIndex: 5, colIndex: 4, root: null },
        20,
      ),
    ).toEqual([{ rowStart: 4, rowEnd: 9, columnStart: 3, columnEnd: 8 }]);
  });

  test("Should expand to the last row when the meta key is pressed", () => {
    const scrollIntoView = vi.fn();
    const cellRoot = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, true, position, 20);

    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 20,
          "rowStart": 2,
        },
      ]
    `);

    expect(scrollIntoView).toHaveBeenCalledOnce();
  });

  test("Should expand to the last row without scrolling when the pivot is at row zero", () => {
    const scrollIntoView = vi.fn();
    const cellRoot = vi.fn();
    const selections: DataRect[] = [{ rowStart: 0, rowEnd: 3, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 0, colIndex: 1, root: null };

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, true, position, 20);

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

  test("Should shrink the top of the selection when the pivot is at the bottom edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 4,
          "rowStart": 3,
        },
      ]
    `);
  });

  test("Should expand the bottom of the selection when the pivot is at the top edge", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 4,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should widen the column bounds when expanding into a spanning cell below the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 3, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };

    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: col === 1 ? null : { rowIndex: 3, colIndex: 2, rowSpan: 2, colSpan: 4 },
        }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 6,
          "columnStart": 1,
          "rowEnd": 5,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should jump past a full-width span when shrinking the selection from the top", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 6, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 5, colIndex: 1, root: null };

    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row !== 5 ? { rowIndex: 2, colIndex: 1, rowSpan: 3, colSpan: 2 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 6,
          "rowStart": 5,
        },
      ]
    `);
  });

  test("Should treat a mid-rect spanning cell as part of the pivot and expand downward instead of shrinking", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 8, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 3, colIndex: 1, root: null };

    // The span at row 3 is rooted at row 2 (rect's rowStart), which pulls pivotStart down to 2.
    // This causes the pivot to be treated as coinciding with rowStart, switching from shrink to expand.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row === 3 ? { rowIndex: 2, colIndex: 1, rowSpan: 2, colSpan: 2 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 9,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should clamp the expanded rowEnd to rowCount when the selection already reaches the last row", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 20, columnStart: 1, columnEnd: 3 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 20,
          "rowStart": 2,
        },
      ]
    `);
    expect(scrollIntoView).toHaveBeenCalledWith({ row: 19 });
  });

  test("Should widen columns when shrinking the selection from the top into a span wider than the rect", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 6, columnStart: 2, columnEnd: 4 }];
    const position: PositionGridCell = { kind: "cell", rowIndex: 5, colIndex: 2, root: null };

    // Span at row 3 starts inside the rect but extends beyond its column bounds on both sides.
    const cellRoot = vi.fn(
      (row, col) =>
        ({
          kind: "cell",
          rowIndex: row,
          colIndex: col,
          root: row === 3 ? { rowIndex: 3, colIndex: 1, rowSpan: 2, colSpan: 5 } : null,
        }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
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

  test("Should use the span root bounds when the position itself is a spanning cell", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [{ rowStart: 2, rowEnd: 5, columnStart: 1, columnEnd: 3 }];

    // The position cell's root spans rows 2-4, cols 1-2 — its rowEnd (5) matches rect.rowEnd,
    // so isAtEdge becomes true and the selection expands downward.
    const position: PositionGridCell = {
      kind: "cell",
      rowIndex: 3,
      colIndex: 1,
      root: { rowIndex: 2, colIndex: 1, rowSpan: 3, colSpan: 2 },
    };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
    expect(expanded).toMatchInlineSnapshot(`
      [
        {
          "columnEnd": 3,
          "columnStart": 1,
          "rowEnd": 6,
          "rowStart": 2,
        },
      ]
    `);
  });

  test("Should only modify the last selection when multiple selections are present", () => {
    const scrollIntoView = vi.fn();
    const selections: DataRect[] = [
      { rowStart: 0, rowEnd: 2, columnStart: 0, columnEnd: 1 },
      { rowStart: 2, rowEnd: 4, columnStart: 1, columnEnd: 3 },
    ];
    const position: PositionGridCell = { kind: "cell", rowIndex: 2, colIndex: 1, root: null };
    const cellRoot = vi.fn(
      (row, col) => ({ kind: "cell", rowIndex: row, colIndex: col, root: null }) as PositionUnion,
    );

    const expanded = expandRectsDown(scrollIntoView, cellRoot, selections, false, position, 20);
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
