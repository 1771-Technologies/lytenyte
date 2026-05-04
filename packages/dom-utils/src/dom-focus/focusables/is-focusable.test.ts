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
import { isFocusable } from "./is-focusable.js";

describe("isFocusable", () => {
  test("Should return false when the element is inert", () => {
    const div = document.createElement("div");
    div.setAttribute("inert", "true");

    const child = document.createElement("button");
    child.textContent = "Child 1";
    div.appendChild(child);

    document.body.appendChild(child);

    expect(isFocusable(child)).toEqual(true);
  });

  test("Should return false when the element does not match the focusable selector", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(isFocusable(div)).toEqual(false);
  });

  test("Should return false when the element is null", () => {
    expect(isFocusable(null)).toEqual(false);
  });

  test("Should return false when the element is not visible", () => {
    const d = document.createElement("div");
    d.textContent = "div";
    d.tabIndex = -1;

    document.body.appendChild(d);
    d.getClientRects = () => {
      return [] as any;
    };
    vi.spyOn(d, "offsetHeight", "get").mockImplementation(() => 0);
    vi.spyOn(d, "offsetWidth", "get").mockImplementation(() => 0);

    expect(isFocusable(d)).toEqual(false);
  });

  test("Should return true when the element has a negative tab index", () => {
    const d = document.createElement("div");
    d.tabIndex = -1;
    document.body.appendChild(d);

    expect(isFocusable(d)).toEqual(true);
  });
});
