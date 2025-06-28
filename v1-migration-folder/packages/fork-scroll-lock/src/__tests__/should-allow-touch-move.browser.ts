import { expect, test, beforeEach, afterEach, describe } from "vitest";
import { shouldAllowTouchMove } from "../should-allow-touch-move.js";
import { bslGlobals } from "../+globals.bsl.js";

beforeEach(() => {
  bslGlobals.locks = [];
});

afterEach(() => {
  bslGlobals.locks = [];
});

describe("shouldAllowTouchMove", () => {
  test("returns false when no locks are present", () => {
    const el = document.createElement("div");
    expect(shouldAllowTouchMove(el)).toBe(false);
  });

  test("returns false when locks exist but none allow touch", () => {
    const el = document.createElement("div");

    bslGlobals.locks = [
      { targetElement: document.createElement("div"), options: {} },
      {
        targetElement: document.createElement("div"),
        options: { allowTouchMove: () => false },
      },
    ];

    expect(shouldAllowTouchMove(el)).toBe(false);
  });

  test("returns true when a lock's allowTouchMove returns true", () => {
    const el = document.createElement("div");

    bslGlobals.locks = [
      {
        targetElement: document.createElement("div"),
        options: {
          allowTouchMove: (target) => target === el,
        },
      },
    ];

    expect(shouldAllowTouchMove(el)).toBe(true);
  });

  test("returns true if any lock allows touch, even if others don’t", () => {
    const el = document.createElement("div");

    bslGlobals.locks = [
      {
        targetElement: document.createElement("div"),
        options: { allowTouchMove: () => false },
      },
      {
        targetElement: document.createElement("div"),
        options: { allowTouchMove: () => true },
      },
      {
        targetElement: document.createElement("div"),
        options: {},
      },
    ];

    expect(shouldAllowTouchMove(el)).toBe(true);
  });
});
