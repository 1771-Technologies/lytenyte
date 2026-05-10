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

import { describe, expect, test } from "vitest";
import { unwrapHost } from "./unwrap-host.js";

describe("unwrapHost", () => {
  test("Should return null for a detached element with no parents", () => {
    const el = document.createElement("div");
    expect(unwrapHost(el)).toBeNull();
  });

  test("Should return null for an element with regular DOM parents but no shadow ancestor", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);

    expect(unwrapHost(child)).toBeNull();
  });

  test("Should return the host when given a ShadowRoot directly", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });

    expect(unwrapHost(shadow)).toBe(host);
  });

  test("Should return the shadow host when the element is a direct child of a shadow root", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const child = document.createElement("span");
    shadow.appendChild(child);

    expect(unwrapHost(child)).toBe(host);
  });

  test("Should return the shadow host when the element is nested deep inside a shadow tree", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const mid = document.createElement("div");
    const deep = document.createElement("span");
    shadow.appendChild(mid);
    mid.appendChild(deep);

    expect(unwrapHost(deep)).toBe(host);
  });

  test("Should return the innermost shadow host for an element inside nested shadow roots", () => {
    const outerHost = document.createElement("div");
    const outerShadow = outerHost.attachShadow({ mode: "open" });
    const innerHost = document.createElement("div");
    const innerShadow = innerHost.attachShadow({ mode: "open" });
    const el = document.createElement("span");
    outerShadow.appendChild(innerHost);
    innerShadow.appendChild(el);

    expect(unwrapHost(el)).toBe(innerHost);
  });
});
