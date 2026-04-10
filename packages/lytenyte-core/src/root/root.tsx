import { forwardRef, memo, useImperativeHandle, type PropsWithChildren, type ReactNode } from "react";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { type RowSource } from "@1771technologies/lytenyte-shared";
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
import { ColumnMoveAndSizeProvider } from "./contexts/column-move-context.js";
import { StylesProvider } from "./contexts/styles-context.js";
import { GridEventsProvider } from "./contexts/events-context.js";
import { RTLProvider } from "./contexts/rtl-provider.js";

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
      <RTLProvider value={props.rtl ?? false}>
        <StylesProvider styles={props.styles} rowAlternateAttr={props.rowAlternateAttr}>
          <GridEventsProvider events={props.events}>
            <GridIdProvider gridId={props.gridId}>
              <DropAcceptProvider
                rowDropAccept={props.rowDropAccept}
                onRowDragEnter={props.onRowDragEnter}
                onRowDragLeave={props.onRowDragLeave}
                onRowDrop={props.onRowDrop}
              >
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
                          <ViewportContext>
                            <DimensionsContext>
                              <CoordinatesProvider
                                columnBase={props.columnBase}
                                columnSizeToFit={props.columnSizeToFit}
                                rowAutoHeightGuess={props.rowAutoHeightGuess}
                                rowDetailAutoHeightGuess={props.rowDetailAutoHeightGuess}
                                rowDetailHeight={props.rowDetailHeight}
                                rowHeight={props.rowHeight}
                                source={source}
                              >
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
                                              props.cellSelectionExcludeMarker &&
                                              (props.columnMarker?.on ?? false)
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
                                                  <SelectPivotProvider
                                                    rowSelectionActivator={props.rowSelectionActivator}
                                                  >
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
                                                          <ColumnMoveAndSizeProvider
                                                            columnDoubleClickToAutosize={
                                                              props.columnDoubleClickToAutosize
                                                            }
                                                            columnGroupMoveDragPlaceholder={
                                                              props.columnGroupMoveDragPlaceholder
                                                            }
                                                            columnMoveDragPlaceholder={
                                                              props.columnMoveDragPlaceholder
                                                            }
                                                            onColumnMoveOutside={props.onColumnMoveOutside}
                                                          >
                                                            {children ?? <Fallback />}
                                                          </ColumnMoveAndSizeProvider>
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
                              </CoordinatesProvider>
                            </DimensionsContext>
                          </ViewportContext>
                        </HeaderLayoutProvider>
                      </GridRendererContext>
                    </RowDetailProvider>
                  </ColumnSettingProvider>
                </ColumnContextProvider>
              </DropAcceptProvider>
            </GridIdProvider>
          </GridEventsProvider>
        </StylesProvider>
      </RTLProvider>
    </RowSourceProvider>
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
