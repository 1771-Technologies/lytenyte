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
import { getNearestMatching } from "./get-nearest-matching.js";

describe("getNearestMatching", () => {
  test("Should return the start element when it matches the predicate", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    const nestedChild = document.createElement("div");

    child.setAttribute("data-match", "1");
    nestedChild.setAttribute("data-match", "2");

    parent.appendChild(child);
    child.appendChild(nestedChild);

    expect(getNearestMatching(child, (el) => el.getAttribute("data-match") === "1")).toBe(child);
  });

  test("Should return the nearest ancestor that matches the predicate", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    const nestedChild = document.createElement("div");

    parent.setAttribute("data-parent", "true");
    child.setAttribute("data-match", "1");
    nestedChild.setAttribute("data-match", "2");

    parent.appendChild(child);
    child.appendChild(nestedChild);

    expect(getNearestMatching(nestedChild, (el) => el.getAttribute("data-parent") === "true")).toBe(parent);
  });

  test("Should return null when no element in the tree matches the predicate", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    const nestedChild = document.createElement("div");

    parent.setAttribute("data-parent", "true");
    child.setAttribute("data-match", "1");
    nestedChild.setAttribute("data-match", "2");

    parent.appendChild(child);
    child.appendChild(nestedChild);

    expect(getNearestMatching(nestedChild, (el) => el.getAttribute("data-parent") === "false")).toEqual(null);
  });
});
