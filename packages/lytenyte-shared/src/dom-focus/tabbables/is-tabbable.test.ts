import { describe, expect, test } from "vitest";
import { isTabbable } from "../tabbables/is-tabbable.js";

describe("isTabbable", () => {
  test("Should return false when the element is null", () => {
    expect(isTabbable(null)).toEqual(false);
  });
  test("Should return true when the element has a positive tab index", () => {
    const d = document.createElement("div");
    d.tabIndex = 1;

    expect(isTabbable(d)).toEqual(true);
  });

  test("Should return true when the element is natively tabbable", () => {
    const v = document.createElement("button");

    document.body.appendChild(v);

    expect(isTabbable(v)).toEqual(true);
  });

  test("Should return false when a natively tabbable element has a negative tab index", () => {
    const v = document.createElement("button");
    v.tabIndex = -1;
    document.body.appendChild(v);
    expect(isTabbable(v)).toEqual(false);
  });

  test("Should return false when the element has a positive tab index but is inside an inert subtree", () => {
    const container = document.createElement("div");
    container.setAttribute("inert", "true");

    const button = document.createElement("button");
    button.tabIndex = 1;
    container.appendChild(button);
    document.body.appendChild(container);

    expect(isTabbable(button)).toEqual(false);
  });
});
