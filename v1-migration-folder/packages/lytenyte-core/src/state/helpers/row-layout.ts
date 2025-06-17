import { isFullWidthMap, type LayoutMap, type SpanLayout } from "@1771technologies/lytenyte-shared";
import type { RowCellLayout, RowLayout } from "../../+types";

interface MakeRowViewArgs {
  layout: SpanLayout;
  layoutMap: LayoutMap;
}
export function makeRowLayout({ layout: n, layoutMap }: MakeRowViewArgs) {
  const rowLayout: RowLayout["layout"] = [];

  for (let r = n.rowTopStart; r < n.rowTopEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    if (isFullWidthMap(row)) {
      rowLayout.push({ rowIndex: r, kind: "full-width" });
      continue;
    }

    const cellLayout: RowCellLayout[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }
    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }
    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }

    rowLayout.push({ rowIndex: r, kind: "row", cells: cellLayout });
  }

  for (let r = n.rowCenterStart; r < n.rowCenterEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    if (isFullWidthMap(row)) {
      rowLayout.push({ rowIndex: r, kind: "full-width" });
      continue;
    }

    const cellLayout: RowCellLayout[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }
    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }
    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }

    rowLayout.push({ rowIndex: r, kind: "row", cells: cellLayout });
  }

  for (let r = n.rowBotStart; r < n.rowBotEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    if (isFullWidthMap(row)) {
      rowLayout.push({ rowIndex: r, kind: "full-width" });
      continue;
    }

    const cellLayout: RowCellLayout[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }
    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }
    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;
      cellLayout.push({ kind: "cell", colIndex: c, rowIndex: r, rowSpan: v[0], colSpan: v[0] });
    }

    rowLayout.push({ rowIndex: r, kind: "row", cells: cellLayout });
  }

  return {
    layout: rowLayout,
  };
}
