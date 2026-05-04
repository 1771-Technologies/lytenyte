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
import { isIPad } from "./is-ipad.js";

describe("isIPad", () => {
  test("Should return the correct result", () => {
    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "iPad");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "iPad",
        brands: [],
      }));

    expect(isIPad()).toEqual(true);
    isIPad.__clear();

    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "Fx");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "Note",
        brands: [],
      }));
    expect(isIPad()).toEqual(false);
  });
});
