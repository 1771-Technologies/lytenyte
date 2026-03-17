import { getDocument } from "../dom-utils/get-document.js";
import { getWindow } from "../dom-utils/get-window.js";
import { isIOS } from "../dom-utils/is-ios.js";
import { basicPreventScroll } from "./basic-prevent-scroll.js";
import { hasInsetScrollbars } from "./has-inset-scrollbars.js";
import { standardPreventScroll } from "./standard-prevent-scroll.js";

export class ScrollLocker {
  lockCount = 0;
  restore: (() => void) | null = null;

  acquire(referenceElement: Element | null) {
    this.lockCount += 1;
    if (this.lockCount === 1 && this.restore === null) {
      setTimeout(() => this.#lock(referenceElement), 0);
    }
    return this.release;
  }

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
    const htmlOverflowY = getWindow(html).getComputedStyle(html).overflowY;

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
