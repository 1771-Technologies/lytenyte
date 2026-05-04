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
import { getRelativeXPosition } from "./get-relative-x-position.js";
import { wait } from "@1771technologies/js-utils";

describe("getRelativeXPosition", () => {
  test("Should return the relative x position both left and right", () => {
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => {
      return {
        left: 20,
        right: 30,
        bottom: 30,
        top: 20,
        x: 20,
        y: 20,
        height: 10,
        width: 10,
        toJSON: () => "",
      };
    });

    vi.spyOn(element, "offsetWidth", "get").mockImplementation(() => 200);
    vi.spyOn(element, "clientWidth", "get").mockImplementation(() => 195);

    expect(getRelativeXPosition(element, 22)).toMatchInlineSnapshot(`
      {
        "left": 2,
        "right": 3,
      }
    `);
  });

  test("Should return the correct relative x position for both left and right for rlt", async () => {
    const element = document.createElement("div");

    element.style.direction = "rtl";
    document.body.appendChild(element);
    await wait();
    vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => {
      return {
        left: 20,
        right: 30,
        bottom: 30,
        top: 20,
        x: 20,
        y: 20,
        height: 10,
        width: 10,
        toJSON: () => "",
      };
    });

    vi.spyOn(element, "offsetWidth", "get").mockImplementation(() => 200);
    vi.spyOn(element, "clientWidth", "get").mockImplementation(() => 195);

    expect(getRelativeXPosition(element, 22)).toMatchInlineSnapshot(`
      {
        "left": -3,
        "right": 8,
      }
    `);
  });
});
