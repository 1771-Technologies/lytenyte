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
import { isDetailCell } from "./predicates/is-detail-cell.js";

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
  readonly isRowDetailExpanded: (rowIndex: number) => boolean;
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
  isRowDetailExpanded,
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
  const nearest = getNearestMatching(
    active,
    (el) => isCell(el) || isFullWidthRow(el) || isDetailCell(el),
  );

  // If we don't find a matching position, then we should just return and let the event happen as normal.
  // The developer must've placed a special div in some part of the grid that is not within a grid row/header
  if (!nearest) return;

  // This key is going to have an action. Since it will have an actions we prevent it
  // and stop the propagation any further. This function should be attached to the viewport,
  // hence it should still allow elements within the grid to handle keys.
  e.preventDefault();
  e.stopPropagation();

  const pos = focusActive.get()!;

  const isHorizontal = key === startKey || key === endKey;
  const isModified = e.ctrlKey || e.metaKey;

  if (isHorizontal) {
    const isBackward = key === startKey;
    // Handle the horizontal navigation of cells.
    if (pos.kind === "cell") {
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
          : pos.colIndex - 1
        : isModified
          ? columnCount - 1
          : pos.colIndex + getColSpanFromEl(nearest);

      // The root cell will definitely not be a full width cell, but we can check anyway to satisfy TypeScript.
      const root = getRootCell(pos.rowIndex, nextIndex);
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
              focusActive.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
            }
          } else {
            cell.focus();
            focusActive.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
          }

          return true;
        }

        return false;
      }, [4, 16, 16]);
      return;
    }

    // Handle the full width row position
    if (pos.kind === "full-width" || pos.kind === "detail") {
      cycleInner(
        pos.kind === "detail" ? nearest : (nearest.firstElementChild as HTMLElement),
        active,
        isBackward,
        true,
      );
      return;
    }
  } else {
    // We must be moving vertically at this point.
    const isUp = key === upKey;

    if (pos.kind === "full-width" || pos.kind === "cell" || pos.kind === "detail") {
      // We want to move up one cell
      let next!: number;

      let nextIsDetail = false;
      if (isUp) {
        if (isModified) next = 0;
        else if (pos.kind === "detail") next = pos.rowIndex;
        else {
          next = pos.rowIndex - 1;
          nextIsDetail = isRowDetailExpanded(next);
        }
      } else {
        if (isModified) next = rowCount - 1;
        else if (pos.kind === "detail") next = pos.rowIndex + 1;
        else {
          nextIsDetail = isRowDetailExpanded(pos.rowIndex);
          if (nextIsDetail) next = pos.rowIndex;
          else next = pos.rowIndex + (pos.kind === "full-width" ? 1 : getRowSpanFromEl(nearest));
        }
      }

      const root = getRootCell(next, pos.colIndex);
      if (!root) return;
      const { rowIndex, colIndex } = root.kind === "cell" ? (root.root ?? root) : root;

      scrollIntoView({ row: next, column: colIndex, behavior: "instant" });
      runWithBackoff(() => {
        // Our root is either a full width row or its a cell.
        const query = nextIsDetail
          ? `[data-ln-gridid="${gridId}"][data-ln-rowindex="${next}"][data-ln-row-detail="true"]`
          : root.kind === "full-width"
            ? getRowQuery(gridId, rowIndex)
            : getCellQuery(gridId, rowIndex, colIndex);
        const element = viewport.querySelector(query) as HTMLElement;

        if (element) {
          if (root.kind === "full-width") {
            if (nextIsDetail) element.focus();
            else (element.firstElementChild as HTMLElement).focus();
          } else {
            element.focus();
            focusActive.set((prev) => ({ ...prev, colIndex: pos.colIndex }) as PositionGridCell);
          }
          return true;
        }
        return false;
      }, [4, 16, 16]);
    }
  }
}
