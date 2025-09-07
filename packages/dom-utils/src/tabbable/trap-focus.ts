import type { FocusTrapOptions } from "./+types";
import { FocusTrap } from "./focus-trap.js";
import { getDocument } from "./node.js";

type ElementOrGetter = HTMLElement | null | (() => HTMLElement | null);

const raf = (fn: VoidFunction) => {
  const frameId = requestAnimationFrame(() => fn());
  return () => cancelAnimationFrame(frameId);
};

export type TrapFocusOptions = Omit<FocusTrapOptions, "document">;

export function trapFocus(el: ElementOrGetter, options: TrapFocusOptions = {}) {
  let trap: FocusTrap | undefined;
  const cleanup = raf(() => {
    const contentEl = typeof el === "function" ? el() : el;
    if (!contentEl) return;

    trap = new FocusTrap(contentEl, {
      escapeDeactivates: false,
      allowOutsideClick: true,
      preventScroll: true,
      returnFocusOnDeactivate: true,
      delayInitialFocus: false,
      fallbackFocus: contentEl,
      ...options,
      document: getDocument(contentEl),
    });

    try {
      trap.activate();
    } catch {
      // intentionally empty
    }
  });

  return function destroy() {
    trap?.deactivate();
    cleanup();
  };
}

export { FocusTrap, type FocusTrapOptions };
