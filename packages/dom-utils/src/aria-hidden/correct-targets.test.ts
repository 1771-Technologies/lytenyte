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

import { describe, expect, test, vi, afterEach } from "vitest";
import { correctTargets } from "./correct-targets.js";

describe("correctTargets", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Should return an empty array when given an empty targets list", () => {
    const parent = document.createElement("div");
    expect(correctTargets(parent, [])).toEqual([]);
  });

  test("Should return the target as-is when it is directly contained in the parent", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);

    expect(correctTargets(parent, [child])).toEqual([child]);
  });

  test("Should substitute the shadow host when the target is inside a shadow root whose host is in the parent", () => {
    const parent = document.createElement("div");
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const target = document.createElement("span");
    shadow.appendChild(target);
    parent.appendChild(host);

    expect(correctTargets(parent, [target])).toEqual([host]);
  });

  test("Should drop a target that is not contained in the parent and has no shadow host", () => {
    const parent = document.createElement("div");
    const outside = document.createElement("span");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(correctTargets(parent, [outside])).toEqual([]);
    expect(errorSpy).toHaveBeenCalledOnce();
  });

  test("Should drop a target whose shadow host is also not contained in the parent", () => {
    const parent = document.createElement("div");
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const target = document.createElement("span");
    shadow.appendChild(target);
    // host is NOT appended to parent
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(correctTargets(parent, [target])).toEqual([]);
    expect(errorSpy).toHaveBeenCalledOnce();
  });

  test("Should handle a mix of valid, corrected, and invalid targets", () => {
    const parent = document.createElement("div");

    const direct = document.createElement("span");
    parent.appendChild(direct);

    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const shadowChild = document.createElement("span");
    shadow.appendChild(shadowChild);
    parent.appendChild(host);

    const outside = document.createElement("p");

    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(correctTargets(parent, [direct, shadowChild, outside])).toEqual([direct, host]);
  });
});
