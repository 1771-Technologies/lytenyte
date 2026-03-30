import { describe, expect, test } from "vitest";
import { moveRelative } from "./move-relative.js";

describe("moveRelative", () => {
  test("Should return the original array when destIndex is in additional", () => {
    const items = ["a", "b", "c", "d", "e"];
    const result = moveRelative(items, 1, 2, [2]);
    expect(result).toBe(items);
  });

  test("Should return a copy when srcIndex is negative", () => {
    const items = ["a", "b", "c"];
    const result = moveRelative(items, -1, 1);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  test("Should return a copy when srcIndex is out of bounds", () => {
    const items = ["a", "b", "c"];
    const result = moveRelative(items, 3, 1);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  test("Should return a copy when destIndex is negative", () => {
    const items = ["a", "b", "c"];
    const result = moveRelative(items, 1, -1);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  test("Should return a copy when destIndex is out of bounds", () => {
    const items = ["a", "b", "c"];
    const result = moveRelative(items, 1, 3);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  test("Should return a copy when srcIndex equals destIndex", () => {
    const items = ["a", "b", "c"];
    const result = moveRelative(items, 1, 1);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  test("Should move an item forward in the array", () => {
    const items = ["a", "b", "c", "d", "e"];
    const result = moveRelative(items, 1, 3);
    expect(result).toEqual(["a", "c", "d", "b", "e"]);
  });

  test("Should move an item backward in the array", () => {
    const items = ["a", "b", "c", "d", "e"];
    const result = moveRelative(items, 3, 1);
    expect(result).toEqual(["a", "d", "b", "c", "e"]);
  });

  test("Should move the first item to the last position", () => {
    const items = ["a", "b", "c", "d"];
    const result = moveRelative(items, 0, 3);
    expect(result).toEqual(["b", "c", "d", "a"]);
  });

  test("Should move the last item to the first position", () => {
    const items = ["a", "b", "c", "d"];
    const result = moveRelative(items, 3, 0);
    expect(result).toEqual(["d", "a", "b", "c"]);
  });

  test("Should move srcIndex and additional indices together when moving forward", () => {
    const items = ["a", "b", "c", "d", "e"];
    const result = moveRelative(items, 1, 3, [2]);
    expect(result).toEqual(["a", "d", "b", "c", "e"]);
  });

  test("Should move srcIndex and additional indices together when moving backward", () => {
    const items = ["a", "b", "c", "d", "e"];
    const result = moveRelative(items, 3, 1, [4]);
    expect(result).toEqual(["a", "d", "e", "b", "c"]);
  });

  test("Should maintain relative order of additional indices when moved", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    const result = moveRelative(items, 1, 4, [3]);
    expect(result).toEqual(["a", "c", "e", "b", "d", "f"]);
  });

  test("Should handle an array with two elements moving forward", () => {
    const items = ["a", "b"];
    const result = moveRelative(items, 0, 1);
    expect(result).toEqual(["b", "a"]);
  });

  test("Should handle an array with two elements moving backward", () => {
    const items = ["a", "b"];
    const result = moveRelative(items, 1, 0);
    expect(result).toEqual(["b", "a"]);
  });

  test("Should work with numeric arrays", () => {
    const items = [10, 20, 30, 40, 50];
    const result = moveRelative(items, 0, 4);
    expect(result).toEqual([20, 30, 40, 50, 10]);
  });
});
