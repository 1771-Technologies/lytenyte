import { getActiveElement, getLastTabbable } from "../dom-utils/index.js";
import type { ScrollIntoViewFn } from "../+types.non-gen.js";
import type { PositionGridCell } from "../+types.js";
import { handleViewportFocused } from "./key-handler/handle-viewport-focused.js";
import { handleInnerItemFocus } from "./key-handler/handle-inner-item-focus.js";
import { nearestFocusable } from "./nearest-focusable.js";
import { getColIndex, getColSpan } from "./attributes.js";
import type { PositionState, RootCellFn } from "./+types.js";
import { BACKOFF_RUNS } from "./constants.js";
import { runWithBackoff } from "../js-utils/index.js";
import { queryCell } from "./query.js";

export interface NavigatorParams {
  readonly viewport: HTMLElement;
  readonly gridId: string;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;

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
}
export function navigator({
  viewport,
  scrollIntoView,
  getRootCell,

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
}: NavigatorParams) {
  const keys = new Set([nextKey, prevKey, endKey, homeKey, upKey, downKey, pageDownKey, pageUpKey]);

  const handleKey = (ev: KeyboardEvent) => {
    const key = ev.key;
    const shouldHandle = () => true; // Temp placeholder for eventual handle hook
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
      const isBack = key === prevKey;
      if (pos.kind === "full-width") {
        // Full width rows cycle through their focus items.
        // -- cycleInnerHook
        handleInnerItemFocus(posElement, active, isBack, true);
        done();
        return;
      }

      if (pos.kind === "cell") {
        // Check if we can cycle inner.
        // -- cycleInnerHook
        if (!modified) {
          const result = handleInnerItemFocus(posElement, active, isBack, false);
          if (result) {
            done();
            return;
          }
        }

        const elColSpan = Number.parseInt(getColSpan(posElement)!);
        const elColIndex = Number.parseInt(getColIndex(posElement)!);

        // Nothing to do
        if ((elColIndex === 0 && isBack) || (elColIndex + elColSpan >= columnCount && !isBack))
          return;

        const nextIndex = isBack
          ? modified
            ? 0
            : elColIndex - 1
          : modified
            ? columnCount - 1
            : elColIndex + elColSpan;

        const root = getRootCell(pos.rowIndex, nextIndex) as PositionGridCell | null;
        console.log(pos.rowIndex);
        if (!root) return;

        const { colIndex, rowIndex } = root.root ?? root;
        scrollIntoView({ column: nextIndex, behavior: "instant" });

        done();

        // The next cell to focus may be out virtualized out of the view, and hence not mounted to the DOM. We run with
        // a bit of backoff to give the cell some time to render into view.
        runWithBackoff(() => {
          const cell = queryCell(gridId, rowIndex, colIndex, viewport);

          if (!cell) return false;

          // If we are moving backward we focus the last tabbable if present otherwise we focus the cell itself.
          if (isBack) {
            // -- cycleInnerHook
            const last = getLastTabbable(cell);
            if (last) {
              last.focus();
            } else {
              cell.focus();
              cp.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
            }
          } else {
            cell.focus();
            cp.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
          }
          return true;
        }, BACKOFF_RUNS());
      }
    }
  };

  return handleKey;
}
