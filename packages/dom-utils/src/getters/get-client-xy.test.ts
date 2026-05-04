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
import { getClientX, getClientY } from "./get-client-xy.js";

describe("getClientXY", () => {
  test("Should return clientX for MouseEvent", () => {
    const mouseEvent = {
      clientX: 100,
      clientY: 200,
    };
    expect(getClientX(mouseEvent as MouseEvent)).toBe(100);
  });

  test("Should return clientX for PointerEvent", () => {
    const pointerEvent = {
      clientX: 150,
      clientY: 250,
    };
    expect(getClientX(pointerEvent as PointerEvent)).toBe(150);
  });

  test("Should return clientX for DragEvent", () => {
    const dragEvent = {
      clientX: 200,
      clientY: 300,
    };
    expect(getClientX(dragEvent as DragEvent)).toBe(200);
  });

  test("Should return first touch clientX for TouchEvent", () => {
    const touchEvent = {
      touches: [
        {
          clientX: 300,
          clientY: 400,
        },
      ],
    };
    expect(getClientX(touchEvent as unknown as TouchEvent)).toBe(300);
  });

  test("Should return clientY for MouseEvent", () => {
    const mouseEvent = {
      clientX: 100,
      clientY: 200,
    };
    expect(getClientY(mouseEvent as MouseEvent)).toBe(200);
  });

  test("Should return clientY for PointerEvent", () => {
    const pointerEvent = {
      clientX: 150,
      clientY: 250,
    };
    expect(getClientY(pointerEvent as PointerEvent)).toBe(250);
  });

  test("Should return clientY for DragEvent", () => {
    const dragEvent = {
      clientX: 200,
      clientY: 300,
    };
    expect(getClientY(dragEvent as DragEvent)).toBe(300);
  });

  test("Should return first touch clientY for TouchEvent", () => {
    const touchEvent = {
      touches: [
        {
          clientX: 300,
          clientY: 400,
        },
      ],
    };
    expect(getClientY(touchEvent as unknown as TouchEvent)).toBe(400);
  });
});
