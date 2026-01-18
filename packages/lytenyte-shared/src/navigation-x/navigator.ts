import { getActiveElement, getNearestMatching, isTextInputFocused } from "../dom-utils/index.js";
import type { ScrollIntoViewFn } from "../types.js";
import { handleViewportFocused } from "./key-handler/handle-viewport-focused.js";
import { nearestFocusable } from "./nearest-focusable.js";
import type { PositionState, RootCellFn } from "./+types.js";
import { handleHorizontal } from "./key-handler/handle-horizontal.js";
import { handleVertical } from "./key-handler/handle-vertical.js";
import { handleHomeEnd } from "./key-handler/handle-home-end.js";
import { handlePageKeys } from "./key-handler/handle-page-keys.js";

export interface NavigatorParams {
  readonly viewport: HTMLElement;
  readonly gridId: string;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly isRowDetailExpanded: (rowIndex: number) => boolean;

  readonly position: PositionState;

  readonly nextKey: string;
  readonly prevKey: string;
  readonly upKey: string;
  readonly downKey: string;
  readonly homeKey: string;
  readonly endKey: string;
  readonly pageUpKey: string;
  readonly pageDownKey: string;

  readonly columnCount: number;
  readonly rowCount: number;
}
export function navigator({
  viewport,
  scrollIntoView,
  getRootCell,
  isRowDetailExpanded,

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

  columnCount,
  rowCount,
}: NavigatorParams) {
  const keys = new Set([nextKey, prevKey, endKey, homeKey, upKey, downKey, pageDownKey, pageUpKey]);

  const handleKey = (
    ev: {
      key: string;
      ctrlKey: boolean;
      metaKey: boolean;
      preventDefault: () => void;
      stopPropagation: () => void;
    },
    ignoreInputFocus: boolean,
  ) => {
    const key = ev.key;
    const shouldHandle = () => true; // Temp placeholder for eventual handle hook

    // If the user is pressing tab, then we should skip the remaining cells and move to the next
    // element. This is slightly different than what may be expected, but makes the most sense.
    // A grid will have 1000s of cells, tabbing through them is not feasible.
    if (ev.key === "Tab") {
      viewport.inert = true;
      setTimeout(() => (viewport.inert = false));
      ev.stopPropagation();
      return;
    }

    const modified = ev.ctrlKey || ev.metaKey;

    const done = () => {
      ev.preventDefault();
      ev.stopPropagation();
    };

    // First is determining if the key should be handled.
    // Handling the key will prevent any further navigation.
    if (!keys.has(key) || !shouldHandle()) return;

    // Placeholder hooks for now
    const beforeKey = () => {};
    const afterKey = () => {};

    const active = getActiveElement(document)!;

    // If the element itself is focused, then only the down key or next key should do something.
    // The down key and next key do the same thing in this case. They focus the first item in the grid.
    // The element should be focusable. The idea is you tab to it and then use arrow keys to navigate
    // through the elements.
    if (viewport === active) {
      if (key !== nextKey && key !== downKey) return;

      const isNested = getNearestMatching(
        viewport.parentElement!,
        (el) => el.getAttribute("data-ln-gridid") != null,
      );
      if (isNested && key === downKey) return;

      handleViewportFocused({ afterKey, beforeKey, gridId, scrollIntoView, viewport });

      done();
      return;
    }

    // Grab our current position. This must be tracked with the focus tracker.
    // The current position may be null. However, this function should be called from the event handler of
    // the viewport. This means there is something focused in the grid but it is not a grid element, or within
    // a grid element. This can happen if the user renders something focusable without using the grid components.
    // If that's the case, we should just ignore it.
    const pos = cp.get();
    const posElement = nearestFocusable(gridId, active!);
    if (!pos || !posElement) return;

    // At this point we have our key and a direction. Some keys can only fire for a given position. For example,
    // pageUp and pageDown must be on a grid cell or full width position.

    // Paging up or down only works on grid cells or full width rows.
    const isCell = pos.kind === "full-width" || pos.kind === "cell";
    if ((key === pageUpKey || key === pageDownKey) && !isCell) return;

    if (key === nextKey || key == prevKey) {
      if (isTextInputFocused() && !ignoreInputFocus) {
        return;
      }

      const isBack = key === prevKey;
      handleHorizontal({
        isBack,
        active,
        columnCount,
        cp,
        done,
        getRootCell,
        gridId,
        modified,
        pos,
        posElement,
        scrollIntoView,
        viewport,
      });
    }

    if (key === downKey || key === upKey) {
      if (isTextInputFocused() && !ignoreInputFocus) {
        return;
      }

      const isUp = key === upKey;

      handleVertical({
        isUp,
        active,
        cp,
        done,
        gridId,
        viewport,
        modified,
        pos,
        posElement,
        scrollIntoView,
        rowCount,
        getRootCell,
        isRowDetailExpanded,
      });
    }

    if (key === endKey || key === homeKey) {
      handleHomeEnd({
        isEnd: key === endKey,
        active,
        cp,
        done,
        gridId,
        rowCount,
        pos,
        posElement,
        scrollIntoView,
        columnCount,
        getRootCell,
        modified,
        viewport,
      });
    }
    if (key === pageDownKey || key === pageUpKey) {
      handlePageKeys({
        cp,
        done,
        getRootCell,
        gridId,
        isUp: key === pageUpKey,
        pos,
        rowCount,
        scrollIntoView,
        viewport,
      });
    }
  };

  return handleKey;
}
