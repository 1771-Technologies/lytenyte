import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import type { GridAtom, PositionGridCell, PositionUnion } from "../../+types.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { ensureVisible } from "../ensure-visible.js";
import { getCellQuery } from "../getters/get-cell-query.js";
import { getRowQuery } from "../getters/get-row-query.js";
import { getCellRootRowAndColIndex } from "./get-cell-root-row-and-col-index.js";

interface HandleHomeEndArgs {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly vp: HTMLElement | null;
  readonly pos: PositionUnion;
  readonly isMeta: boolean;
  readonly isStart: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
}

export function handleHomeEnd({
  vp,
  pos,
  isMeta,
  isStart,
  rowCount,
  columnCount,
  scrollIntoView,
  getRootCell,
  id,
  focusActive,
}: HandleHomeEndArgs) {
  if ((pos.kind !== "cell" && pos.kind !== "full-width") || rowCount === 0 || columnCount === 0) {
    return;
  }

  const targetRow = isMeta ? (isStart ? 0 : rowCount - 1) : pos.rowIndex;
  const targetColumn = isStart ? 0 : columnCount - 1;

  // Ensure the cell we want to focus is visible. This will ensure layout
  // calculations are performed and that we can safely focus the cell.
  scrollIntoView({ row: targetRow, column: targetColumn, behavior: "instant" });

  const run = () => {
    const cell = getRootCell(targetRow, targetColumn);
    // No header and no rows - the grid is empty, nothing to focus
    if (!cell) return false;

    if (cell.kind === "full-width") {
      const c = vp?.querySelector(getRowQuery(id, targetRow)) as HTMLElement;
      if (!c) return false;

      ensureVisible(c, scrollIntoView);
      c.focus();
      return true;
    }

    if (!cell) return false;
    const [rootRow, rootCol] = getCellRootRowAndColIndex(cell);

    const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
    if (!el) return false;

    ensureVisible(el, scrollIntoView);
    el.focus();

    focusActive.set(
      (p) => ({ ...p, colIndex: targetColumn, rowIndex: targetRow }) as PositionGridCell,
    );
    return true;
  };

  runWithBackoff(run, [8, 20]);
}
