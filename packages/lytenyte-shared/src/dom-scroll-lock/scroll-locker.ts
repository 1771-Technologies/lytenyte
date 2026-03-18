import { getDocument } from "../dom-utils/getters/get-document.js";
import { isIOS } from "../dom-utils/detection/index.js";
import { basicPreventScroll } from "./basic-prevent-scroll.js";
import { hasInsetScrollbars } from "./has-inset-scrollbars.js";
import { standardPreventScroll } from "./standard-prevent-scroll.js";
import { getComputedStyle } from "../dom-utils/getters/get-computed-style.js";

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

  /**
   * Calls the stored restore function and clears it, but only if the lock
   * count is still zero when this runs. Guards against a release being
   * followed immediately by a new acquire before the timeout fires.
   */
  #unlock = () => {
    if (this.lockCount === 0 && this.restore) {
      this.restore?.();
      this.restore = null;
    }
  };

  /**
   * Applies the scroll lock by selecting the appropriate strategy. Uses
   * `basicPreventScroll` on iOS or when inset scrollbars are absent, and
   * `standardPreventScroll` otherwise. Does nothing if the document is already
   * scroll-locked via `overflow: hidden` or `overflow: clip`.
   */
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
