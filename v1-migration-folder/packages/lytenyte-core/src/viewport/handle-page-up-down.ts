import type { GridRootContext } from "../context";
import { getRowIndexFromEl } from "../navigation/getters/get-row-index-from-el";
import { getRowsCenterSection } from "../navigation/getters/get-rows-center-section";
import { getRowsInSection } from "../navigation/getters/get-rows-in-section";
import type { PositionUnion } from "../state/+types";
import { focusCellVertically } from "./focus-cell-vertically";

export function handlePageUpDown(ctx: GridRootContext, pos: PositionUnion, isUp: boolean) {
  if (pos.kind !== "cell" && pos.kind !== "full-width") return;

  const vp = ctx.grid.state.viewport.get();

  const ds = ctx.grid.state.rowDataStore;
  const tc = ds.rowTopCount.get();
  const cc = ds.rowCenterCount.get();

  // The current cell is not a centered cell.
  if (pos.rowIndex < tc || pos.rowIndex >= tc + cc) return;

  const rowSection = getRowsCenterSection(vp!);
  if (!rowSection) return;
  const rows = getRowsInSection(rowSection, ctx.grid.state.gridId.get());

  const rowIndex = isUp ? getRowIndexFromEl(rows[0]) : getRowIndexFromEl(rows.at(-1)!);

  if (rowIndex === pos.rowIndex) return;

  focusCellVertically({
    id: ctx.grid.state.gridId.get(),
    focusActive: ctx.grid.internal.focusActive,
    layout: ctx.grid.internal.layout.get(),
    nextRow: rowIndex,
    pos,
    scrollIntoView: ctx.grid.api.scrollIntoView,
    vp,
  });
}
