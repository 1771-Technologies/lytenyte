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
import { clamp } from "./clamp.js";

describe("clamp", () => {
  test("Should return the correct value", () => {
    expect(clamp(0, 10, 20)).toEqual(10);
    expect(clamp(11, 10, 20)).toEqual(11);
    expect(clamp(11, 23, 20)).toEqual(20);
    expect(clamp(22, 23, 20)).toEqual(20);
  });
});
