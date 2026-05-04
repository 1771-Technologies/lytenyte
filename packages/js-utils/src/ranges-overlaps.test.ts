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
import { rangesOverlap } from "./ranges-overlap.js";

describe("rangesOverlap", () => {
  test("Should return the correct result", () => {
    expect(rangesOverlap(2, 4, 3, 6)).toEqual(true);
    expect(rangesOverlap(3, 8, 3, 6)).toEqual(true);
    expect(rangesOverlap(4, 8, 3, 6)).toEqual(true);
    expect(rangesOverlap(6, 8, 3, 6)).toEqual(false);

    // completely before
    expect(rangesOverlap(2, 4, 4, 8)).toEqual(false);
    // completely after
    expect(rangesOverlap(8, 12, 4, 8)).toEqual(false);
    // start overlaps but end exceeds
    expect(rangesOverlap(4, 12, 2, 8)).toEqual(true);
    // end overlaps but start is out of bounds
    expect(rangesOverlap(4, 12, 6, 8)).toEqual(true);
  });
});
