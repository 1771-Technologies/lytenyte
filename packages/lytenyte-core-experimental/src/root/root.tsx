import {
  useId,
  useImperativeHandle,
  useMemo,
  useState,
  type PropsWithChildren,
  type Ref,
} from "react";
import { GridContext, type GridContextType } from "./context.js";
import { useViewportDimensions } from "./use-viewport-dimensions.js";
import { useXPositions } from "./positions/use-x-positions.js";
import { AnyArray, AnyObject, DEFAULT_ROW_SOURCE } from "../constants.js";
import { useControlled } from "../hooks/use-controlled.js";
import { useEvent } from "../hooks/use-event.js";
import { useColumnView } from "./column-view/use-column-view.js";
import type { Column, ColumnBase, ColumnMarker } from "../types/column.js";
import { useColumnMeta } from "./column-view/use-column-meta.js";
import { BoundsProvider } from "./bounds/bounds-provider.js";
import { useYPositions } from "./positions/use-y-positions.js";
import { ColumnLayoutProvider } from "./layout-columns/column-layout-provider.js";
import type {
  RowDetailRenderer,
  RowFullWidthPredicate,
  RowFullWidthRenderer,
  RowHeight,
  RowNode,
  RowSource,
} from "../types/row.js";
import { useHeaderHeightTotal } from "./use-header-height-total.js";
import { RowSourceProvider } from "./row-source/row-source-provider.js";
import { RowLayoutProvider } from "./layout-rows/row-layout-provider.js";
import { usePiece } from "../hooks/use-piece.js";
import { useRowDetail } from "./row-detail/use-row-detail.js";
import { RowDetailContext } from "./row-detail/row-detail-context.js";

export interface API<T> {
  readonly getRowDetailHeight: (rowId: RowNode<T> | string) => number;
}

export interface RootProps<T> {
  readonly columns?: Column<T>[];
  readonly columnBase?: ColumnBase<T>;
  readonly columnMarker?: ColumnMarker<T>;
  readonly columnMarkerEnabled?: boolean;
  readonly columnGroupDefaultExpansion?: boolean;
  readonly columnGroupJoinDelimiter?: string;

  readonly sizeToFit?: boolean;

  readonly gridId?: string;

  readonly rtl?: boolean;

  readonly headerHeight?: number;
  readonly headerGroupHeight?: number;
  readonly floatingRowHeight?: number;
  readonly floatingRowEnabled?: boolean;

  readonly rowOverscanTop?: number;
  readonly rowOverscanBottom?: number;
  readonly colOverscanStart?: number;
  readonly colOverscanEnd?: number;

  readonly rowScanDistance?: number;
  readonly rowSource?: RowSource;
  readonly rowHeight?: RowHeight;

  readonly rowFullWidthPredicate?: RowFullWidthPredicate<T> | null;
  readonly rowFullWidthRenderer?: RowFullWidthRenderer<T> | null;

  readonly virtualizeCols?: boolean;
  readonly virtualizeRows?: boolean;

  readonly rowDetailHeight?: number | "auto";
  readonly rowDetailAutoHeightGuess?: number;
  readonly rowDetailRenderer?: RowDetailRenderer<T> | null;

  // Values that can be changed by the grid
  readonly columnGroupExpansions?: Record<string, boolean>;
  readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
  readonly rowDetailExpansions?: Set<string>;
  readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;

  readonly ref: Ref<API<T>>;
}

export function Root<T>({
  columns = AnyArray,
  columnBase = AnyObject,
  sizeToFit = false,
  gridId,
  rtl,

  headerHeight = 40,
  headerGroupHeight = 40,
  floatingRowHeight = 40,
  floatingRowEnabled = false,

  columnGroupDefaultExpansion = true,
  columnGroupJoinDelimiter = "-->",
  columnMarker = AnyObject,
  columnMarkerEnabled = false,

  children,

  rowOverscanTop = 10,
  rowOverscanBottom = 10,
  colOverscanStart = 3,
  colOverscanEnd = 3,

  rowSource = DEFAULT_ROW_SOURCE,
  rowHeight = 40,

  rowDetailHeight = 300,
  rowDetailAutoHeightGuess = 300,
  rowDetailRenderer = null,

  rowScanDistance = 100,
  virtualizeCols = true,
  virtualizeRows = true,

  rowFullWidthPredicate = null,
  rowFullWidthRenderer = null,

  columnGroupExpansions = AnyObject,
  onColumnGroupExpansionChange,

  rowDetailExpansions,
  onRowDetailExpansionsChange,

  ref,
}: PropsWithChildren<RootProps<T>>) {
  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const id = useId();

  const dimensions = useViewportDimensions(vp);

  // Column Grouping
  const [colGroupExpansions, setColGroupExpansions] = useControlled({
    controlled: columnGroupExpansions,
    default: AnyObject,
  });
  const _onColGroupExpansionChange = useEvent((change: Record<string, boolean>) => {
    onColumnGroupExpansionChange?.(change);
    setColGroupExpansions(change);
  });

  const view = useColumnView(
    columns,
    columnBase,
    columnGroupDefaultExpansion,
    colGroupExpansions,
    columnGroupJoinDelimiter,
    columnMarkerEnabled,
    columnMarker,
  );
  const columnMeta = useColumnMeta(view);

  const floatHeight = floatingRowEnabled ? 0 : floatingRowHeight;
  const totalHeaderHeight = useHeaderHeightTotal(
    headerGroupHeight,
    headerHeight,
    floatHeight,
    view.maxRow,
  );

  const detailCtx = useRowDetail(
    rowDetailExpansions,
    onRowDetailExpansionsChange,
    rowDetailHeight,
    rowDetailAutoHeightGuess,
    rowDetailRenderer,
  );

  const xPositions = useXPositions(columns, columnBase, dimensions.innerWidth, sizeToFit);
  const yPositions = useYPositions(
    rowSource,
    vp,
    dimensions.innerHeight,
    rowHeight,
    totalHeaderHeight,
    rowDetailHeight,
    detailCtx.autoHeightCache,
    rowDetailAutoHeightGuess,
    detailCtx.detailExpansions,
  );

  const fullWidthPiece = usePiece(rowFullWidthRenderer);
  const rowDetailPiece = usePiece(detailCtx.detailExpansions);

  const api = useMemo<API<T>>(() => {
    return {
      getRowDetailHeight: detailCtx.getRowDetailHeight,
    };
  }, [detailCtx.getRowDetailHeight]);

  useImperativeHandle(ref, () => api, [api]);

  const value = useMemo<GridContextType>(() => {
    return {
      setViewport: setVp,
      rtl: rtl ?? false,
      id: gridId ?? id,
      headerHeightTotal: totalHeaderHeight,
      headerHeight,
      headerGroupHeight,
      floatingRowHeight,
      floatingRowEnabled,
      headerRowCount: view.maxRow,
      columnMeta,
      columnBase,
      columnGroupDefaultExpansion,
      columnGroupExpansions: colGroupExpansions,
      xPositions,
      yPositions,
      vpInnerHeight: dimensions.innerHeight,
      vpInnerWidth: dimensions.innerWidth,

      rowFullWidthRenderer: fullWidthPiece,
      rowDetailExpansions: rowDetailPiece,
      api,
    };
  }, [
    rtl,
    gridId,
    id,
    totalHeaderHeight,
    headerHeight,
    headerGroupHeight,
    floatingRowHeight,
    floatingRowEnabled,
    view.maxRow,
    columnMeta,
    columnBase,
    columnGroupDefaultExpansion,
    colGroupExpansions,
    xPositions,
    yPositions,
    dimensions.innerHeight,
    dimensions.innerWidth,
    fullWidthPiece,
    rowDetailPiece,
    api,
  ]);

  return (
    <GridContext.Provider value={value}>
      <BoundsProvider
        startCount={view.startCount}
        endCount={view.endCount}
        rowOverscanTop={rowOverscanTop}
        rowOverscanBottom={rowOverscanBottom}
        colOverscanEnd={colOverscanEnd}
        colOverscanStart={colOverscanStart}
        viewport={vp}
        viewportHeight={dimensions.innerHeight}
        viewportWidth={dimensions.innerWidth}
        xPositions={xPositions}
        yPositions={yPositions}
        rowSource={rowSource}
      >
        <RowDetailContext.Provider value={detailCtx}>
          <ColumnLayoutProvider view={view} floatingRowEnabled={floatingRowEnabled}>
            <RowLayoutProvider
              columnMeta={columnMeta}
              rowDetailExpansions={detailCtx.detailExpansions}
              rowFullWidthPredicate={rowFullWidthPredicate}
              rowScan={rowScanDistance}
              rs={rowSource}
              virtualizeCols={virtualizeCols}
              virtualizeRows={virtualizeRows}
              vp={vp}
            >
              <RowSourceProvider rowSource={rowSource}>{children}</RowSourceProvider>
            </RowLayoutProvider>
          </ColumnLayoutProvider>
        </RowDetailContext.Provider>
      </BoundsProvider>
    </GridContext.Provider>
  );
}
