import {
  getActiveElement,
  getLastTabbable,
  getNearestMatching,
} from "@1771technologies/lytenyte-dom-utils";
import type { RootCellFn, ScrollIntoViewFn } from "../+types.non-gen.js";
import { isCell } from "./predicates/is-cell.js";
import { cycleInner } from "./cycle-inner.js";
import { getColSpanFromEl } from "./getters/get-col-span-from-el.js";
import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import { getCellQuery } from "./getters/get-cell-query.js";
import type { GridAtom, PositionGridCell, PositionUnion } from "../+types.js";
import { isFullWidthRow } from "./predicates/is-full-width-row.js";
import { getRowQuery } from "./getters/get-row-query.js";
import { getRowSpanFromEl } from "./getters/get-row-span-from-el.js";

interface Event {
  readonly key: string;
  readonly preventDefault: () => void;
  readonly stopPropagation: () => void;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
}

interface HandleNavigationArgs {
  readonly gridId: string;
  readonly viewport: HTMLElement;
  readonly event: Event;
  readonly rtl: boolean;

  readonly columnCount: number;
  readonly rowCount: number;

  readonly getRootCell: RootCellFn;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;
}

export function handleNavigation({
  gridId,
  event: e,
  viewport,
  rtl,
  columnCount,
  rowCount,

  getRootCell,
  scrollIntoView,
  focusActive,
}: HandleNavigationArgs) {
  // If the user is pressing tab, then we should skip the remaining cells and move to the next
  // element. This is slightly different than what may be expected, but makes the most sense.
  // A grid will have 1000s of cells, tabbing through them is not feasible.
  if (e.key === "Tab") {
    viewport.inert = true;
    setTimeout(() => (viewport.inert = false));
    return;
  }

  const startKey = rtl ? "ArrowRight" : "ArrowLeft";
  const endKey = rtl ? "ArrowLeft" : "ArrowRight";
  const upKey = "ArrowUp";
  const downKey = "ArrowDown";

  const keys = [startKey, endKey, upKey, downKey];
  const key = e.key;

  // If pressed key is not in the included navigation keys, then we can simply ignore the
  // key being pressed.
  if (!keys.includes(key)) return;

  // We need to know what our current focus position. There will definitely be an active element,
  // otherwise how is this event listener being called.
  const active = getActiveElement(document)!;
  const nearest = getNearestMatching(active, (el) => isCell(el) || isFullWidthRow(el));

  // If we don't find a matching position, then we should just return and let the event happen as normal.
  // The developer must've placed a special div in some part of the grid that is not within a grid row/header
  if (!nearest) return;

  // This key is going to have an action. Since it will have an actions we prevent it
  // and stop the propagation any further. This function should be attached to the viewport,
  // hence it should still allow elements within the grid to handle keys.
  e.preventDefault();
  e.stopPropagation();

  const position = focusActive.get()!;

  const isHorizontal = key === startKey || key === endKey;
  const isModified = e.ctrlKey || e.metaKey;

  if (isHorizontal) {
    const isBackward = key === startKey;
    // Handle the horizontal navigation of cells.
    if (position.kind === "cell") {
      if (!isModified) {
        // We need to determine the direction we are navigating. There are few horizontal navigation scenarios to  handle.
        // If the cell that has focus has tabbable items, we navigate these before moving onto the next cell.
        const didFocusInner = cycleInner(nearest, active, isBackward, false);
        if (didFocusInner) return;
      }

      // We determine the next cell - which may be a spanning cell, so we check for its root cell.
      const nextIndex = isBackward
        ? isModified
          ? 0
          : position.colIndex - 1
        : isModified
          ? columnCount - 1
          : position.colIndex + getColSpanFromEl(nearest);

      // The root cell will definitely not be a full width cell, but we can check anyway to satisfy TypeScript.
      const root = getRootCell(position.rowIndex, nextIndex);
      if (!root || root.kind === "full-width") return;

      const { colIndex, rowIndex } = root.root ?? root;

      scrollIntoView({ column: nextIndex, behavior: "instant" });
      runWithBackoff(() => {
        const cell = viewport.querySelector(
          getCellQuery(gridId, rowIndex, colIndex),
        ) as HTMLElement;
        if (cell) {
          // If we are moving backward we focus the last
          // tabbable if present otherwise we focus the cell itself.
          if (isBackward) {
            const last = getLastTabbable(cell);
            if (last) {
              last.focus();
            } else {
              cell.focus();
              focusActive.set(
                (prev) => ({ ...prev, rowIndex: position.rowIndex }) as PositionGridCell,
              );
            }
          } else {
            cell.focus();
            focusActive.set(
              (prev) => ({ ...prev, rowIndex: position.rowIndex }) as PositionGridCell,
            );
          }

          return true;
        }

        return false;
      }, [4, 16, 16]);
      return;
    }

    // Handle the full width row position
    if (position.kind === "full-width") {
      // Just try cycle through the items.
      cycleInner(nearest.firstElementChild as HTMLElement, active, isBackward, true);
      return;
    }
  } else {
    // We must be moving vertically at this point.
    const isUp = key === upKey;

    if (position.kind === "full-width" || position.kind === "cell") {
      // We want to move up one cell
      const next = isUp
        ? isModified
          ? 0
          : position.rowIndex - 1
        : isModified
          ? rowCount - 1
          : position.rowIndex + (position.kind === "full-width" ? 1 : getRowSpanFromEl(nearest));

      const root = getRootCell(next, position.colIndex);
      if (!root) return;
      const { rowIndex, colIndex } = root.kind === "cell" ? (root.root ?? root) : root;

      scrollIntoView({ row: next, column: colIndex, behavior: "instant" });
      runWithBackoff(() => {
        // Our root is either a full width row or its a cell.
        const query =
          root.kind === "full-width"
            ? getRowQuery(gridId, rowIndex)
            : getCellQuery(gridId, rowIndex, colIndex);
        const element = viewport.querySelector(query) as HTMLElement;

        if (element) {
          if (root.kind === "full-width") (element.firstElementChild as HTMLElement).focus();
          else {
            element.focus();
            focusActive.set(
              (prev) => ({ ...prev, colIndex: position.colIndex }) as PositionGridCell,
            );
          }
          return true;
        }
        return false;
      }, [4, 16, 16]);
    }
  }
}
