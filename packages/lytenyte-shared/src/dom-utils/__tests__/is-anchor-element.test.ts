import { describe, expect, test } from "vitest";
import { isAnchorElement } from "../is-anchor-element.js";

describe("isAnchorElement", () => {
  test("when the anchor does not have an href should return false", () => {
    const a = document.createElement("a");
    expect(isAnchorElement(a)).toEqual(false);
  });
  test("when the anchor element is not an anchor element should return false", () => {
    const div = document.createElement("div");

    expect(isAnchorElement(div)).toEqual(false);
  });

  test("when the anchor element has a href it should return true", () => {
    const a = document.createElement("a");

    a.href = "#";

    expect(isAnchorElement(a)).toEqual(true);
  });
});
