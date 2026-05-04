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
import { isInputElement } from "./is-input-element.js";

describe("isInputElement", () => {
  test("Should return true when the element is an input element and false for other elements", () => {
    const input = document.createElement("input");

    expect(isInputElement(input)).toEqual(true);

    expect(isInputElement(document.createElement("div"))).toEqual(false);
  });

  test("Should return false when the value is not an HTML element", () => {
    expect(isInputElement(null as any)).toEqual(false);
  });
});
