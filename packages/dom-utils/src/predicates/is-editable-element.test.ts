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
import { isEditableElement } from "./is-editable-element.js";

describe("isEditableElement", () => {
  test("Should return false when the element is not an HTML element or is null", () => {
    expect(isEditableElement(null)).toEqual(false);
    expect(isEditableElement({} as any)).toEqual(false);
  });

  test("Should return true when the element is an input element", () => {
    const el = document.createElement("input");
    document.body.appendChild(el);

    expect(isEditableElement(el)).toEqual(true);
  });

  test("Should return false when the element is an input but selectionStart is null", () => {
    const el = document.createElement("input");
    vi.spyOn(el, "selectionStart", "get").mockImplementation(() => null as any);

    expect(isEditableElement(el)).toEqual(false);
  });

  test("Should return true when the element has contenteditable set", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "isContentEditable", "get").mockImplementation(() => true);
    expect(isEditableElement(el)).toEqual(true);
    vi.spyOn(el, "isContentEditable", "get").mockImplementation(() => false);
    expect(isEditableElement(el)).toEqual(false);

    const viaAttribute = document.createElement("div");
    viaAttribute.setAttribute("contenteditable", "true");
    expect(isEditableElement(viaAttribute)).toEqual(true);
    viaAttribute.setAttribute("contenteditable", "");
    expect(isEditableElement(viaAttribute)).toEqual(true);
    viaAttribute.setAttribute("contenteditable", "false");
    expect(isEditableElement(viaAttribute)).toEqual(false);
  });
});
