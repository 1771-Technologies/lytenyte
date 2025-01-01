import type { Block, BlockPaths } from "../../types.js";
import { blockStoreDeleteByNodes } from "../block-store-delete-by-nodes.js";
import { makeRowNodes } from "./make-row-nodes.js";
import { prettyPrintBlockPaths } from "./pretty-print-block.js";

let lookup: BlockPaths;

beforeEach(() => {
  lookup = new Map();
  // Setup base structure
  lookup.set("alpha", {
    size: 20,
    map: new Map([
      [
        0,
        {
          data: makeRowNodes([
            [2, "x"],
            [1, ""],
          ]),
          index: 0,
        } satisfies Block,
      ],
      [
        1,
        {
          data: makeRowNodes([
            [2, "y"],
            [1, ""],
            [1, ""],
          ]),
          index: 2,
        } satisfies Block,
      ],
    ]),
  });
  lookup.set("alpha/x", { size: 20, map: new Map() });
  lookup.set("alpha/y", { size: 20, map: new Map() });
  lookup.set("alpha/z", { size: 20, map: new Map() });
});

test("should delete the correct store nodes", () => {
  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "x"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         2         20        0=[2:x, 1:""], 1=[2:y, 1:"", 1:""]
      alpha/y                     0         20        
      alpha/z                     0         20        "
  `);
});

test("should handle multiple row groups in nodes array", () => {
  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "x"],
      [1, ""],
      [2, "y"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
      "PATH                          BLOCKS    SIZE      DATA
      ────────────────────────────────────────────────────────────────────────────────
      alpha                         2         20        0=[2:x, 1:""], 1=[2:y, 1:"", 1:""]
        alpha/z                     0         20        "
    `);
});

test("should ignore non-row-group nodes", () => {
  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [1, ""], // Non-row-group node
      [2, "x"], // Row group node
      [1, ""], // Non-row-group node
    ]),
    lookup,
    "/",
  );

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
      "PATH                          BLOCKS    SIZE      DATA
      ────────────────────────────────────────────────────────────────────────────────
      alpha                         2         20        0=[2:x, 1:""], 1=[2:y, 1:"", 1:""]
        alpha/y                     0         20        
        alpha/z                     0         20        "
    `);
});

test("should handle empty nodes array", () => {
  blockStoreDeleteByNodes("alpha", [], lookup, "/");

  expect(lookup.size).toBe(4);
});

test("should work with different separators", () => {
  const dotLookup: BlockPaths = new Map();
  dotLookup.set("alpha.x", { size: 20, map: new Map() });
  dotLookup.set("alpha.y", { size: 20, map: new Map() });

  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "x"],
      [1, ""],
    ]),
    dotLookup,
    ".",
  );

  expect(dotLookup.has("alpha.x")).toBe(false);
  expect(dotLookup.has("alpha.y")).toBe(true);
});

test("should handle nested paths", () => {
  lookup.set("alpha/x/sub1", { size: 20, map: new Map() });
  lookup.set("alpha/x/sub2", { size: 20, map: new Map() });

  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "x"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(lookup.has("alpha/x")).toBe(false);
  expect(lookup.has("alpha/x/sub1")).toBe(false);
  expect(lookup.has("alpha/x/sub2")).toBe(false);
  expect(lookup.has("alpha/y")).toBe(true);
});

test("should handle multiple calls with overlapping paths", () => {
  // First deletion
  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "x"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  // Second deletion with overlapping path
  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "x"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         2         20        0=[2:x, 1:""], 1=[2:y, 1:"", 1:""]
      alpha/y                     0         20        
      alpha/z                     0         20        "
  `);
});

test("should handle nodes with special characters in pathKey", () => {
  lookup.set("alpha/special@path", { size: 20, map: new Map() });

  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "special@path"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(lookup.has("alpha/special@path")).toBe(false);
});

test("should be case sensitive with pathKeys", () => {
  lookup.set("alpha/CaseSensitive", { size: 20, map: new Map() });

  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "casesensitive"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(lookup.has("alpha/CaseSensitive")).toBe(true);

  blockStoreDeleteByNodes(
    "alpha",
    makeRowNodes([
      [2, "CaseSensitive"],
      [1, ""],
    ]),
    lookup,
    "/",
  );

  expect(lookup.has("alpha/CaseSensitive")).toBe(false);
});
