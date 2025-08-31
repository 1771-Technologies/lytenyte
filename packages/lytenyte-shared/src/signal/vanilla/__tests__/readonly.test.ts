import { afterEach, describe, expect, test } from "vitest";
import { tick } from "../primitives.js";
import { readonly, signal } from "../signal.js";

describe("readonly", () => {
  afterEach(() => tick());

  test("should create readonly proxy", () => {
    const $a = signal(10);
    const $b = readonly($a);

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      $b.set(10);
    }).toThrow();

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      $b.set((n) => n + 10);
    }).toThrow();

    tick();
    expect($b()).toBe(10);

    $a.set(20);
    tick();
    expect($b()).toBe(20);
  });
});
