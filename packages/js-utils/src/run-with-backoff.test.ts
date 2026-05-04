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
import { runWithBackoff } from "./run-with-backoff.js";

describe("runWithBackoff", () => {
  test("Should run correctly", async () => {
    let count = 0;

    const fn = vi.fn(() => {
      if (count === 3) return true;
      count++;
      return false;
    });

    runWithBackoff(fn, [4, 4]);

    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(3), { timeout: 2000 });
  });
});
