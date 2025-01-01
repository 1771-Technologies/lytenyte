import type { BlockPaths, BlockStore } from "../../types.js";
import { blockStoreDelete } from "../block-store-delete.js";
import { makeRowNodes } from "./make-row-nodes.js";
import { prettyPrintBlockPaths } from "./pretty-print-block.js";

let lookup: BlockPaths;

beforeEach(() => {
  // Setup fresh lookup for each test
  lookup = new Map();

  const alphaX: BlockStore = { size: 10, map: new Map() };
  const alphaY: BlockStore = { size: 10, map: new Map() };
  const betaX: BlockStore = { size: 10, map: new Map() };
  const betaY: BlockStore = { size: 10, map: new Map() };
  const alpha: BlockStore = {
    size: 10,
    map: new Map([
      [
        0,
        {
          data: makeRowNodes([
            [2, "x"],
            [1, ""],
          ]),
          index: 0,
        },
      ],
      [
        1,
        {
          data: makeRowNodes([
            [2, "y"],
            [1, ""],
          ]),
          index: 0,
        },
      ],
    ]),
  };

  lookup.set("alpha", alpha);
  lookup.set("alpha/x", alphaX);
  lookup.set("alpha/y", alphaY);
  lookup.set("beta/x", betaX);
  lookup.set("beta/y", betaY);
  lookup.set("beta", { size: 10, map: new Map() });
});

test("should correctly delete root level blocks and their children", () => {
  blockStoreDelete("alpha", lookup, "/");

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
      "PATH                          BLOCKS    SIZE      DATA
      ────────────────────────────────────────────────────────────────────────────────
      beta                          0         10        
        beta/x                      0         10        
        beta/y                      0         10        "
    `);
});

test("should correctly delete nested blocks without affecting siblings", () => {
  blockStoreDelete("alpha/x", lookup, "/");

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         2         10        0=[2:x, 1:""], 1=[2:y, 1:""]
      alpha/y                     0         10        
    beta                          0         10        
      beta/x                      0         10        
      beta/y                      0         10        "
  `);
});

test("should handle non-existent paths gracefully", () => {
  blockStoreDelete("gamma", lookup, "/");

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         2         10        0=[2:x, 1:""], 1=[2:y, 1:""]
      alpha/x                     0         10        
      alpha/y                     0         10        
    beta                          0         10        
      beta/x                      0         10        
      beta/y                      0         10        "
  `);
});

test("should work with different separators", () => {
  const dotLookup: BlockPaths = new Map([
    ["alpha.x", { size: 10, map: new Map() }],
    ["alpha.y", { size: 10, map: new Map() }],
  ]);

  blockStoreDelete("alpha.x", dotLookup, ".");
  expect(dotLookup.has("alpha.x")).toBe(false);
  expect(dotLookup.has("alpha.y")).toBe(true);
});

test("should handle empty paths", () => {
  blockStoreDelete("", lookup, "/");
  expect(lookup.size).toBe(6); // Should not delete anything
});

test("should handle paths with special characters", () => {
  lookup.set("special/path/with spaces", { size: 10, map: new Map() });
  lookup.set("special/path/with@special#chars", { size: 10, map: new Map() });

  blockStoreDelete("special/path/with spaces", lookup, "/");
  expect(lookup.has("special/path/with spaces")).toBe(false);
  expect(lookup.has("special/path/with@special#chars")).toBe(true);
});

test("should be case sensitive", () => {
  lookup.set("CaseSensitive/Path", { size: 10, map: new Map() });

  blockStoreDelete("casesensitive/path", lookup, "/");
  expect(lookup.has("CaseSensitive/Path")).toBe(true);

  blockStoreDelete("CaseSensitive/Path", lookup, "/");
  expect(lookup.has("CaseSensitive/Path")).toBe(false);
});

test("should delete all nested paths when deleting a parent", () => {
  lookup.set("nested/path/one", { size: 10, map: new Map() });
  lookup.set("nested/path/two", { size: 10, map: new Map() });
  lookup.set("nested/other", { size: 10, map: new Map() });

  blockStoreDelete("nested/path", lookup, "/");

  expect(lookup.has("nested/path/one")).toBe(false);
  expect(lookup.has("nested/path/two")).toBe(false);
  expect(lookup.has("nested/other")).toBe(true);
});
