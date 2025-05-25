import { describe, expect, test } from "vitest";
import { isFunction } from "../is-function";

describe("isFunction", () => {
  test("returns true for regular functions", () => {
    function fn() {}
    const arrow = () => {};

    expect(isFunction(fn)).toBe(true);
    expect(isFunction(arrow)).toBe(true);
  });

  test("returns true for async and generator functions", () => {
    async function asyncFn() {}
    function* generatorFn() {}

    expect(isFunction(asyncFn)).toBe(true);
    expect(isFunction(generatorFn)).toBe(true);
  });

  test("returns true for built-in functions", () => {
    expect(isFunction(Math.max)).toBe(true);
    expect(isFunction(setTimeout)).toBe(true);
  });

  test("returns false for non-functions", () => {
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction("function")).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });

  test("returns false for class instances and constructors", () => {
    class MyClass {}
    const instance = new MyClass();

    expect(isFunction(MyClass)).toBe(true); // class constructor is a function
    expect(isFunction(instance)).toBe(false); // instance is not
  });
});
