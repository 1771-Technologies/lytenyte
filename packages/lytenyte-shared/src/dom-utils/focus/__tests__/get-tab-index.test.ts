import { describe, expect, test, vi } from "vitest";
import { getTabIndex } from "../get-tab-index.js";

describe("getTabIndex", () => {
  test("when the element provided is a tabbable by default it should return 0", () => {
    expect(getTabIndex(document.createElement("button"))).toEqual(0);
  });

  test("when the element is editable and tab index is less than 0 it should return 0", () => {
    const v = document.createElement("input");
    vi.spyOn(v, "tabIndex", "get").mockImplementation(() => -1);

    expect(getTabIndex(v)).toEqual(0);
  });

  test("when the element is not editable and tab index is less than 0 it should return the tab index", () => {
    const v = document.createElement("div");
    vi.spyOn(v, "tabIndex", "get").mockImplementation(() => -1);

    expect(getTabIndex(v)).toEqual(-1);
  });

  test("when the element is an audio, video, or details element it should have a tab index of 0", () => {
    const v = document.createElement("video");
    vi.spyOn(v, "tabIndex", "get").mockImplementation(() => -1);
    const a = document.createElement("audio");
    vi.spyOn(a, "tabIndex", "get").mockImplementation(() => -1);
    const d = document.createElement("details");
    vi.spyOn(d, "tabIndex", "get").mockImplementation(() => -1);

    expect(getTabIndex(v)).toEqual(0);
    expect(getTabIndex(a)).toEqual(0);
    expect(getTabIndex(d)).toEqual(0);
  });

  test("when the element has a tab index set it should be returned", () => {
    const d = document.createElement("div");
    d.tabIndex = 2;
    expect(getTabIndex(d)).toEqual(2);
  });
});
