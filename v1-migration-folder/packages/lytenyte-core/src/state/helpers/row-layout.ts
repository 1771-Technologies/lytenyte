import { isFullWidthMap, type LayoutMap, type SpanLayout } from "@1771technologies/lytenyte-shared";
import type { Column, RowCellLayout, RowDataStore, RowSectionLayouts } from "../../+types";

interface MakeRowViewArgs<T> {
  layout: SpanLayout;
  layoutMap: LayoutMap;
  rds: RowDataStore<T>;
  columns: Column<T>[];
}
export function makeRowLayout<T>({ layout: n, layoutMap, rds, columns }: MakeRowViewArgs<T>) {
  const top: RowSectionLayouts<T>["top"] = [];
  const center: RowSectionLayouts<T>["center"] = [];
  const bottom: RowSectionLayouts<T>["bottom"] = [];

  for (let r = n.rowTopStart; r < n.rowTopEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    if (isFullWidthMap(row)) {
      top.push({ rowIndex: r, kind: "full-width", rowPin: "top", row: node });
      continue;
    }

    const cellLayout: RowCellLayout<T>[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "top",
        colPin: "start",

        row: node,
        column: columns[c],
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
        colSpan: v[1],
        rowPin: "top",
        colPin: null,

        row: node,
        column: columns[c],
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
        colSpan: v[1],
        rowPin: "top",
        colPin: "end",

        row: node,
        column: columns[c],
      });
    }

    top.push({ rowIndex: r, kind: "row", cells: cellLayout, rowPin: "top", row: node });
  }

  for (let r = n.rowCenterStart; r < n.rowCenterEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    if (isFullWidthMap(row)) {
      center.push({ rowIndex: r, kind: "full-width", rowPin: null, row: node });
      continue;
    }

    const cellLayout: RowCellLayout<T>[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: null,
        colPin: "start",

        row: node,
        column: columns[c],
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
        colSpan: v[1],
        rowPin: null,
        colPin: null,

        row: node,
        column: columns[c],
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
        colSpan: v[1],
        rowPin: null,
        colPin: "end",

        row: node,
        column: columns[c],
      });
    }

    center.push({ rowIndex: r, kind: "row", cells: cellLayout, rowPin: null, row: node });
  }

  for (let r = n.rowBotStart; r < n.rowBotEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      console.error(`Failed to get the layout of row at index: ${r}`);
      continue;
    }

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    if (isFullWidthMap(row)) {
      bottom.push({ rowIndex: r, kind: "full-width", rowPin: "bottom", row: node });
      continue;
    }

    const cellLayout: RowCellLayout<T>[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "bottom",
        colPin: "start",

        row: node,
        column: columns[c],
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
        colSpan: v[1],
        rowPin: "bottom",
        colPin: null,

        row: node,
        column: columns[c],
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
        colSpan: v[1],
        rowPin: "bottom",
        colPin: "end",

        row: node,
        column: columns[c],
      });
    }

    bottom.push({ rowIndex: r, kind: "row", cells: cellLayout, rowPin: "bottom", row: node });
  }

  return {
    top,
    center,
    bottom,
  };
}
