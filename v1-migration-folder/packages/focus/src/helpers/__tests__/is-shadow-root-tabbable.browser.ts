import { expect, test, describe, beforeEach, vi } from "vitest";
import { isShadowRootTabbable } from "../is-shadow-root-tabbable";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("isShadowRootTabbable", () => {
  test("returns true if tabindex is not set", () => {
    const el = document.createElement("div");
    expect(isShadowRootTabbable(el)).toBe(true);
  });

  test("returns true if tabindex is a non-negative number", () => {
    const el = document.createElement("div");
    el.setAttribute("tabindex", "0");
    expect(isShadowRootTabbable(el)).toBe(true);

    el.setAttribute("tabindex", "5");
    expect(isShadowRootTabbable(el)).toBe(true);
  });

  test("returns false if tabindex is a negative number", () => {
    const el = document.createElement("div");
    el.setAttribute("tabindex", "-1");
    expect(isShadowRootTabbable(el)).toBe(false);

    el.setAttribute("tabindex", "-999");
    expect(isShadowRootTabbable(el)).toBe(false);
  });

  test("returns true if tabindex is not a valid number", () => {
    const el = document.createElement("div");
    el.setAttribute("tabindex", "not-a-number");
    expect(isShadowRootTabbable(el)).toBe(true);
  });
});
