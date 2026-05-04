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
import { distance } from "./distance.js";

describe("distance", () => {
  test("Should return 0 when both points are the same", () => {
    expect(distance(0, 0, 0, 0)).toBe(0);
    expect(distance(5, 5, 5, 5)).toBe(0);
  });

  test("Should return correct value for horizontal distance", () => {
    expect(distance(0, 0, 3, 0)).toBe(3);
    expect(distance(10, 0, 4, 0)).toBe(6);
  });

  test("Should return correct value for vertical distance", () => {
    expect(distance(0, 0, 0, 5)).toBe(5);
    expect(distance(2, 10, 2, 4)).toBe(6);
  });

  test("Should return correct diagonal distance", () => {
    expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
    expect(distance(-1, -1, 2, 3)).toBeCloseTo(5);
  });

  test("Should handle negative coordinates", () => {
    expect(distance(-3, -4, 0, 0)).toBe(5);
    expect(distance(-2, -2, -5, -6)).toBe(5);
  });
});
