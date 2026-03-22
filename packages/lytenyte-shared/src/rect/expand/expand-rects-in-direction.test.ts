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

  test("Should return null when the position is strictly interior to the selection", () => {
    expect(
      expandRectsInDirection({
        scrollIntoView: () => {},
        cellRoot: () => null,
        selections: [{ rowStart: 4, rowEnd: 8, columnStart: 3, columnEnd: 8 }],
        direction: "up",
        meta: false,
        pos: { kind: "cell", rowIndex: 5, colIndex: 4, root: null },
        rowCount: 20,
        view,
        ignoreFirst: false,
      }),
    ).toEqual(null);
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
