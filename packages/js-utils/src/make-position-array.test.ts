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
import { makePositionArray } from "./make-position-array.js";

describe("makePositionArray", () => {
  test("Should return a single zero position for a count of zero", () => {
    expect(makePositionArray(() => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
      ]
    `);
  });

  test("Should return two positions for a single element", () => {
    expect(makePositionArray(() => 100, 1)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        100,
      ]
    `);
  });

  test("Should compute cumulative positions for fixed and variable sizes", () => {
    expect(makePositionArray(() => 20, 5)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
      100,
    ]
  `);

    expect(makePositionArray((i) => [20, 40, 60][i % 3], 6)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      60,
      120,
      140,
      180,
      240,
    ]
  `);
  });

  test("Should produce all-zero positions when every size is zero", () => {
    expect(makePositionArray(() => 0, 4)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        0,
        0,
        0,
        0,
      ]
    `);
  });

  test("Should treat negative sizes as zero without affecting the running total", () => {
    const widths = [20, -10, 10, 40];

    expect(makePositionArray((i) => widths[i], 4)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      20,
      30,
      70,
    ]
  `);
  });

  test("Should reset the cumulative sum when a size is NaN, unlike negative values which preserve it", () => {
    const withNaN = [10, NaN, 20];
    const withNegative = [10, -10, 20];

    // NaN causes Math.max(NaN, 0) = NaN, which propagates and resets the Uint32Array entry to 0
    expect(makePositionArray((i) => withNaN[i], 3)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        10,
        0,
        20,
      ]
    `);

    // Negative is clamped to 0 by Math.max, so the running total carries forward
    expect(makePositionArray((i) => withNegative[i], 3)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        10,
        10,
        30,
      ]
    `);
  });
});
