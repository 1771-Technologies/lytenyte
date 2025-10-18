import { getActiveElement } from "../dom-utils/index.js";
import type { ScrollIntoViewFn } from "../+types.non-gen.js";
import type { PositionUnion } from "../+types.js";
import { handleViewportFocused } from "./key-handler/handle-viewport-focused.js";

export interface NavigatorParams {
  readonly viewport: HTMLElement;
  readonly gridId: string;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly position: { get: () => PositionUnion | null; set: (p: PositionUnion | null) => void };

  readonly nextKey: string;
  readonly prevKey: string;
  readonly upKey: string;
  readonly downKey: string;
  readonly homeKey: string;
  readonly endKey: string;
  readonly pageUpKey: string;
  readonly pageDownKey: string;
}
export function navigator({
  viewport,
  scrollIntoView,
  gridId,
  position: cp,
  nextKey,
  prevKey,
  upKey,
  downKey,
  homeKey,
  endKey,
  pageDownKey,
  pageUpKey,
}: NavigatorParams) {
  const keys = new Set([nextKey, prevKey, endKey, homeKey, upKey, downKey, pageDownKey, pageUpKey]);

  const handleKey = (ev: KeyboardEvent) => {
    const key = ev.key;
    const shouldHandle = () => true; // Temp placeholder for eventual handle hook

    // First is determining if the key should be handled.
    // Handling the key will prevent any further navigation.
    if (!keys.has(key) || !shouldHandle()) return;

    const beforeKey = () => {
      // Placeholder for now
    };

    const afterKey = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };

    // If the element itself is focused, then only the down key or next key should do something.
    // The down key and next key do the same thing in this case. They focus the first item in the grid.
    // The element should be focusable. The idea is you tab to it and then use arrow keys to navigate
    // through the elements.
    if (viewport === getActiveElement(document)) {
      if (key !== nextKey && key !== downKey) return;
      handleViewportFocused({ afterKey, beforeKey, gridId, scrollIntoView, viewport });
      return;
    }

    // Grab our current position. This must be tracked with the focus tracker.
    // The current position may be null. However, this function should be called from the event handler of
    // the viewport. This means there is something focused in the grid but it is not a grid element, or within
    // a grid element. This can happen if the user renders something focusable without using the grid components.
    // If that's the case, we should just ignore it.
    const pos = cp.get();
    if (!pos) return;

    // At this point we have our key and a direction. Some keys can only fire for a given position. For example,
    // pageUp and pageDown must be on a grid cell or full width position.

    // Paging up or down only works on grid cells or full width rows.
    const isCell = pos.kind === "full-width" || pos.kind === "cell";
    if ((key === pageUpKey || key === pageDownKey) && !isCell) return;

    // The next and previous values for a full width position can only move in a few ways.
    if ((key === nextKey || key === prevKey) && pos.kind === "full-width") {
      //
    }

    // At this point we have ways to handle the navigation depending on the key being pressed.
    if (key === nextKey || key === prevKey) {
      //
    } else if (key === upKey || key === downKey) {
      //
    }
  };

  return handleKey;
}
