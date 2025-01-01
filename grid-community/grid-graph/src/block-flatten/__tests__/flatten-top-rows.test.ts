import { EMPTY_TOTAL } from "../../constants.js";
import { flattenTopRows } from "../flatten-top-rows.js";
import type { FlattenRowContext } from "../types.js";
import { makeRowNodes } from "./make-row-nodes.js";
import { prettyPrintMap } from "./pretty-print-map.js";

test("should handle top rows", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, makeRowNodes(2, 0), null, false, EMPTY_TOTAL);

  expect(result).toEqual(2);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    "
  `);
});

test("should handle empty top rows", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, [], null, false, EMPTY_TOTAL);

  expect(result).toEqual(0);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "

    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "

    "
  `);
});

test("should handle top rows with totals pinned top", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, makeRowNodes(2, 0), "top", true, EMPTY_TOTAL);

  expect(result).toEqual(3);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    __lng__totals__row => __lng__totals__row
    0 => 0
    1 => 1
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => __lng__totals__row
    1 => 0
    2 => 1
    "
  `);
});

test("should handle top rows with totals positioned top", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, makeRowNodes(2, 0), "top", false, EMPTY_TOTAL);

  expect(result).toEqual(3);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    __lng__totals__row => __lng__totals__row
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    2 => __lng__totals__row
    "
  `);
});

test("should handle top rows with totals positioned bottom", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, makeRowNodes(2, 0), "bottom", false, EMPTY_TOTAL);

  expect(result).toEqual(2);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    "
  `);
});

test("should handle top rows with totals pinned bottom", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, makeRowNodes(2, 0), "bottom", true, EMPTY_TOTAL);

  expect(result).toEqual(2);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    "
  `);
});

test("should handle empty top rows with totals pinned top", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, [], "top", true, EMPTY_TOTAL);

  expect(result).toEqual(1);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    __lng__totals__row => __lng__totals__row
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => __lng__totals__row
    "
  `);
});

test("should handle empty top rows with totals positioned top", () => {
  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenTopRows(ctx, [], "top", false, EMPTY_TOTAL);

  expect(result).toEqual(1);
  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    __lng__totals__row => __lng__totals__row
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => __lng__totals__row
    "
  `);
});
