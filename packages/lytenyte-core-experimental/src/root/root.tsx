import {
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { GridContext, type GridContextType } from "./context.js";
import { useViewportDimensions } from "./use-viewport-dimensions.js";
import { useXPositions } from "./positions/use-x-positions.js";
import { AnyArray, AnyObject, DEFAULT_ROW_SOURCE } from "../constants.js";
import { useControlled } from "../hooks/use-controlled.js";
import { useEvent } from "../hooks/use-event.js";
import { useColumnView } from "./column-view/use-column-view.js";
import { useColumnMeta } from "./column-view/use-column-meta.js";
import { BoundsProvider } from "./bounds/bounds-provider.js";
import { useYPositions } from "./positions/use-y-positions.js";
import { ColumnLayoutProvider } from "./layout-columns/column-layout-provider.js";
import { useHeaderHeightTotal } from "./use-header-height-total.js";
import { RowSourceProvider } from "./row-source/row-source-provider.js";
import { RowLayoutProvider } from "./layout-rows/row-layout-provider.js";
import { usePiece } from "../hooks/use-piece.js";
import { useRowDetail } from "./row-detail/use-row-detail.js";
import { RowDetailContext } from "./row-detail/row-detail-context.js";
import { useApi } from "./api/use-api.js";
import type { Ln } from "../types.js";
import { FocusPositionProvider } from "./focus-position/focus-position-provider.js";
import type { LayoutState } from "@1771technologies/lytenyte-shared";

export function Root<T>(props: PropsWithChildren<Ln.Props<T>>) {
  const {
    columns = AnyArray as Ln.LnColumn<T>[],
    columnBase = AnyObject as Ln.ColumnBase<T>,
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
  } = props;

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

  const layoutStateRef = useRef<LayoutState>(null as unknown as LayoutState);
  const api = useApi(
    rtl ?? false,
    props,
    detailCtx,
    view,
    rowSource,
    rowFullWidthPredicate,
    layoutStateRef,
    vp,
    xPositions,
    yPositions,
    totalHeaderHeight,
  );

  useImperativeHandle(ref, () => api as any, [api]);

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
      api: api,
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
    <FocusPositionProvider>
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
                api={api}
                layoutStateRef={layoutStateRef}
              >
                <RowSourceProvider rowSource={rowSource}>{children}</RowSourceProvider>
              </RowLayoutProvider>
            </ColumnLayoutProvider>
          </RowDetailContext.Provider>
        </BoundsProvider>
      </GridContext.Provider>
    </FocusPositionProvider>
  );
}
