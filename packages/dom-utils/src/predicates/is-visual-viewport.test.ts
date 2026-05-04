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
import { isVisualViewport } from "./is-visual-viewport.js";

describe("isVisualViewport", () => {
  test("Should return true when the value is a VisualViewport and false otherwise", () => {
    expect(isVisualViewport({ constructor: { name: "VisualViewport" } })).toEqual(true);
    expect(isVisualViewport({ constructor: { name: "X" } })).toEqual(false);
  });

  test("Should return false when the value is null", () => {
    expect(isVisualViewport(null)).toEqual(false);
  });
});
