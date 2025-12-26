import type {
  ColumnAbstract,
  ColumnPin,
  PositionUnion,
  RowNode,
  RowPin,
  SpanLayout,
} from "../+types.non-gen.js";
import type { LayoutState } from "./make-layout-state.js";
import { CONTAINS_DEAD_CELLS, FULL_WIDTH } from "./update-layout.js";

interface MakeRowViewArgs {
  view: SpanLayout;
  layout: LayoutState;
  viewCache: Map<number, LayoutRow>;

  rowScan: number;

  rowByIndex: (i: number) => RowNode<any> | null;
  columns: ColumnAbstract[];
  focus: PositionUnion | null;
}

/**
 * This is quite a complex function so read each part carefully.
 */
export function makeRowLayout({
  view: n,
  rowScan,
  viewCache,
  layout,
  rowByIndex,
  columns,
  focus,
}: MakeRowViewArgs) {
  // Initializes the layout sections for the view.
  const top: RowView["top"] = [];
  const center: RowView["center"] = [];
  const bottom: RowView["bottom"] = [];

  const shouldIncludeFocus =
    (focus?.kind === "cell" || focus?.kind === "full-width" || focus?.kind === "detail") &&
    focus.rowIndex >= n.rowTopEnd &&
    focus.rowIndex < n.rowBotStart;

  const before = shouldIncludeFocus && focus.rowIndex < n.rowCenterStart && focus;
  const after = shouldIncludeFocus && focus.rowIndex >= n.rowCenterEnd && focus;

  handleViewLayout({
    columns,
    container: top,
    layout,
    rowStart: n.rowTopStart,
    rowEnd: n.rowTopEnd,
    rowForIndex: rowByIndex,
    onlySpans: false,
    rowPin: "top",
    spanLayout: n,
    viewCache,
  });

  handleViewLayout({
    columns,
    container: center,
    layout,
    rowStart: Math.max(n.rowCenterStart - rowScan, n.rowTopEnd),
    rowEnd: n.rowCenterStart,
    rowForIndex: rowByIndex,
    onlySpans: true,
    rowPin: null,
    spanLayout: n,
    viewCache,
  });

  if (before) {
    const alreadyIncluded = center.findIndex((x) => x.rowIndex === focus.rowIndex);

    const before: RowView["center"] = [];
    handleViewLayout({
      columns,
      container: before,
      layout,
      rowStart: focus.rowIndex,
      rowEnd: focus.rowIndex + 1,
      rowForIndex: rowByIndex,
      onlySpans: false,
      rowPin: null,
      spanLayout: n,
      viewCache,
    });

    if (alreadyIncluded) center.splice(alreadyIncluded, 1, ...before);
    else {
      const insertionIndex = center.findIndex(
        (x, i) => x.rowIndex < focus.rowIndex && center[i + 1].rowIndex > focus.rowIndex,
      );
      if (insertionIndex === -1) center.push(...before);
      else {
        center.splice(insertionIndex, 1, ...before);
      }
    }
  }

  handleViewLayout({
    columns,
    container: center,
    layout,
    rowStart: n.rowCenterStart,
    rowEnd: n.rowCenterEnd,
    rowForIndex: rowByIndex,
    onlySpans: false,
    rowPin: null,
    spanLayout: n,
    viewCache,
  });

  if (after) {
    handleViewLayout({
      columns,
      container: center,
      layout,
      rowStart: focus.rowIndex,
      rowEnd: focus.rowIndex + 1,
      rowForIndex: rowByIndex,
      onlySpans: false,
      rowPin: null,
      spanLayout: n,
      viewCache,
    });
  }

  handleViewLayout({
    columns,
    container: bottom,
    layout,
    rowStart: n.rowBotStart,
    rowEnd: n.rowBotEnd,
    rowForIndex: rowByIndex,
    onlySpans: false,
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
  readonly columns: ColumnAbstract[];
  readonly spanLayout: SpanLayout;
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly rowPin: RowPin;
  readonly onlySpans: boolean;
  readonly layout: LayoutState;
  readonly viewCache: Map<number, LayoutRow>;
  readonly container: LayoutRow[];
  readonly rowForIndex: (row: number) => RowNode<T> | null;
}

function handleViewLayout<T>({
  columns,
  spanLayout: n,
  rowStart,
  onlySpans,
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
      const row = viewCache.get(r)!;
      if (onlySpans) {
        if (row.kind === "full-width") continue;
        const spansIntoView = row.cells.some((x) => x.rowSpan + x.rowIndex - 1 >= rowEnd);
        if (spansIntoView) container.push(row);
        continue;
      } else {
        container.push(row);
        continue;
      }
    }

    const node = rowForIndex(r);
    if (!node) break;

    const rowLastPinTop = n.rowTopEnd - 1 === r ? true : undefined;

    if (status === FULL_WIDTH) {
      const row: LayoutRow = {
        id: node.id,
        rowIndex: r,
        kind: "full-width",
        rowPin,
        rowLastPinTop,
      };

      viewCache.set(r, row);

      if (onlySpans) continue;

      container.push(row);
      continue;
    }

    const cellSpec = layout.lookup.get(r);
    const cellLayout: LayoutCell[] = [];
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
      });
    }

    const row: LayoutRowWithCells = {
      id: node.id,
      rowIndex: r,
      kind: "row",
      cells: cellLayout,
      rowPin,
      rowLastPinTop,
    };
    viewCache.set(r, row);

    if (onlySpans && row.cells.some((x) => x.rowSpan + x.rowIndex - 1 >= rowEnd)) continue;

    container.push(row);
  }
}

export interface LayoutCell {
  readonly kind: "cell";
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly isDeadRow: boolean;
  readonly isDeadCol: boolean;
  readonly id: string;
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly colPin: ColumnPin;
  readonly rowPin: RowPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutFullWidthRow {
  readonly kind: "full-width";
  readonly id: string;
  readonly rowIndex: number;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutRowWithCells {
  readonly kind: "row";
  readonly rowIndex: number;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
  readonly id: string;
  readonly cells: LayoutCell[];
}

export type LayoutRow = LayoutRowWithCells | LayoutFullWidthRow;

export interface RowView {
  readonly top: LayoutRow[];
  readonly center: LayoutRow[];
  readonly bottom: LayoutRow[];
  readonly rowFocusedIndex: number | null;
  readonly rowFirstCenter: number;
}
