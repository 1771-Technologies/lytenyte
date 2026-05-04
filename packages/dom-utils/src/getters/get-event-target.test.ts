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
import { getEventTarget } from "./get-event-target.js";

describe("getEventTarget", () => {
  test("Should return the event target when there is no composed path", () => {
    const event = new Event("build");
    const target = document.createElement("div");
    vi.spyOn(event, "target", "get").mockImplementation(() => target);

    expect(getEventTarget(event)).toEqual(target);
  });

  test("Should return the first element in the composed path", () => {
    const event = new Event("build");
    event.composedPath = () => [target as any];
    const target = document.createElement("div");

    expect(getEventTarget(event)).toEqual(target);

    vi.resetAllMocks();

    // @ts-expect-error its fine but typing is irritating
    event.nativeEvent = { composedPath: () => [target] };

    expect(getEventTarget(event)).toEqual(target);
  });
});
