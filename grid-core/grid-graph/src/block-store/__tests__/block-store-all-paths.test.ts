import { ROW_GROUP_KIND, ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import { blockStoreAllPaths } from "../block-store-all-paths.js";
import type { Block, BlockStore } from "../../types.js";
import type { RowNodeCore } from "@1771technologies/grid-types/core";

const lookup = createTestMap();
test("returns an empty array when path not found in lookup", () => {
  const results = blockStoreAllPaths("non-existent", lookup, "/");

  expect(results).toEqual(new Set(["non-existent"]));
});

test("returns all the children for top level node", () => {
  const results = blockStoreAllPaths("A", lookup, "/");
  expect(results).toEqual(new Set(["A", "A/B", "A/C", "A/B/D", "A/B/E"]));
});

test("returns all the children for a middle level node", () => {
  const results = blockStoreAllPaths("A/B", lookup, "/");
  expect(results).toEqual(new Set(["A/B", "A/B/D", "A/B/E"]));
});

test("returns all the children for the lowest level node", () => {
  const results = blockStoreAllPaths("A/B/E", lookup, "/");
  expect(results).toEqual(new Set(["A/B/E"]));
});

test("returns all the children for a top level node that is also a root", () => {
  const results = blockStoreAllPaths("F", lookup, "/");
  expect(results).toEqual(new Set(["F"]));
});

function createBlock(data: { kind: number; pathKey: string }[]): Block<any> {
  return { data: data as RowNodeCore<any>[], index: 0 };
}

function createBlockMap(data: { kind: number; pathKey: string }[]): BlockStore<any> {
  return {
    size: 1,
    map: new Map([[0, createBlock(data)]]),
  };
}

function createTestMap() {
  return new Map<string, BlockStore<any>>([
    [
      "A",
      createBlockMap([
        { kind: ROW_GROUP_KIND, pathKey: "B" },
        { kind: ROW_GROUP_KIND, pathKey: "C" },
        { kind: ROW_LEAF_KIND, pathKey: "F" },
      ]),
    ],
    [
      "A/B",
      createBlockMap([
        { kind: ROW_GROUP_KIND, pathKey: "D" },
        { kind: ROW_GROUP_KIND, pathKey: "E" },
      ]),
    ],
    ["A/C", createBlockMap([{ kind: ROW_LEAF_KIND, pathKey: "leaf1" }])],
    ["A/B/D", createBlockMap([{ kind: ROW_LEAF_KIND, pathKey: "leaf2" }])],
    ["A/B/E", createBlockMap([{ kind: ROW_LEAF_KIND, pathKey: "leaf3" }])],
    ["F", createBlockMap([{ kind: ROW_LEAF_KIND, pathKey: "leaf4" }])],
    ["G", createBlockMap([{ kind: ROW_GROUP_KIND, pathKey: "H" }])],
    ["G/H", createBlockMap([{ kind: ROW_LEAF_KIND, pathKey: "leaf5" }])],
  ]);
}
