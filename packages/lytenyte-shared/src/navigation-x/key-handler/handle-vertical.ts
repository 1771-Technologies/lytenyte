import type { PositionState, RootCellFn, ScrollIntoViewFn } from "../+types.js";
import type { PositionHeaderCell, PositionUnion } from "../../+types.js";
import { getFirstTabbable } from "../../dom-utils/index.js";
import { runWithBackoff } from "../../js-utils/index.js";
import { getRowIndex } from "../attributes.js";
import { BACKOFF_RUNS } from "../constants.js";
import {
  queryCell,
  queryDetail,
  queryFloatingCell,
  queryFullWidthRow,
  queryHeader,
  queryHeaderCellsAtRow,
} from "../query.js";
import { handleFocusCellFromRoot } from "./handle-focus-cell-from-root.js";
import { handleFocus } from "./handle-focus.js";

export interface HandleVerticalParams {
  readonly isUp: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly gridId: string;
  readonly getRootCell: RootCellFn;
  readonly viewport: HTMLElement;
  readonly cp: PositionState;
  readonly pos: PositionUnion;
  readonly posElement: HTMLElement;
  readonly active: HTMLElement;
  readonly done: () => void;
  readonly modified: boolean;
  readonly rowCount: number;
  readonly isRowDetailExpanded: (rowIndex: number) => boolean;
}

export function handleVertical(params: HandleVerticalParams) {
  const {
    isUp,
    scrollIntoView,
    done,
    active,
    pos,
    posElement,
    cp,
    gridId,
    viewport,
    getRootCell,
    modified,
    rowCount,
    isRowDetailExpanded,
  } = params;

  // Header cells can move up to a group a cell if it present, or down
  // to a floating cell or the first row. The header element will have the total header row
  // count and if floating rows are enabled. Floating rows do not count as part of the row count.
  if (pos.kind === "header-cell") {
    const header = queryHeader(gridId, viewport);
    if (!header) return;

    const rowCount = Number.parseInt(header.getAttribute("data-ln-rowcount")!);

    if (isUp) {
      if (rowCount === 1) return;

      // Row count is already one passed the end, hence,
      // rowCount - 1 is the last row, and rowCount - 2 is the second last row
      const nextIndex = Number.parseInt(getRowIndex(active)!) - 1;

      scrollIntoView({ column: pos.colIndex, behavior: "instant" });
      done();

      const colIndex = pos.colIndex;
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
      return;
    }

    const hasFloating = header.getAttribute("data-ln-floating") === "true";

    if (hasFloating) {
      scrollIntoView({ column: pos.colIndex, behavior: "instant" });
      done();

      runWithBackoff(() => {
        return handleFocus(false, () => {
          return queryFloatingCell(gridId, pos.colIndex, header);
        });
      }, BACKOFF_RUNS());
    } else {
      const root = getRootCell(0, pos.colIndex);
      if (!root) return;

      const { colIndex, rowIndex } =
        root.kind === "full-width"
          ? { rowIndex: root.rowIndex, colIndex: pos.colIndex }
          : (root.root ?? root);

      scrollIntoView({
        column: root.kind === "full-width" ? undefined : colIndex,
        row: rowIndex,
        behavior: "instant",
      });
      done();

      runWithBackoff(() => {
        return handleFocus(
          false,
          () => {
            if (root.kind === "full-width") return queryFullWidthRow(gridId, rowIndex, viewport);
            else return queryCell(gridId, rowIndex, colIndex, viewport);
          },
          () => {
            cp.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
          },
        );
      }, BACKOFF_RUNS());
    }

    return;
  }

  if (pos.kind === "header-group-cell") {
    const header = queryHeader(gridId, viewport);
    if (!header) return;

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
    return;
  }

  if (pos.kind === "floating-cell") {
    const header = queryHeader(gridId, viewport);
    if (!header) return;

    // If we are going up then we must focus the header cell. There is nothing else to focus.
    if (isUp) {
      scrollIntoView({ column: pos.colIndex, behavior: "instant" });
      done();

      const rowCount = Number.parseInt(header.getAttribute("data-ln-rowcount")!);

      runWithBackoff(() => {
        return handleFocus(false, () => {
          const cells = queryHeaderCellsAtRow(gridId, rowCount - 1, header);
          return cells.find(
            (c) =>
              c.getAttribute("data-ln-colindex") === posElement.getAttribute("data-ln-colindex"),
          );
        });
      }, BACKOFF_RUNS());
    } else {
      const root = getRootCell(0, pos.colIndex);
      if (!root) return;

      const { colIndex, rowIndex } =
        root.kind === "full-width"
          ? { rowIndex: root.rowIndex, colIndex: pos.colIndex }
          : (root.root ?? root);

      scrollIntoView({
        column: root.kind === "full-width" ? undefined : colIndex,
        row: rowIndex,
        behavior: "instant",
      });
      done();

      runWithBackoff(() => {
        return handleFocus(
          false,
          () => {
            if (root.kind === "full-width") return queryFullWidthRow(gridId, rowIndex, viewport);
            else return queryCell(gridId, rowIndex, colIndex, viewport);
          },
          () => {
            cp.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
          },
        );
      }, BACKOFF_RUNS());
    }
    return;
  }

  if (modified && (pos.kind === "full-width" || pos.kind === "cell" || pos.kind === "detail")) {
    const nextIndex = isUp ? 0 : rowCount - 1;
    if (nextIndex === pos.rowIndex) return;

    const root = getRootCell(nextIndex, pos.colIndex);
    handleFocusCellFromRoot(params, root);

    return;
  }

  if (pos.kind === "full-width" || pos.kind === "cell") {
    if (isUp && pos.rowIndex === 0 && !modified) return handleFocusHeaderFromRow(params);

    if (!isUp && isRowDetailExpanded(pos.rowIndex) && !modified) {
      scrollIntoView({ row: pos.rowIndex, behavior: "instant" });
      done();

      runWithBackoff(() => {
        return handleFocus(
          false,
          () => {
            const detail = queryDetail(gridId, pos.rowIndex, viewport);
            return detail ? (getFirstTabbable(detail) ?? detail) : detail;
          },
          () => {
            console.log(pos.colIndex);
            cp.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
          },
        );
      }, BACKOFF_RUNS());
      return;
    }

    let nextIndex: number;
    if (pos.kind === "full-width") {
      nextIndex = isUp ? pos.rowIndex - 1 : pos.rowIndex + 1;
    } else {
      nextIndex = isUp
        ? pos.root
          ? pos.root.rowIndex - 1
          : pos.rowIndex - 1
        : pos.root
          ? pos.root.rowIndex + pos.root.rowSpan
          : pos.rowIndex + 1;
    }

    if (isUp && isRowDetailExpanded(nextIndex) && !modified) {
      scrollIntoView({ row: nextIndex, behavior: "instant" });
      done();
      runWithBackoff(() => {
        return handleFocus(
          false,
          () => {
            const detail = queryDetail(gridId, nextIndex, viewport);
            return detail ? (getFirstTabbable(detail) ?? detail) : detail;
          },
          () => {
            cp.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionHeaderCell);
          },
        );
      }, BACKOFF_RUNS());
      return;
    }

    const root = getRootCell(nextIndex, pos.colIndex);

    handleFocusCellFromRoot(params, root);

    return;
  }

  if (pos.kind === "detail") {
    if (isUp) {
      scrollIntoView({ row: pos.rowIndex, column: pos.colIndex, behavior: "instant" });
      done();

      const root = getRootCell(pos.rowIndex, pos.colIndex);

      return handleFocusCellFromRoot(params, root);
    }

    const next = pos.rowIndex + 1;
    const root = getRootCell(next, pos.colIndex);

    handleFocusCellFromRoot(params, root);
  }
}

function handleFocusHeaderFromRow({
  gridId,
  viewport,
  scrollIntoView,
  done,
  pos,
}: HandleVerticalParams) {
  const header = queryHeader(gridId, viewport);
  if (!header) return;
  const rowCount = Number.parseInt(header.getAttribute("data-ln-rowcount")!);
  const hasFloating = header.getAttribute("data-ln-floating") === "true";

  scrollIntoView({ column: pos.colIndex, behavior: "instant" });
  done();

  runWithBackoff(() => {
    return handleFocus(false, () => {
      if (hasFloating) return queryFloatingCell(gridId, pos.colIndex, header);

      const colIndex = pos.colIndex;
      const cells = queryHeaderCellsAtRow(gridId, rowCount - 1, viewport);
      return (
        cells.find((el) => {
          const range = el.getAttribute("data-ln-header-range");
          if (!range) return;
          const [start, end] = range.split(",").map((c) => Number.parseInt(c));
          return colIndex >= start && colIndex < end;
        }) ?? null
      );
    });
  }, BACKOFF_RUNS());

  return;
}
