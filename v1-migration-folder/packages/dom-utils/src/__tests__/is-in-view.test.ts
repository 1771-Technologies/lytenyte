import { describe, test, expect, beforeEach, vi } from "vitest";
import { isInView } from "../is-in-view.js";

function createMockRect(top: number, left: number, bottom: number, right: number): DOMRect {
  return {
    top,
    left,
    bottom,
    right,
    width: right - left,
    height: bottom - top,
    x: left,
    y: top,
    toJSON: () => "",
  };
}

describe("isInView", () => {
  let el: HTMLElement;
  let bound: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    bound = document.createElement("div");

    el.getBoundingClientRect = vi.fn();
    bound.getBoundingClientRect = vi.fn();
  });

  test("returns true when element is fully inside bounds", () => {
    el.getBoundingClientRect = () => createMockRect(110, 110, 190, 190);
    bound.getBoundingClientRect = () => createMockRect(100, 100, 200, 200);

    expect(isInView(el, bound)).toBe(true);
  });

  test("returns false when element overflows bottom of bounds", () => {
    el.getBoundingClientRect = () => createMockRect(150, 110, 210, 190);
    bound.getBoundingClientRect = () => createMockRect(100, 100, 200, 200);

    expect(isInView(el, bound)).toBe(false);
  });

  test("returns false when element overflows left of bounds", () => {
    el.getBoundingClientRect = () => createMockRect(110, 90, 190, 150);
    bound.getBoundingClientRect = () => createMockRect(100, 100, 200, 200);

    expect(isInView(el, bound)).toBe(false);
  });

  test("returns true when element is within bounds and offset allows more room", () => {
    el.getBoundingClientRect = () => createMockRect(110, 110, 185, 185);
    bound.getBoundingClientRect = () => createMockRect(100, 100, 200, 200);

    expect(isInView(el, bound, { top: 10, bottom: 10, left: 10, right: 10 })).toBe(true);
  });

  test("returns false when offset shrinks visible area and element is outside", () => {
    el.getBoundingClientRect = () => createMockRect(105, 105, 195, 195);
    bound.getBoundingClientRect = () => createMockRect(100, 100, 200, 200);

    expect(isInView(el, bound, { top: 10, bottom: 10, left: 10, right: 10 })).toBe(false);
  });

  test("returns false if either element is null", () => {
    expect(isInView(null as any, bound)).toBe(false);
    expect(isInView(el, null as any)).toBe(false);
  });
});
