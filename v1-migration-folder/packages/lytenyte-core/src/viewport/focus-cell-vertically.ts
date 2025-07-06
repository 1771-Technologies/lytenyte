import { isFullWidthMap, type LayoutMap } from "@1771technologies/lytenyte-shared";
import type { PositionFullWidthRow, PositionGridCell, PositionUnion } from "../state/+types";
import { ensureVisible } from "../navigation/ensure-visible";
import { getRowQuery } from "../navigation/get-row-query";
import type { GridAtom } from "../+types";
import { getCellQuery } from "../navigation/get-cell-query";

interface FocusCellVerticallyArgs {
  readonly id: string;
  readonly nextRow: number;
  readonly layout: LayoutMap;

  readonly vp: HTMLElement | null;
  readonly pos: PositionUnion;
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly scrollIntoView: (p: { row: number; column: number; behavior: "instant" }) => void;
}

export function focusCellVertically({
  id,
  nextRow,
  layout,
  vp,
  pos,
  focusActive,
  scrollIntoView,
}: FocusCellVerticallyArgs) {
  const row = layout.get(nextRow);

  if (!row) return false;

  if (isFullWidthMap(row)) {
    // Just focus the next
    const el = vp?.querySelector(getRowQuery(id, nextRow)) as HTMLElement;
    if (!el) return false;

    ensureVisible(el, scrollIntoView);
    el.focus();

    focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionFullWidthRow);

    return true;
  }

  const cell = row.get(pos.columnIndex)!;
  let rootRow: number;
  let rootCol: number;
  if (cell.length === 2) {
    rootRow = nextRow;
    rootCol = pos.columnIndex;
  } else {
    rootRow = cell[1];
    rootCol = cell[2];
  }

  const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
  if (!el) return false;

  ensureVisible(el, scrollIntoView);
  el.focus();
  focusActive.set((p) => ({ ...p, columnIndex: pos.columnIndex }) as PositionGridCell);

  return true;
}
