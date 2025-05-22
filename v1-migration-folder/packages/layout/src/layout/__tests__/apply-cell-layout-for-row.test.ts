import { expect, test } from "vitest";
import { applyCellLayoutForRow } from "../apply-cell-layout-for-row";
import { printLayoutMap } from "./print-layout-map";

test("applyCellLayoutForRow: should apply the correct cell layout when the layout is flat", () => {
  const map = new Map();

  applyCellLayoutForRow({
    computeColSpan: () => 1,
    computeRowSpan: () => 1,
    row: 2,
    start: 4,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 25,
    maxRowBound: 5,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬───┬───┬─────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2 │ 3 │ 4   │ 5   │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼───┼───┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ - │ - │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    └──────┴───┴───┴───┴───┴─────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when there is a column span", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => (c === 3 ? 3 : 1),
    computeRowSpan: () => 1,
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 25,
    maxRowBound: 5,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬──────┬───────┬───────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3    │ 4     │ 5     │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼──────┼───────┼───────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c1,3 │ #r2,3 │ #r2,3 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    └──────┴───┴───┴─────┴──────┴───────┴───────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when the span is only a single extra column", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => (c === 3 ? 2 : 1),
    computeRowSpan: () => 1,
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 25,
    maxRowBound: 5,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬──────┬───────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3    │ 4     │ 5   │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼──────┼───────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c1,2 │ #r2,3 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    └──────┴───┴───┴─────┴──────┴───────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when the span exceeds the max bound", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => (c === 3 ? 15 : 1),
    computeRowSpan: () => 1,
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 5,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬──────┬───────┬───────┬───────┬───────┬───────┬───────┐
    │ Row  │ 0 │ 1 │ 2   │ 3    │ 4     │ 5     │ 6     │ 7     │ 8     │ 9     │
    ├──────┼───┼───┼─────┼──────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 2    │ - │ - │ 1,1 │ c1,7 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    └──────┴───┴───┴─────┴──────┴───────┴───────┴───────┴───────┴───────┴───────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when the span is over some rows", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: () => 1,
    computeRowSpan: (_, c) => (c === 3 ? 3 : 1),
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 5,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3     │ 4   │ 5   │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c3,1  │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 4    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    └──────┴───┴───┴─────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when the span is just one row", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: () => 1,
    computeRowSpan: (_, c) => (c === 3 ? 2 : 1),
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 5,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3     │ 4   │ 5   │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c2,1  │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    └──────┴───┴───┴─────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when the span exceeds the max row bound", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: () => 1,
    computeRowSpan: (_, c) => (c === 3 ? 12 : 1),
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3     │ 4   │ 5   │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c6,1  │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 4    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 5    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 6    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼─────┼───────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 7    │ - │ - │ -   │ #r2,3 │ -   │ -   │ -   │ -   │ -   │     │
    └──────┴───┴───┴─────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when there are both row and column spans", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => (c === 3 ? 2 : 1),
    computeRowSpan: (_, c) => (c === 3 ? 2 : 1),
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬───────┬───────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3     │ 4     │ 5   │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c2,2  │ #r2,3 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼─────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ -   │ #r2,3 │ #r2,3 │ -   │ -   │ -   │ -   │     │
    └──────┴───┴───┴─────┴───────┴───────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should apply the correct layout when the spans are over multiple rows and columns", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => (c === 3 ? 3 : 1),
    computeRowSpan: (_, c) => (c === 3 ? 3 : 1),
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬───────┬───────┬───────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2   │ 3     │ 4     │ 5     │ 6   │ 7   │ 8   │ 9   │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ 1,1 │ c3,3  │ #r2,3 │ #r2,3 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ -   │ -   │ -   │     │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼─────┼─────┼─────┤     │
    │ 4    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ -   │ -   │ -   │     │
    └──────┴───┴───┴─────┴───────┴───────┴───────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should respect bounds when the spans occur both ways", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => (c === 3 ? 12 : 1),
    computeRowSpan: (_, c) => (c === 3 ? 12 : 1),
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬─────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┐
    │ Row  │ 0 │ 1 │ 2   │ 3     │ 4     │ 5     │ 6     │ 7     │ 8     │ 9     │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 2    │ - │ - │ 1,1 │ c6,7  │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 3    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 4    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 5    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 6    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    ├──────┼───┼───┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 7    │ - │ - │ -   │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │ #r2,3 │
    └──────┴───┴───┴─────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┘"
  `);
});

test("applyCellLayoutForRow: should be able to have multiple spans on the same row", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 3;
      return 1;
    },
    computeRowSpan: () => 1,
    row: 2,
    start: 2,
    end: 10,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬──────┬───────┬─────┬──────┬───────┬───────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2    │ 3     │ 4   │ 5    │ 6     │ 7     │ 8   │ 9   │
    ├──────┼───┼───┼──────┼───────┼─────┼──────┼───────┼───────┼─────┼─────┤
    │ 2    │ - │ - │ c1,2 │ #r2,2 │ 1,1 │ c1,3 │ #r2,5 │ #r2,5 │ 1,1 │ 1,1 │
    └──────┴───┴───┴──────┴───────┴─────┴──────┴───────┴───────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should be able to have multiple spans in both directions", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 3;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 3;
      return 1;
    },
    row: 2,
    start: 2,
    end: 12,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 10,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬───────┬───────┬─────┬───────┬───────┬───────┬─────┬─────┬─────┬──────┐
    │ Row  │ 0 │ 1 │ 2     │ 3     │ 4   │ 5     │ 6     │ 7     │ 8   │ 9   │ 10  │ 11   │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼─────┼─────┼─────┼──────┤
    │ 2    │ - │ - │ c2,2  │ #r2,2 │ 1,1 │ c3,3  │ #r2,5 │ #r2,5 │ 1,1 │ 1,1 │ 1,0 │ 1,-1 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼─────┼─────┼─────┼──────┤
    │ 3    │ - │ - │ #r2,2 │ #r2,2 │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ -   │ -   │ -   │      │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼─────┼─────┼─────┤      │
    │ 4    │ - │ - │ -     │ -     │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ -   │ -   │ -   │      │
    └──────┴───┴───┴───────┴───────┴─────┴───────┴───────┴───────┴─────┴─────┴─────┴──────┘"
  `);
});

test("applyCellLayoutForRow: should be able to have multiple spans in both directions that respect the bounds", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 10;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 12;
      return 1;
    },
    row: 2,
    start: 2,
    end: 12,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬───────┬───────┬─────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┐
    │ Row  │ 0 │ 1 │ 2     │ 3     │ 4   │ 5     │ 6     │ 7     │ 8     │ 9     │ 10    │ 11    │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 2    │ - │ - │ c2,2  │ #r2,2 │ 1,1 │ c6,7  │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 3    │ - │ - │ #r2,2 │ #r2,2 │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 4    │ - │ - │ -     │ -     │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 5    │ - │ - │ -     │ -     │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 6    │ - │ - │ -     │ -     │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 7    │ - │ - │ -     │ -     │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    └──────┴───┴───┴───────┴───────┴─────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┘"
  `);
});

test("applyCellLayoutForRow: should respect row cut off", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 10;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 12;
      return 1;
    },
    row: 2,
    start: 2,
    end: 12,
    isRowCutoff: (r) => r === 5,
    isFullWidth: () => false,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬───────┬───────┬─────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┐
    │ Row  │ 0 │ 1 │ 2     │ 3     │ 4   │ 5     │ 6     │ 7     │ 8     │ 9     │ 10    │ 11    │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 2    │ - │ - │ c2,2  │ #r2,2 │ 1,1 │ c3,7  │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 3    │ - │ - │ #r2,2 │ #r2,2 │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    ├──────┼───┼───┼───────┼───────┼─────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 4    │ - │ - │ -     │ -     │ -   │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │ #r2,5 │
    └──────┴───┴───┴───────┴───────┴─────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┘"
  `);
});

test("applyCellLayoutForRow: should apply full width rows", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 10;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 12;
      return 1;
    },
    row: 1,
    start: 2,
    end: 12,
    isRowCutoff: (r) => r === 5,
    isFullWidth: (r) => r === 2,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 10;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 2;
      if (c === 5) return 12;
      return 1;
    },
    row: 2,
    start: 2,
    end: 12,
    isRowCutoff: (r) => r === 5,
    isFullWidth: (r) => r === 2,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬──────┬───────┬─────┬──────┬───────┬───────┬───────┬───────┬───────┬───────┐
    │ Row  │ 0 │ 1 │ 2    │ 3     │ 4   │ 5    │ 6     │ 7     │ 8     │ 9     │ 10    │ 11    │
    ├──────┼───┼───┼──────┼───────┼─────┼──────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 1    │ - │ - │ c1,2 │ #r1,2 │ 1,1 │ c1,7 │ #r1,5 │ #r1,5 │ #r1,5 │ #r1,5 │ #r1,5 │ #r1,5 │
    ├──────┼───┼───┼──────┼───────┼─────┼──────┼───────┼───────┼───────┼───────┼───────┼───────┤
    │ 2    │ F │ F │ F    │ F     │ F   │ F    │ F     │ F     │ F     │ F     │ F     │ F     │
    └──────┴───┴───┴──────┴───────┴─────┴──────┴───────┴───────┴───────┴───────┴───────┴───────┘"
  `);
});

test("applyCellLayoutForRow: should ignore spans that are overlapping - preferring only the first", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 3;
      if (c === 4) return 4;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 3;
      if (c === 4) return 4;
      return 1;
    },
    row: 2,
    start: 2,
    end: 12,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬───────┬───────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2     │ 3     │ 4     │ 5   │ 6   │ 7   │ 8   │ 9   │ 10  │ 11  │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ c3,3  │ #r2,2 │ #r2,2 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ #r2,2 │ #r2,2 │ #r2,2 │ -   │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 4    │ - │ - │ #r2,2 │ #r2,2 │ #r2,2 │ -   │ -   │ -   │ -   │ -   │ -   │     │
    └──────┴───┴───┴───────┴───────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});

test("applyCellLayoutForRow: should be apply to the same map correctly", () => {
  const map = new Map();
  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 3;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 3;
      return 1;
    },
    row: 2,
    start: 2,
    end: 12,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  applyCellLayoutForRow({
    computeColSpan: (_, c) => {
      if (c === 2) return 3;
      return 1;
    },
    computeRowSpan: (_, c) => {
      if (c === 2) return 3;
      return 1;
    },
    row: 5,
    start: 2,
    end: 12,
    isRowCutoff: () => false,
    isFullWidth: () => false,
    map,
    maxColBound: 12,
    maxRowBound: 8,
  });

  expect(printLayoutMap(map)).toMatchInlineSnapshot(`
    "
    ┌──────┬───┬───┬───────┬───────┬───────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
    │ Row  │ 0 │ 1 │ 2     │ 3     │ 4     │ 5   │ 6   │ 7   │ 8   │ 9   │ 10  │ 11  │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 2    │ - │ - │ c3,3  │ #r2,2 │ #r2,2 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 3    │ - │ - │ #r2,2 │ #r2,2 │ #r2,2 │ -   │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 4    │ - │ - │ #r2,2 │ #r2,2 │ #r2,2 │ -   │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 5    │ - │ - │ c3,3  │ #r5,2 │ #r5,2 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │ 1,1 │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
    │ 6    │ - │ - │ #r5,2 │ #r5,2 │ #r5,2 │ -   │ -   │ -   │ -   │ -   │ -   │     │
    ├──────┼───┼───┼───────┼───────┼───────┼─────┼─────┼─────┼─────┼─────┼─────┤     │
    │ 7    │ - │ - │ #r5,2 │ #r5,2 │ #r5,2 │ -   │ -   │ -   │ -   │ -   │ -   │     │
    └──────┴───┴───┴───────┴───────┴───────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘"
  `);
});
