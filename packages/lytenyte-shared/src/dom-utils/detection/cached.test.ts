import { describe, expect, test, vi } from "vitest";
import { cached } from "./cached.js";

describe("cached", () => {
  test("Should cache the function result", () => {
    const fn = vi.fn(() => true);

    const cachedFn = cached(fn);
    expect(cachedFn()).toEqual(true);
    expect(cachedFn()).toEqual(true);
    expect(cachedFn()).toEqual(true);
    expect(fn).toHaveBeenCalledOnce();
    cachedFn.__clear();
    expect(cachedFn()).toEqual(true);
    expect(cachedFn()).toEqual(true);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
