import type { PositionState, RootCellFn, ScrollIntoViewFn } from "../+types.js";
import type { PositionFullWidthRow, PositionUnion } from "../../+types.js";
import { runWithBackoff } from "../../js-utils/run-with-backoff.js";
import { BACKOFF_RUNS } from "../constants.js";
import { queryCell, queryFullWidthRow } from "../query.js";
import { handleFocus } from "./handle-focus.js";
import { handleHorizontal } from "./handle-horizontal.js";

export interface HandleHomeEndParams {
  readonly isEnd: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly gridId: string;

  readonly columnCount: number;
  readonly rowCount: number;
  readonly viewport: HTMLElement;

  readonly cp: PositionState;
  readonly pos: PositionUnion;
  readonly posElement: HTMLElement;
  readonly active: HTMLElement;
  readonly done: () => void;
  readonly modified: boolean;
}

export function handleHomeEnd({
  modified,
  isEnd,
  active,
  cp,
  done,
  gridId,
  pos,
  rowCount,
  posElement,
  scrollIntoView,
  columnCount,
  getRootCell,
  viewport,
}: HandleHomeEndParams) {
  if (!modified) {
    handleHorizontal({
      isBack: !isEnd,
      active,
      cp,
      done,
      gridId,
      pos,
      posElement,
      scrollIntoView,
      columnCount,
      getRootCell,
      modified: true,
      viewport,
    });

    return;
  }

  if (pos.kind !== "detail" && pos.kind !== "cell" && pos.kind !== "full-width") return;

  const rowIndex = isEnd ? rowCount - 1 : 0;
  const colIndex = isEnd ? columnCount - 1 : 0;

  const root = getRootCell(rowIndex, colIndex);
  if (!root) return;

  const nextIndex = root.rowIndex;
  if (root.kind === "full-width") {
    scrollIntoView({ row: nextIndex, behavior: "instant" });
    done();

    runWithBackoff(() => {
      return handleFocus(
        false,
        () => queryFullWidthRow(gridId, nextIndex, viewport),
        () => {
          cp.set((prev) => ({ ...prev, colIndex: pos.colIndex }) as PositionFullWidthRow);
        },
      );
    }, BACKOFF_RUNS());
  } else {
    const { colIndex, rowIndex } = root.root ?? root;
    scrollIntoView({ row: rowIndex, column: colIndex, behavior: "instant" });
    done();
    runWithBackoff(() => {
      return handleFocus(
        false,
        () => queryCell(gridId, rowIndex, colIndex, viewport),
        () => {},
      );
    }, BACKOFF_RUNS());
  }
}
