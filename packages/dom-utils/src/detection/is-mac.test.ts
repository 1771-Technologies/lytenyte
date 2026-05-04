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
import { isMac } from "./is-mac.js";

describe("isMac", () => {
  test("Should return the correct result when the device is mac", () => {
    vi.spyOn(window.navigator, "platform", "get").mockImplementationOnce(() => "Mac");
    if (window.navigator?.userAgentData)
      vi.spyOn(window.navigator, "userAgentData", "get").mockImplementationOnce(() => ({
        platform: "Mac",
        brands: [],
      }));

    expect(isMac()).toEqual(true);
  });
});
