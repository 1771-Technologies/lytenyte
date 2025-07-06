import { isFullWidthMap } from "@1771technologies/lytenyte-shared";
import type { GridRootContext } from "../context";
import { ensureVisible } from "../navigation/ensure-visible";
import type { PositionGridCell, PositionUnion } from "../state/+types";
import { getRowQuery } from "../navigation/get-row-query";
import { getCellQuery } from "../navigation/get-cell-query";

export function handleHomeEnd(
  ctx: GridRootContext,
  pos: PositionUnion,
  isMeta: boolean,
  isStart: boolean,
) {
  const vp = ctx.grid.state.viewport.get();
  const i = ctx.grid.internal;
  const rowCount = ctx.grid.state.rowDataStore.rowCount.get();
  const columnCount = ctx.grid.state.columnMeta.get().columnsVisible.length;

  if ((pos.kind !== "cell" && pos.kind !== "full-width") || rowCount === 0 || columnCount === 0) {
    return;
  }

  const targetRow = isMeta ? (isStart ? 0 : rowCount - 1) : pos.rowIndex;
  const targetColumn = isStart ? 0 : columnCount - 1;

  // Ensure the cell we want to focus is visible. This will ensure layout
  // calculations are performed and that we can safely focus the cell.
  ctx.grid.api.scrollIntoView({ row: targetRow, column: targetColumn });

  // We put this in a timeout since we need to wait for the scrollIntoView to resolve.
  setTimeout(() => {
    const layout = i.layout.get();
    const row = layout.get(targetRow);
    // No header and no rows - the grid is empty, nothing to focus
    if (!row) return;

    const id = ctx.grid.state.gridId.get();
    if (isFullWidthMap(row)) {
      const c = vp?.querySelector(getRowQuery(id, targetRow)) as HTMLElement;
      if (!c) return;

      ensureVisible(c, ctx.grid.api.scrollIntoView);
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

    ensureVisible(el, ctx.grid.api.scrollIntoView);
    el.focus();

    i.focusActive.set(
      (p) => ({ ...p, columnIndex: targetColumn, rowIndex: targetRow }) as PositionGridCell,
    );
    return;
  }, 20);
}
