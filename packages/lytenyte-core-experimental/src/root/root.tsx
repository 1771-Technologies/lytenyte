import {
  forwardRef,
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
import type { LayoutState, RowSource } from "@1771technologies/lytenyte-shared";
import { useRowLayout } from "./hooks/use-row-layout/use-row-layout.js";
import { useBounds } from "./hooks/use-bounds.js";
import { useApi } from "./hooks/use-api/use-api.js";
import {
  BoundsContextProvider,
  ColumnLayoutContextProvider,
  EditProvider,
  FocusProvider,
  RootContextProvider,
  RowLayoutContextProvider,
  type RootContextValue,
} from "./root-context.js";
import { useEditContext } from "./hooks/use-edit-context.js";
import { useExtendedAPI } from "./hooks/use-api/use-extended-api.js";
import { usePosition } from "./hooks/use-position.js";
import { useDropAccept } from "./hooks/use-drop-accept.js";
import { useGridId } from "./hooks/use-grid-id.js";
import type { GridSpec as LnSpec } from "../types/grid.js";
import type { Column as LnColumn } from "../types/column.js";
import type { API as LnAPI } from "../types/api.js";
import type { Props as LnProps } from "../types/props.js";

const RootImpl = <Spec extends Root.GridSpec = Root.GridSpec>(
  {
    children,
    ...p
  }: PropsWithChildren<
    Root.Props<Spec> & (undefined extends Spec["api"] ? object : { apiExtension: Spec["api"] })
  >,
  forwarded: Root.Props<Spec>["ref"],
) => {
  const props = p as unknown as Root.Props & {
    ln_topComponent?: () => ReactNode;
    ln_bottomComponent: () => ReactNode;
    ln_centerComponent: () => ReactNode;
  };
  const source = props.rowSource ?? DEFAULT_ROW_SOURCE;

  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const gridId = useGridId(props.gridId);
  const selectPivot = useRef<number | null>(null);

  const dropAccept = useDropAccept(props, gridId);

  const dimensions = useViewportDimensions(vp);
  const controlled = useControlledGridState(props);

  const view = useColumnView(controlled.columns, props, source, controlled.columnGroupExpansions);
  const totalHeaderHeight = useTotalHeaderHeight(props, view.maxRow);

  const xPositions = useXPositions(props, view, dimensions.innerWidth);
  const yPositions = useYPositions(
    props,
    source,
    dimensions.innerHeight - totalHeaderHeight,
    controlled.detailExpansions,
  );

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

  const { focusPiece, focusValue, position } = usePosition();

  const layoutStateRef = useRef<LayoutState>(null as unknown as LayoutState);
  const headerLayout = useHeaderLayout(view, props);
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
  );

  const value = useMemo<RootContextValue>(() => {
    return {
      id: gridId,
      rtl: props.rtl ?? false,
      api: api,
      xPositions,
      yPositions: yPositions.positions,
      viewport: vp,
      setViewport: setVp,
      view,
      focusActive: focusPiece,
      source,

      columnGroupMoveDragPlaceholder: props.columnGroupMoveDragPlaceholder,
      columnGroupRenderer: props.columnGroupRenderer,
      columnMoveDragPlaceholder: props.columnMoveDragPlaceholder,
      columnDoubleClickToAutosize: props.columnDoubleClickToAutosize ?? true,

      dimensions,

      totalHeaderHeight,
      detailExpansions: controlled.detailExpansions,

      topComponent: props.ln_topComponent,
      bottomComponent: props.ln_bottomComponent,
      centerComponent: props.ln_centerComponent,

      rowDetailHeight: props.rowDetailHeight ?? 200,
      rowDetailRenderer: props.rowDetailRenderer,
      rowFullWidthRenderer: props.rowFullWidthRenderer,
      setDetailCache: yPositions.setDetailCache,

      base: props.columnBase ?? {},

      columnGroupDefaultExpansion: props.columnGroupDefaultExpansion ?? true,
      columnGroupExpansions: controlled.columnGroupExpansions,

      floatingRowEnabled: props.floatingRowEnabled ?? false,
      floatingRowHeight: props.floatingRowHeight ?? 40,
      headerGroupHeight: props.headerGroupHeight ?? 40,
      headerHeight: props.headerHeight ?? 40,

      editMode: props.editMode ?? "readonly",
      editClickActivator: props.editClickActivator ?? "double-click",
      editValidator: props.editRowValidatorFn ?? null,

      selectActivator: props.rowSelectionActivator ?? "single-click",
      selectPivot,
      dropAccept,
      onRowDragEnter: props.onRowDragEnter,
      onRowDragLeave: props.onRowDragLeave,
      onRowDrop: props.onRowDrop,
    };
  }, [
    api,
    controlled.columnGroupExpansions,
    controlled.detailExpansions,
    dimensions,
    dropAccept,
    focusPiece,
    gridId,
    props.columnBase,
    props.columnDoubleClickToAutosize,
    props.columnGroupDefaultExpansion,
    props.columnGroupMoveDragPlaceholder,
    props.columnGroupRenderer,
    props.columnMoveDragPlaceholder,
    props.editClickActivator,
    props.editMode,
    props.editRowValidatorFn,
    props.floatingRowEnabled,
    props.floatingRowHeight,
    props.headerGroupHeight,
    props.headerHeight,
    props.ln_bottomComponent,
    props.ln_centerComponent,
    props.ln_topComponent,
    props.onRowDragEnter,
    props.onRowDragLeave,
    props.onRowDrop,
    props.rowDetailHeight,
    props.rowDetailRenderer,
    props.rowFullWidthRenderer,
    props.rowSelectionActivator,
    props.rtl,
    source,
    totalHeaderHeight,
    view,
    vp,
    xPositions,
    yPositions.positions,
    yPositions.setDetailCache,
  ]);

  return (
    <RootContextProvider value={value}>
      <RowLayoutContextProvider value={rowLayout}>
        <ColumnLayoutContextProvider value={headerLayout}>
          <BoundsContextProvider value={bounds}>
            <EditProvider value={editValue}>
              <FocusProvider value={focusValue}>{children}</FocusProvider>
            </EditProvider>
          </BoundsContextProvider>
        </ColumnLayoutContextProvider>
      </RowLayoutContextProvider>
    </RootContextProvider>
  );
};

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
