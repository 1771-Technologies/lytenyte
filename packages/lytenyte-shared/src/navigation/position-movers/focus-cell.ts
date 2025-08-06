import { runWithBackoff } from "@1771technologies/lytenyte-js-utils";
import type { GridAtom, PositionFullWidthRow, PositionUnion } from "../../+types";
import type { LayoutMap, ScrollIntoViewFn } from "../../+types.non-gen";
import { isFullWidthMap } from "../../layout/is-full-width-map";
import { getCellQuery } from "../getters/get-cell-query";
import { getRowQuery } from "../getters/get-row-query";

interface FocusCellArgs {
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly vp: HTMLElement | null;
  readonly layout: LayoutMap;
  readonly id: string;
  readonly focusActive: GridAtom<PositionUnion | null>;

  readonly postFocus?: () => void;
}

export function focusCell({
  layout,
  focusActive,
  id,
  vp,
  rowIndex,
  colIndex,
  scrollIntoView,
  postFocus,
}: FocusCellArgs) {
  scrollIntoView({ row: rowIndex, column: colIndex, behavior: "instant" });

  if (!vp) return false;

  const run = () => {
    const row = layout.get(rowIndex);
    if (!row) return false;

    if (isFullWidthMap(row)) {
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
