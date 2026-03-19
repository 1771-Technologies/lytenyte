import { describe, expect, test } from "vitest";
import { hasNegativeTabIndex } from "./has-negative-tab-index.js";

describe("hasNegativeTabIndex", () => {
  test("Should return true when the element has a negative tab index and false otherwise", () => {
    const div = document.createElement("div");
    div.tabIndex = -2;
    expect(hasNegativeTabIndex(div)).toEqual(true);
    div.tabIndex = 0;
    expect(hasNegativeTabIndex(div)).toEqual(false);
    expect(hasNegativeTabIndex(document.createElement("div"))).toEqual(false);
  });
});
