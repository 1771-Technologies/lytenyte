import type { GridAtom, PositionFullWidthRow, PositionGridCell, PositionUnion } from "../../+types";
import type { LayoutMap } from "../../+types.non-gen";
import { isFullWidthMap } from "../../layout/is-full-width-map";
import { ensureVisible } from "../ensure-visible";
import { getCellQuery } from "../getters/get-cell-query";
import { getRowQuery } from "../getters/get-row-query";

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

    focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionFullWidthRow);

    return true;
  }

  const cell = row.get(pos.colIndex)!;
  let rootRow: number;
  let rootCol: number;
  if (cell.length === 2) {
    rootRow = nextRow;
    rootCol = pos.colIndex;
  } else {
    rootRow = cell[1];
    rootCol = cell[2];
  }

  const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
  if (!el) return false;

  ensureVisible(el, scrollIntoView);
  el.focus();
  focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionGridCell);

  return true;
}
