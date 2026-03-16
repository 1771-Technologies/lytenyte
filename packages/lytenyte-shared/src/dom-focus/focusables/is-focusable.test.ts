import { describe, expect, test, vi } from "vitest";
import { isFocusable } from "./is-focusable.js";

describe("isFocusable", () => {
  test("Should return false when the element is inert", () => {
    const div = document.createElement("div");
    div.setAttribute("inert", "true");

    const child = document.createElement("button");
    child.textContent = "Child 1";
    div.appendChild(child);

    document.body.appendChild(child);

    expect(isFocusable(child)).toEqual(true);
  });

  test("Should return false when the element does not match the focusable selector", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(isFocusable(div)).toEqual(false);
  });

  test("Should return false when the element is null", () => {
    expect(isFocusable(null)).toEqual(false);
  });

  test("Should return false when the element is not visible", () => {
    const d = document.createElement("div");
    d.textContent = "div";
    d.tabIndex = -1;

    document.body.appendChild(d);
    d.getClientRects = () => {
      return [] as any;
    };
    vi.spyOn(d, "offsetHeight", "get").mockImplementation(() => 0);
    vi.spyOn(d, "offsetWidth", "get").mockImplementation(() => 0);

    expect(isFocusable(d)).toEqual(false);
  });

  test("Should return true when the element has a negative tab index", () => {
    const d = document.createElement("div");
    d.tabIndex = -1;
    document.body.appendChild(d);

    expect(isFocusable(d)).toEqual(true);
  });
});
