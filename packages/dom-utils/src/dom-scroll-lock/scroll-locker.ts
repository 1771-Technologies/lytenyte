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

import { isIOS } from "../detection/is-ios.js";
import { getDocument } from "../getters/get-document.js";
import { basicPreventScroll } from "./basic-prevent-scroll.js";
import { hasInsetScrollbars } from "./has-inset-scrollbars.js";
import { standardPreventScroll } from "./standard-prevent-scroll.js";

/**
 * Manages a reference-counted scroll lock. Multiple callers can independently
 * acquire the lock and the page scroll is only restored once every caller has
 * released it. Chooses between `basicPreventScroll` and `standardPreventScroll`
 * based on the platform and scrollbar type.
 */
export class ScrollLocker {
  lockCount = 0;
  restore: (() => void) | null = null;

  /**
   * Increments the lock count and schedules the scroll lock to be applied on
   * the next tick if this is the first active acquire. Returns a release
   * function that the caller must invoke when the lock is no longer needed.
   */
  acquire(referenceElement: Element | null) {
    this.lockCount += 1;
    if (this.lockCount === 1 && this.restore === null) {
      setTimeout(() => this.#lock(referenceElement), 0);
    }
    return this.release;
  }

  /**
   * Decrements the lock count and schedules the scroll to be restored on the
   * next tick once no more active locks remain.
   */
  release = () => {
    this.lockCount -= 1;
    if (this.lockCount === 0 && this.restore) {
      setTimeout(this.#unlock, 0);
    }
  };

  #unlock = () => {
    if (this.lockCount === 0 && this.restore) {
      this.restore?.();
      this.restore = null;
    }
  };

  #lock(referenceElement: Element | null) {
    if (this.lockCount <= 0 || this.restore !== null) return;

    const doc = getDocument(referenceElement);
    const html = doc.documentElement;
    const htmlOverflowY = getComputedStyle(html).overflowY;

    if (htmlOverflowY === "hidden" || htmlOverflowY === "clip") {
      this.restore = () => {};
      return;
    }

    const isOverflowHiddenLock = isIOS() || !hasInsetScrollbars(referenceElement);

    this.restore = isOverflowHiddenLock
      ? basicPreventScroll(referenceElement)
      : standardPreventScroll(referenceElement);
  }
}

export const SCROLL_LOCKER = new ScrollLocker();
