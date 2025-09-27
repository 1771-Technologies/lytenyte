import { describe, expect, test } from "vitest";
import { hasTabIndex } from "../has-tab-index.js";

describe("hasTabIndex", () => {
  test("when the element has tab index defined it should return true", () => {
    const div = document.createElement("div");
    div.tabIndex = 2;
    expect(hasTabIndex(div)).toEqual(true);
    expect(hasTabIndex(document.createElement("div"))).toEqual(false);
  });

  test("when the element would be tabbable but it does not have a tab index it should return false", () => {
    expect(hasTabIndex(document.createElement("input"))).toEqual(false);
  });
});
