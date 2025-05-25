import { describe, expect, test } from "vitest";
import { getTabIndex } from "../get-tab-index";

describe("getTabIndex", () => {
  test("should return the correct tab index", () => {
    const audioElement = document.createElement("audio");
    expect(getTabIndex(audioElement)).toEqual(0);

    const negative = document.createElement("a");
    negative.tabIndex = -1;
    expect(getTabIndex(negative)).toEqual(-1);

    const normal = document.createElement("div");
    expect(getTabIndex(normal)).toEqual(-1);

    const positive = document.createElement("div");
    positive.tabIndex = 2;
    expect(getTabIndex(positive)).toEqual(2);

    const contentEditable = document.createElement("div");
    contentEditable.contentEditable = "true";
    expect(getTabIndex(contentEditable)).toEqual(0);
  });
});
