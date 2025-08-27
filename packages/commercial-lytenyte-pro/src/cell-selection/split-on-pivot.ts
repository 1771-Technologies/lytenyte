import type { DataRect } from "../+types";
import type { DataRectSplit } from "./split-cell-selection-rect";
import { areRectsEqual } from "./are-rects-equal";

export function splitOnPivot(rect: DataRectSplit, pivot: DataRect) {
  if (rect.isUnit || areRectsEqual(rect, pivot)) return null;

  const splits: DataRectSplit[] = [];

  const isAfter = pivot.columnStart > rect.columnStart;
  const isSame = pivot.columnStart === rect.columnStart && pivot.columnEnd === rect.columnEnd;
  // The pivot is on the right side of the rect. So we split by end
  if (isAfter) {
    const split: DataRectSplit = { ...rect, columnEnd: rect.columnEnd - 1, borderEnd: false };

    if (split.columnStart !== split.columnEnd) splits.push(split);
  } else {
    const split: DataRectSplit = {
      ...rect,
      columnStart: rect.columnStart + 1,
      borderStart: false,
    };

    if (split.columnStart !== split.columnEnd) splits.push(split);
  }

  if (pivot.rowStart > rect.rowStart) {
    const split: DataRectSplit = {
      ...rect,
      columnStart: pivot.columnStart,
      columnEnd: pivot.columnEnd,
      rowEnd: rect.rowEnd - 1,
      borderBottom: false,
      borderStart: !isAfter,
      borderEnd: isSame || isAfter,
    };

    if (split.rowStart !== split.rowEnd) splits.push(split);
  } else {
    const split: DataRectSplit = {
      ...rect,
      columnStart: pivot.columnStart,
      columnEnd: pivot.columnEnd,
      rowStart: rect.rowStart + 1,
      borderTop: false,
      borderStart: !isAfter,
      borderEnd: isSame || isAfter,
    };

    if (split.rowStart !== split.rowEnd) splits.push(split);
  }

  return splits;
}
