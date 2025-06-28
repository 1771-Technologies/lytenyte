import { describe, test, expect } from "vitest";
import { equal } from "../equal.js";

describe("equal", () => {
  // Basic equality tests
  test("should handle primitive types", () => {
    expect(equal(1, 1)).toBe(true);
    expect(equal("test", "test")).toBe(true);
    expect(equal(true, true)).toBe(true);
    expect(equal(null, null)).toBe(true);
    expect(equal(undefined, undefined)).toBe(true);
    expect(equal(1, 2)).toBe(false);
    expect(equal("test", "test2")).toBe(false);
  });

  // NaN handling
  test("should handle NaN values", () => {
    expect(equal(NaN, NaN)).toBe(true);
    expect(equal(NaN, 1)).toBe(false);
  });

  // Array tests
  test("should handle arrays", () => {
    expect(equal([], [])).toBe(true);
    expect(equal([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(equal([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(equal([1, 2, 3], [1, 2])).toBe(false);
    expect(equal([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });

  // Object tests
  test("should handle objects", () => {
    expect(equal({}, {})).toBe(true);
    expect(equal({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(equal({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(equal({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(equal({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(equal({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);

    // Test object with property on prototype vs own property
    const proto = { b: 2 };
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };
    Object.setPrototypeOf(obj2, proto);
    expect(equal(obj1, obj2)).toBe(true); // Properties from prototype should not be considered

    // Test where second object is missing a property entirely
    const objWithProp = { a: 1, b: undefined };
    const objMissingProp = { a: 1 };
    // @ts-expect-error just for tests
    delete objMissingProp.b; // Ensure b doesn't exist, not even as undefined
    expect(equal(objWithProp, objMissingProp)).toBe(false); // Should fail at hasOwnProperty check
  });

  // Specific test for hasOwnProperty check
  test("should handle objects with properties only in prototype", () => {
    const proto = { b: 2 };
    const obj1 = { a: 1 };
    const obj2 = Object.create(proto);
    obj2.a = 1;
    expect(equal(obj1, obj2)).toBe(true); // Should be false because obj2 has 'b' in prototype

    // Test case where objects have same prototype property
    const commonProto = { shared: 1 };
    const test1 = Object.create(commonProto);
    const test2 = Object.create(commonProto);
    test1.a = 1;
    test2.a = 1;
    expect(equal(test1, test2)).toBe(true); // Should be true as they have same own properties
  });

  // Map tests
  test("should handle Maps", () => {
    const map1 = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const map2 = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const map3 = new Map([
      ["a", 1],
      ["b", 3],
    ]);
    const map4 = new Map([["a", 1]]);
    // This map has different keys to test the has() check
    const map5 = new Map([
      ["c", 1],
      ["d", 2],
    ]);

    expect(equal(map1, map2)).toBe(true);
    expect(equal(map1, map3)).toBe(false);
    expect(equal(map1, map4)).toBe(false);
    expect(equal(map1, map5)).toBe(false); // Will fail at the has() check
  });

  // Set tests
  test("should handle Sets", () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);
    const set4 = new Set([1, 2]);

    expect(equal(set1, set2)).toBe(true);
    expect(equal(set1, set3)).toBe(false);
    expect(equal(set1, set4)).toBe(false);
  });

  // TypedArray tests
  test("should handle TypedArrays", () => {
    const arr1 = new Uint8Array([1, 2, 3]);
    const arr2 = new Uint8Array([1, 2, 3]);
    const arr3 = new Uint8Array([1, 2, 4]);
    const arr4 = new Uint8Array([1, 2]);

    expect(equal(arr1, arr2)).toBe(true);
    expect(equal(arr1, arr3)).toBe(false);
    expect(equal(arr1, arr4)).toBe(false);
  });

  // RegExp tests
  test("should handle RegExp", () => {
    expect(equal(/foo/, /foo/)).toBe(true);
    expect(equal(/foo/i, /foo/i)).toBe(true);
    expect(equal(/foo/, /bar/)).toBe(false);
    expect(equal(/foo/i, /foo/)).toBe(false);
  });

  // Custom valueOf/toString tests
  test("should handle custom valueOf and toString", () => {
    const obj1 = { valueOf: () => 1 };
    const obj2 = { valueOf: () => 1 };
    const obj3 = { valueOf: () => 2 };
    expect(equal(obj1, obj2)).toBe(true);
    expect(equal(obj1, obj3)).toBe(false);

    const obj4 = { toString: () => "test" };
    const obj5 = { toString: () => "test" };
    const obj6 = { toString: () => "test2" };
    expect(equal(obj4, obj5)).toBe(true);
    expect(equal(obj4, obj6)).toBe(false);
  });

  // Function comparison tests
  test("should handle functions with compareFunctionsAsStrings", () => {
    const fn1 = function () {
      return 1;
    };
    const fn2 = function () {
      return 1;
    };
    const fn3 = function () {
      return 2;
    };

    expect(equal(fn1, fn1)).toBe(true);
    expect(equal(fn1, fn2)).toBe(false);
    expect(equal(fn1, fn2, true)).toBe(true);
    expect(equal(fn1, fn3, true)).toBe(false);
  });

  // Constructor check tests
  test("should handle objects with different constructors", () => {
    class Class1 {}
    class Class2 {}
    expect(equal(new Class1(), new Class1())).toBe(true);
    expect(equal(new Class1(), new Class2())).toBe(false);
  });

  // React element specific tests
  test("should handle React-like elements", () => {
    const reactElement1 = {
      $$typeof: Symbol.for("react.element"),
      _owner: {
        /* circular reference */
      },
      props: { a: 1 },
    };
    const reactElement2 = {
      $$typeof: Symbol.for("react.element"),
      _owner: {
        /* different circular reference */
      },
      props: { a: 1 },
    };
    expect(equal(reactElement1, reactElement2)).toBe(true);
  });
});
