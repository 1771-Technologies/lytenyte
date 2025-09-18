import { afterEach, describe, expect, test } from "vitest";
import { signal } from "../signal.js";
import { tick } from "../primitives.js";

describe("signal", () => {
  afterEach(() => tick());

  test("should store and return value on read", () => {
    const $a = signal(10);
    expect($a).toBeInstanceOf(Function);
    expect($a()).toBe(10);
  });

  test("should update signal via `set()`", () => {
    const $a = signal(10);
    $a.set(20);
    expect($a()).toBe(20);
  });

  test("should update signal via next function", () => {
    const $a = signal(10);
    $a.set((n) => n + 10);
    expect($a()).toBe(20);
  });

  test("should accept dirty option", () => {
    const $a = signal(10, {
      // Skip odd numbers.
      dirty: (prev, next) => prev + 1 !== next,
    });

    $a.set(11);
    tick();
    expect($a()).toBe(10);

    $a.set(12);
    tick();
    expect($a()).toBe(12);

    $a.set(13);
    tick();
    expect($a()).toBe(12);
  });

  test("should update signal with functional value", () => {
    const $a = signal<() => number>(() => 10);
    expect($a()()).toBe(10);
    $a.set(() => () => 20);
    expect($a()()).toBe(20);
  });
});
