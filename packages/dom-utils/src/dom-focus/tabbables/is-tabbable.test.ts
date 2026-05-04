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

import { describe, expect, test } from "vitest";
import { isTabbable } from "../tabbables/is-tabbable.js";

describe("isTabbable", () => {
  test("Should return false when the element is null", () => {
    expect(isTabbable(null)).toEqual(false);
  });
  test("Should return true when the element has a positive tab index", () => {
    const d = document.createElement("div");
    d.tabIndex = 1;

    expect(isTabbable(d)).toEqual(true);
  });

  test("Should return true when the element is natively tabbable", () => {
    const v = document.createElement("button");

    document.body.appendChild(v);

    expect(isTabbable(v)).toEqual(true);
  });

  test("Should return false when a natively tabbable element has a negative tab index", () => {
    const v = document.createElement("button");
    v.tabIndex = -1;
    document.body.appendChild(v);
    expect(isTabbable(v)).toEqual(false);
  });

  test("Should return false when the element has a positive tab index but is inside an inert subtree", () => {
    const container = document.createElement("div");
    container.setAttribute("inert", "true");

    const button = document.createElement("button");
    button.tabIndex = 1;
    container.appendChild(button);
    document.body.appendChild(container);

    expect(isTabbable(button)).toEqual(false);
  });
});
