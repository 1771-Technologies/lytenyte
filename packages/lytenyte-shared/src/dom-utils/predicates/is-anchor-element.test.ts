import { describe, expect, test } from "vitest";
import { isAnchorElement } from "./is-anchor-element.js";

describe("isAnchorElement", () => {
  test("Should return false when the anchor does not have an href", () => {
    const a = document.createElement("a");
    expect(isAnchorElement(a)).toEqual(false);
  });
  test("Should return false when the element is not an anchor element", () => {
    const div = document.createElement("div");

    expect(isAnchorElement(div)).toEqual(false);
  });

  test("Should return true when the element is an anchor with an href", () => {
    const a = document.createElement("a");

    a.href = "#";

    expect(isAnchorElement(a)).toEqual(true);
  });
});
