import {
  CONTAINS_DEAD_CELLS,
  FULL_WIDTH,
  type LayoutState,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import type {
  Column,
  GridAtomReadonlyUnwatchable,
  PositionUnion,
  RowCellLayout,
  RowDataStore,
  RowLayout,
  RowNode,
  RowPin,
  RowSectionLayouts,
} from "../../../+types";

interface MakeRowViewArgs<T> {
  view: SpanLayout;
  layout: LayoutState;
  viewCache: Map<number, RowLayout<T>>;

  rds: RowDataStore<T>;
  columns: Column<T>[];
  focus: PositionUnion | null;
}

/**
 * This is quite a complex function so read each part carefully.
 */
export function makeRowLayout<T>({ view: n, viewCache, layout, rds, columns }: MakeRowViewArgs<T>) {
  // Initializes the layout sections for the view.
  const top: RowSectionLayouts<T>["top"] = [];
  const center: RowSectionLayouts<T>["center"] = [];
  const bottom: RowSectionLayouts<T>["bottom"] = [];

  handleViewLayout({
    columns,
    container: top,
    layout,
    rowStart: n.rowTopStart,
    rowEnd: n.rowTopEnd,
    rowForIndex: rds.rowForIndex,
    rowPin: "top",
    spanLayout: n,
    viewCache,
  });

  handleViewLayout({
    columns,
    container: center,
    layout,
    rowStart: n.rowCenterStart,
    rowEnd: n.rowCenterEnd,
    rowForIndex: rds.rowForIndex,
    rowPin: null,
    spanLayout: n,
    viewCache,
  });

  handleViewLayout({
    columns,
    container: bottom,
    layout,
    rowStart: n.rowBotStart,
    rowEnd: n.rowBotEnd,
    rowForIndex: rds.rowForIndex,
    rowPin: "bottom",
    spanLayout: n,
    viewCache,
  });

  /**
   * BOTTOM ROW LAYOUT END
   */
  return {
    top: top,
    center: center,
    bottom: bottom,
  };
}

interface HandleViewLayoutArgs<T> {
  readonly columns: Column<T>[];
  readonly spanLayout: SpanLayout;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowPin: RowPin;
  readonly layout: LayoutState;
  readonly viewCache: Map<number, RowLayout<T>>;
  readonly container: RowLayout<T>[];
  readonly rowForIndex: (row: number) => GridAtomReadonlyUnwatchable<RowNode<T> | null>;
}

function handleViewLayout<T>({
  columns,
  spanLayout: n,
  rowStart,
  rowEnd,
  rowPin,
  layout,
  viewCache,
  container,
  rowForIndex,
}: HandleViewLayoutArgs<T>) {
  for (let r = rowStart; r < rowEnd; r++) {
    const status = layout.special[r];
    const computed = layout.computed[r];
    if (!computed) continue;

    if (viewCache.has(r)) {
      container.push(viewCache.get(r)!);
      continue;
    }

    const node = rowForIndex(r);
    if (!node) break;

    const rowLastPinTop = n.rowTopEnd - 1 === r ? true : undefined;

    if (status === FULL_WIDTH) {
      const row: RowLayout<T> = {
        get id() {
          return node.get()?.id ?? `${r}`;
        },
        rowIndex: r,
        kind: "full-width",
        rowPin,
        row: node,
        rowLastPinTop,
      };

      viewCache.set(r, row);
      container.push(row);
      continue;
    }

    const cellSpec = layout.lookup.get(r);
    const cellLayout: RowCellLayout<T>[] = [];
    const hasDead = status === CONTAINS_DEAD_CELLS;

    for (let c = n.colStartStart; c < n.colStartEnd; c++) {
      const ci = c * 4;

      const isDeadRow = hasDead && cellSpec?.[ci] === -1;
      const isDeadCol = hasDead && cellSpec?.[ci] === 0;

      const colSpan = cellSpec?.[c * 4 + 1] || 1;
      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan,
        rowPin,
        colPin: "start",
        isDeadCol,
        isDeadRow,

        colLastStartPin: c + colSpan === n.colStartEnd ? true : undefined,
        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colStartEnd; c < n.colCenterLast; c++) {
      const ci = c * 4;

      const isDeadRow = hasDead && cellSpec?.[ci] === -1;
      const isDeadCol = hasDead && cellSpec?.[ci] === 0;

      const colSpan = cellSpec?.[c * 4 + 1] || 1;
      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan,
        rowPin,
        colPin: null,
        isDeadCol,
        isDeadRow,

        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    for (let c = n.colEndStart; c < n.colEndEnd; c++) {
      const ci = c * 4;

      const isDeadRow = hasDead && cellSpec?.[ci] === -1;
      const isDeadCol = hasDead && cellSpec?.[ci] === 0;

      cellLayout.push({
        id: columns[c].id,
        kind: "cell",
        colIndex: c,
        rowIndex: r,
        rowSpan: cellSpec?.[c * 4] || 1,
        colSpan: cellSpec?.[c * 4 + 1] || 1,
        rowPin,
        colPin: "end",
        isDeadCol,
        isDeadRow,

        colFirstEndPin: c === n.colCenterLast ? true : undefined,
        rowLastPinTop,
        row: node,
        column: columns[c],
      });
    }

    const row: RowLayout<T> = {
      get id() {
        return node.get()?.id ?? `${r}`;
      },
      rowIndex: r,
      kind: "row",
      cells: cellLayout,
      rowPin,
      row: node,
      rowLastPinTop,
    };
    viewCache.set(r, row);
    container.push(row);
  }
}
