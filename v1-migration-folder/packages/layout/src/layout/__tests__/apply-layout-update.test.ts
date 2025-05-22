import { expect, test } from "vitest";
import { applyLayoutUpdate } from "../apply-layout-update";
import { printLayoutMap } from "./print-layout-map";

test("applyLayoutForRows: should compute the standard layout", () => {
  const map = new Map();
  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    invalidated: false,
    isFullWidth: () => false,
    isRowCutoff: () => false,
    computeColSpan: () => 1,
    computeRowSpan: () => 1,
    layoutMap: map,
    nextLayout: {
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
    prevLayout: {
      colCenterStart: 0,
      colCenterEnd: 0,
      colCenterLast: 0,
      colEndEnd: 10,
      colEndStart: 0,
      colStartStart: 0,
      colStartEnd: 0,
      rowCenterStart: 0,
      rowCenterEnd: 0,
      rowCenterLast: 0,
      rowTopStart: 0,
      rowTopEnd: 0,
      rowBotEnd: 0,
      rowBotStart: 0,
    },
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬─────┬─────┬─────┬───┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2   │ 3   │ 4   │ 5 │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 0    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 1    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴─────┴─────┴─────┴───┴───┴───┴─────┴─────┘"
  `);
});

test("applyLayoutForRows: should return the map if previously calculated", () => {
  const map = new Map();
  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    invalidated: false,
    isFullWidth: () => false,
    isRowCutoff: () => false,
    computeColSpan: () => 1,
    computeRowSpan: () => 1,
    layoutMap: map,
    nextLayout: {
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
    prevLayout: {
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
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┐
    │ Row  │
    └──────┘"
  `);
});

test("applyLayoutForRows: should return the map calculated if invalidated is true", () => {
  const map = new Map();
  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    invalidated: true,
    isFullWidth: () => false,
    isRowCutoff: () => false,
    computeColSpan: () => 1,
    computeRowSpan: () => 1,
    layoutMap: map,
    nextLayout: {
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
    prevLayout: {
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
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬─────┬─────┬─────┬─────┬─────┬───┬───┬───┬─────┬─────┐
    │ Row  │ 0   │ 1   │ 2   │ 3   │ 4   │ 5 │ 6 │ 7 │ 8   │ 9   │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 0    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 1    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 2    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 3    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    ├──────┼─────┼─────┼─────┼─────┼─────┼───┼───┼───┼─────┼─────┤
    │ 4    │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ - │ - │ - │ 1,1 │ 1,1 │
    └──────┴─────┴─────┴─────┴─────┴─────┴───┴───┴───┴─────┴─────┘"
  `);
});
