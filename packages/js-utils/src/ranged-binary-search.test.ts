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
import { rangedBinarySearch } from "./ranged-binary-search.js";

describe("rangedBinarySearch", () => {
  test("Should return the correct values", () => {
    const range = new Uint32Array([0, 20, 30, 60, 100, 200, 280, 400, 460]);

    expect(rangedBinarySearch(range, -20)).toEqual(0);
    expect(rangedBinarySearch(range, 0)).toEqual(0);
    expect(rangedBinarySearch(range, 20)).toEqual(1);
    expect(rangedBinarySearch(range, 25)).toEqual(1);
    expect(rangedBinarySearch(range, 30)).toEqual(2);
    expect(rangedBinarySearch(range, 100)).toEqual(4);
    expect(rangedBinarySearch(range, 110)).toEqual(4);
    expect(rangedBinarySearch(range, 210)).toEqual(5);
    expect(rangedBinarySearch(range, 450)).toEqual(7);
    expect(rangedBinarySearch(range, 460)).toEqual(8);
    expect(rangedBinarySearch(range, 500)).toEqual(8);
  });
});
