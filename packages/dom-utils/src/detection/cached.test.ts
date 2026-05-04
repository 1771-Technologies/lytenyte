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
import { cached } from "./cached.js";

describe("cached", () => {
  test("Should cache the function result", () => {
    const fn = vi.fn(() => true);

    const cachedFn = cached(fn);
    expect(cachedFn()).toEqual(true);
    expect(cachedFn()).toEqual(true);
    expect(cachedFn()).toEqual(true);
    expect(fn).toHaveBeenCalledOnce();
    cachedFn.__clear();
    expect(cachedFn()).toEqual(true);
    expect(cachedFn()).toEqual(true);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
