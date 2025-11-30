import { useId, useMemo, useState, type PropsWithChildren } from "react";
import { GridContext, type GridContextType } from "./context-grid.js";
import { useViewportDimensions } from "./use-viewport-dimensions.js";
import { useXPositions } from "./positions/use-x-positions.js";
import { AnyArray, AnyObject } from "../constants.js";
import { useControlled } from "../hooks/use-controlled.js";
import { useEvent } from "../hooks/use-event.js";
import { useColumnView } from "./column-view/use-column-view.js";
import type { Column, ColumnBase, ColumnMarker } from "../types/column.js";
import { useColumnMeta } from "./column-view/use-column-meta.js";
import { BoundsProvider } from "./bounds/bounds-provider.js";
import { useYPositions } from "./positions/use-y-positions.js";
import { ColumnLayoutProvider } from "./column-layout/column-layout-provider.js";

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

  readonly columnGroupExpansions?: Record<string, boolean>;
  readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;

  readonly rowOverscanTop?: number;
  readonly rowOverscanBottom?: number;
  readonly colOverscanStart?: number;
  readonly colOverscanEnd?: number;
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
  columnGroupExpansions = AnyObject,
  columnMarker = AnyObject,
  columnMarkerEnabled = false,

  children,
  onColumnGroupExpansionChange,

  rowOverscanTop = 10,
  rowOverscanBottom = 10,
  colOverscanStart = 3,
  colOverscanEnd = 3,
}: PropsWithChildren<RootProps<T>>) {
  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const id = useId();

  const dimensions = useViewportDimensions(vp);
  const xPositions = useXPositions(columns, columnBase, dimensions.innerWidth, sizeToFit);
  const yPositions = useYPositions();

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

  const value = useMemo<GridContextType>(() => {
    return {
      setViewport: setVp,
      rtl: rtl ?? false,
      id: gridId ?? id,
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
    };
  }, [
    colGroupExpansions,
    columnBase,
    columnGroupDefaultExpansion,
    columnMeta,
    view.maxRow,
    floatingRowEnabled,
    floatingRowHeight,
    gridId,
    headerGroupHeight,
    headerHeight,
    id,
    rtl,
    xPositions,
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
        topCount={0}
        bottomCount={0}
      >
        <ColumnLayoutProvider view={view} floatingRowEnabled={floatingRowEnabled}>
          {children}
        </ColumnLayoutProvider>
      </BoundsProvider>
    </GridContext.Provider>
  );
}
