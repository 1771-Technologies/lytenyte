import { getActiveElement } from "../dom-utils/index.js";
import type { ScrollIntoViewFn } from "../+types.non-gen.js";
import { handleViewportFocused } from "./key-handler/handle-viewport-focused.js";
import { nearestFocusable } from "./nearest-focusable.js";
import type { PositionState, RootCellFn } from "./+types.js";
import { handleHorizontal } from "./key-handler/handle-horizontal.js";
import { runWithBackoff } from "../js-utils/index.js";
import { handleFocus } from "./key-handler/handle-focus.js";
import { queryHeaderCellsAtRow } from "./query.js";
import { BACKOFF_RUNS } from "./constants.js";
import { getRowIndex } from "./attributes.js";
import type { PositionHeaderCell } from "../+types.js";

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
      const isUp = key === upKey;

      if (pos.kind === "header-group-cell" || pos.kind === "header-cell") {
        const index = Number.parseInt(getRowIndex(active)!);
        const nextIndex = isUp ? index - 1 : index + 1;
        if (nextIndex < 0) return;

        const colIndex = pos.colIndex;
        scrollIntoView({ column: pos.colIndex, behavior: "instant" });
        done();

        runWithBackoff(() => {
          return handleFocus(
            false,
            () => {
              const cells = queryHeaderCellsAtRow(gridId, nextIndex, viewport);

              return (
                cells.find((el) => {
                  const range = el.getAttribute("data-ln-header-range");
                  if (!range) return;
                  const [start, end] = range.split(",").map((c) => Number.parseInt(c));
                  return colIndex >= start && colIndex < end;
                }) ?? null
              );
            },
            () => {
              cp.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
            },
          );
        }, BACKOFF_RUNS());
      }
    }
  };

  return handleKey;
}
