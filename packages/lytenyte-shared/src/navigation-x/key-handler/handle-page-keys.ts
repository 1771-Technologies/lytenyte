import type { PositionState, RootCellFn, ScrollIntoViewFn } from "../+types";
import type { PositionUnion } from "../../+types";
import { clamp } from "../../js-utils/index.js";
import { handleFocusCellFromRoot } from "./handle-focus-cell-from-root.js";

export interface HandlePageKeyParams {
  readonly isUp: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly gridId: string;
  readonly getRootCell: RootCellFn;
  readonly viewport: HTMLElement;
  readonly cp: PositionState;
  readonly pos: PositionUnion;
  readonly done: () => void;
  readonly rowCount: number;
}

export function handlePageKeys({
  isUp,
  pos,
  viewport,
  gridId,
  rowCount,
  getRootCell,
  cp,
  done,
  scrollIntoView,
}: HandlePageKeyParams) {
  if (pos.kind !== "cell" && pos.kind !== "full-width") return;

  const visibleCount =
    viewport.querySelectorAll(`[data-ln-gridid="${gridId}"][data-ln-row="true"]`).length - 2;
  if (visibleCount <= 0) return;

  const nextIndex = clamp(0, pos.rowIndex + (isUp ? -visibleCount : visibleCount), rowCount - 1);
  if (nextIndex === pos.rowIndex) return;

  const root = getRootCell(nextIndex, pos.colIndex);

  handleFocusCellFromRoot({ cp, done, gridId, pos, scrollIntoView, viewport }, root);
}
