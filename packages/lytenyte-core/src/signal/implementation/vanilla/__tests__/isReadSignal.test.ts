import { afterEach, describe, expect, it } from "vitest";
import { tick } from "../primitives.js";
import { signal, readonly, computed, isReadSignal } from "../signal.js";

describe("isReadSignal", () => {
  afterEach(() => tick());

  it("should return true if given signal", () => {
    [signal(10), readonly(signal(10)), computed(() => 10)].forEach((type) => {
      expect(isReadSignal(type)).toBe(true);
    });
  });

  it("should return false if given non-signal", () => {
    ([false, null, undefined, () => {}] as const).forEach((type) => expect(isReadSignal(type)).toBe(false));
  });
});
