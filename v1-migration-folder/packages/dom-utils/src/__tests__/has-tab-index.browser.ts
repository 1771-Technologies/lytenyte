import { describe, expect, test } from "vitest";
import { hasTabIndex } from "../has-tab-index";

describe("hasTabIndex", () => {
  test("should return the correct result", () => {
    const el = document.createElement("a");
    expect(hasTabIndex(el)).toEqual(false);

    el.tabIndex = 1;
    expect(hasTabIndex(el)).toEqual(true);
    el.tabIndex = 0;
    expect(hasTabIndex(el)).toEqual(true);
  });
});
