import type { PositionState, RootCellFn, ScrollIntoViewFn } from "../+types";
import type { PositionFloatingCell, PositionGridCell, PositionUnion } from "../../+types";
import { runWithBackoff } from "../../js-utils/index.js";
import { getColIndex, getColSpan } from "../attributes.js";
import { BACKOFF_RUNS } from "../constants.js";
import { queryCell, queryFloatingCell, queryHeaderCell, queryHeaderCellsAtRow } from "../query.js";
import { handleFocus } from "./handle-focus.js";
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
  if (pos.kind === "header-group-cell") {
    const nextIndex = isBack
      ? modified
        ? 0
        : pos.columnStartIndex - 1
      : modified
        ? columnCount - 1
        : pos.columnEndIndex;

    scrollIntoView({ column: nextIndex, behavior: "instant" });
    done();

    runWithBackoff(() => {
      return handleFocus(isBack, () => {
        const cells = queryHeaderCellsAtRow(gridId, pos.hierarchyRowIndex, viewport);

        return (
          cells.find((el) => {
            const range = el.getAttribute("data-ln-header-range");
            if (!range) return;
            const [start, end] = range.split(",").map((c) => Number.parseInt(c));
            return nextIndex >= start && nextIndex < end;
          }) ?? null
        );
      });
    }, BACKOFF_RUNS());

    return;
  }

  if (pos.kind === "floating-cell" || pos.kind === "header-cell") {
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
      return handleFocus(
        isBack,
        () => {
          return pos.kind === "header-cell"
            ? queryHeaderCell(gridId, nextIndex, viewport)
            : queryFloatingCell(gridId, nextIndex, viewport);
        },
        () => {
          cp.set((prev) => ({ ...prev, colIndex: nextIndex }) as PositionFloatingCell);
        },
      );
    }, BACKOFF_RUNS());
    return;
  }

  // For full-width and detail rows the horizontal navigation should simply cycle through the tabbable elements.
  // This is because these elements do not have any cells within them. Hence there is no concept of next cell or
  // previous cell.
  if (pos.kind === "full-width" || pos.kind === "detail") {
    // The full width row implementation is a row wrapped with a cell. The code will search for the nearest row, but
    // the first cell in the full width row is actually what has the focus. Hence we cycle through the first element child
    // when the position is a full width row.
    // -- cycleInnerHook
    const element = pos.kind === "detail" ? active : (active.firstElementChild as HTMLElement);
    handleInnerItemFocus(element, active, isBack, true);
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
      return handleFocus(
        isBack,
        () => queryCell(gridId, rowIndex, colIndex, viewport),
        () => {
          cp.set((prev) => ({ ...prev, rowIndex: pos.rowIndex }) as PositionGridCell);
        },
      );
    }, BACKOFF_RUNS());
  }
}
