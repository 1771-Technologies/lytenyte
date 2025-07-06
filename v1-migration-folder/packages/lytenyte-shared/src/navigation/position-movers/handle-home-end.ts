import type { GridAtom, PositionGridCell, PositionUnion } from "../../+types";
import type { LayoutMap, ScrollIntoViewFn } from "../../+types.non-gen";
import { isFullWidthMap } from "../../layout/is-full-width-map";
import { ensureVisible } from "../ensure-visible";
import { getCellQuery } from "../getters/get-cell-query";
import { getRowQuery } from "../getters/get-row-query";

interface HandleHomeEndArgs {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly vp: HTMLElement | null;
  readonly pos: PositionUnion;
  readonly isMeta: boolean;
  readonly isStart: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly id: string;
  readonly layout: LayoutMap;
}

export function handleHomeEnd({
  vp,
  pos,
  isMeta,
  isStart,
  rowCount,
  columnCount,
  scrollIntoView,
  id,
  focusActive,
  layout,
}: HandleHomeEndArgs) {
  if ((pos.kind !== "cell" && pos.kind !== "full-width") || rowCount === 0 || columnCount === 0) {
    return;
  }

  const targetRow = isMeta ? (isStart ? 0 : rowCount - 1) : pos.rowIndex;
  const targetColumn = isStart ? 0 : columnCount - 1;

  // Ensure the cell we want to focus is visible. This will ensure layout
  // calculations are performed and that we can safely focus the cell.
  scrollIntoView({ row: targetRow, column: targetColumn, behavior: "instant" });

  // We put this in a timeout since we need to wait for the scrollIntoView to resolve.
  setTimeout(() => {
    const row = layout.get(targetRow);
    // No header and no rows - the grid is empty, nothing to focus
    if (!row) return;

    if (isFullWidthMap(row)) {
      const c = vp?.querySelector(getRowQuery(id, targetRow)) as HTMLElement;
      if (!c) return;

      ensureVisible(c, scrollIntoView);
      c.focus();
      return;
    }

    const cell = row.get(targetColumn)!;
    let rootRow: number;
    let rootCol: number;
    if (cell.length === 2) {
      rootRow = targetRow;
      rootCol = targetColumn;
    } else {
      rootRow = cell[1];
      rootCol = cell[2];
    }
    const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
    if (!el) return;

    ensureVisible(el, scrollIntoView);
    el.focus();

    focusActive.set(
      (p) => ({ ...p, colIndex: targetColumn, rowIndex: targetRow }) as PositionGridCell,
    );
    return;
  }, 20);
}
