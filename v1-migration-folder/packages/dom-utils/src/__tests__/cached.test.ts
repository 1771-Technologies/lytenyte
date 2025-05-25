import { describe, expect, test, vi } from "vitest";
import { cached } from "../cached";

describe("cached", () => {
  test("should correctly cache the result", () => {
    const fn = vi.fn(() => false);

    const cachedFn = cached(fn);
    expect(cachedFn()).toEqual(false);

    expect(fn).toHaveBeenCalledOnce();
    cachedFn();
    expect(fn).toHaveBeenCalledOnce();
  });
});
