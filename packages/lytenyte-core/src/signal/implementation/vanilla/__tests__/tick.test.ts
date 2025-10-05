import { afterEach, describe, expect, test, vi } from "vitest";
import { tick } from "../primitives.js";
import { signal, effect } from "../signal.js";

describe("tick", () => {
  afterEach(() => tick());

  test("should batch updates", () => {
    const $a = signal(10);
    const $effect = vi.fn(() => void $a());

    effect($effect);

    $a.set(20);
    $a.set(30);
    $a.set(40);

    expect($effect).to.toHaveBeenCalledTimes(1);
    tick();
    expect($effect).to.toHaveBeenCalledTimes(2);
  });

  test("should wait for queue to flush", () => {
    const $a = signal(10);
    const $effect = vi.fn(() => void $a());

    effect($effect);

    expect($effect).to.toHaveBeenCalledTimes(1);

    $a.set(20);
    tick();
    expect($effect).to.toHaveBeenCalledTimes(2);

    $a.set(30);
    tick();
    expect($effect).to.toHaveBeenCalledTimes(3);
  });

  test("should not fail if called while flushing", () => {
    const $a = signal(10);
    const $effect = vi.fn(() => {
      $a();
      tick();
    });

    effect(() => {
      $effect();
    });

    expect($effect).to.toHaveBeenCalledTimes(1);

    $a.set(20);
    tick();
    expect($effect).to.toHaveBeenCalledTimes(2);
  });
});
