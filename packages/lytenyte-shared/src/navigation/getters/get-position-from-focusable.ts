import type { PositionUnion } from "../../+types.js";
import { isCell } from "../predicates/is-cell.js";
import { isColumnFloatingHeader } from "../predicates/is-column-floating-header.js";
import { isColumnHeader } from "../predicates/is-column-header.js";
import { isDetailCell } from "../predicates/is-detail-cell.js";
import { isFullWidthRow } from "../predicates/is-full-width-row.js";
import { getColIndexFromEl } from "./get-col-index-from-el.js";
import { getColSpanFromEl } from "./get-col-span-from-el.js";
import { getRowIndexFromEl } from "./get-row-index-from-el.js";
import { getRowSpanFromEl } from "./get-row-span-from-el.js";

export function getPositionFromFocusable(el: HTMLElement, gridId: string): PositionUnion {
  if (isCell(el, gridId)) {
    const rowIndex = getRowIndexFromEl(el);
    const colIndex = getColIndexFromEl(el);
    const rowSpan = getRowSpanFromEl(el);
    const colSpan = getColSpanFromEl(el);

    return {
      kind: "cell",
      rowIndex,
      colIndex,
      root: {
        colIndex,
        colSpan,
        rowIndex,
        rowSpan,
      },
    };
  }

  if (isDetailCell(el, gridId)) {
    const rowIndex = getRowIndexFromEl(el);
    return { kind: "detail", rowIndex, colIndex: 0 };
  }

  if (isFullWidthRow(el, gridId)) {
    const rowIndex = getRowIndexFromEl(el);
    return { kind: "full-width", rowIndex, colIndex: 0 };
  }

  if (isColumnHeader(el, gridId)) {
    return {
      kind: isColumnFloatingHeader(el) ? "floating-cell" : "header-cell",
      colIndex: getColIndexFromEl(el),
    };
  }

  return {
    kind: "header-group-cell",
    columnStartIndex: getColIndexFromEl(el),
    columnEndIndex: getColIndexFromEl(el) + getColSpanFromEl(el),
    hierarchyRowIndex: getRowIndexFromEl(el),
    colIndex: getColIndexFromEl(el),
  };
}
