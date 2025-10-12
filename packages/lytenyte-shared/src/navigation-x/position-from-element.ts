import type { PositionUnion } from "../+types.js";
import { getColIndex, getColSpan, getRowIndex, getRowSpan } from "./attributes.js";
import { isCell, isDetail, isFloatingCell, isFullWidth, isHeaderCell } from "./predicates.js";

export function positionFromElement(gridId: string, el: HTMLElement): PositionUnion {
  if (isCell(gridId, el)) {
    const rowIndex = Number.parseInt(getRowIndex(el)!);
    const colIndex = Number.parseInt(getColIndex(el)!);
    const rowSpan = Number.parseInt(getRowSpan(el)!);
    const colSpan = Number.parseInt(getColSpan(el)!);

    return { kind: "cell", rowIndex, colIndex, root: { colIndex, colSpan, rowIndex, rowSpan } };
  }

  if (isDetail(gridId, el)) {
    const rowIndex = Number.parseInt(getRowIndex(el)!);
    return { kind: "detail", rowIndex, colIndex: 0 };
  }

  if (isFullWidth(gridId, el)) {
    const rowIndex = Number.parseInt(getRowIndex(el)!);
    return { kind: "full-width", rowIndex, colIndex: 0 };
  }

  if (isHeaderCell(gridId, el)) {
    const colIndex = Number.parseInt(getColIndex(el)!);
    return { kind: "header-cell", colIndex };
  }

  if (isFloatingCell(gridId, el)) {
    const colIndex = Number.parseInt(getColIndex(el)!);
    return { kind: "floating-cell", colIndex };
  }

  const rowIndex = Number.parseInt(getRowIndex(el)!);
  const colIndex = Number.parseInt(getColIndex(el)!);
  const colSpan = Number.parseInt(getColSpan(el)!);

  return {
    kind: "header-group-cell",
    columnStartIndex: colIndex,
    columnEndIndex: colIndex + colSpan,
    hierarchyRowIndex: rowIndex,
    colIndex,
  };
}
