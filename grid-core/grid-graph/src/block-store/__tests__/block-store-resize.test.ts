import { test, expect, beforeEach } from "vitest";
import type { BlockPaths, BlockStore, Block } from "../../types.js";
import { blockStoreResize } from "../block-store-resize.js";
import type { RowNodeCore } from "@1771technologies/grid-types/core";

const ROW_GROUP_KIND = 2;
const ROW_LEAF_KIND = 1;

let lookup: BlockPaths;

function createBlock(data: { kind: number; pathKey: string }[], index: number): Block<any> {
  return { data: data as RowNodeCore<any>[], index };
}

function createBlockMap(
  data: Array<{ kind: number; pathKey: string }[]>,
  size: number,
): BlockStore<any> {
  return {
    size,
    map: new Map(data.map((blockData, index) => [index, createBlock(blockData, index)])),
  };
}

function createTestLookup() {
  return new Map<string, BlockStore<any>>([
    [
      "root",
      createBlockMap(
        [
          // Block 0: 0-49
          Array.from({ length: 50 }, (_, i) => ({
            kind: i % 2 === 0 ? ROW_GROUP_KIND : ROW_LEAF_KIND,
            pathKey: `item${i}`,
          })),
          // Block 1: 50-99
          Array.from({ length: 50 }, (_, i) => ({
            kind: ROW_LEAF_KIND,
            pathKey: `item${i + 50}`,
          })),
          // Block 2: 100-149
          Array.from({ length: 50 }, (_, i) => ({
            kind: ROW_GROUP_KIND,
            pathKey: `item${i + 100}`,
          })),
          // Block 3: 150-199
          Array.from({ length: 50 }, (_, i) => ({
            kind: ROW_LEAF_KIND,
            pathKey: `item${i + 150}`,
          })),
        ],
        200,
      ),
    ],
  ]);
}

beforeEach(() => {
  lookup = createTestLookup();
});

test("should do nothing if path does not exist", () => {
  blockStoreResize("nonexistent", 100, 50, lookup, "/");
  expect(lookup.size).toBe(1);
});

test("should update size and remove blocks that are completely outside new size", () => {
  blockStoreResize("root", 120, 50, lookup, "/");

  const rootStore = lookup.get("root");
  expect(rootStore?.size).toBe(120);
});

test("should truncate the last block when it partially exceeds new size", () => {
  blockStoreResize("root", 175, 50, lookup, "/");

  const rootStore = lookup.get("root");
  const lastBlock = rootStore?.map.get(3);

  expect(rootStore?.size).toBe(175);
  expect(lastBlock?.data.length).toBe(25); // Last block should only have items up to 175
  expect(rootStore?.map.size).toBe(4); // Should keep all blocks but truncate the last one
});

test("should not modify blocks that fit within new size", () => {
  const originalFirstBlock = lookup.get("root")?.map.get(0)?.data;

  blockStoreResize("root", 175, 50, lookup, "/");

  const newFirstBlock = lookup.get("root")?.map.get(0)?.data;
  expect(newFirstBlock).toEqual(originalFirstBlock);
});

test("should handle resizing to exactly block size boundaries", () => {
  blockStoreResize("root", 150, 50, lookup, "/");

  const rootStore = lookup.get("root");
  expect(rootStore?.size).toBe(150);
  expect(rootStore?.map.get(2)?.data.length).toBe(50); // Last block should be complete
});

test("should handle resizing to larger size", () => {
  const originalStoreSize = lookup.get("root")?.map.size;

  blockStoreResize("root", 250, 50, lookup, "/");

  const rootStore = lookup.get("root");
  expect(rootStore?.size).toBe(250);
  expect(rootStore?.map.size).toBe(originalStoreSize); // Should not add new blocks
});

test("should handle resizing to zero", () => {
  blockStoreResize("root", 0, 50, lookup, "/");

  const rootStore = lookup.get("root");
  expect(rootStore?.size).toBe(0);
});

test("should handle resizing with different block sizes", () => {
  // Create a new lookup with different block size
  lookup = new Map([
    [
      "root",
      createBlockMap(
        [
          Array.from({ length: 30 }, (_, i) => ({
            kind: ROW_LEAF_KIND,
            pathKey: `item${i}`,
          })),
          Array.from({ length: 30 }, (_, i) => ({
            kind: ROW_LEAF_KIND,
            pathKey: `item${i + 30}`,
          })),
        ],
        60,
      ),
    ],
  ]);

  blockStoreResize("root", 45, 30, lookup, "/");

  const rootStore = lookup.get("root");
  expect(rootStore?.size).toBe(45);
  expect(rootStore?.map.size).toBe(2);
  expect(rootStore?.map.get(1)?.data.length).toBe(15); // Last block should be truncated
});
