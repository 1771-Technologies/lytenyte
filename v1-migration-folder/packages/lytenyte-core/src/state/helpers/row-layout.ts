import { isFullWidthMap, type LayoutMap, type SpanLayout } from "@1771technologies/lytenyte-shared";
import type { RowCellLayout, RowSectionLayouts } from "../../+types";

interface MakeRowViewArgs {
  layout: SpanLayout;
  layoutMap: LayoutMap;
}
export function makeRowLayout({ layout: n, layoutMap }: MakeRowViewArgs) {
  const top: RowSectionLayouts["top"] = [];
  const center: RowSectionLayouts["center"] = [];
  const bottom: RowSectionLayouts["bottom"] = [];

  for (let r = n.rowTopStart; r < n.rowTopEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    if (isFullWidthMap(row)) {
      top.push({ rowIndex: r, kind: "full-width", rowPin: "top" });
      continue;
    }

    const cellLayout: RowCellLayout[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: "top",
        colPin: "start",
      });
    }
    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: "top",
        colPin: null,
      });
    }
    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: "top",
        colPin: "end",
      });
    }

    top.push({ rowIndex: r, kind: "row", cells: cellLayout, rowPin: "top" });
  }

  for (let r = n.rowCenterStart; r < n.rowCenterEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    if (isFullWidthMap(row)) {
      center.push({ rowIndex: r, kind: "full-width", rowPin: null });
      continue;
    }

    const cellLayout: RowCellLayout[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: null,
        colPin: "start",
      });
    }
    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: null,
        colPin: null,
      });
    }
    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: null,
        colPin: "end",
      });
    }

    center.push({ rowIndex: r, kind: "row", cells: cellLayout, rowPin: null });
  }

  for (let r = n.rowBotStart; r < n.rowBotEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    if (isFullWidthMap(row)) {
      bottom.push({ rowIndex: r, kind: "full-width", rowPin: "bottom" });
      continue;
    }

    const cellLayout: RowCellLayout[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: "bottom",
        colPin: "start",
      });
    }
    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: "bottom",
        colPin: null,
      });
    }
    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[0],
        rowPin: "bottom",
        colPin: "end",
      });
    }

    bottom.push({ rowIndex: r, kind: "row", cells: cellLayout, rowPin: "bottom" });
  }

  return {
    top,
    center,
    bottom,
  };
}
