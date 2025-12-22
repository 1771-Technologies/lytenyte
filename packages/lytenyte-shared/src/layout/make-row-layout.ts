import type {
  ColumnAbstract,
  ColumnPin,
  PositionUnion,
  RowAtom,
  RowNode,
  RowPin,
  RowSource,
  SpanLayout,
} from "../+types.non-gen.js";
import type { LayoutState } from "./make-layout-state.js";
import { CONTAINS_DEAD_CELLS, FULL_WIDTH } from "./update-layout.js";

interface MakeRowViewArgs<T> {
  view: SpanLayout;
  layout: LayoutState;
  viewCache: Map<number, LayoutRow<T>>;

  rowScan: number;

  rds: RowSource;
  columns: ColumnAbstract[];
  focus: PositionUnion | null;
}

/**
 * This is quite a complex function so read each part carefully.
 */
export function makeRowLayout<T>({
  view: n,
  rowScan,
  viewCache,
  layout,
  rds,
  columns,
  focus,
}: MakeRowViewArgs<T>) {
  // Initializes the layout sections for the view.
  const top: RowView<T>["top"] = [];
  const center: RowView<T>["center"] = [];
  const bottom: RowView<T>["bottom"] = [];

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
    rowForIndex: rds.rowByIndex,
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
    rowForIndex: rds.rowByIndex,
    onlySpans: true,
    rowPin: null,
    spanLayout: n,
    viewCache,
  });

  if (before) {
    const alreadyIncluded = center.findIndex((x) => x.rowIndex === focus.rowIndex);

    const before: RowView<T>["center"] = [];
    handleViewLayout({
      columns,
      container: before,
      layout,
      rowStart: focus.rowIndex,
      rowEnd: focus.rowIndex + 1,
      rowForIndex: rds.rowByIndex,
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
        console.log(" iran");
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
    rowForIndex: rds.rowByIndex,
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
      rowForIndex: rds.rowByIndex,
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
    rowForIndex: rds.rowByIndex,
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
  readonly viewCache: Map<number, LayoutRow<T>>;
  readonly container: LayoutRow<T>[];
  readonly rowForIndex: (row: number) => RowAtom<RowNode<T> | null>;
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
      const row: LayoutRow<T> = {
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

      if (onlySpans) continue;

      container.push(row);
      continue;
    }

    const cellSpec = layout.lookup.get(r);
    const cellLayout: LayoutCell<T>[] = [];
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
      });
    }

    const row: LayoutRowWithCells<T> = {
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

    if (onlySpans && row.cells.some((x) => x.rowSpan + x.rowIndex - 1 >= rowEnd)) continue;

    container.push(row);
  }
}

export interface LayoutCell<T = any> {
  readonly kind: "cell";
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly isDeadRow: boolean;
  readonly isDeadCol: boolean;
  readonly id: string;
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly row: RowAtom<RowNode<T> | null>;
  readonly colPin: ColumnPin;
  readonly rowPin: RowPin;
  readonly colFirstEndPin?: boolean;
  readonly colLastStartPin?: boolean;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutFullWidthRow<T> {
  readonly kind: "full-width";
  readonly id: string;
  readonly rowIndex: number;
  readonly row: RowAtom<RowNode<T> | null>;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
}

export interface LayoutRowWithCells<T> {
  readonly kind: "row";
  readonly rowIndex: number;
  readonly row: RowAtom<RowNode<T> | null>;
  readonly rowPin: RowPin;
  readonly rowLastPinTop?: boolean;
  readonly rowFirstPinBottom?: boolean;
  readonly rowIsFocusRow?: boolean;
  readonly id: string;
  readonly cells: LayoutCell<T>[];
}

export type LayoutRow<T> = LayoutRowWithCells<T> | LayoutFullWidthRow<T>;

export interface RowView<T> {
  readonly top: LayoutRow<T>[];
  readonly center: LayoutRow<T>[];
  readonly bottom: LayoutRow<T>[];
  readonly rowFocusedIndex: number | null;
  readonly rowFirstCenter: number;
}
