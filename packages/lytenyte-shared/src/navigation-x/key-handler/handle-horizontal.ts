import type { PositionState, RootCellFn, ScrollIntoViewFn } from "../+types";
import type { PositionFloatingCell, PositionGridCell, PositionUnion } from "../../+types";
import { getLastTabbable } from "../../dom-utils/index.js";
import { runWithBackoff } from "../../js-utils/index.js";
import { getColIndex, getColSpan } from "../attributes.js";
import { BACKOFF_RUNS } from "../constants.js";
import { queryCell, queryFloatingCell } from "../query.js";
import { handleInnerItemFocus } from "./handle-inner-item-focus.js";

export interface HandleHorizontalParams {
  isBack: boolean;
  scrollIntoView: ScrollIntoViewFn;
  getRootCell: RootCellFn;
  gridId: string;

  columnCount: number;
  viewport: HTMLElement;

  cp: PositionState;
  pos: PositionUnion;
  posElement: HTMLElement;
  active: HTMLElement;
  done: () => void;
  modified: boolean;
}

export function handleHorizontal({
  isBack,
  viewport,
  scrollIntoView,
  getRootCell,
  columnCount,
  gridId,
  pos,
  posElement,
  active,
  cp,
  done,
  modified,
}: HandleHorizontalParams) {
  if (pos.kind === "floating-cell") {
    // Check if we can cycle inner
    // -- cycleInnerHook
    if (!modified) {
      const result = handleInnerItemFocus(posElement, active, isBack, true);
      if (result) {
        done();
        return;
      }
    }

    const elColIndex = Number.parseInt(getColIndex(posElement)!);
    if ((elColIndex === 0 && isBack) || (elColIndex >= columnCount - 1 && !isBack)) return;
    const nextIndex = isBack
      ? modified
        ? 0
        : elColIndex - 1
      : modified
        ? columnCount - 1
        : elColIndex + 1;

    scrollIntoView({ column: nextIndex, behavior: "instant" });
    done();

    runWithBackoff(() => {
      const header = queryFloatingCell(gridId, nextIndex, viewport);

      if (!header) return false;
      if (isBack) {
        // -- cycleInnerHook
        const last = getLastTabbable(header);
        if (last) last.focus();
        else header.focus();

        cp.set((prev) => ({ ...prev, colIndex: nextIndex }) as PositionFloatingCell);
      } else {
        header.focus();
        cp.set((prev) => ({ ...prev, colIndex: nextIndex }) as PositionFloatingCell);
      }
      return true;
    }, BACKOFF_RUNS());
  }

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
    if ((elColIndex === 0 && isBack) || (elColIndex + elColSpan >= columnCount && !isBack)) return;

    const nextIndex = isBack
      ? modified
        ? 0
        : elColIndex - 1
      : modified
        ? columnCount - 1
        : elColIndex + elColSpan;

    const root = getRootCell(pos.rowIndex, nextIndex) as PositionGridCell | null;
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
        if (last) last.focus();
        else cell.focus();

        cp.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
      } else {
        cell.focus();
        cp.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
      }
      return true;
    }, BACKOFF_RUNS());
  }
}
