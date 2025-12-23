import { useMemo, useRef, useState, type PropsWithChildren, type ReactNode, type Ref } from "react";
import { useViewportDimensions } from "./hooks/use-viewport-dimensions.js";
import { useControlledGridState } from "./hooks/use-controlled-grid-state.js";
import { useColumnView } from "./hooks/use-column-view.js";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { useTotalHeaderHeight } from "./hooks/use-total-header-height.js";
import { useXPositions } from "./hooks/use-x-positions.js";
import { useYPositions } from "./hooks/use-y-positions.js";
import { useHeaderLayout } from "./hooks/use-header-layout.js";
import type {
  ColumnAbstract,
  LayoutState,
  PositionFullWidthRow,
  PositionGridCell,
  RowGroup,
  RowGroupDisplayMode,
  RowHeight,
  RowLeaf,
  RowNode,
  RowSource,
} from "@1771technologies/lytenyte-shared";
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
import type { UseDraggableProps } from "../dnd/types.js";
import type { useDraggable } from "../dnd/use-draggable.js";
import { useExtendedAPI } from "./hooks/use-api/use-extended-api.js";
import { usePosition } from "./hooks/use-position.js";
import { useDropAccept } from "./hooks/use-drop-accept.js";
import { useGridId } from "./hooks/use-grid-id.js";

export const Root = <Spec extends Root.GridSpec = Root.GridSpec>({
  children,
  ...p
}: PropsWithChildren<Root.Props<Spec>>) => {
  const props = p as unknown as Root.Props;
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
    controlled.detailExpansions,
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

export namespace Root {
  export interface GridSpec<
    Data = unknown,
    ColExt extends Record<string, any> = object,
    S extends RowSource<Data> = RowSource,
    Ext extends Record<string, any> = object,
  > {
    readonly data?: Data;
    readonly columnExtension?: ColExt;
    readonly source?: S;
    readonly apiExtension?: Ext;
  }

  type WithId = { readonly id: string };

  export type PathField = { kind: "path"; path: string };

  export interface RowParams<Spec extends GridSpec = GridSpec> {
    readonly rowIndex: number;
    readonly row: RowNode<GridSpec["data"]>;
    readonly api: API<Spec>;
  }

  export interface HeaderParams<Spec extends GridSpec = GridSpec> {
    readonly column: Column<Spec>;
    readonly api: API<Spec>;
  }

  export interface HeaderGroupParams<Spec extends GridSpec = GridSpec> {
    readonly groupPath: string[];
    readonly columns: Column<Spec>[];
    readonly api: API<Spec>;
  }

  export interface CellParams<Spec extends GridSpec = GridSpec> {
    readonly row: RowNode<Spec["data"]>;
    readonly column: Column<Spec>;
    readonly api: API<Spec>;
  }

  export interface CellParamsWithIndex<Spec extends GridSpec = GridSpec> extends CellParams<Spec> {
    readonly rowIndex: number;
    readonly colIndex: number;
  }

  export interface CellParamsWithSelection<Spec extends GridSpec = GridSpec>
    extends CellParamsWithIndex<Spec> {
    readonly selected: boolean;
    readonly indeterminate: boolean;
  }

  export interface EditParams<Spec extends GridSpec = GridSpec> extends CellParamsWithIndex<Spec> {
    readonly editValue: unknown;
    readonly changeValue: (value: unknown) => boolean | Record<string, unknown>;
    readonly editData: unknown;
    readonly changeData: (data: unknown) => boolean | Record<string, unknown>;
    readonly commit: () => boolean | Record<string, unknown>;
    readonly cancel: () => void;
  }

  export interface Renderers<Spec extends GridSpec = GridSpec> {
    readonly header: (props: HeaderParams<Spec>) => ReactNode;
    readonly cell: (props: CellParamsWithSelection<Spec>) => ReactNode;
    readonly row: (props: RowParams<Spec>) => ReactNode;
    readonly edit: (props: EditParams<Spec>) => ReactNode;
  }

  export interface DataRect {
    readonly rowStart: number;
    readonly rowEnd: number;
    readonly columnStart: number;
    readonly columnEnd: number;
  }

  export interface ExportDataRectResult<Spec extends GridSpec = GridSpec> {
    readonly headers: string[];
    readonly groupHeaders: (string | null)[][];
    readonly data: unknown[][];
    readonly columns: Column<Spec>[];
  }

  type RowSourceOmits = "onRowGroupExpansionsChange" | "onRowsUpdated" | "onRowsSelected";
  export type API<Spec extends GridSpec = GridSpec> = {
    readonly cellRoot: (row: number, column: number) => PositionGridCell | PositionFullWidthRow | null;
    readonly columnById: (id: string) => Column<Spec> | null;
    readonly columnByIndex: (index: number) => Column<Spec> | null;
    readonly columnField: (columnOrId: string | WithId, row: RowNode<Spec["data"]>) => unknown;
    readonly columnMove: (params: {
      readonly moveColumns: (string | WithId)[];
      readonly moveTarget: string | number | WithId;
      readonly before?: boolean;
      readonly updatePinState?: boolean;
    }) => void;
    readonly columnResize: (sizes: Record<string, number>) => void;
    readonly columnAutosize: (params: {
      readonly dryRun?: boolean;
      readonly includeHeader?: boolean;
      readonly columns?: (string | number | WithId)[];
    }) => Record<string, number>;
    readonly columnUpdate: (updates: Record<string, Omit<Column<Spec>, "id">>) => void;
    readonly columnToggleGroup: (group: string | string[], state?: boolean) => void;

    readonly rowDetailHeight: (rowId: WithId | string) => number;
    readonly rowDetailExpanded: (rowOrId: RowNode<Spec["data"]> | string | number) => boolean;

    readonly rowGroupToggle: (rowOrId: RowNode<Spec["data"]> | string, state?: boolean) => void;
    readonly rowIsLeaf: (row: RowNode<Spec["data"]>) => row is RowLeaf<Spec["data"]>;
    readonly rowIsGroup: (row: RowNode<Spec["data"]>) => row is RowGroup;

    readonly exportData: (params?: {
      readonly rect: DataRect;
      readonly uniformGroupHeaders?: boolean;
    }) => Promise<ExportDataRectResult<Spec>>;

    readonly scrollIntoView: (params: {
      readonly column?: number | string | WithId;
      readonly row?: number;
      readonly behavior?: "smooth" | "auto" | "instant";
    }) => void;

    readonly viewport: () => HTMLElement | null;

    readonly editBegin: (params: {
      readonly init?: any;
      readonly column: WithId | string | number;
      readonly rowIndex: number;
      readonly focusIfNotEditable?: boolean;
    }) => void;
    readonly editEnd: (cancel?: boolean) => void;
    readonly editIsCellActive: (params: {
      readonly column: WithId | string | number;
      readonly rowIndex: number;
    }) => boolean;
    readonly editUpdate: (
      rows: Map<string | number, unknown>,
    ) => true | Map<string | number, boolean | Record<string, unknown>>;

    readonly rowSelect: (params: {
      readonly selected: string | [start: string, end: string] | Set<string> | "all";
      readonly deselect?: boolean;
    }) => void;
    readonly rowHandleSelect: (params: { readonly target: EventTarget; readonly shiftKey: boolean }) => void;

    readonly useRowDrag: (
      params: Partial<Pick<UseDraggableProps, "data" | "placeholder">> & { rowIndex: number },
    ) => ReturnType<typeof useDraggable>;

    readonly props: () => Props<Spec>;
  } & (undefined extends Spec["source"]
    ? Omit<RowSource, RowSourceOmits>
    : Omit<Spec["source"], RowSourceOmits>) &
    Spec["apiExtension"];

  interface ColumnUnextended<Spec extends GridSpec = GridSpec> extends ColumnAbstract {
    readonly field?: string | number | PathField | ((params: CellParams<Spec>) => unknown);

    readonly colSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);
    readonly rowSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);

    readonly autosizeCellFn?: (params: CellParams<Spec>) => number | null | undefined;
    readonly autosizeHeaderFn?: (params: HeaderParams<Spec>) => number | null | undefined;

    readonly floatingCellRenderer?: Renderers<Spec>["header"];
    readonly headerRenderer?: Renderers<Spec>["header"];
    readonly cellRenderer?: Renderers<Spec>["cell"];

    readonly editRenderer?: Renderers<Spec>["edit"];
    readonly editable?: boolean | ((params: CellParamsWithIndex<Spec>) => boolean);
    readonly editSetter?: (
      params: Pick<EditParams<Spec>, "api" | "editValue" | "editData" | "row" | "column">,
    ) => unknown;
  }

  export type Column<Spec extends GridSpec = GridSpec> = ColumnUnextended<Spec> & Spec["columnExtension"];

  export type Props<Spec extends GridSpec = GridSpec> = {
    readonly columns?: Column<Spec>[];
    readonly columnBase?: Omit<Column<Spec>, "id" | "pin" | "field" | "editSetter">;
    readonly columnMarker?: Omit<Column<Spec>, "field"> & { width?: number };

    readonly columnMarkerEnabled?: boolean;
    readonly columnGroupDefaultExpansion?: boolean;
    readonly columnGroupExpansions?: Record<string, boolean>;
    readonly columnGroupJoinDelimiter?: string;
    readonly columnSizeToFit?: boolean;
    readonly columnDoubleClickToAutosize?: boolean;

    readonly columnMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((props: HeaderParams<Spec> & { readonly x: number; y: number }) => ReactNode);
    readonly columnGroupMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((props: HeaderGroupParams<Spec> & { readonly x: number; readonly y: number }) => ReactNode);
    readonly columnGroupRenderer?: (props: HeaderGroupParams<Spec>) => ReactNode;

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
    readonly rowSource?: Spec["source"];
    readonly rowHeight?: RowHeight;
    readonly rowAutoHeightGuess?: number;

    readonly rowGroupColumn?: Omit<Column<Spec>, "field" | "id">;
    readonly rowGroupDisplayMode?: RowGroupDisplayMode;

    readonly rowFullWidthPredicate?: null | ((params: RowParams<Spec>) => boolean);
    readonly rowFullWidthRenderer?: Renderers<Spec>["row"] | null;

    readonly virtualizeCols?: boolean;
    readonly virtualizeRows?: boolean;

    readonly rowSelectionMode?: "single" | "multiple" | "none";
    readonly rowSelectionActivator?: "single-click" | "double-click" | "none";

    readonly rowDetailExpansions?: Set<string>;
    readonly rowDetailHeight?: number | "auto";
    readonly rowDetailAutoHeightGuess?: number;
    readonly rowDetailRenderer?: Renderers<Spec>["row"] | null;
    readonly rowDropAccept?: string[];

    readonly ref?: Ref<API<Spec>>;

    readonly editRowValidatorFn?: (
      params: Pick<EditParams<Spec>, "api" | "editData" | "row">,
    ) => boolean | Record<string, unknown>;
    readonly editClickActivator?: "single" | "double-click" | "none";
    readonly editMode?: "cell" | "row" | "readonly";

    // Values that can be changed by the grid
    readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
    readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
    readonly onRowGroupExpansionChange?: (deltaChange: Record<string, boolean>) => void;
    readonly onColumnsChange?: (columns: Column<Spec>[]) => void;
    readonly onRowGroupColumnChange?: (column: Omit<Column<Spec>, "field" | "id">) => void;

    // Events
    readonly onEditBegin?: (params: {
      readonly api: API<Spec>;
      readonly preventDefault: () => void;
      readonly row: RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditEnd?: (params: {
      readonly api: API<Spec>;
      readonly preventDefault: () => void;
      readonly row: RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditCancel?: (params: {
      readonly api: API<Spec>;
      readonly row: RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditFail?: (params: {
      readonly api: API<Spec>;
      readonly row: RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
      readonly validation: null | Record<string, unknown> | boolean;
    }) => void;
    readonly onRowSelect?: (params: {
      readonly preventDefault: () => void;
      readonly api: API<Spec>;
      readonly rows: string[] | "all";
      readonly deselect: boolean;
    }) => boolean;

    readonly onRowDrop?: (params: {
      readonly source: { id: string; api: API<any>; row: RowNode<any>; rowIndex: number; data?: any };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<any> }
        | {
            kind: "row";
            id: string;
            api: API<any>;
            row: RowNode<any>;
            rowIndex: number;
            element: HTMLElement;
          };
    }) => void;

    readonly onRowDragEnter?: (params: {
      readonly source: { id: string; api: API<any>; row: RowNode<any>; rowIndex: number; data?: any };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<any> }
        | {
            kind: "row";
            id: string;
            api: API<any>;
            row: RowNode<any>;
            rowIndex: number;
            element: HTMLElement;
          };
    }) => void;
    readonly onRowDragLeave?: (params: {
      readonly source: { id: string; api: API<any>; row: RowNode<any>; rowIndex: number | null; data?: any };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<any> }
        | {
            kind: "row";
            id: string;
            api: API<any>;
            row: RowNode<any>;
            rowIndex: number | null;
            element: HTMLElement;
          };
    }) => void;
  } & (undefined extends Spec["apiExtension"] ? object : { apiExtension: Spec["apiExtension"] });
}
