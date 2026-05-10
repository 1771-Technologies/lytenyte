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
import { isIgnoredNode } from "./is-ignored-node.js";

describe("isIgnoredNode", () => {
  test("Should return false for an ordinary element", () => {
    expect(isIgnoredNode(document.createElement("div"))).toBe(false);
  });

  test("Should return true for a <script> element", () => {
    expect(isIgnoredNode(document.createElement("script"))).toBe(true);
  });

  test("Should return true for an <output> element", () => {
    expect(isIgnoredNode(document.createElement("output"))).toBe(true);
  });

  test("Should return true for a <status> custom element", () => {
    expect(isIgnoredNode(document.createElement("status"))).toBe(true);
  });

  test("Should return true for a <next-route-announcer> custom element", () => {
    expect(isIgnoredNode(document.createElement("next-route-announcer"))).toBe(true);
  });

  test("Should return true for an element with role='status'", () => {
    const el = document.createElement("div");
    el.role = "status";
    expect(isIgnoredNode(el)).toBe(true);
  });

  test("Should return true for an element with an aria-live attribute", () => {
    const el = document.createElement("div");
    el.setAttribute("aria-live", "polite");
    expect(isIgnoredNode(el)).toBe(true);
  });

  test("Should return true for an element with an empty aria-live attribute", () => {
    const el = document.createElement("div");
    el.setAttribute("aria-live", "");
    expect(isIgnoredNode(el)).toBe(true);
  });

  test("Should return true for an element with a data-live-announcer attribute", () => {
    const el = document.createElement("div");
    el.setAttribute("data-live-announcer", "");
    expect(isIgnoredNode(el)).toBe(true);
  });
});
