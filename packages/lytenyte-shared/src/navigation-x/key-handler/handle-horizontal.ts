import type { PositionState, RootCellFn, ScrollIntoViewFn } from "../+types";
import type {
  PositionFloatingCell,
  PositionFullWidthRow,
  PositionGridCell,
  PositionUnion,
} from "../../+types";
import { runWithBackoff } from "../../js-utils/index.js";
import { getColIndex, getColSpan } from "../attributes.js";
import { BACKOFF_RUNS } from "../constants.js";
import { queryCell, queryFloatingCell, queryHeaderCell, queryHeaderCellsAtRow } from "../query.js";
import { handleFocus } from "./handle-focus.js";
import { handleInnerItemFocus } from "./handle-inner-item-focus.js";

export interface HandleHorizontalParams {
  readonly isBack: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly gridId: string;

  readonly columnCount: number;
  readonly viewport: HTMLElement;

  readonly cp: PositionState;
  readonly pos: PositionUnion;
  readonly posElement: HTMLElement;
  readonly active: HTMLElement;
  readonly done: () => void;
  readonly modified: boolean;
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
  // When the position is a header group cell, we want to navigate to the closest header group
  // or header cell. Header groups can only match on the same level. This means that if we move
  // left or right, the code should first check the next header group cell for the same level that
  // is also adjacent. If we find one, it will be focused, otherwise a normal header cell will definitely
  // be focus. This makes the horizontal navigation a bit asymmetric, since a header group cell may result
  // in a navigation to a header cell, but a header cell will never horizontally navigate to a group cell.
  if (pos.kind === "header-group-cell") {
    // Check if we can cycle inner
    // -- cycleInnerHook
    if (!modified) {
      const result = handleInnerItemFocus(posElement, active, isBack, false);
      if (result) {
        done();
        return;
      }
    }

    // For group cells, the pos.columnStartIndex is the actual column index, and the
    // pos.columnEndIndex is one past the end of the group span. We don't use the `columnIndex`
    // value of the position, since this may be somewhere in the middle of the group cell depending
    // on how we navigated to it.
    const nextIndex = isBack
      ? modified
        ? 0
        : pos.columnStartIndex - 1
      : modified
        ? columnCount - 1
        : pos.columnEndIndex;

    // If we are at the end of the navigation on either side, or the navigation does not result in a
    // change of index, we should just return and left the event propagate.
    if (nextIndex === pos.columnStartIndex || nextIndex < 0 || nextIndex >= columnCount) return;

    // If we reached this point, it means that the index is definitely valid, but we haven't focused the
    // cell yet. However, since we are going to try and focus the cell, we try scroll it into view, then
    // call done to stop event propagation.
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

  // Floating and header cells have the same navigation behavior. A horizontal navigation always
  // results in the positioning moving to another cell of the same type.
  if (pos.kind === "floating-cell" || pos.kind === "header-cell") {
    // Check if we can cycle inner
    // -- cycleInnerHook
    if (!modified) {
      const result = handleInnerItemFocus(posElement, active, isBack, false);
      if (result) {
        done();
        return;
      }
    }

    const elColIndex = Number.parseInt(getColIndex(posElement)!);
    const nextIndex = isBack ? (modified ? 0 : elColIndex - 1) : modified ? columnCount - 1 : elColIndex + 1;

    if (nextIndex < 0 || nextIndex >= columnCount || nextIndex === elColIndex) return;

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
    const element = pos.kind === "detail" ? posElement : (posElement.firstElementChild as HTMLElement);
    if (handleInnerItemFocus(element, active, isBack, true)) {
      done();
      cp.set((prev) => ({ ...prev, colIndex: pos.colIndex }) as PositionFullWidthRow);
    }
    return;
  }

  // Grid cells have a few cases to focus. Firstly there may focusable elements within the grid cell. Like other cells
  // we cycle through these. Next a grid cell may span rows or columns, so we need to handle these cases correctly. Finally,
  // the next or previous cell may also span rows or columns. The spanning complicates things, and means we have to use the
  // getRootCell function that returns the actual cell for a given position. However, whilst navigating we want to maintain the
  // row index of what is being navigated - especially when navigating across spans.
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

    const nextIndex = isBack
      ? modified
        ? 0
        : elColIndex - 1
      : modified
        ? columnCount - 1
        : elColIndex + elColSpan;

    if (nextIndex < 0 || nextIndex >= columnCount || nextIndex === elColIndex) return;

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
