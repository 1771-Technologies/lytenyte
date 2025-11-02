import type { PositionState, ScrollIntoViewFn } from "../+types.js";
import type { PositionFullWidthRow, PositionGridCell, PositionUnion } from "../../+types.js";
import { runWithBackoff } from "../../js-utils/index.js";
import { BACKOFF_RUNS } from "../constants.js";
import { queryCell, queryFullWidthRow } from "../query.js";
import { handleFocus } from "./handle-focus.js";

interface HandleFocusCellFromRootParams {
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly gridId: string;
  readonly viewport: HTMLElement;
  readonly cp: PositionState;
  readonly pos: PositionUnion;
  readonly done: () => void;
}

export function handleFocusCellFromRoot(
  { scrollIntoView, done, gridId, viewport, cp, pos }: HandleFocusCellFromRootParams,
  root: PositionGridCell | PositionFullWidthRow | null,
) {
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
        () => {
          cp.set((prev) => ({ ...prev, colIndex: pos.colIndex }) as PositionGridCell);
        },
      );
    }, BACKOFF_RUNS());
  }
}
