import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useControlledGridState } from "./hooks/use-controlled-grid-state.js";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { useHeaderLayout } from "./hooks/use-header-layout.js";
import { equal, type RowSource } from "@1771technologies/lytenyte-shared";
import { useRowLayout } from "./hooks/use-row-layout/use-row-layout.js";
import { useApi } from "./hooks/use-api/use-api.js";
import {
  ColumnLayoutContextProvider,
  EditProvider,
  RootContextProvider,
  type RootContextValue,
} from "./root-context.js";
import { useEditContext } from "./hooks/use-edit-context.js";
import { useExtendedAPI } from "./hooks/use-api/use-extended-api.js";
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
import { GridIdProvider, useGridIdContext } from "./contexts/grid-id.js";
import { GridSectionsProvider } from "./contexts/grid-sections-context.js";
import { ColumnSettingProvider } from "./contexts/columns/column-settings-context.js";
import { BoundsProvider, useBoundsContext } from "./contexts/bounds.js";
import { FocusPositionProvider } from "./contexts/focus-position.js";
import { RowLayoutProvider, RowViewContextProvider } from "./contexts/row-view.js";
import { CellRangeSelectionActive } from "./contexts/cell-range-selection/cell-range-selection-active.js";
import {
  CellSelectionContext,
  useCellRangeSelection,
  useCellRangeSelectionPieceContext,
} from "./contexts/cell-range-selection/cell-range-selection-state.js";
import { RowCountsProvider } from "./contexts/grid-areas/row-counts-context.js";
import { ColumnContextProvider, useColumnsContext } from "./contexts/columns/column-context.js";
import { DimensionsContext, useDimensionContext } from "./contexts/viewport/dimensions-context.js";
import { useViewportContext, ViewportContext } from "./contexts/viewport/viewport-context.js";
import { HeaderLayoutProvider, useHeaderLayoutContext } from "./contexts/header-layout.js";
import { CoordinatesProvider, useXCoordinates, useYCoordinates } from "./contexts/coordinates.js";
import { RowDetailProvider, useRowDetailContext } from "./contexts/state/row-detail.js";
import { OffsetProvider } from "./contexts/grid-areas/offset-context.js";
import { CutoffProvider } from "./contexts/grid-areas/cutoff-context.js";
import {
  GridSectionsContextProvider,
  useGridSectionsContext,
} from "./contexts/grid-areas/grid-sections-context.js";
import { DropAcceptProvider, useDropAcceptContext } from "./contexts/drop-accept.js";

const RootMain = <Spec extends Root.GridSpec = Root.GridSpec>(
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

  return (
    <GridIdProvider gridId={props.gridId}>
      <DropAcceptProvider rowDropAccept={props.rowDropAccept}>
        <ColumnContextProvider
          columnBase={props.columnBase}
          columnGroupDefaultExpansion={props.columnGroupDefaultExpansion}
          columnGroupExpansions={props.columnGroupExpansions}
          columnMarker={props.columnMarker}
          columns={props.columns}
          onColumnGroupExpansionChange={props.onColumnGroupExpansionChange}
          onColumnsChange={props.onColumnsChange}
          rowGroupColumn={props.rowGroupColumn}
          source={source}
        >
          <RowDetailProvider
            onRowDetailExpansionsChange={props.onRowDetailExpansionsChange}
            rowDetailExpansions={props.rowDetailExpansions}
          >
            <HeaderLayoutProvider
              floatingRowEnabled={p.floatingRowEnabled}
              floatingRowHeight={p.floatingRowHeight}
              headerGroupHeight={p.headerGroupHeight}
              headerHeight={p.headerHeight}
            >
              <CoordinatesProvider
                columnBase={props.columnBase}
                columnSizeToFit={props.columnSizeToFit}
                rowAutoHeightGuess={props.rowAutoHeightGuess}
                rowDetailAutoHeightGuess={props.rowDetailAutoHeightGuess}
                rowDetailHeight={props.rowDetailHeight}
                rowHeight={props.rowHeight}
                source={source}
              >
                <ViewportContext>
                  <DimensionsContext>
                    <RowCountsProvider source={source}>
                      <OffsetProvider>
                        <CutoffProvider>
                          <GridSectionsContextProvider>
                            <BoundsProvider
                              colOverscanEnd={props.colOverscanEnd}
                              colOverscanStart={props.colOverscanStart}
                              rowOverscanBottom={props.rowOverscanBottom}
                              rowOverscanTop={props.rowOverscanTop}
                              source={source}
                            >
                              <CellSelectionContext
                                cellSelections={props.cellSelections}
                                cellSelectionExcludeMarker={
                                  props.cellSelectionExcludeMarker && (props.columnMarker?.on ?? false)
                                }
                                cellSelectionMaintainOnNonCellPosition={
                                  props.cellSelectionMaintainOnNonCellPosition
                                }
                                cellSelectionMode={props.cellSelectionMode}
                                onCellSelectionChange={props.onCellSelectionChange}
                              >
                                <CellRangeSelectionActive>
                                  <RootImpl {...props} ref={forwarded as any}>
                                    {children}
                                  </RootImpl>
                                </CellRangeSelectionActive>
                              </CellSelectionContext>
                            </BoundsProvider>
                          </GridSectionsContextProvider>
                        </CutoffProvider>
                      </OffsetProvider>
                    </RowCountsProvider>
                  </DimensionsContext>
                </ViewportContext>
              </CoordinatesProvider>
            </HeaderLayoutProvider>
          </RowDetailProvider>
        </ColumnContextProvider>
      </DropAcceptProvider>
    </GridIdProvider>
  );
};

const RootImpl = forwardRef(
  <Spec extends Root.GridSpec = Root.GridSpec>(
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

    const { view } = useColumnsContext();
    const { viewport: vp, setViewport: setVp } = useViewportContext();
    const dimensions = useDimensionContext();
    const { totalHeaderHeight } = useHeaderLayoutContext();
    const { detailCache, setDetailCache } = useRowDetailContext();

    const controlled = useControlledGridState(props);

    const xPositions = useXCoordinates();
    const yPositions = useYCoordinates();
    const cutoffValue = useGridSectionsContext();

    const gridId = useGridIdContext();
    const selectPivot = useRef<number | null>(null);
    const dropAccept = useDropAcceptContext();

    const api = useExtendedAPI(props);
    useImperativeHandle(forwarded, () => api as any, [api]);

    const bounds = useBoundsContext();
    const headerLayout = useHeaderLayout(view, props);

    const { rowLayout, rowView } = useRowLayout(
      props,
      cutoffValue,
      source,
      view,
      vp,
      api,
      bounds,
      controlled.detailExpansions,
    );

    const editValue = useEditContext(view, api, props, source);

    const { cellSelections } = useCellRangeSelection();
    const cellSelections$ = useCellRangeSelectionPieceContext();

    useApi(
      gridId,
      props,
      source,
      view,
      controlled,
      editValue,
      selectPivot,
      bounds,
      rowLayout,
      detailCache,
      vp,
      xPositions,
      yPositions,
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
        rtl: props.rtl ?? false,
        api: api,
        xPositions,
        yPositions: yPositions,
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
        rowDetailHeightCache: detailCache,
        rowDetailRenderer: props.rowDetailRenderer,
        rowFullWidthRenderer: props.rowFullWidthRenderer,
        setDetailCache: setDetailCache,

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
      detailCache,
      dimensions,
      dropAccept,
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
      setDetailCache,
      setVp,
      source,
      styles,
      totalHeaderHeight,
      view,
      vp,
      xPositions,
      yPositions,
    ]);

    return (
      <RootContextProvider value={value}>
        <RowCountsProvider source={source}>
          <GridSectionsProvider value={cutoffValue}>
            <RowViewContextProvider value={rowView}>
              <RowLayoutProvider value={rowLayout}>
                <ColumnLayoutContextProvider value={headerLayout}>
                  <EditProvider value={editValue}>
                    <ColumnSettingProvider columns={view.visibleColumns} base={props.columnBase}>
                      <FocusPositionProvider>{children ?? <Fallback />}</FocusPositionProvider>
                    </ColumnSettingProvider>
                  </EditProvider>
                </ColumnLayoutContextProvider>
              </RowLayoutProvider>
            </RowViewContextProvider>
          </GridSectionsProvider>
        </RowCountsProvider>
      </RootContextProvider>
    );
  },
);

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

export const Root = forwardRef(RootMain) as <Spec extends Root.GridSpec = Root.GridSpec>(
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
