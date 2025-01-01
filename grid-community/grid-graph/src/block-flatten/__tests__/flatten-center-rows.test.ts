import type { BlockPaths, BlockStore } from "../../types.js";
import { flattenCenterRows } from "../flatten-center-rows.js";
import type { FlattenRowContext } from "../types.js";
import { makeGroupNode, makeLeafNode, makeRowNodes } from "./make-row-nodes.js";
import { prettyPrintMap } from "./pretty-print-map.js";

test("should handle flattening center rows", () => {
  const lookup: BlockPaths = new Map();

  const root: BlockStore = { size: 30, map: new Map() };

  root.map.set(0, { data: makeRowNodes(5, 0), index: 0 });
  root.map.set(1, { data: makeRowNodes(5, 10), index: 2 });
  root.map.set(5, { data: makeRowNodes(3, 25), index: 5 });

  lookup.set("", root);

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(30);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    2 => 2
    3 => 3
    4 => 4
    10 => 10
    11 => 11
    12 => 12
    13 => 13
    14 => 14
    25 => 25
    26 => 26
    27 => 27
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    2 => 2
    3 => 3
    4 => 4
    10 => 10
    11 => 11
    12 => 12
    13 => 13
    14 => 14
    25 => 25
    26 => 26
    27 => 27
    "
  `);

  expect(ctx.ranges).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 30,
        "rowStart": 0,
      },
    ]
  `);
});

test("should handle flattening center rows that are offset", () => {
  const lookup: BlockPaths = new Map();

  const root: BlockStore = { size: 30, map: new Map() };

  root.map.set(0, { data: makeRowNodes(5, 0), index: 0 });
  root.map.set(1, { data: makeRowNodes(5, 10), index: 2 });
  root.map.set(5, { data: makeRowNodes(3, 25), index: 5 });

  lookup.set("", root);

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 4);
  expect(result).toEqual(34);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    0 => 0
    1 => 1
    2 => 2
    3 => 3
    4 => 4
    10 => 10
    11 => 11
    12 => 12
    13 => 13
    14 => 14
    25 => 25
    26 => 26
    27 => 27
    "
  `);

  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    4 => 0
    5 => 1
    6 => 2
    7 => 3
    8 => 4
    14 => 10
    15 => 11
    16 => 12
    17 => 13
    18 => 14
    29 => 25
    30 => 26
    31 => 27
    "
  `);
  expect(ctx.ranges).toMatchInlineSnapshot(`
    [
      {
        "path": "",
        "rowEnd": 34,
        "rowStart": 4,
      },
    ]
  `);
});

test("should handle flattening group rows that are expanded and skipping those that are not", () => {
  const lookup: BlockPaths = new Map();
  const root: BlockStore = { size: 30, map: new Map() };

  root.map.set(0, {
    data: [makeGroupNode("alpha", "alpha", true), makeGroupNode("beta", "beta", false)],
    index: 0,
  });
  root.map.set(2, {
    data: [makeGroupNode("zeta", "zeta", true), makeGroupNode("sigma", "sigma", false)],
    index: 2,
  });

  const alpha: BlockStore = { size: 20, map: new Map() };
  alpha.map.set(0, {
    data: [
      makeGroupNode("alpha/a", "a", true),
      makeGroupNode("alpha/b", "b", false),
      makeGroupNode("alpha/c", "c", true),
      makeGroupNode("alpha/d", "d", false),
    ],
    index: 0,
  });
  alpha.map.set(1, {
    data: [makeLeafNode("alpha/x"), makeLeafNode("alpha/z"), makeLeafNode("alpha/t")],
    index: 1,
  });

  const alphaA: BlockStore = { size: 10, map: new Map() };
  alphaA.map.set(1, {
    data: [
      makeLeafNode("alpha/a/1"),
      makeLeafNode("alpha/a/2"),
      makeLeafNode("alpha/a/3"),
      makeLeafNode("alpha/a/4"),
    ],
    index: 1,
  });

  const alphaB: BlockStore = { size: 20, map: new Map() };
  alphaB.map.set(1, {
    data: [
      makeLeafNode("alpha/b/1"),
      makeLeafNode("alpha/b/2"),
      makeLeafNode("alpha/b/3"),
      makeLeafNode("alpha/b/4"),
      makeLeafNode("alpha/b/5"),
    ],
    index: 1,
  });

  const alphaC: BlockStore = { size: 20, map: new Map() };
  alphaC.map.set(1, {
    data: [
      makeLeafNode("alpha/c/1"),
      makeLeafNode("alpha/c/2"),
      makeLeafNode("alpha/c/3"),
      makeLeafNode("alpha/c/4"),
      makeLeafNode("alpha/c/5"),
    ],
    index: 1,
  });
  alphaC.map.set(2, {
    data: [
      makeLeafNode("alpha/c/6"),
      makeLeafNode("alpha/c/7"),
      makeLeafNode("alpha/c/8"),
      makeLeafNode("alpha/c/9"),
      makeLeafNode("alpha/c/10"),
    ],
    index: 1,
  });

  const zeta: BlockStore = { size: 20, map: new Map() };
  zeta.map.set(2, {
    data: [makeLeafNode("vv"), makeLeafNode("zeta/x"), makeLeafNode("zeta/b")],
    index: 2,
  });

  lookup.set("", root);
  lookup.set("alpha", alpha);
  lookup.set("alpha/a", alphaA);
  lookup.set("alpha/b", alphaB);
  lookup.set("alpha/c", alphaC);
  lookup.set("zeta", zeta);

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(100);

  expect(prettyPrintMap(ctx.rowIdToRow)).toMatchInlineSnapshot(`
    "
    alpha => alpha
    alpha/a => alpha/a
    alpha/a/1 => alpha/a/1
    alpha/a/2 => alpha/a/2
    alpha/a/3 => alpha/a/3
    alpha/a/4 => alpha/a/4
    alpha/b => alpha/b
    alpha/c => alpha/c
    alpha/c/1 => alpha/c/1
    alpha/c/2 => alpha/c/2
    alpha/c/3 => alpha/c/3
    alpha/c/4 => alpha/c/4
    alpha/c/5 => alpha/c/5
    alpha/c/6 => alpha/c/6
    alpha/c/7 => alpha/c/7
    alpha/c/8 => alpha/c/8
    alpha/c/9 => alpha/c/9
    alpha/c/10 => alpha/c/10
    alpha/d => alpha/d
    alpha/x => alpha/x
    alpha/z => alpha/z
    alpha/t => alpha/t
    beta => beta
    zeta => zeta
    vv => vv
    zeta/x => zeta/x
    zeta/b => zeta/b
    sigma => sigma
    "
  `);
  expect(prettyPrintMap(ctx.rowIndexToRow)).toMatchInlineSnapshot(`
    "
    0 => alpha
    1 => alpha/a
    7 => alpha/a/1
    8 => alpha/a/2
    9 => alpha/a/3
    10 => alpha/a/4
    12 => alpha/b
    13 => alpha/c
    19 => alpha/c/6
    20 => alpha/c/7
    21 => alpha/c/8
    22 => alpha/c/9
    23 => alpha/c/10
    34 => alpha/d
    36 => alpha/x
    37 => alpha/z
    38 => alpha/t
    51 => beta
    60 => zeta
    71 => vv
    72 => zeta/x
    73 => zeta/b
    81 => sigma
    "
  `);
});

test("should handle an empty lookup", () => {
  const lookup: BlockPaths = new Map();

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(0);
});

test("should handle missing blocks", () => {
  const lookup: BlockPaths = new Map();
  const root: BlockStore = { size: 30, map: new Map() };

  root.map.set(0, {
    data: [makeGroupNode("alpha", "alpha", true), makeGroupNode("beta", "beta", false)],
    index: 0,
  });
  root.map.set(2, {
    data: [makeGroupNode("zeta", "zeta", true), makeGroupNode("sigma", "sigma", false)],
    index: 2,
  });

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  lookup.set("", root);

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(30);
});

// Test deeply nested groups with mixed expansion states
test("should handle deeply nested groups with mixed expansion states", () => {
  const lookup: BlockPaths = new Map();
  const root: BlockStore = { size: 10, map: new Map() };

  // Root level with two groups
  root.map.set(0, {
    data: [makeGroupNode("level1", "level1", true), makeGroupNode("level1b", "level1b", false)],
    index: 0,
  });

  // Level 1 with nested groups
  const level1: BlockStore = { size: 15, map: new Map() };
  level1.map.set(0, {
    data: [
      makeGroupNode("level1/level2a", "level2a", true),
      makeGroupNode("level1/level2b", "level2b", false),
      makeLeafNode("level1/leaf1"),
    ],
    index: 0,
  });

  // Level 2 with more nesting
  const level2a: BlockStore = { size: 8, map: new Map() };
  level2a.map.set(0, {
    data: [
      makeGroupNode("level1/level2a/level3", "level3", true),
      makeLeafNode("level1/level2a/leaf2"),
    ],
    index: 0,
  });

  // Level 3 with leaves
  const level3: BlockStore = { size: 5, map: new Map() };
  level3.map.set(0, {
    data: [
      makeLeafNode("level1/level2a/level3/leaf3"),
      makeLeafNode("level1/level2a/level3/leaf4"),
    ],
    index: 0,
  });

  lookup.set("", root);
  lookup.set("level1", level1);
  lookup.set("level1/level2a", level2a);
  lookup.set("level1/level2a/level3", level3);

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(38); // Total size including all expanded groups

  // Verify specific important mappings
  expect(ctx.rowIdToRow.get("level1/level2a/level3/leaf3")).toBeDefined();
  expect(ctx.rowIdToRow.get("level1b")).toBeDefined();
  expect(ctx.rowIdToRow.get("level1/level2b")).toBeDefined();
});

// Test handling of empty blocks within valid block store
test("should handle empty blocks within valid block store", () => {
  const lookup: BlockPaths = new Map();
  const root: BlockStore = { size: 10, map: new Map() };

  // Mix of empty and non-empty blocks
  root.map.set(0, {
    data: [], // Empty block
    index: 0,
  });
  root.map.set(1, {
    data: makeRowNodes(3, 10),
    index: 1,
  });
  root.map.set(2, {
    data: [], // Another empty block
    index: 2,
  });

  lookup.set("", root);

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(10);

  // Verify handling of empty blocks
  expect(ctx.rowIndexToRow.size).toEqual(3);
  expect(ctx.ranges[0].rowEnd - ctx.ranges[0].rowStart).toEqual(10);
});

// Test handling of invalid paths in lookup
test("should handle invalid paths in lookup", () => {
  const lookup: BlockPaths = new Map();
  const root: BlockStore = { size: 5, map: new Map() };

  root.map.set(0, {
    data: [makeGroupNode("valid", "valid", true), makeGroupNode("invalid", "invalid", true)],
    index: 0,
  });

  // Only set up one of the referenced paths
  const valid: BlockStore = { size: 3, map: new Map() };
  valid.map.set(0, {
    data: [makeLeafNode("valid/leaf")],
    index: 0,
  });

  lookup.set("", root);
  lookup.set("valid", valid);
  // Intentionally omit "invalid" path

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const result = flattenCenterRows(ctx, 5, "/", lookup, 0);
  expect(result).toEqual(8); // Should include valid group's size

  // Verify invalid path was skipped gracefully
  expect(ctx.rowIdToRow.get("valid/leaf")).toBeDefined();
  expect(ctx.rowIdToRow.get("invalid")).toBeDefined();
});

// Test handling of large topOffset values
test("should handle large topOffset values", () => {
  const lookup: BlockPaths = new Map();
  const root: BlockStore = { size: 10, map: new Map() };

  root.map.set(0, {
    data: makeRowNodes(5, 0),
    index: 0,
  });

  lookup.set("", root);

  const ctx: FlattenRowContext<any> = {
    ranges: [],
    rowIdToRow: new Map(),
    rowIndexToRow: new Map(),
  };

  const largeOffset = 1000;
  const result = flattenCenterRows(ctx, 5, "/", lookup, largeOffset);
  expect(result).toEqual(1010);

  // Verify all indices are properly offset
  const indices = [...ctx.rowIndexToRow.keys()];
  expect(Math.min(...indices)).toBeGreaterThanOrEqual(largeOffset);
  expect(ctx.ranges[0].rowStart).toEqual(largeOffset);
});
