import type { PositionUnion } from "../../state/+types";
import { isCell } from "../predicates/is-cell";
import { isColumnHeader } from "../predicates/is-column-header";
import { isFullWidthRow } from "../predicates/is-full-width-row";
import { getColIndexFromEl } from "./get-col-index-from-el";
import { getColSpanFromEl } from "./get-col-span-from-el";
import { getRowIndexFromEl } from "./get-row-index-from-el";
import { getRowSpanFromEl } from "./get-row-span-from-el";

export function getPositionFromFocusable(el: HTMLElement): PositionUnion {
  if (isCell(el)) {
    const rowIndex = getRowIndexFromEl(el);
    const columnIndex = getColIndexFromEl(el);
    const rowSpan = getRowSpanFromEl(el);
    const colSpan = getColSpanFromEl(el);

    return {
      kind: "cell",
      rowIndex,
      columnIndex,
      root: {
        columnIndex,
        colSpan,
        rowIndex,
        rowSpan,
      },
    };
  }

  if (isFullWidthRow(el)) {
    const rowIndex = getRowIndexFromEl(el);
    return { kind: "full-width", rowIndex, columnIndex: 0 };
  }

  if (isColumnHeader(el)) {
    return {
      kind: "header-cell",
      columnIndex: getColIndexFromEl(el),
    };
  }

  return {
    kind: "header-group-cell",
    columnStartIndex: getColIndexFromEl(el),
    columnEndIndex: getColIndexFromEl(el) + getColSpanFromEl(el),
    hierarchyRowIndex: getRowIndexFromEl(el),
    columnIndex: getColIndexFromEl(el),
  };
}
