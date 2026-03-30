import type { ColumnAbstract, ColumnPin, RowNode, RowPin, RowPredicate, SpanFn } from "../types.js";
import type { LayoutCell, LayoutFullWidthRow, LayoutRow } from "./types.js";

export interface RowLayout {
  readonly layoutByIndex: (index: number) => LayoutRow | null | undefined;
  readonly layoutById: (id: string) => LayoutRow | null | undefined;
  readonly rootCell: (row: number, column: number) => LayoutFullWidthRow | LayoutCell | null;
  readonly clearCache: () => void;
}

export interface CreateRowLayoutOptions {
  readonly rowByIndex: (i: number) => RowNode<any> | null | undefined;
  readonly computeColSpan: SpanFn | null;
  readonly computeRowSpan: SpanFn | null;
  readonly isFullWidth: RowPredicate | null;
  readonly isCutoff: RowPredicate;

  readonly columns: ColumnAbstract[];
  readonly startCutoff: number;
  readonly endCutoff: number;
  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly rowLookback: number;

  readonly hasSpans: boolean;
}

export function createRowLayout({
  startCutoff,
  endCutoff,
  columns,
  bottomCutoff,
  topCutoff,
  rowLookback,
  rowByIndex,
  computeColSpan,
  computeRowSpan,
  isCutoff,
  isFullWidth,
  hasSpans,
}: CreateRowLayoutOptions): RowLayout {
  const columnCount = columns.length;

  function getColumnSectionEnd(column: number): number {
    if (column < startCutoff) return startCutoff;
    if (column < endCutoff) return endCutoff;
    return columnCount;
  }
  function getRowSectionStart(row: number): number {
    if (row >= bottomCutoff) return bottomCutoff;
    if (row >= topCutoff) return topCutoff;
    return 0;
  }
  function getRowSectionEnd(row: number): number {
    if (row < topCutoff) return topCutoff;
    if (row < bottomCutoff) return bottomCutoff;
    return Infinity;
  }
  function clampColSpan(column: number, span: number): number {
    return Math.min(span, getColumnSectionEnd(column) - column);
  }
  function clampRowSpan(row: number, span: number): number {
    return Math.min(span, getRowSectionEnd(row) - row);
  }
  const getRowPin = (index: number): RowPin => {
    if (index < topCutoff) return "top";
    if (index >= bottomCutoff) return "bottom";
    return null;
  };
  const getColPin = (index: number): ColumnPin => {
    if (index < startCutoff) return "start";
    if (index >= endCutoff) return "end";
    return null;
  };

  function createCell(
    rowIndex: number,
    colIndex: number,
    colSpan: number,
    rowSpan: number,
    root: LayoutCell | null = null,
    isDeadCol: boolean = false,
    isDeadRow: boolean = false,
  ): LayoutCell {
    return {
      kind: "cell",
      id: columns[colIndex].id,
      rowIndex,
      colIndex,
      rowPin: getRowPin(rowIndex),
      colPin: getColPin(colIndex),
      colSpan,
      rowSpan,
      isDeadCol,
      isDeadRow,
      root,
      type: columns[colIndex].type ?? "string",
      colFirstEndPin: colIndex === endCutoff,
      colLastStartPin: colIndex === startCutoff - 1,
      rowLastPinTop: rowIndex === topCutoff - 1,
      rowFirstPinBottom: rowIndex === bottomCutoff,
      rowIsFocusRow: false,
    };
  }

  const indexToLayout = new Map<number, LayoutRow>();
  const idToLayout = new Map<string, LayoutRow>();

  const occupiedFlags = new Map<number, Uint8Array>();
  const occupiedRoots = new Map<number, LayoutCell[]>();

  function computeRow(index: number): LayoutRow | null {
    const row = rowByIndex(index);

    // If the row is not defined, we return nothing, since we have nothing to compute the layout off of.
    if (!row) return null;

    if (isFullWidth?.(index)) {
      const layout: LayoutRow = {
        kind: "full-width",
        id: row.id,
        rowIndex: index,
        rowPin: getRowPin(index),
        rowFirstPinBottom: index === bottomCutoff,
        rowLastPinTop: index === topCutoff - 1,
        rowIsFocusRow: false,
      };

      indexToLayout.set(index, layout);
      idToLayout.set(row.id, layout);
      return layout;
    }

    if (hasSpans) {
      const lookbackEnd = Math.max(index - rowLookback, 0);
      const sectionStart = getRowSectionStart(index);

      for (let ri = index - 1; ri >= lookbackEnd; ri--) {
        const row = rowByIndex(ri);
        if (ri < sectionStart || isFullWidth?.(ri) || !row) break;
        if (indexToLayout.has(ri)) continue;

        const lookbackCells: LayoutCell[] = new Array(columnCount);
        const riFlags = occupiedFlags.get(ri);
        const riRoots = occupiedRoots.get(ri);

        for (let ci = 0; ci < columnCount; ) {
          if (riFlags?.[ci]) {
            const preFilledRoot = riRoots![ci];
            lookbackCells[ci] = createCell(
              preFilledRoot.rowIndex,
              ci,
              1,
              1,
              preFilledRoot,
              ci !== preFilledRoot.colIndex,
              true,
            );
            ci++;
            continue;
          }

          const colSpan = clampColSpan(ci, computeColSpan?.(ri, ci) ?? 1);
          const rowSpan = clampRowSpan(ri, computeRowSpan?.(ri, ci) ?? 1);
          const root = createCell(ri, ci, colSpan, rowSpan);
          lookbackCells[ci] = root;

          for (let x = ci + 1; x < ci + colSpan; x++) {
            lookbackCells[x] = createCell(ri, x, 1, 1, root, true, false);
          }

          if (rowSpan > 1) {
            for (let x = ri + 1; x < ri + rowSpan; x++) {
              if (isCutoff(x)) {
                (root.rowSpan as any) = x - ri;
                break;
              }
              let xFlags = occupiedFlags.get(x);
              let xRoots = occupiedRoots.get(x);
              if (!xFlags) {
                xFlags = new Uint8Array(columnCount);
                xRoots = [];
                occupiedFlags.set(x, xFlags);
                occupiedRoots.set(x, xRoots);
              }
              for (let y = ci; y < ci + colSpan; y++) {
                xFlags[y] = 1;
                xRoots![y] = root;
              }
            }
          }

          ci += colSpan;
        }

        const lookbackRow: LayoutRow = {
          kind: "row",
          id: row.id,
          cells: lookbackCells,
          rowIndex: ri,
          rowPin: getRowPin(ri),
          rowFirstPinBottom: ri === bottomCutoff,
          rowLastPinTop: ri === topCutoff - 1,
          rowIsFocusRow: false,
        };
        indexToLayout.set(ri, lookbackRow);
        idToLayout.set(row.id, lookbackRow);
      }
    }

    const cells: LayoutCell[] = new Array(columnCount);
    const indexFlags = occupiedFlags.get(index);
    const indexRoots = occupiedRoots.get(index);

    for (let ci = 0; ci < columnCount; ) {
      if (indexFlags?.[ci]) {
        const preFilledRoot = indexRoots![ci];
        cells[ci] = createCell(
          preFilledRoot.rowIndex,
          ci,
          1,
          1,
          preFilledRoot,
          ci !== preFilledRoot.colIndex,
          true,
        );
        ci++;
        continue;
      }

      const colSpan = clampColSpan(ci, computeColSpan?.(index, ci) ?? 1);
      const rowSpan = clampRowSpan(index, computeRowSpan?.(index, ci) ?? 1);
      const root = createCell(index, ci, colSpan, rowSpan);
      cells[ci] = root;

      for (let x = ci + 1; x < ci + colSpan; x++) {
        cells[x] = createCell(index, x, 1, 1, root, true, false);
      }

      if (rowSpan > 1) {
        for (let x = index + 1; x < index + rowSpan; x++) {
          if (isCutoff(x)) {
            (root.rowSpan as any) = x - index;
            break;
          }

          let xFlags = occupiedFlags.get(x);
          let xRoots = occupiedRoots.get(x);
          if (!xFlags) {
            xFlags = new Uint8Array(columnCount);
            xRoots = [];
            occupiedFlags.set(x, xFlags);
            occupiedRoots.set(x, xRoots);
          }
          for (let y = ci; y < ci + colSpan; y++) {
            xFlags[y] = 1;
            xRoots![y] = root;
          }
        }
      }

      ci += colSpan;
    }

    const layoutRow: LayoutRow = {
      kind: "row",
      id: row.id,
      cells,
      rowIndex: index,
      rowPin: getRowPin(index),
      rowFirstPinBottom: index === bottomCutoff,
      rowLastPinTop: index === topCutoff - 1,
      rowIsFocusRow: false,
    };
    indexToLayout.set(index, layoutRow);
    idToLayout.set(row.id, layoutRow);

    return layoutRow;
  }

  const view: RowLayout = {
    clearCache: () => {
      indexToLayout.clear();
      idToLayout.clear();
      occupiedFlags.clear();
      occupiedRoots.clear();
    },
    layoutById: (id) => idToLayout.get(id),
    layoutByIndex: (index) => {
      const layout = indexToLayout.get(index);
      if (layout) {
        return layout;
      }

      return computeRow(index);
    },
    rootCell: (r, c) => {
      const row = view.layoutByIndex(r);
      if (!row || row.kind === "full-width") return row ?? null;

      const cell = row.cells[c];
      return cell?.root ?? cell ?? null;
    },
  };

  return view;
}
