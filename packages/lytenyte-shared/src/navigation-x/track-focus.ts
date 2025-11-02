import type { PositionUnion } from "../+types";
import { getWindow } from "../dom-utils/get-window.js";
import { equal } from "../js-utils/index.js";
import type { PositionState } from "./+types";
import { cellEqual } from "./cell-equal.js";
import { nearestFocusable } from "./nearest-focusable.js";
import { positionFromElement } from "./position-from-element.js";

export interface TrackFocusParams {
  readonly gridId: string;
  readonly focusActive: PositionState;
  readonly onElementFocused: (has: boolean) => void;
  readonly onHasFocusChange: (has: boolean) => void;
  readonly element: HTMLElement;
}

export function trackFocus({
  gridId,
  focusActive,
  onHasFocusChange,
  onElementFocused,
  element,
}: TrackFocusParams): () => void {
  const controller = new AbortController();

  const onFocusChange = (p: PositionUnion | null) => {
    const c = focusActive.get();
    if ((p?.kind === "cell" && c?.kind === "cell" && cellEqual(p, c)) || equal(p, c)) return;
    if (p?.kind === "full-width" && c?.kind === "full-width" && c.rowIndex === p.rowIndex) return;
    if (p?.kind === "detail" && c?.kind === "detail" && c.rowIndex === p.rowIndex) return;

    if (equal(p, c)) return;

    focusActive.set(p);
  };

  element.addEventListener(
    "focusin",
    (ev) => {
      onHasFocusChange(true);

      const el = nearestFocusable(gridId, ev.target as HTMLElement);
      if (!el) {
        onHasFocusChange(false);
        onFocusChange(null);
        return;
      }

      const position = positionFromElement(gridId, el);

      onFocusChange(position);
    },
    { signal: controller.signal },
  );

  element.addEventListener(
    "focusout",
    (ev) => {
      if (!getWindow(element).document.hasFocus()) return;

      if (ev.relatedTarget && element.contains(ev.relatedTarget as HTMLElement)) return;

      onHasFocusChange(false);
      onFocusChange(null);
    },
    { signal: controller.signal },
  );

  element.addEventListener("focus", () => onElementFocused(true), { signal: controller.signal });
  element.addEventListener("blur", () => onElementFocused(false), { signal: controller.signal });

  return () => {
    controller.abort();
  };
}
