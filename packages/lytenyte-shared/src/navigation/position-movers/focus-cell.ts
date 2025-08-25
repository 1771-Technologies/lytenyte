import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import type { GridAtom, PositionFullWidthRow, PositionUnion } from "../../+types.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { getCellQuery } from "../getters/get-cell-query.js";
import { getRowQuery } from "../getters/get-row-query.js";

interface FocusCellArgs {
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly getRootCell: RootCellFn;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly vp: HTMLElement | null;
  readonly id: string;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;

  readonly postFocus?: () => void;
}

export function focusCell({
  focusActive,
  id,
  vp,
  rowIndex,
  colIndex,
  getRootCell,
  scrollIntoView,
  postFocus,
}: FocusCellArgs) {
  scrollIntoView({ row: rowIndex, column: colIndex, behavior: "instant" });

  if (!vp) return false;

  const run = () => {
    const cell = getRootCell(rowIndex, colIndex);
    if (!cell) return false;

    if (cell.kind === "full-width") {
      const query = getRowQuery(id, rowIndex);

      const el = vp.querySelector(query) as HTMLElement;
      if (!el) return false;

      el.focus();
      if (postFocus) queueMicrotask(postFocus);

      focusActive.set((prev) => ({ ...prev, colIndex }) as PositionFullWidthRow);

      return true;
    }

    const cellQuery = getCellQuery(id, rowIndex, colIndex);
    const el = vp.querySelector(cellQuery) as HTMLElement;
    if (!el) return false;

    el.focus();
    if (postFocus) queueMicrotask(postFocus);
    return true;
  };

  runWithBackoff(run, [8, 20]);
  return true;
}
