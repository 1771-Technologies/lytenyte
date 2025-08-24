import {
  CONTAINS_DEAD_CELLS,
  FULL_WIDTH,
  type LayoutState,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
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
  view: SpanLayout;
  layout: LayoutState;
  rds: RowDataStore<T>;
  columns: Column<T>[];
  focus: PositionUnion | null;
}

/**
 * This is quite a complex function so read each part carefully.
 */
export function makeRowLayout<T>({ view: n, layout, rds, columns, focus }: MakeRowViewArgs<T>) {
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
    const status = layout.special[r];
    const computed = layout.computed[r];
    if (!computed) continue;

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    const rowLastPinTop = n.rowTopEnd - 1 === r ? true : undefined;

    if (status === FULL_WIDTH) {
      top.push({
        id: node.get()?.id ?? `${r}`,
        rowIndex: r,
        kind: "full-width",
        rowPin: "top",
        row: node,
        rowLastPinTop,
      });
      continue;
    }

    const cellSpec = layout.lookup.get(r);
    const cellLayout: RowCellLayout<T>[] = [];
    const hasDead = status === CONTAINS_DEAD_CELLS;

    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      const colSpan = cellSpec?.[c * 4 + 1] || 1;
      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan,
        rowPin: "top",
        colPin: "start",

        colLastStartPin: c + colSpan === n.colStartEnd ? true : undefined,
        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      const colSpan = cellSpec?.[c * 4 + 1] || 1;
      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan,
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
      const isEmpty = hasDead && cellSpec?.[f.colIndex * 4] === 0;
      if (!isEmpty) {
        const rowSpan = cellSpec?.[f.colIndex * 4] || 1;
        const colSpan = cellSpec?.[f.colIndex * 4 + 1] || 1;

        const cell: RowCellLayout<T> = {
          id: columns[f.colIndex].id,
          kind: "cell",
          colIndex: f.colIndex,
          rowIndex: f.rowIndex,
          rowSpan,
          colSpan,
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
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: cellSpec?.[c * 4 + 1] || 1,
        rowPin: "top",
        colPin: "end",

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    top.push({
      id: node.get()?.id ?? `${r}`,
      rowIndex: r,
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
    const status = layout.special[r];
    const computed = layout.computed[r];
    if (!computed) continue;

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    if (status === FULL_WIDTH) {
      center.push({
        id: node.get()?.id ?? `${r}`,
        rowIndex: r,
        kind: "full-width",
        rowPin: null,
        row: node,
      });
      continue;
    }

    const cellSpec = layout.lookup.get(r);
    const cellLayout: RowCellLayout<T>[] = [];
    const hasDead = status === CONTAINS_DEAD_CELLS;

    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      const colSpan = cellSpec?.[c * 4 + 1] || 1;
      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: colSpan,
        rowPin: null,
        colPin: "start",

        colLastStartPin: c + colSpan === n.colStartEnd ? true : undefined,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: cellSpec?.[c * 4 + 1] || 1,
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
      const ci = f.colIndex * 4;
      const isEmpty = hasDead && cellSpec?.[ci] === 0;

      if (isEmpty) {
        const cell: RowCellLayout<T> = {
          id: columns[f.colIndex].id,
          kind: "cell",
          colIndex: f.colIndex,
          rowIndex: f.rowIndex,
          rowSpan: cellSpec?.[ci] || 1,
          colSpan: cellSpec?.[ci + 1] || 1,
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
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: cellSpec?.[c * 4 + 1] || 1,
        rowPin: null,
        colPin: "end",

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        row: node,
        column: columns[c],
      });
    }

    center.push({
      id: node.get()?.id ?? `${r}`,
      rowIndex: r,
      kind: "row",
      cells: cellLayout,
      rowPin: null,
      row: node,
    });
  }

  if (f.isRowCenterBefore || f.isRowCenterAfter) {
    const node = rds.rowForIndex(f.rowIndex);

    const status = layout.special[f.rowIndex];
    const computed = layout.computed[f.rowIndex];

    if (computed && node) {
      if (status === FULL_WIDTH) {
        center.push({
          id: node.get()?.id ?? `${f.rowIndex}`,
          rowIndex: f.rowIndex,
          kind: "full-width",
          rowPin: null,
          row: node,
          rowIsFocusRow: true,
        });
      } else {
        const cellLayout: RowCellLayout<T>[] = [];
        const cellSpec = layout.lookup.get(f.rowIndex);
        const ci = f.colIndex * 4;
        const isEmpty = status === CONTAINS_DEAD_CELLS && cellSpec?.[ci] === 0;

        if (!isEmpty) {
          cellLayout.push({
            id: columns[f.colIndex].id,
            kind: "cell",
            colIndex: f.colIndex,
            rowIndex: f.rowIndex,
            rowSpan: cellSpec?.[ci] || 1,
            colSpan: cellSpec?.[ci + 1] || 1,
            rowPin: null,
            colPin: f.isStart ? "start" : f.isEnd ? "end" : null,

            rowIsFocusRow: true,

            row: node,
            column: columns[f.colIndex],
          });
        }

        const rowLayout: RowLayout<T> = {
          id: node.get()?.id ?? `${f.rowIndex}`,
          rowIndex: f.rowIndex,
          kind: "row",
          cells: cellLayout,
          rowPin: null,
          row: node,
          rowIsFocusRow: true,
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
    const status = layout.special[r];
    const computed = layout.computed[r];
    if (!computed) continue;

    const node = rds.rowForIndex(r);
    if (!node) {
      console.error(`Row data source did not return a row for a valid row position at index: ${r}`);
      break;
    }

    const rowFirstPinBottom = r === n.rowBotStart ? true : undefined;
    if (status === FULL_WIDTH) {
      bottom.push({
        id: node.get()?.id ?? `${r}`,
        rowIndex: r,
        kind: "full-width",
        rowPin: "bottom",
        row: node,
        rowFirstPinBottom,
      });
      continue;
    }

    const cellSpec = layout.lookup.get(r);
    const cellLayout: RowCellLayout<T>[] = [];
    const hasDead = status === CONTAINS_DEAD_CELLS;

    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      const colSpan = cellSpec?.[c * 4 + 1] || 1;
      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: colSpan,
        rowPin: "bottom",
        colPin: "start",

        colLastStartPin: c + colSpan === n.colStartEnd ? true : undefined,
        rowFirstPinBottom,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colCenterStart; c < n.colCenterEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: cellSpec?.[c * 4 + 1] || 1,
        rowPin: "bottom",
        colPin: null,

        rowFirstPinBottom,
        row: node,
        column: columns[c],
      });
    }

    if (f.isBot && (f.isColCenterAfter || f.isColCenterBefore)) {
      const ci = f.colIndex * 4;
      const isEmpty = hasDead && cellSpec?.[ci] === 0;

      if (!isEmpty) {
        const cell: RowCellLayout<T> = {
          id: columns[f.colIndex].id,
          kind: "cell",
          colIndex: f.colIndex,
          rowIndex: f.rowIndex,
          rowSpan: cellSpec?.[ci] || 1,
          colSpan: cellSpec?.[ci + 1] || 1,
          rowPin: "bottom",
          colPin: null,

          row: node,
          column: columns[f.colIndex],
        };

        cellLayout.push(cell);
      }
    }

    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      if (hasDead && cellSpec?.[c * 4] === 0) continue;

      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: cellSpec?.[c * 4 + 1] || 1,
        rowPin: "bottom",
        colPin: "end",

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        rowFirstPinBottom,
        row: node,
        column: columns[c],
      });
    }

    bottom.push({
      id: node.get()?.id ?? `${r}`,
      rowIndex: r,
      kind: "row",
      cells: cellLayout,
      rowPin: "bottom",
      row: node,
      rowFirstPinBottom,
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
