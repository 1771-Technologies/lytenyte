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
import { getNavigatorData } from "./get-navigator-data.js";

describe("getNavigatorData", () => {
  test("Should return the correct navigator data", () => {
    vi.stubGlobal("navigator", undefined);
    expect(getNavigatorData()).toMatchInlineSnapshot(`
      {
        "maxTouchPoints": -1,
        "platform": "",
      }
    `);

    vi.stubGlobal("navigator", { userAgentData: { platform: "my-platform" }, maxTouchPoints: -2 });
    expect(getNavigatorData()).toMatchInlineSnapshot(`
      {
        "maxTouchPoints": -2,
        "platform": "my-platform",
      }
    `);

    vi.stubGlobal("navigator", { platform: "bob-platform", userAgentData: {} });
    expect(getNavigatorData()).toMatchInlineSnapshot(`
      {
        "maxTouchPoints": -1,
        "platform": "bob-platform",
      }
    `);
    vi.stubGlobal("navigator", { maxTouchPoints: 2 });
    expect(getNavigatorData()).toMatchInlineSnapshot(`
      {
        "maxTouchPoints": 2,
        "platform": "",
      }
    `);
    vi.unstubAllGlobals();
  });
});
