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
import { getTabbables } from "./get-tabbables.js";

describe("getTabbables", () => {
  test("Should return an empty array when there are no tabbable elements", async () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(getTabbables(div)).toEqual([]);
  });
  test("Should return an empty array when children are not tabbable", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getTabbables(div)).toEqual([]);
  });

  test("Should return an empty array when the container is null", () => {
    expect(getTabbables(null)).toEqual([]);
  });

  test("Should return all tabbable children", () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    child1.tabIndex = -1;
    const child2 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getTabbables(div)).toEqual([child2]);
  });

  test("Should include the container when includeContainer is if-empty and no tabbable children exist", () => {
    const div = document.createElement("div");
    div.tabIndex = 0;
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getTabbables(div, "if-empty")).toEqual([div]);
  });

  test("Should not include the container when includeContainer is true but the container is not tabbable", () => {
    const div = document.createElement("div");
    div.tabIndex = -1;
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getTabbables(div, true)).toEqual([child1, child2]);
  });

  test("Should return tabbable elements within nested iframes", () => {
    const div = document.createElement("div");
    const frame = document.createElement("iframe");
    div.appendChild(frame);

    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    vi.spyOn(child1, "offsetHeight", "get").mockImplementation(() => 100);
    vi.spyOn(child2, "offsetHeight", "get").mockImplementation(() => 100);
    const frameBody = document.createElement("div");
    frameBody.appendChild(child1);
    frameBody.appendChild(child2);

    document.body.appendChild(div);

    const contentDocument = {
      body: frameBody,
    };
    vi.spyOn(frame, "contentDocument", "get").mockImplementation(() => contentDocument as any);

    expect(getTabbables(div)).toEqual([child1, child2]);
  });

  test("Should include the container when includeContainer is true and no tabbable children exist", () => {
    const div = document.createElement("div");
    div.tabIndex = 0;
    div.style.height = "200px";
    div.style.width = "200px";
    document.body.appendChild(div);

    expect(getTabbables(div, true)).toEqual([div]);
  });

  test("Should sort elements with positive tab indexes before elements with tab index zero", () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    button2.tabIndex = 1;

    div.appendChild(button1);
    div.appendChild(button2);
    document.body.appendChild(div);

    expect(getTabbables(div)).toEqual([button2, button1]);
  });

  test("Should sort elements with positive tab indexes in ascending order", () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    button1.tabIndex = 2;
    button2.tabIndex = 1;

    div.appendChild(button1);
    div.appendChild(button2);
    document.body.appendChild(div);

    expect(getTabbables(div)).toEqual([button2, button1]);
  });

  test("Should return tabbable elements from multiple nested iframes", () => {
    const div = document.createElement("div");
    const frame1 = document.createElement("iframe");
    const frame2 = document.createElement("iframe");
    div.appendChild(frame1);
    div.appendChild(frame2);

    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    const child4 = document.createElement("button");
    vi.spyOn(child1, "offsetHeight", "get").mockImplementation(() => 100);
    vi.spyOn(child2, "offsetHeight", "get").mockImplementation(() => 100);
    vi.spyOn(child3, "offsetHeight", "get").mockImplementation(() => 100);
    vi.spyOn(child4, "offsetHeight", "get").mockImplementation(() => 100);

    const frameBody1 = document.createElement("div");
    frameBody1.appendChild(child1);
    frameBody1.appendChild(child2);

    const frameBody2 = document.createElement("div");
    frameBody2.appendChild(child3);
    frameBody2.appendChild(child4);

    document.body.appendChild(div);

    vi.spyOn(frame1, "contentDocument", "get").mockImplementation(() => ({ body: frameBody1 }) as any);
    vi.spyOn(frame2, "contentDocument", "get").mockImplementation(() => ({ body: frameBody2 }) as any);

    expect(getTabbables(div)).toEqual([child1, child2, child3, child4]);
  });
});
