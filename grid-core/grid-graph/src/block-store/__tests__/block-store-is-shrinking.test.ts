import type { BlockPaths } from "../../types.js";
import { blockStoreIsShrinking } from "../block-store-is-shrinking.js";

let lookup: BlockPaths;

beforeEach(() => {
  lookup = new Map();

  // Setup some blocks with different sizes
  lookup.set("normal", { size: 100, map: new Map() });
  lookup.set("small", { size: 10, map: new Map() });
  lookup.set("large", { size: 1000, map: new Map() });
  lookup.set("zero", { size: 0, map: new Map() });
});

test("should return true when new size is smaller than current size", () => {
  expect(blockStoreIsShrinking("normal", 50, lookup)).toBe(true);
  expect(blockStoreIsShrinking("large", 500, lookup)).toBe(true);
});

test("should return false when new size is larger than current size", () => {
  expect(blockStoreIsShrinking("normal", 200, lookup)).toBe(false);
  expect(blockStoreIsShrinking("small", 20, lookup)).toBe(false);
});

test("should return false when new size equals current size", () => {
  expect(blockStoreIsShrinking("normal", 100, lookup)).toBe(false);
  expect(blockStoreIsShrinking("zero", 0, lookup)).toBe(false);
});

test("should return false for non-existent paths", () => {
  expect(blockStoreIsShrinking("nonexistent", 50, lookup)).toBe(false);
  expect(blockStoreIsShrinking("", 50, lookup)).toBe(false);
});

test("should handle zero and negative sizes", () => {
  expect(blockStoreIsShrinking("normal", 0, lookup)).toBe(true);
  expect(blockStoreIsShrinking("normal", -10, lookup)).toBe(true);
  expect(blockStoreIsShrinking("zero", -1, lookup)).toBe(true);
});

test("should handle extremely large size differences", () => {
  lookup.set("huge", { size: Number.MAX_SAFE_INTEGER, map: new Map() });

  expect(blockStoreIsShrinking("huge", 1, lookup)).toBe(true);
  expect(blockStoreIsShrinking("huge", Number.MAX_SAFE_INTEGER - 1, lookup)).toBe(true);
  expect(blockStoreIsShrinking("huge", Number.MAX_SAFE_INTEGER, lookup)).toBe(false);
});

test("should work with nested paths", () => {
  lookup.set("parent/child", { size: 100, map: new Map() });

  expect(blockStoreIsShrinking("parent/child", 50, lookup)).toBe(true);
  expect(blockStoreIsShrinking("parent/child", 150, lookup)).toBe(false);
  expect(blockStoreIsShrinking("parent", 50, lookup)).toBe(false); // non-existent parent
});

test("should handle special characters in paths", () => {
  lookup.set("special@path#123", { size: 100, map: new Map() });

  expect(blockStoreIsShrinking("special@path#123", 50, lookup)).toBe(true);
  expect(blockStoreIsShrinking("special@path#123", 150, lookup)).toBe(false);
});

test("should be case sensitive with paths", () => {
  lookup.set("CaseSensitive", { size: 100, map: new Map() });

  expect(blockStoreIsShrinking("CaseSensitive", 50, lookup)).toBe(true);
  expect(blockStoreIsShrinking("casesensitive", 50, lookup)).toBe(false);
});
