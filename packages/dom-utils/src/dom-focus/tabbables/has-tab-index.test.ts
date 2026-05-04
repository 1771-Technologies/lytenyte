import { describe, expect, test } from "vitest";
import { hasTabIndex } from "./has-tab-index.js";

describe("hasTabIndex", () => {
  test("Should return true when the element has an explicit tabindex attribute", () => {
    const div = document.createElement("div");
    div.tabIndex = 2;
    expect(hasTabIndex(div)).toEqual(true);
    expect(hasTabIndex(document.createElement("div"))).toEqual(false);
  });

  test("Should return false when the element does not have an explicit tabindex attribute", () => {
    expect(hasTabIndex(document.createElement("input"))).toEqual(false);
  });
});
