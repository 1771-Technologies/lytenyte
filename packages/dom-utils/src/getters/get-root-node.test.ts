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
import { getRootNode } from "./get-root-node.js";

describe("getRootNode", () => {
  test("Should return the document when the element is attached to the document", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    expect(getRootNode(el)).toBe(document);
  });

  test("Should return the document when the element is inside a shadow root connected to the document", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const el = document.createElement("span");
    shadow.appendChild(el);
    document.body.appendChild(host);

    expect(getRootNode(el)).toBe(document);
  });

  test("Should return the shadow root when getRootNode returns a ShadowRoot", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const el = document.createElement("span");
    shadow.appendChild(el);
    vi.spyOn(el, "getRootNode").mockImplementation(() => shadow);

    expect(getRootNode(el)).toBe(shadow);
  });

  test("Should fall back to ownerDocument when the element is inside a shadow root not connected to the document", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const el = document.createElement("span");
    shadow.appendChild(el);

    // composed: true traverses through the shadow host, returning the detached host
    // element (not a Document or ShadowRoot), so ownerDocument is used as fallback
    expect(getRootNode(el)).toBe(el.ownerDocument);
  });

  test("Should fall back to ownerDocument when getRootNode returns neither a Document nor a ShadowRoot", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "getRootNode").mockImplementation(() => el);

    expect(getRootNode(el)).toBe(el.ownerDocument);
  });

  test("Should fall back to ownerDocument when getRootNode throws", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "getRootNode").mockImplementation(() => {
      throw new Error("getRootNode failed");
    });

    expect(getRootNode(el)).toBe(el.ownerDocument);
  });

  test("Should fall back to the global document when getRootNode throws and ownerDocument is null", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "getRootNode").mockImplementation(() => {
      throw new Error("getRootNode failed");
    });
    vi.spyOn(el, "ownerDocument", "get").mockImplementation(() => null as any);

    expect(getRootNode(el)).toBe(document);
  });
});
