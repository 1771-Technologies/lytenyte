/*
Copyright 2025 1771 Technologies

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
import { distance } from "@1771technologies/lytenyte-js-utils";

export function makeLongTouchPressHandler(fn: (t: TouchEvent) => void, time = 400) {
  return (ev: TouchEvent) => {
    if (ev.touches.length !== 1) return;
    ev.preventDefault();

    const x1 = ev.touches[0].clientX;
    const y1 = ev.touches[0].clientY;
    const timeout = setTimeout(() => {
      controller.abort();

      fn(ev);
    }, time);

    const controller = new AbortController();
    document.addEventListener(
      "touchend",
      () => {
        clearTimeout(timeout);
        controller.abort();
      },
      { signal: controller.signal },
    );

    document.addEventListener(
      "touchcancel",
      () => {
        clearTimeout(timeout);
        controller.abort();
      },
      { signal: controller.signal },
    );
    document.addEventListener(
      "touchmove",
      (ev) => {
        const x2 = ev.touches[0].clientX;
        const y2 = ev.touches[0].clientY;
        if (distance(x1, y1, x2, y2) > 20) {
          clearTimeout(timeout);
          controller.abort();
        }
      },
      { signal: controller.signal },
    );
  };
}
