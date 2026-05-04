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
import { isHTMLElement } from "./is-html-element.js";

describe("isHTMLElement", () => {
  test("Should return true when the value is an HTML element", () => {
    expect(isHTMLElement(document.createElement("div"))).toEqual(true);
  });

  test("Should return false when the value is not an HTML element", () => {
    expect(isHTMLElement(window)).toEqual(false);
  });
});
