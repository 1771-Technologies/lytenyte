import { isFullWidthMap, type LayoutMap, type SpanLayout } from "@1771technologies/lytenyte-shared";
import type {
  Column,
  PositionUnion,
  RowCellLayout,
  RowDataStore,
  RowLayout,
  RowSectionLayouts,
} from "../../../+types";
import { getFocusCriteria } from "./get-focus-criteria";

interface MakeRowViewArgs<T> {
  layout: SpanLayout;
  layoutMap: LayoutMap;
  rds: RowDataStore<T>;
  columns: Column<T>[];
  focus: PositionUnion | null;
}

/**
 * This is quite a complex function so read each part carefully.
 */
export function makeRowLayout<T>({
  layout: n,
  layoutMap,
  rds,
  columns,
  focus,
}: MakeRowViewArgs<T>) {
  // Initializes the layout sections for the view.
  const top: RowSectionLayouts<T>["top"] = [];
  const center: RowSectionLayouts<T>["center"] = [];
  const bottom: RowSectionLayouts<T>["bottom"] = [];

  // Compute the focus setup for the view. The cell that is currently focused must always be mounted.
  // However things get tricky since the cell may be scrolled out of view. Additionally it may be in any
  // quadrant of the grid. This function returns the specification of where exactly the focus cell is.
  const f = getFocusCriteria(n, focus);

  /**
   * TOP ROW LAYOUT START
   */
  for (let r = n.rowTopStart; r < n.rowTopEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      continue;
    }

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    const rowLastPinTop = n.rowTopEnd - 1 === r ? true : undefined;

    if (isFullWidthMap(row)) {
      top.push({
        rowIndex: r,
        id: node.get()?.id ?? `${r}`,
        kind: "full-width",
        rowPin: "top",
        row: node,
        rowLastPinTop,
      });
      continue;
    }

    const cellLayout: RowCellLayout<T>[] = [];

    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "top",
        colPin: "start",

        colLastStartPin: c + v[1] === n.colStartEnd ? true : undefined,
        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "top",
        colPin: null,

        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    // For the top section, only the center cells may be out of view. The focused cell may be before or after the
    // center cells (if they are in the center cells we will be rendering them anyway).
    if (f.isTop && (f.isColCenterBefore || f.isColCenterAfter)) {
      const v = row.get(f.colIndex);

      if (v && v.length !== 3) {
        const cell: RowCellLayout<T> = {
          kind: "cell",
          id: columns[f.colIndex].id,
          colIndex: f.colIndex,
          rowIndex: f.rowIndex,
          rowSpan: v[0],
          colSpan: v[1],
          rowPin: "top",
          colPin: null,

          rowLastPinTop,
          row: node,
          column: columns[f.colIndex],
        };

        if (f.isColCenterBefore) cellLayout.unshift(cell);
        else cellLayout.push(cell);
      }
    }

    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "top",
        colPin: "end",

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    top.push({
      rowIndex: r,
      id: node.get()?.id ?? `${r}`,
      kind: "row",
      cells: cellLayout,
      rowPin: "top",
      row: node,
      rowLastPinTop,
    });
  }
  /**
   * TOP ROW LAYOUT END
   */

  /**
   * CENTER ROW LAYOUT START
   */

  for (let r = n.rowCenterStart; r < n.rowCenterEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      continue;
    }

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    if (isFullWidthMap(row)) {
      center.push({
        rowIndex: r,
        kind: "full-width",
        rowPin: null,
        row: node,
        id: node.get()?.id ?? `${r}`,
      });
      continue;
    }

    const cellLayout: RowCellLayout<T>[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: null,
        colPin: "start",

        colLastStartPin: c + v[1] === n.colStartEnd ? true : undefined,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
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

    if (
      !f.isBot &&
      !f.isTop &&
      !f.isRowCenterAfter &&
      !f.isRowCenterAfter &&
      (f.isColCenterAfter || f.isColCenterBefore)
    ) {
      const v = row.get(f.colIndex);

      if (v && v.length !== 3) {
        const cell: RowCellLayout<T> = {
          kind: "cell",
          id: columns[f.colIndex].id,
          colIndex: f.colIndex,
          rowIndex: f.rowIndex,
          rowSpan: v[0],
          colSpan: v[1],
          rowPin: null,
          colPin: null,

          row: node,
          column: columns[f.colIndex],
        };
        if (f.isColCenterAfter) cellLayout.push(cell);
        else cellLayout.unshift(cell);
      }
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
        id: node.get()?.id ?? `${r}`,

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        row: node,
        column: columns[c],
      });
    }

    center.push({
      rowIndex: r,
      kind: "row",
      cells: cellLayout,
      rowPin: null,
      row: node,
      id: node.get()?.id ?? `${r}`,
    });
  }

  if (f.isRowCenterBefore || f.isRowCenterAfter) {
    const row = layoutMap.get(f.rowIndex);
    const node = rds.rowForIndex(f.rowIndex);

    if (row && node) {
      if (isFullWidthMap(row)) {
        center.push({
          rowIndex: f.rowIndex,
          kind: "full-width",
          rowPin: null,
          row: node,
          rowIsFocusRow: true,
          id: node.get()?.id ?? `${f.rowIndex}`,
        });
      } else {
        const cellLayout: RowCellLayout<T>[] = [];

        const v = row.get(f.colIndex);
        if (v && v.length !== 3) {
          cellLayout.push({
            kind: "cell",
            colIndex: f.colIndex,
            rowIndex: f.rowIndex,
            rowSpan: v[0],
            colSpan: v[1],
            rowPin: null,
            colPin: f.isStart ? "start" : f.isEnd ? "end" : null,

            rowIsFocusRow: true,

            row: node,
            column: columns[f.colIndex],
            id: columns[f.colIndex].id,
          });
        }

        const rowLayout: RowLayout<T> = {
          rowIndex: f.rowIndex,
          kind: "row",
          cells: cellLayout,
          rowPin: null,
          row: node,
          rowIsFocusRow: true,
          id: node.get()?.id ?? `${f.rowIndex}`,
        };

        if (f.isRowCenterAfter) center.push(rowLayout);
        else center.unshift(rowLayout);
      }
    }
  }
  /**
   * CENTER ROW LAYOUT END
   */

  /**
   * BOTTOM ROW LAYOUT START
   */
  for (let r = n.rowBotStart; r < n.rowBotEnd; r++) {
    const row = layoutMap.get(r);
    if (!row) {
      continue;
    }

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    const rowFirstPinBottom = r === n.rowBotStart ? true : undefined;
    if (isFullWidthMap(row)) {
      bottom.push({
        rowIndex: r,
        kind: "full-width",
        rowPin: "bottom",
        row: node,
        rowFirstPinBottom,
        id: node.get()?.id ?? `${r}`,
      });
      continue;
    }

    const cellLayout: RowCellLayout<T>[] = [];
    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const v = row.get(c);

      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "bottom",
        colPin: "start",

        colLastStartPin: c + v[1] === n.colStartEnd ? true : undefined,
        rowFirstPinBottom,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "bottom",
        colPin: null,

        rowFirstPinBottom,
        row: node,
        column: columns[c],
      });
    }

    if (f.isBot && (f.isColCenterAfter || f.isColCenterBefore)) {
      const v = row.get(f.colIndex);

      if (v && v.length !== 3) {
        const cell: RowCellLayout<T> = {
          kind: "cell",
          id: columns[f.colIndex].id,
          colIndex: f.colIndex,
          rowIndex: f.rowIndex,
          rowSpan: v[0],
          colSpan: v[1],
          rowPin: "bottom",
          colPin: null,

          row: node,
          column: columns[f.colIndex],
        };

        cellLayout.push(cell);
      }
    }

    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const v = row.get(c);
      if (!v || v.length === 3) continue;

      cellLayout.push({
        kind: "cell",
        id: columns[c].id,
        colIndex: c,
        rowIndex: r,
        rowSpan: v[0],
        colSpan: v[1],
        rowPin: "bottom",
        colPin: "end",

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        rowFirstPinBottom,
        row: node,
        column: columns[c],
      });
    }

    bottom.push({
      rowIndex: r,
      kind: "row",
      cells: cellLayout,
      rowPin: "bottom",
      row: node,
      rowFirstPinBottom,
      id: node.get()?.id ?? `${r}`,
    });
  }
  /**
   * BOTTOM ROW LAYOUT END
   */

  return {
    top,
    center,
    bottom,
  };
}
