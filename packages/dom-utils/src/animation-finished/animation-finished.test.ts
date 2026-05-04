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
import { onAnimationFinished } from "./animation-finished.js";
import { wait } from "@1771technologies/js-utils";

describe("onAnimationFinished", () => {
  test("Should invoke the callback only after all animations on the element have finished", async () => {
    const button = document.createElement("button");
    Object.assign(button.style, { background: "white", transition: "background 200ms linear" });

    document.body.appendChild(button);

    await wait();
    button.style.backgroundColor = "black";
    await wait();
    const fn = vi.fn();
    onAnimationFinished({ element: button, fn });
    await wait();
    expect(fn).toHaveBeenCalledTimes(0);
    await wait(200);
    expect(fn).toHaveBeenCalledTimes(1);

    // Should wait for the next
    onAnimationFinished({ element: button, fn });
    expect(fn).toHaveBeenCalledTimes(1);
    await wait();
    expect(fn).toHaveBeenCalledTimes(2);

    const controller = new AbortController();
    button.style.backgroundColor = "white";
    await wait();
    onAnimationFinished({ element: button, fn, signal: controller.signal });
    await wait();
    controller.abort();
    await wait(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("Should invoke the callback immediately when the element does not support getAnimations", () => {
    const fn = vi.fn();
    onAnimationFinished({ element: {} as HTMLElement, fn });
    expect(fn).toHaveBeenCalledOnce();
  });
});
