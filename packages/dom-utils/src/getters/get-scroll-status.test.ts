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
import { getScrollStatus } from "./get-scroll-status.js";
import { wait } from "@1771technologies/js-utils";

describe("getScrollStatus", () => {
  test("Should return the correct scroll status values when the scroll is at different positions", async () => {
    const el = document.createElement("div");
    el.style.height = "200px";
    el.style.width = "200px";
    el.style.overflow = "auto";
    const child = document.createElement("div");
    child.style.height = "3000px";
    child.style.width = "3000px";
    el.appendChild(child);
    document.body.appendChild(el);

    await wait();
    expect(getScrollStatus(el)).toEqual(["none", "none"]);

    el.scrollBy({ top: 100, left: 300 });
    expect(getScrollStatus(el)).toEqual(["partial", "partial"]);

    el.scrollBy({ top: 3000, left: 3000 });
    expect(getScrollStatus(el)).toEqual(["full", "full"]);
  });
});
