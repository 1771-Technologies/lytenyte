import type {
  GridAtom,
  PositionFullWidthRow,
  PositionGridCell,
  PositionUnion,
} from "../../+types.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { ensureVisible } from "../ensure-visible.js";
import { getCellQuery } from "../getters/get-cell-query.js";
import { getRowQuery } from "../getters/get-row-query.js";
import { getCellRootRowAndColIndex } from "./handle-vertical-move.js";

interface FocusCellVerticallyArgs {
  readonly id: string;
  readonly nextRow: number;

  readonly vp: HTMLElement | null;
  readonly pos: PositionUnion;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;
  readonly getRootCell: RootCellFn;
  readonly scrollIntoView: ScrollIntoViewFn;
}

export function focusCellVertically({
  id,
  nextRow,
  vp,
  pos,
  focusActive,
  getRootCell,
  scrollIntoView,
}: FocusCellVerticallyArgs) {
  const cell = getRootCell(nextRow, pos.colIndex);
  if (!cell) return false;

  if (cell.kind === "full-width") {
    // Just focus the next
    const el = vp?.querySelector(getRowQuery(id, nextRow)) as HTMLElement;
    if (!el) return false;

    ensureVisible(el, scrollIntoView);
    el.focus();

    focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionFullWidthRow);

    return true;
  }

  const [rootRow, rootCol] = getCellRootRowAndColIndex(cell);

  const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
  if (!el) return false;

  ensureVisible(el, scrollIntoView);
  el.focus();
  focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionGridCell);

  return true;
}
