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
import { getDocument } from "./get-document.js";

describe("getDocument", () => {
  test("Should return the document when the document itself is passed", () => {
    expect(getDocument(document)).toBe(document);
  });

  test("Should return the document when a window object is passed", () => {
    expect(getDocument(window)).toBe(document);
  });

  test("Should return the global document when the element has no ownerDocument", () => {
    const el = document.createElement("div");

    vi.spyOn(el, "ownerDocument", "get").mockImplementation(() => null as any);
    expect(el.ownerDocument).toBe(null);
    expect(getDocument(el)).toBe(document);
  });

  test("Should return the global document when null is passed", () => {
    expect(getDocument(null)).toBe(document);
  });
});
