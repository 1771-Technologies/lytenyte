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
import { isIOS } from "@1771technologies/lytenyte-dom-utils";
import { bslGlobals } from "./+globals.bsl.js";
import type { BodyScrollOptions } from "./+types.bsl.js";
import { applyOverflowHidden } from "./apply-overflow-hidden.js";
import { applyPositionFixed } from "./apply-position-fixed.js";
import { handlePreventDefault } from "./handle-prevent-default.js";
import { handleScroll } from "./handle-scroll.js";

export const applyDisableBodyScroll = (
  targetElement: HTMLElement,
  options?: BodyScrollOptions,
): void => {
  bslGlobals.locksIndex.set(
    targetElement,
    bslGlobals.locksIndex?.get(targetElement)
      ? (bslGlobals.locksIndex?.get(targetElement) as number) + 1
      : 1,
  );
  // disableBodyScroll must not have been called on this targetElement before
  if (bslGlobals.locks.some((lock) => lock.targetElement === targetElement)) {
    return;
  }

  const lock = {
    targetElement,
    options: options || {},
  };

  bslGlobals.locks = [...bslGlobals.locks, lock];

  if (isIOS()) {
    applyPositionFixed();
  } else {
    applyOverflowHidden(options);
  }

  if (isIOS()) {
    targetElement.ontouchstart = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        bslGlobals.initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        handleScroll(event, targetElement);
      }
    };

    if (!bslGlobals.documentListenerAdded) {
      document.addEventListener("touchmove", handlePreventDefault, { passive: false });
      bslGlobals.documentListenerAdded = true;
    }
  }
};
