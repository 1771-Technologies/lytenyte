/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { describe, expect, test, vi } from "vitest";
import { getTabIndex } from "./get-tab-index.js";

describe("getTabIndex", () => {
  test("Should return 0 for elements that are tabbable by default", () => {
    expect(getTabIndex(document.createElement("button"))).toEqual(0);
  });

  test("Should return 0 when an editable element has a negative tab index", () => {
    const v = document.createElement("input");
    vi.spyOn(v, "tabIndex", "get").mockImplementation(() => -1);

    expect(getTabIndex(v)).toEqual(0);
  });

  test("Should return the actual negative tab index for non-editable, non-media elements", () => {
    const v = document.createElement("div");
    vi.spyOn(v, "tabIndex", "get").mockImplementation(() => -1);

    expect(getTabIndex(v)).toEqual(-1);
  });

  test("Should return 0 for audio, video, and details elements with a negative tab index", () => {
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

  test("Should return the explicitly set tab index", () => {
    const d = document.createElement("div");
    d.tabIndex = 2;
    expect(getTabIndex(d)).toEqual(2);
  });
});
