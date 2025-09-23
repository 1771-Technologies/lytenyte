import { describe, expect, test, vi } from "vitest";
import { isFocusable } from "../is-focusable.js";

describe("isFocusable", () => {
  test("when the element is inert it should return false", () => {
    const div = document.createElement("div");
    div.setAttribute("inert", "true");

    const child = document.createElement("button");
    child.textContent = "Child 1";
    div.appendChild(child);

    document.body.appendChild(child);

    expect(isFocusable(child)).toEqual(true);
  });

  test("when the element is not focusable it should return false", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(isFocusable(div)).toEqual(false);
  });

  test("when the element is not defined it should return false", () => {
    expect(isFocusable(null)).toEqual(false);
  });

  test("when the element is not visible it should return false", () => {
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

  test("when the element has a negative tab index it should still be focusable", () => {
    const d = document.createElement("div");
    d.tabIndex = -1;
    document.body.appendChild(d);

    expect(isFocusable(d)).toEqual(true);
  });
});
