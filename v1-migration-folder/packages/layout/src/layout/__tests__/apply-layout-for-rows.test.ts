import { describe, expect, test } from "vitest";
import { applyLayoutForRows } from "../apply-layout-for-rows.js";
import { printLayoutMap } from "./print-layout-map.js";

describe("applyLayoutForRows", () => {
  test("should apply row layouts for flat views", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeColSpan: () => 1,
      computeRowSpan: () => 1,
      start: 2,
      end: 5,
      isFullWidth: () => false,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 8,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2   │ 3   │ 4   │
    ├──────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴─────┴─────┴─────┘"
  `);
  });

  test("should apply row layouts for flat views with full width rows", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeColSpan: () => 1,
      computeRowSpan: () => 1,
      start: 2,
      end: 5,
      isFullWidth: (i) => i === 3,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 8,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2   │ 3   │ 4   │
    ├──────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ F   │ F   │ F   │ F   │ F   │
    ├──────┼─────┼─────┼─────┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴─────┴─────┴─────┘"
  `);
  });

  test("should handle pinned end columns", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeColSpan: () => 1,
      computeRowSpan: () => 1,
      start: 2,
      end: 5,
      isFullWidth: () => false,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬─────┬─────┬─────┬───┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2   │ 3   │ 4   │ 5 │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴─────┴─────┴─────┴───┴───┴───┴─────┴─────┘"
  `);
  });

  test("should handle column spans for a given row", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeColSpan: (r, c) => (r === 2 && c === 2 ? 3 : 1),
      computeRowSpan: () => 1,
      start: 2,
      end: 5,
      isFullWidth: () => false,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬──────┬───────┬───────┬───┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2    │ 3     │ 4     │ 5 │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼──────┼───────┼───────┼───┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ c1,3 │ #r2,2 │ #r2,2 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼──────┼───────┼───────┼───┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ 1,1  │ 1,1   │ 1,1   │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼──────┼───────┼───────┼───┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1  │ 1,1   │ 1,1   │ - │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴──────┴───────┴───────┴───┴───┴───┴─────┴─────┘"
  `);
  });

  test("should handle row spans for a given row", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeRowSpan: (r, c) => (r === 2 && c === 2 ? 3 : 1),
      computeColSpan: () => 1,
      start: 2,
      end: 5,
      isFullWidth: () => false,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬───────┬─────┬─────┬───┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2     │ 3   │ 4   │ 5 │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼───────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ c3,1  │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ #r2,2 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ #r2,2 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴───────┴─────┴─────┴───┴───┴───┴─────┴─────┘"
  `);
  });

  test("should handle row and col spans for a given row", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeRowSpan: (r, c) => (r === 2 && c === 2 ? 3 : 1),
      computeColSpan: (r, c) => (r === 2 && c === 2 ? 3 : 1),
      start: 2,
      end: 5,
      isFullWidth: () => false,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬───────┬───────┬───────┬───┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2     │ 3     │ 4     │ 5 │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ c3,3  │ #r2,2 │ #r2,2 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴───────┴───────┴───────┴───┴───┴───┴─────┴─────┘"
  `);
  });

  test("should handle row and col spans for a given row with full row cutoff", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeRowSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      computeColSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      start: 2,
      end: 5,
      isFullWidth: (i) => i === 4,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬───────┬───────┬───────┬───────┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2     │ 3     │ 4     │ 5     │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ c2,4  │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ #r2,2 │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 4    │ F   │ F   │ F     │ F     │ F     │ F     │ F │ F │ F   │ F   │
    └──────┴─────┴─────┴───────┴───────┴───────┴───────┴───┴───┴─────┴─────┘"
  `);
  });

  test("should handle row and col spans for a given row with full row cutoff", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeRowSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      computeColSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      start: 2,
      end: 5,
      isFullWidth: () => false,
      isRowCutoff: (i) => i === 4,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬───────┬───────┬───────┬───────┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2     │ 3     │ 4     │ 5     │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ c2,4  │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ #r2,2 │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1   │ 1,1   │ 1,1   │ -     │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴───────┴───────┴───────┴───────┴───┴───┴─────┴─────┘"
  `);
  });

  test("should handle multiple applications", () => {
    const map = new Map();
    applyLayoutForRows({
      colScanDistance: 200,
      computeRowSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      computeColSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      start: 2,
      end: 5,
      isFullWidth: (i) => i === 4,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    applyLayoutForRows({
      colScanDistance: 200,
      computeRowSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      computeColSpan: (r, c) => (r === 2 && c === 2 ? 4 : 1),
      start: 4,
      end: 7,
      isFullWidth: (i) => i === 4,
      isRowCutoff: () => false,
      layout: {
        colCenterStart: 2,
        colCenterEnd: 5,
        colCenterLast: 8,
        colEndEnd: 10,
        colEndStart: 8,
        colStartStart: 0,
        colStartEnd: 2,
        rowCenterStart: 2,
        rowCenterEnd: 5,
        rowCenterLast: 8,
        rowTopStart: 0,
        rowTopEnd: 2,
        rowBotEnd: 8,
        rowBotStart: 8,
      },
      maxRowBound: 8,
      map,
    });

    expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬───────┬───────┬───────┬───────┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2     │ 3     │ 4     │ 5     │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ c2,4  │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ #r2,2 │ #r2,2 │ #r2,2 │ #r2,2 │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 4    │ F   │ F   │ F     │ F     │ F     │ F     │ F │ F │ F   │ F   │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 5    │ 1,1 │ 1,1 │ 1,1   │ 1,1   │ 1,1   │ -     │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼───────┼───────┼───────┼───────┼───┼───┼─────┼─────┤
    │ 6    │ 1,1 │ 1,1 │ 1,1   │ 1,1   │ 1,1   │ -     │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴───────┴───────┴───────┴───────┴───┴───┴─────┴─────┘"
  `);
  });
});
