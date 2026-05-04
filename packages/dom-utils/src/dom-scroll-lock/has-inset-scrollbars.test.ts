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
import { hasInsetScrollbars } from "./has-inset-scrollbars.js";

describe("hasInsetScrollbars", () => {
  test("Should return true if the scrollbars are inset", () => {
    vi.spyOn(document.documentElement, "clientWidth", "get").mockImplementationOnce(() => 200);
    vi.spyOn(window, "innerWidth", "get").mockImplementationOnce(() => 220);

    expect(hasInsetScrollbars(document.body)).toEqual(true);
  });

  test("Should return false if the scrollbars are not inset", () => {
    vi.spyOn(document.documentElement, "clientWidth", "get").mockImplementationOnce(() => 200);
    vi.spyOn(window, "innerWidth", "get").mockImplementationOnce(() => 180);

    expect(hasInsetScrollbars(document.body)).toEqual(false);
  });
});
