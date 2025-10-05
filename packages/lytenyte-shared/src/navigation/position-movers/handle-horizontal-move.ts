import { runWithBackoff } from "@1771technologies/lytenyte-shared";
import type { GridAtom, PositionGridCell, PositionUnion } from "../../+types.js";
import { cycleInner } from "../cycle-inner.js";
import { getColSpanFromEl } from "../getters/get-col-span-from-el.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { getCellQuery } from "../getters/get-cell-query.js";
import { getLastTabbable } from "@1771technologies/lytenyte-shared";
import { getHeaderRows } from "../getters/get-header-rows.js";
import { getColIndexFromEl } from "../getters/get-col-index-from-el.js";

export interface HandleHorizontalMoveParams {
  readonly gridId: string;
  readonly isBackward: boolean;
  readonly isModified: boolean;

  readonly position: PositionUnion;
  readonly viewport: HTMLElement;
  readonly nearest: HTMLElement;
  readonly active: HTMLElement;

  readonly columnCount: number;

  readonly getRootCell: RootCellFn;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly isRowDetailExpanded: (rowIndex: number) => boolean;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;
}

export function handleHorizontalMove({
  gridId,
  nearest,
  active,
  isBackward,
  isModified,
  position: pos,
  columnCount,
  viewport,
  focusActive,

  getRootCell,
  scrollIntoView,
}: HandleHorizontalMoveParams) {
  // For full-width and detail rows the horizontal navigation should simply cycle through the tabbable elements.
  // This is because these elements do not have any cells within them. Hence there is no concept of next cell or
  // previous cell.
  if (pos.kind === "full-width" || pos.kind === "detail") {
    // The full width row implementation is a row wrapped with a cell. The code will search for the nearest row, but
    // the first cell in the full width row is actually what has the focus. Hence we cycle through the first element child
    // when the position is a full width row.
    const element = pos.kind === "detail" ? nearest : (nearest.firstElementChild as HTMLElement);
    cycleInner(element, active, isBackward, true);
    return;
  }

  // Try cycling through the inner tabbables of the cell before moving on.
  // If the focus was successfully moved then we return early since
  // we are still cycling through the tabbables of the cell.
  if (!isModified && cycleInner(nearest, active, isBackward, false)) return;

  if (pos.kind === "cell") {
    const nextIndex = isBackward
      ? isModified
        ? 0
        : getColIndexFromEl(nearest) - 1
      : isModified
        ? columnCount - 1
        : getColIndexFromEl(nearest) + getColSpanFromEl(nearest);

    // The root cell will definitely not be a full width cell since we focusing a normal cell.
    const root = getRootCell(pos.rowIndex, nextIndex) as PositionGridCell | null;
    if (!root) return;

    const { colIndex, rowIndex } = root.root ?? root;
    scrollIntoView({ column: nextIndex, behavior: "instant" });

    // The next cell to focus may be out virtualized out of the view, and hence not mounted to the DOM. We run with
    // a bit of backoff to give the cell some time to render into view.
    runWithBackoff(() => {
      const cell = viewport.querySelector(getCellQuery(gridId, rowIndex, colIndex)) as HTMLElement;
      if (!cell) return false;
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
    }, [4, 16, 16]);
    return;
  }

  // Floating and header cells are more or less like grid cells, except there is no row index tracking.
  if (pos.kind === "floating-cell" || pos.kind === "header-cell") {
    const nextIndex = isBackward
      ? isModified
        ? 0
        : pos.colIndex - 1
      : isModified
        ? columnCount - 1
        : pos.colIndex + 1;

    scrollIntoView({ column: nextIndex, behavior: "instant" });
    runWithBackoff(() => {
      const header = viewport.querySelector('[data-ln-header="true"]') as HTMLElement;
      if (!header) return false;

      const query =
        pos.kind === "floating-cell"
          ? `[data-ln-header-cell="true"][data-ln-header-floating="true"][data-ln-colindex="${nextIndex}"]`
          : `[data-ln-header-cell="true"][data-ln-colindex="${nextIndex}"]`;

      const cell = header.querySelector(query) as HTMLElement;
      if (!cell) return false;

      if (isBackward) {
        const last = getLastTabbable(cell);
        if (last) {
          last.focus();
        } else {
          cell.focus();
        }
      } else {
        cell.focus();
      }
      return true;
    }, [4, 16, 16]);
  }

  // Header group cells search for a matching next index. The next cell must be on the same level or lower
  if (pos.kind === "header-group-cell") {
    const nextIndex = isBackward
      ? isModified
        ? 0
        : pos.columnStartIndex - 1
      : isModified
        ? columnCount - 1
        : pos.columnEndIndex;

    scrollIntoView({ column: nextIndex, behavior: "instant" });

    runWithBackoff(() => {
      const allRows = getHeaderRows(viewport);
      if (!allRows) return false;

      const index = allRows.findIndex((c) => c.contains(active));
      const headerRows = allRows.slice(index);

      let cell: HTMLElement | null = null;
      for (const row of headerRows) {
        for (const header of Array.from(row.children) as HTMLElement[]) {
          const range = header.getAttribute("data-ln-header-range");
          if (!range) continue;

          const [start, end] = range.split(",").map((c) => Number.parseInt(c));
          if (start <= nextIndex && end > nextIndex) {
            cell = header;
            break;
          }
        }
        if (cell) break;
      }
      if (!cell) return false;

      if (isBackward) {
        const last = getLastTabbable(cell);
        if (last) last.focus();
        else cell.focus();
      } else {
        cell.focus();
      }

      return true;
    }, [4, 16, 16]);
  }
}
