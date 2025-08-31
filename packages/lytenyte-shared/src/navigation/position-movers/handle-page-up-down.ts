import type { GridAtom, PositionUnion } from "../../+types.js";
import { focusCellVertically } from "./focus-cell-vertically.js";
import type { RootCellFn, ScrollIntoViewFn } from "../../+types.non-gen.js";
import { getRowsCenterSection } from "../getters/get-rows-center-section.js";
import { getRowsInSection } from "../getters/get-rows-in-section.js";
import { getRowIndexFromEl } from "../getters/get-row-index-from-el.js";

interface HandleHomeEndArgs {
  readonly vp: HTMLElement | null;
  readonly pos: PositionUnion;
  readonly isUp: boolean;
  readonly scrollIntoView: ScrollIntoViewFn;
  readonly getRootCell: RootCellFn;
  readonly focusActive: Omit<GridAtom<PositionUnion | null>, "$">;
  readonly id: string;
  readonly topCount: number;
  readonly centerCount: number;
}

export function handlePageUpDown({
  pos,
  vp,
  topCount,
  centerCount,
  id,
  isUp,
  focusActive,
  getRootCell,
  scrollIntoView,
}: HandleHomeEndArgs) {
  if (pos.kind !== "cell" && pos.kind !== "full-width") return;

  const tc = topCount;
  const cc = centerCount;

  // The current cell is not a centered cell.
  if (pos.rowIndex < tc || pos.rowIndex >= tc + cc) return;

  const rowSection = getRowsCenterSection(vp!);
  if (!rowSection) return;
  const rows = getRowsInSection(rowSection, id);

  const rowIndex = isUp ? getRowIndexFromEl(rows[0]) : getRowIndexFromEl(rows.at(-1)!);

  if (rowIndex === pos.rowIndex) return;

  focusCellVertically({
    id,
    focusActive,
    getRootCell,
    nextRow: rowIndex,
    pos,
    scrollIntoView,
    vp,
  });
}
