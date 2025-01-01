import { EMPTY_TOTAL } from "../../constants.js";
import { flattenBottomRows } from "../flatten-bottom-rows.js";
import type { FlattenRowContext } from "../types.js";
import { makeRowNodes } from "./make-row-nodes.js";
import { prettyPrintMap } from "./pretty-print-map.js";

test("should return the correct mapping for bottom rows", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, makeRowNodes(2, 10), null, false, EMPTY_TOTAL, 10);

  expect(result).toEqual(12);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    "
  `);
});

test("should return the correct mapping for bottom rows when the totals row is pinned bot", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, makeRowNodes(2, 10), "bottom", true, EMPTY_TOTAL, 10);
  expect(result).toEqual(13);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    __lng__totals__row => __lng__totals__row
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    12 => __lng__totals__row
    "
  `);
});

test("should return the correct mapping for bottom rows when the totals row is positioned bot", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, makeRowNodes(2, 10), "bottom", false, EMPTY_TOTAL, 10);
  expect(result).toEqual(13);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    __lng__totals__row => __lng__totals__row
    10 => 10
    11 => 11
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => __lng__totals__row
    11 => 10
    12 => 11
    "
  `);
});

test("should handle empty bottom rows", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, [], null, false, EMPTY_TOTAL, 10);
  expect(result).toEqual(10);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "

    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "

    "
  `);
});

test("should handle empty bottom rows with total positioned", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, [], "bottom", false, EMPTY_TOTAL, 10);
  expect(result).toEqual(11);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    __lng__totals__row => __lng__totals__row
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => __lng__totals__row
    "
  `);
});

test("should handle empty bottom rows with total pinned bottom", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, [], "bottom", true, EMPTY_TOTAL, 10);
  expect(result).toEqual(11);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    __lng__totals__row => __lng__totals__row
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => __lng__totals__row
    "
  `);
});

test("should handle the totals row not being pinned bottom", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, makeRowNodes(2, 10), "top", true, EMPTY_TOTAL, 10);
  expect(result).toEqual(12);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    "
  `);
});

test("should handle the totals row not being positioned bottom", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIdToRowIndex: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenBottomRows(ctx, makeRowNodes(2, 10), "top", false, EMPTY_TOTAL, 10);
  expect(result).toEqual(12);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    10 => 10
    11 => 11
    "
  `);
});
