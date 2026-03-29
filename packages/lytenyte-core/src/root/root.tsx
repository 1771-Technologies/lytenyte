import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { equal, type RowSource } from "@1771technologies/lytenyte-shared";
import { RootContextProvider, type RootContextValue } from "./root-context.js";
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
import { GridIdProvider } from "./contexts/grid-id.js";
import { ColumnSettingProvider } from "./contexts/columns/column-settings-context.js";
import { BoundsProvider } from "./contexts/bounds.js";
import { FocusPositionProvider } from "./contexts/focus-position.js";
import { CellRangeSelectionActive } from "./contexts/cell-range-selection/cell-range-selection-active.js";
import { CellSelectionContext } from "./contexts/cell-range-selection/cell-range-selection-state.js";
import { RowCountsProvider } from "./contexts/grid-areas/row-counts-context.js";
import { ColumnContextProvider } from "./contexts/columns/column-context.js";
import { DimensionsContext } from "./contexts/viewport/dimensions-context.js";
import { ViewportContext } from "./contexts/viewport/viewport-context.js";
import { HeaderLayoutProvider } from "./contexts/header-layout.js";
import { CoordinatesProvider } from "./contexts/coordinates.js";
import { RowDetailProvider } from "./contexts/row-detail.js";
import { OffsetProvider } from "./contexts/grid-areas/offset-context.js";
import { CutoffProvider } from "./contexts/grid-areas/cutoff-context.js";
import { GridSectionsContextProvider } from "./contexts/grid-areas/grid-sections-context.js";
import { DropAcceptProvider } from "./contexts/drop-accept.js";
import { RowLayoutProvider } from "./contexts/row-layout/row-layout-context.js";
import { EditProvider } from "./contexts/edit-context.js";
import { APIProvider } from "./contexts/api-provider.js";
import { GridRendererContext } from "./contexts/grid-renderer-context.js";
import { RowSourceProvider } from "./contexts/row-source-provider.js";
import { HeaderHierarchyProvider } from "./contexts/header-hierarchy.js";
import { SelectPivotProvider } from "./contexts/row-select-context.js";

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

  const api = useExtendedAPI(props);
  useImperativeHandle(forwarded, () => api as any, [api]);

  return (
    <RowSourceProvider value={source}>
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
            <ColumnSettingProvider base={props.columnBase}>
              <RowDetailProvider
                onRowDetailExpansionsChange={props.onRowDetailExpansionsChange}
                rowDetailExpansions={props.rowDetailExpansions}
                rowDetailAutoHeightGuess={props.rowAutoHeightGuess}
                rowDetailHeight={props.rowDetailHeight}
              >
                <GridRendererContext
                  rowDetailRenderer={props.rowDetailRenderer}
                  rowFullWidthRenderer={props.rowFullWidthRenderer}
                  columnGroupRenderer={props.columnGroupRenderer}
                  slotRowsOverlay={props.slotRowsOverlay}
                  slotShadows={props.slotShadows}
                  slotViewportOverlay={props.slotViewportOverlay}
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
                                        <FocusPositionProvider>
                                          <RowLayoutProvider
                                            api={api}
                                            source={source}
                                            rowFullWidthPredicate={props.rowFullWidthPredicate}
                                            virtualizeCols={props.virtualizeCols}
                                            virtualizeRows={props.virtualizeRows}
                                          >
                                            <SelectPivotProvider>
                                              <EditProvider
                                                api={api}
                                                source={source}
                                                columnBase={props.columnBase}
                                                editRowValidatorFn={props.editRowValidatorFn}
                                                onEditBegin={props.onEditBegin}
                                                onEditCancel={props.onEditCancel}
                                                onEditEnd={props.onEditEnd}
                                                onEditFail={props.onEditFail}
                                                editMode={props.editMode}
                                                editClickActivator={props.editClickActivator}
                                              >
                                                <APIProvider api={api} source={source} {...props}>
                                                  <HeaderHierarchyProvider
                                                    floatingRowEnabled={props.floatingRowEnabled}
                                                  >
                                                    <RootImpl {...props} ref={forwarded as any}>
                                                      {children}
                                                    </RootImpl>
                                                  </HeaderHierarchyProvider>
                                                </APIProvider>
                                              </EditProvider>
                                            </SelectPivotProvider>
                                          </RowLayoutProvider>
                                        </FocusPositionProvider>
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
                </GridRendererContext>
              </RowDetailProvider>
            </ColumnSettingProvider>
          </ColumnContextProvider>
        </DropAcceptProvider>
      </GridIdProvider>
    </RowSourceProvider>
  );
};

const RootImpl = <Spec extends Root.GridSpec = Root.GridSpec>({
  children,
  ...p
}: PropsWithChildren<
  Root.Props<Spec> & (undefined extends Spec["api"] ? object : { apiExtension: Spec["api"] })
>) => {
  const props = p as unknown as Root.Props & { apiExtension?: Spec["api"] } & {};

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

      events: props.events ?? {},
      styles,

      columnGroupMoveDragPlaceholder: props.columnGroupMoveDragPlaceholder,
      columnMoveDragPlaceholder: props.columnMoveDragPlaceholder,
      columnDoubleClickToAutosize: props.columnDoubleClickToAutosize ?? true,
      onColumnMoveOutside: props.onColumnMoveOutside,

      rowAlternateAttr: props.rowAlternateAttr ?? true,
      selectActivator: props.rowSelectionActivator ?? "single-click",
      onRowDragEnter: props.onRowDragEnter,
      onRowDragLeave: props.onRowDragLeave,
      onRowDrop: props.onRowDrop,
    } satisfies RootContextValue;
  }, [
    props.columnDoubleClickToAutosize,
    props.columnGroupMoveDragPlaceholder,
    props.columnMoveDragPlaceholder,
    props.events,
    props.onColumnMoveOutside,
    props.onRowDragEnter,
    props.onRowDragLeave,
    props.onRowDrop,
    props.rowAlternateAttr,
    props.rowSelectionActivator,
    props.rtl,
    styles,
  ]);

  return <RootContextProvider value={value}>{children ?? <Fallback />} </RootContextProvider>;
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
