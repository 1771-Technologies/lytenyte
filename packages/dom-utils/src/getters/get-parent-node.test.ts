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
import { getParentNode } from "./get-parent-node.js";
import { getDocumentElement } from "./get-document-element.js";

describe("getParentNode", () => {
  test("Should return the assigned slot when the element has one", () => {
    const d = document.createElement("div");
    const slot = document.createElement("slot");
    vi.spyOn(d, "assignedSlot", "get").mockImplementation(() => slot);

    expect(getParentNode(d)).toBe(slot);
  });

  test("Should return the parent node when the element has one", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(getParentNode(child)).toBe(parent);
  });

  test("Should return the html element itself when it is passed in", () => {
    const el = document.querySelector("html")!;
    expect(getParentNode(el)).toBe(el);
  });

  test("Should return the shadow host when the node is a shadow root", () => {
    const node = document.createElement("div");
    const root = node.attachShadow({ mode: "open" });

    expect(getParentNode(root)).toBe(node);
  });

  test("Should return the document element when the node has no parent", () => {
    const node = document.createElement("div");

    expect(getParentNode(node)).toBe(getDocumentElement(document));
  });

  test("Should return the host when the result node is itself a shadow root", () => {
    const node = document.createElement("div");
    const outer = node.attachShadow({ mode: "open" });
    const element = document.createElement("span");
    outer.appendChild(element);
    const inner = element.attachShadow({ mode: "open" });

    (element as any).host = node;
    vi.spyOn(element, "nodeType", "get").mockImplementation(() => 11);

    expect(getParentNode(inner)).toBe(node);
  });
});
