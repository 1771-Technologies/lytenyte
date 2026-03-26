import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useViewportDimensions } from "./hooks/use-viewport-dimensions.js";
import { useControlledGridState } from "./hooks/use-controlled-grid-state.js";
import { useColumnView } from "./hooks/use-column-view.js";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { useTotalHeaderHeight } from "./hooks/use-total-header-height.js";
import { useXPositions } from "./hooks/use-x-positions.js";
import { useYPositions } from "./hooks/use-y-positions.js";
import { useHeaderLayout } from "./hooks/use-header-layout.js";
import {
  equal,
  type DataRect,
  type GridSections,
  type LayoutState,
  type PositionUnion,
  type RowSource,
} from "@1771technologies/lytenyte-shared";
import { useRowLayout } from "./hooks/use-row-layout/use-row-layout.js";
import { useBounds } from "./hooks/use-bounds.js";
import { useApi } from "./hooks/use-api/use-api.js";
import {
  BoundsContextProvider,
  ColumnLayoutContextProvider,
  EditProvider,
  RootContextProvider,
  RowLayoutContextProvider,
  type RootContextValue,
} from "./root-context.js";
import { useEditContext } from "./hooks/use-edit-context.js";
import { useExtendedAPI } from "./hooks/use-api/use-extended-api.js";
import { useDropAccept } from "./hooks/use-drop-accept.js";
import { useGridId } from "./hooks/use-grid-id.js";
import type { GridSpec as LnSpec } from "../types/grid.js";
import type { Column as LnColumn } from "../types/column.js";
import type { API as LnAPI } from "../types/api.js";
import type { Props as LnProps } from "../types/props.js";
import { Viewport } from "../components/viewport/viewport.js";
import { Header } from "../components/header/header.js";
import { RowsContainer } from "../components/rows/rows-container/rows-container.js";
import { RowsTop } from "../components/rows/row-sections/rows-top.js";
import { RowsCenter } from "../components/rows/row-sections/rows-center.js";
import { RowsBottom } from "../components/rows/row-sections/rows-bottom.js";
import { useOffsets } from "./hooks/use-offsets.js";
import { RangeSelectionProvider } from "./contexts/range-selection/range-selection-context.js";
import { GridIdProvider } from "./contexts/grid-id.js";
import { GridSectionsProvider } from "./contexts/grid-sections-context.js";
import { RangeSelectionActiveProvider } from "./contexts/range-selection/range-selection-active-context.js";
import { useControlled } from "../hooks/use-controlled.js";
import { useEvent } from "../hooks/use-event.js";
import { usePiece } from "../internal.js";
import { PositionProvider } from "./contexts/position-context.js";

const RootImpl = <Spec extends Root.GridSpec = Root.GridSpec>(
  {
    children,
    ...p
  }: PropsWithChildren<
    Root.Props<Spec> & (undefined extends Spec["api"] ? object : { apiExtension: Spec["api"] })
  >,
  forwarded: Root.Props<Spec>["ref"],
) => {
  const props = p as unknown as Root.Props & { apiExtension?: Spec["api"] } & {};
  const source = props.rowSource ?? DEFAULT_ROW_SOURCE;
  const controlled = useControlledGridState(props);
  const view = useColumnView(controlled.columns, props, source, controlled.columnGroupExpansions);

  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const dimensions = useViewportDimensions(vp);

  const rowCount = source.useRowCount();
  const topCount = source.useTopCount();
  const bottomCount = source.useBottomCount();

  const totalHeaderHeight = useTotalHeaderHeight(props, view.maxRow);
  const xPositions = useXPositions(props, view, dimensions.innerWidth);
  const yPositions = useYPositions(
    props,
    source,
    dimensions.innerHeight - totalHeaderHeight,
    controlled.detailExpansions,
  );

  const offsets = useOffsets(source, view, totalHeaderHeight, xPositions, yPositions.positions);

  const sections = useMemo<GridSections>(() => {
    const centerCount = rowCount - topCount - bottomCount;
    const topCutoff = topCount;
    const botCutoff = centerCount + topCount;
    const startCutoff = view.startCount;
    const endCutoff = view.startCount + view.centerCount;

    return {
      rowCount,
      topCount,
      centerCount,
      bottomCount,
      startCount: view.startCount,
      colCenterCount: view.centerCount,
      endCount: view.endCount,
      bottomCutoff: botCutoff,
      startCutoff,
      endCutoff,
      topCutoff,
      ...offsets,
    };
  }, [bottomCount, offsets, rowCount, topCount, view.centerCount, view.endCount, view.startCount]);

  const gridId = useGridId(props.gridId);
  const selectPivot = useRef<number | null>(null);

  const dropAccept = useDropAccept(props, gridId);

  const api = useExtendedAPI(props);
  useImperativeHandle(forwarded, () => api as any, [api]);

  const bounds = useBounds(
    props,
    source,
    view,
    vp,
    dimensions.innerWidth,
    dimensions.innerHeight,
    xPositions,
    yPositions.positions,
  );

  const layoutStateRef = useRef<LayoutState>(null as unknown as LayoutState);
  const headerLayout = useHeaderLayout(view, props);

  const [position, setPosition] = useState<PositionUnion | null>(null);

  const rowLayout = useRowLayout(
    props,
    source,
    view,
    vp,
    api,
    bounds,
    layoutStateRef,
    controlled.detailExpansions,
    position,
  );

  const editValue = useEditContext(view, api, props, source);

  const [cellSelections, setCellSelections] = useControlled<DataRect[]>({
    controlled: p.cellSelections,
    default: [] as DataRect[],
  });
  const onCellSelectionChange = useEvent((change: DataRect[]) => {
    setCellSelections(change);
    p.onCellSelectionChange?.(change);
  });
  const cellSelections$ = usePiece(cellSelections);

  useApi(
    gridId,
    props,
    source,
    view,
    controlled,
    editValue,
    selectPivot,
    bounds.get(),
    layoutStateRef,
    yPositions.detailCache,
    vp,
    xPositions,
    yPositions.positions,
    totalHeaderHeight,
    api,
    cellSelections,
  );

  const prevStyles = useRef(props.styles);
  const styles = useMemo(() => {
    const next = props.styles;
    if (equal(prevStyles.current, next)) return prevStyles.current;

    prevStyles.current = next;
    return next;
  }, [props.styles]);

  const value = useMemo<RootContextValue>(() => {
    return {
      animate: props.animate ?? false,
      rtl: props.rtl ?? false,
      api: api,
      xPositions,
      yPositions: yPositions.positions,
      idToPositions: yPositions.idToPositions,

      cellSelections$,
      viewport: vp,
      setViewport: setVp,
      view,
      source,

      events: props.events ?? {},
      columnGroupMoveDragPlaceholder: props.columnGroupMoveDragPlaceholder,
      columnGroupRenderer: props.columnGroupRenderer,
      columnMoveDragPlaceholder: props.columnMoveDragPlaceholder,
      columnDoubleClickToAutosize: props.columnDoubleClickToAutosize ?? true,

      dimensions,
      styles,

      totalHeaderHeight,
      detailExpansions: controlled.detailExpansions,

      rowDetailHeight: props.rowDetailHeight ?? 200,
      rowDetailAutoHeightGuess: props.rowDetailAutoHeightGuess ?? 200,
      rowDetailHeightCache: yPositions.detailCache,
      rowDetailRenderer: props.rowDetailRenderer,
      rowFullWidthRenderer: props.rowFullWidthRenderer,
      setDetailCache: yPositions.setDetailCache,

      base: props.columnBase ?? {},

      onColumnMoveOutside: props.onColumnMoveOutside,
      columnGroupDefaultExpansion: props.columnGroupDefaultExpansion ?? true,
      columnGroupExpansions: controlled.columnGroupExpansions,

      floatingRowEnabled: props.floatingRowEnabled ?? false,
      floatingRowHeight: props.floatingRowHeight ?? 40,
      headerGroupHeight: props.headerGroupHeight ?? 40,
      headerHeight: props.headerHeight ?? 40,

      slotShadows: props.slotShadows,
      slotRowsOverlay: props.slotRowsOverlay,
      slotViewportOverlay: props.slotViewportOverlay,

      editMode: props.editMode ?? "readonly",
      editClickActivator: props.editClickActivator ?? "double-click",
      editValidator: props.editRowValidatorFn ?? null,

      rowAlternateAttr: props.rowAlternateAttr ?? true,
      selectActivator: props.rowSelectionActivator ?? "single-click",
      selectPivot,
      dropAccept,
      onRowDragEnter: props.onRowDragEnter,
      onRowDragLeave: props.onRowDragLeave,
      onRowDrop: props.onRowDrop,
    };
  }, [
    api,
    cellSelections$,
    controlled.columnGroupExpansions,
    controlled.detailExpansions,
    dimensions,
    dropAccept,
    props.animate,
    props.columnBase,
    props.columnDoubleClickToAutosize,
    props.columnGroupDefaultExpansion,
    props.columnGroupMoveDragPlaceholder,
    props.columnGroupRenderer,
    props.columnMoveDragPlaceholder,
    props.editClickActivator,
    props.editMode,
    props.editRowValidatorFn,
    props.events,
    props.floatingRowEnabled,
    props.floatingRowHeight,
    props.headerGroupHeight,
    props.headerHeight,
    props.onColumnMoveOutside,
    props.onRowDragEnter,
    props.onRowDragLeave,
    props.onRowDrop,
    props.rowAlternateAttr,
    props.rowDetailAutoHeightGuess,
    props.rowDetailHeight,
    props.rowDetailRenderer,
    props.rowFullWidthRenderer,
    props.rowSelectionActivator,
    props.rtl,
    props.slotRowsOverlay,
    props.slotShadows,
    props.slotViewportOverlay,
    source,
    styles,
    totalHeaderHeight,
    view,
    vp,
    xPositions,
    yPositions.detailCache,
    yPositions.idToPositions,
    yPositions.positions,
    yPositions.setDetailCache,
  ]);

  return (
    <RootContextProvider value={value}>
      <GridIdProvider value={gridId}>
        <GridSectionsProvider value={sections}>
          <RangeSelectionProvider
            topCutoff={sections.topCutoff}
            bottomCutoff={sections.bottomCutoff}
            endCutoff={sections.endCutoff}
            startCutoff={sections.startCutoff}
            cellSelections={cellSelections}
            excludeMarker={(p.cellSelectionExcludeMarker ?? false) && (p.columnMarker?.on ?? false)}
            maintainOnNonCell={p.cellSelectionMaintainOnNonCellPosition ?? false}
            mode={p.cellSelectionMode ?? "none"}
            onCellSelectionChange={onCellSelectionChange}
          >
            <RangeSelectionActiveProvider
              topCutoff={sections.topCutoff}
              bottomCutoff={sections.bottomCutoff}
              endCutoff={sections.endCutoff}
              startCutoff={sections.startCutoff}
            >
              <RowLayoutContextProvider value={rowLayout}>
                <ColumnLayoutContextProvider value={headerLayout}>
                  <BoundsContextProvider value={bounds}>
                    <EditProvider value={editValue}>
                      <PositionProvider position={position} setPosition={setPosition}>
                        {children ?? <Fallback />}
                      </PositionProvider>
                    </EditProvider>
                  </BoundsContextProvider>
                </ColumnLayoutContextProvider>
              </RowLayoutContextProvider>
            </RangeSelectionActiveProvider>
          </RangeSelectionProvider>
        </GridSectionsProvider>
      </GridIdProvider>
    </RootContextProvider>
  );
};

export const Fallback = memo(() => {
  return (
    <Viewport>
      <Header />
      <RowsContainer>
        <RowsTop />
        <RowsCenter />
        <RowsBottom />
      </RowsContainer>
    </Viewport>
  );
});

export const Root = forwardRef(RootImpl) as <Spec extends Root.GridSpec = Root.GridSpec>(
  props: PropsWithChildren<Root.Props<Spec>>,
) => ReactNode;

export namespace Root {
  export type GridSpec<
    T = unknown,
    C extends Record<string, any> = object,
    S extends RowSource<T> = RowSource,
    E extends Record<string, any> = object,
  > = LnSpec<T, C, S, E>;

  export type Props<Spec extends GridSpec = GridSpec> = LnProps<Spec>;
  export type API<Spec extends GridSpec = GridSpec> = LnAPI<Spec>;
  export type Column<Spec extends GridSpec = GridSpec> = LnColumn<Spec>;
}
