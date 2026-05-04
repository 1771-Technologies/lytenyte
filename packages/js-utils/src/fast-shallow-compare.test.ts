import { describe, test, expect } from "vitest";
import { fastShallowCompare } from "./fast-shallow-compare.js";

describe("fastShallowCompare", () => {
  test("Should return true for the same object reference", () => {
    const obj = { a: 1 };
    expect(fastShallowCompare(obj, obj)).toBe(true);
  });

  test("Should return true for shallowly equal objects", () => {
    const a = { x: 10, y: "hello" };
    const b = { x: 10, y: "hello" };
    expect(fastShallowCompare(a, b)).toBe(true);
  });

  test("Should return false for objects with different values", () => {
    const a = { x: 10, y: "hello" };
    const b = { x: 10, y: "world" };
    expect(fastShallowCompare(a, b)).toBe(false);
  });

  test("Should return false for objects with different keys", () => {
    const a = { x: 10, y: "hello" };
    const b = { x: 10, z: "hello" };
    expect(fastShallowCompare(a, b as any)).toBe(false);
  });

  test("Should return false for objects with different number of keys", () => {
    const a = { x: 10 };
    const b = { x: 10, y: 20 };
    expect(fastShallowCompare(a, b)).toBe(false);
  });

  test("Should return false for objects with different number of keys (a has key b does not)", () => {
    const a = { t: undefined, x: 10 };
    const b = { x: 10 };
    expect(fastShallowCompare(a, b as any)).toBe(false);
  });

  test("Should return true for two empty objects", () => {
    expect(fastShallowCompare({}, {})).toBe(true);
  });

  test("Should return false if one input is null", () => {
    expect(fastShallowCompare(null, { x: 1 })).toBe(false);
    expect(fastShallowCompare({ x: 1 }, null)).toBe(false);
  });

  test("Should return true if both inputs are null", () => {
    expect(fastShallowCompare(null, null)).toBe(true);
  });

  test("Should return false if one input is not an object", () => {
    expect(fastShallowCompare({ x: 1 }, 5 as any)).toBe(false);
    expect(fastShallowCompare(5 as any, { x: 1 })).toBe(false);
  });

  test("Should distinguish between NaN and other values correctly using Object.is", () => {
    const a = { value: NaN };
    const b = { value: NaN };
    expect(fastShallowCompare(a, b)).toBe(true);
  });

  test("Should distinguish -0 and +0 correctly using Object.is", () => {
    const a = { zero: -0 };
    const b = { zero: +0 };
    expect(fastShallowCompare(a, b)).toBe(false);
  });
});
