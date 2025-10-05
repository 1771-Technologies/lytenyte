import { describe, expect, test, vi } from "vitest";
import { signal } from "../signal.js";
import { computedMap } from "../map.js";
import { tick } from "../primitives.js";

describe("computedMap", () => {
  test("should compute map", () => {
    const source = signal([1, 2, 3]);
    const compute = vi.fn();

    const map = computedMap(source, (value, index) => {
      compute();
      return {
        i: index,
        get id() {
          return value() * 2;
        },
      };
    });

    const [a, b, c] = map();
    expect(a.i).toBe(0);
    expect(a.id).toBe(2);
    expect(b.i).toBe(1);
    expect(b.id).toBe(4);
    expect(c.i).toBe(2);
    expect(c.id).toBe(6);
    expect(compute).toHaveBeenCalledTimes(3);

    // Move values around
    source.set([3, 2, 1]);
    tick();

    const [a2, b2, c2] = map();
    expect(a2.i).toBe(0);
    expect(a2.id).toBe(6);
    expect(a === a2).toBeTruthy();
    expect(b2.i).toBe(1);
    expect(b2.id).toBe(4);
    expect(b === b2).toBeTruthy();
    expect(c2.i).toBe(2);
    expect(c2.id).toBe(2);
    expect(c === c2).toBeTruthy();
    expect(compute).toHaveBeenCalledTimes(3);

    // Add new value
    source.set([3, 2, 1, 4]);
    tick();

    expect(map().length).toBe(4);
    expect(map()[map().length - 1].i).toBe(3);
    expect(map()[map().length - 1].id).toBe(8);
    expect(compute).toHaveBeenCalledTimes(4);

    // Remove value
    source.set([2, 1, 4]);
    tick();

    expect(map().length).toBe(3);
    expect(map()[0].id).toBe(4);

    // Empty
    source.set([]);
    tick();

    expect(map().length).toBe(0);
    expect(compute).toHaveBeenCalledTimes(4);
  });
});
