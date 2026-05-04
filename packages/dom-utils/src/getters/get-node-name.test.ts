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
import { getNodeName } from "./get-node-name.js";

describe("getNodeName", () => {
  test("Should return the local name of an HTML element", () => {
    expect(getNodeName(document.createElement("div"))).toEqual("div");
  });

  test("Should return an empty string when localName is null", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "localName", "get").mockImplementation(() => null as unknown as string);
    expect(getNodeName(el)).toEqual("");
  });

  test("Should return #document when the value is not an HTML element", () => {
    expect(getNodeName(window)).toEqual("#document");
  });
});
