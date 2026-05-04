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
import { getFrameElement } from "./get-frame-element.js";

describe("getFrameElement", () => {
  test("Should return the correct frame element", () => {
    vi.spyOn(window, "parent", "get").mockImplementation(() => ({ frameElement: "x" }) as any);
    vi.spyOn(window, "frameElement", "get").mockImplementation(() => "x" as any);
    expect(getFrameElement(window)).toEqual("x");
    vi.clearAllMocks();
    vi.spyOn(window, "parent", "get").mockImplementation(() => null as any);
    expect(getFrameElement(window)).toEqual(null);
    vi.clearAllMocks();
  });
});
