import { isPromise } from "../is-promise.js";

describe("isPromise", () => {
  test("should return true for native Promises", () => {
    const promise = Promise.resolve(42);
    expect(isPromise(promise)).toBe(true);
  });

  test("should return true for Promise-like objects", () => {
    const promiseLike = {
      then: () => {},
    };
    expect(isPromise(promiseLike)).toBe(true);
  });

  test("should return true for Promise-like objects with additional properties", () => {
    const promiseLike = {
      then: () => {},
      catch: () => {},
      finally: () => {},
    };
    expect(isPromise(promiseLike)).toBe(true);
  });

  test("should return false for null", () => {
    expect(isPromise(null)).toBe(false);
  });

  test("should return false for undefined", () => {
    expect(isPromise(undefined)).toBe(false);
  });

  test("should return false for primitive values", () => {
    expect(isPromise(42)).toBe(false);
    expect(isPromise("string")).toBe(false);
    expect(isPromise(true)).toBe(false);
    expect(isPromise(Symbol())).toBe(false);
    expect(isPromise(BigInt(42))).toBe(false);
  });

  test("should return false for objects without then property", () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise({ catch: () => {} })).toBe(false);
    expect(isPromise({ finally: () => {} })).toBe(false);
  });

  test("should return false for arrays", () => {
    expect(isPromise([])).toBe(false);
    expect(isPromise([Promise.resolve()])).toBe(false);
  });

  test("should return false for functions", () => {
    expect(isPromise(() => {})).toBe(false);
    expect(isPromise(async () => {})).toBe(false);
  });

  test("should handle async/await syntax", async () => {
    const asyncFunction = async () => 42;
    const promise = asyncFunction();
    expect(isPromise(promise)).toBe(true);
    await promise;
  });

  test("should return true for rejected promises", () => {
    const rejectedPromise = Promise.reject(new Error("test")).catch(() => {});
    expect(isPromise(rejectedPromise)).toBe(true);
  });

  test("should return true for pending promises", () => {
    const pendingPromise = new Promise(() => {});
    expect(isPromise(pendingPromise)).toBe(true);
  });

  test("should maintain type safety with generics", () => {
    const numberPromise: Promise<number> = Promise.resolve(42);
    const stringPromise: Promise<string> = Promise.resolve("test");

    expect(isPromise(numberPromise)).toBe(true);
    expect(isPromise(stringPromise)).toBe(true);
  });
});
