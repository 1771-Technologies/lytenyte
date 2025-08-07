import type {
  GridAtom,
  PositionFullWidthRow,
  PositionGridCell,
  PositionUnion,
} from "../../+types.js";
import type { LayoutMap } from "../../+types.non-gen.js";
import { isFullWidthMap } from "../../layout/is-full-width-map.js";
import { ensureVisible } from "../ensure-visible.js";
import { getCellQuery } from "../getters/get-cell-query.js";
import { getRowQuery } from "../getters/get-row-query.js";
import { getCellRootRowAndColIndex } from "./get-cell-root-row-and-col-index.js";

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

  const [rootRow, rootCol] = getCellRootRowAndColIndex(
    row.get(pos.colIndex)!,
    nextRow,
    pos.colIndex,
  );

  const el = vp?.querySelector(getCellQuery(id, rootRow, rootCol)) as HTMLElement;
  if (!el) return false;

  ensureVisible(el, scrollIntoView);
  el.focus();
  focusActive.set((p) => ({ ...p, colIndex: pos.colIndex }) as PositionGridCell);

  return true;
}
