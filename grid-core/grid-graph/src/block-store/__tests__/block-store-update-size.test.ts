import type { BlockPaths } from "../../types.js";
import { blockStoreUpdateSize } from "../block-store-update-size.js";

let lookup: BlockPaths;

beforeEach(() => {
  lookup = new Map();

  // Setup initial blocks with different sizes
  lookup.set("normal", { size: 100, map: new Map() });
  lookup.set("small", { size: 10, map: new Map() });
  lookup.set("zero", { size: 0, map: new Map() });
  lookup.set("nested/path", { size: 50, map: new Map() });
});

test("should update size to a positive number", () => {
  blockStoreUpdateSize("normal", 200, lookup);
  expect(lookup.get("normal")?.size).toBe(200);
});

test("should update to zero when given zero", () => {
  blockStoreUpdateSize("normal", 0, lookup);
  expect(lookup.get("normal")?.size).toBe(0);
});

test("should clamp negative numbers to zero", () => {
  blockStoreUpdateSize("normal", -50, lookup);
  expect(lookup.get("normal")?.size).toBe(0);
});

test("should handle updating from zero", () => {
  blockStoreUpdateSize("zero", 100, lookup);
  expect(lookup.get("zero")?.size).toBe(100);
});

test("should not modify other properties of the block", () => {
  const originalMap = lookup.get("normal")?.map;
  blockStoreUpdateSize("normal", 200, lookup);
  expect(lookup.get("normal")?.map).toBe(originalMap);
});

test("should handle non-existent paths", () => {
  blockStoreUpdateSize("nonexistent", 100, lookup);
  expect(lookup.has("nonexistent")).toBe(false);
});

test("should handle empty path", () => {
  blockStoreUpdateSize("", 100, lookup);
  expect(lookup.has("")).toBe(false);
});

test("should handle nested paths", () => {
  blockStoreUpdateSize("nested/path", 75, lookup);
  expect(lookup.get("nested/path")?.size).toBe(75);
});

test("should handle updating to same size", () => {
  const originalSize = lookup.get("normal")?.size;
  blockStoreUpdateSize("normal", originalSize!, lookup);
  expect(lookup.get("normal")?.size).toBe(originalSize);
});

test("should handle extremely large numbers", () => {
  blockStoreUpdateSize("normal", Number.MAX_SAFE_INTEGER, lookup);
  expect(lookup.get("normal")?.size).toBe(Number.MAX_SAFE_INTEGER);
});

test("should be case sensitive with paths", () => {
  lookup.set("CaseSensitive", { size: 100, map: new Map() });

  blockStoreUpdateSize("casesensitive", 200, lookup);
  expect(lookup.get("CaseSensitive")?.size).toBe(100); // unchanged

  blockStoreUpdateSize("CaseSensitive", 200, lookup);
  expect(lookup.get("CaseSensitive")?.size).toBe(200); // changed
});

test("should handle paths with special characters", () => {
  lookup.set("special@path#123", { size: 100, map: new Map() });

  blockStoreUpdateSize("special@path#123", 200, lookup);
  expect(lookup.get("special@path#123")?.size).toBe(200);
});

test("should handle fractional numbers by not rounding", () => {
  blockStoreUpdateSize("normal", 100.5, lookup);
  expect(lookup.get("normal")?.size).toBe(100.5);
});
