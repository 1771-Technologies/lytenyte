import { describe, test, expect } from "vitest";
import { clampOffset } from "./clamp-offset.js";

describe("clampOffset", () => {
  test("Should return the offset when within bounds", () => {
    expect(clampOffset("hello", 3)).toBe(3);
  });

  test("Should return 0 for negative offsets", () => {
    expect(clampOffset("hello", -5)).toBe(0);
  });

  test("Should return source length for offsets beyond the end", () => {
    expect(clampOffset("hello", 100)).toBe(5);
  });

  test("Should return 0 for offset 0", () => {
    expect(clampOffset("hello", 0)).toBe(0);
  });

  test("Should return source length for offset equal to length", () => {
    expect(clampOffset("hello", 5)).toBe(5);
  });

  test("Should return 0 for empty source with any offset", () => {
    expect(clampOffset("", 5)).toBe(0);
  });

  test("Should return 0 for empty source with negative offset", () => {
    expect(clampOffset("", -1)).toBe(0);
  });
});
