import { afterEach, describe, expect, it as test } from "vitest";
import { computed, effect, isWriteSignal, readonly, signal } from "../signal.js";
import { tick } from "../primitives.js";

describe("isWriteSignal", () => {
  afterEach(() => tick());

  test("should return true given subject", () => {
    expect(isWriteSignal(signal(10))).toBe(true);
  });

  test("should return false if given non-subject", () => {
    (
      [
        false,
        null,
        undefined,
        () => {},
        computed(() => 10),
        readonly(signal(10)),
        effect(() => {}),
      ] as const
    ).forEach((type) => expect(isWriteSignal(type)).toBe(false));
  });
});
