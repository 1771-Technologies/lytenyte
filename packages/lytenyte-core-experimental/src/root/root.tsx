/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
} from "react";
import type { API, Props, RowHeight } from "../types/types-internal.js";
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
  PositionUnion,
  RowGroup,
  RowGroupDisplayMode,
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
import { usePiece } from "../hooks/use-piece.js";
import { useEditContext } from "./hooks/use-edit-context.js";
import type { UseDraggableProps } from "../dnd/types.js";
import type { useDraggable } from "../dnd/use-draggable.js";

export const Root = <
  Data = unknown,
  ColExt extends Record<string, unknown> = {},
  Source extends RowSource = RowSource,
  Ext extends Record<string, unknown> = {},
>({
  children,
  ...p
}: PropsWithChildren<Root.Props<Data, ColExt, Source, Ext>>) => {
  const props = p as unknown as Props;
  const source = props.rowSource ?? DEFAULT_ROW_SOURCE;

  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const id = useId();
  const gridId = props.gridId ?? id;
  const selectPivot = useRef<number | null>(null);

  const dropAccept = useMemo(() => {
    const drop = props.rowDropAccept ?? [];
    if (!drop.includes(gridId)) drop.push(gridId);

    return drop.map((x) => `grid:${x}`);
  }, [gridId, props.rowDropAccept]);

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

  const api = useRef<API>({} as any);
  useImperativeHandle(props.ref, () => api.current as any, []);

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

  const [position, setPosition] = useState<PositionUnion | null>(null);
  const focusPiece = usePiece(position, setPosition);

  const focusValue = useMemo(() => {
    if (position?.kind === "cell") {
      return { row: position.rowIndex, column: position.colIndex };
    }

    return null;
  }, [position]);

  const layoutStateRef = useRef<LayoutState>(null as unknown as LayoutState);
  const headerLayout = useHeaderLayout(view, props);
  const rowLayout = useRowLayout(
    props,
    source,
    view,
    vp,
    api.current,
    bounds,
    layoutStateRef,
    controlled.detailExpansions,
    position,
  );

  const editValue = useEditContext(view, api.current, props, source);

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
    api.current,
  );

  const value = useMemo<RootContextValue>(() => {
    return {
      id: gridId,
      rtl: props.rtl ?? false,
      api: api.current,
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
  type WithId = { readonly id: string };

  export type PathField = { kind: "path"; path: string };

  export interface RowParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly rowIndex: number;
    readonly row: RowNode<T>;
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface HeaderParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly column: Column<T, ColExt, S, Ext>;
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface HeaderGroupParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly groupPath: string[];
    readonly columns: Column<T, ColExt, S, Ext>[];
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface CellParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly row: RowNode<T>;
    readonly column: Column<T, ColExt, S, Ext>;
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface CellParamsWithIndex<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > extends CellParams<T, ColExt, S, Ext> {
    readonly rowIndex: number;
    readonly colIndex: number;
  }

  export interface CellParamsWithSelection<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > extends CellParamsWithIndex<T, ColExt, S, Ext> {
    readonly selected: boolean;
    readonly indeterminate: boolean;
  }

  export interface EditParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > extends CellParamsWithIndex<T, ColExt, S, Ext> {
    readonly editValue: unknown;
    readonly changeValue: (value: unknown) => boolean | Record<string, unknown>;
    readonly editData: unknown;
    readonly changeData: (data: unknown) => boolean | Record<string, unknown>;
    readonly commit: () => boolean | Record<string, unknown>;
    readonly cancel: () => void;
  }

  export interface Renderers<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly header: (props: HeaderParams<T, ColExt, S, Ext>) => ReactNode;
    readonly cell: (props: CellParamsWithSelection<T, ColExt, S, Ext>) => ReactNode;
    readonly row: (props: RowParams<T, ColExt, S, Ext>) => ReactNode;
    readonly edit: (props: EditParams<T, ColExt, S, Ext>) => ReactNode;
  }

  export interface DataRect {
    readonly rowStart: number;
    readonly rowEnd: number;
    readonly columnStart: number;
    readonly columnEnd: number;
  }

  export interface ExportDataRectResult<T> {
    readonly headers: string[];
    readonly groupHeaders: (string | null)[][];
    readonly data: unknown[][];
    readonly columns: Column<T>[];
  }

  type RowSourceOmits = "onRowGroupExpansionsChange" | "onRowsUpdated" | "onRowsSelected";
  export type API<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > = {
    readonly cellRoot: (row: number, column: number) => PositionGridCell | PositionFullWidthRow | null;
    readonly columnById: (id: string) => Column<T, ColExt, S, Ext> | null;
    readonly columnByIndex: (index: number) => Column<T, ColExt, S, Ext> | null;
    readonly columnField: (columnOrId: string | WithId, row: RowNode<T>) => unknown;
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
    readonly columnUpdate: (updates: Record<string, Omit<Column<T, ColExt, S, Ext>, "id">>) => void;

    readonly rowDetailHeight: (rowId: WithId | string) => number;
    readonly rowDetailExpanded: (rowOrId: RowNode<T> | string | number) => boolean;

    readonly rowGroupToggle: (rowOrId: RowNode<T> | string, state?: boolean) => void;

    // To implement
    readonly rowIsLeaf: (row: RowNode<T>) => row is RowLeaf<T>;
    readonly rowIsGroup: (row: RowNode<T>) => row is RowGroup;
    readonly rowGroupIsExpanded: (row: RowNode<T>) => boolean;
    readonly columnToggleGroup: (group: string | string[], state?: boolean) => void;
    readonly exportData: (params?: {
      readonly rect: DataRect;
      readonly uniformGroupHeaders?: boolean;
    }) => Promise<ExportDataRectResult<T>>;
    // To implement end

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

    readonly props: () => Props<T, ColExt, S, Ext>;
  } & Omit<S, RowSourceOmits> &
    Ext;

  interface ColumnUnextended<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > extends ColumnAbstract {
    readonly field?: string | number | PathField | ((params: CellParams<T, ColExt, S, Ext>) => unknown);

    readonly colSpan?: number | ((params: CellParamsWithIndex<T, ColExt, S, Ext>) => number);
    readonly rowSpan?: number | ((params: CellParamsWithIndex<T, ColExt, S, Ext>) => number);

    readonly autosizeCellFn?: (params: CellParams<T, ColExt, S, Ext>) => number | null | undefined;
    readonly autosizeHeaderFn?: (
      params: HeaderParams<this & ColExt, API<T, ColExt, S, Ext>>,
    ) => number | null | undefined;

    readonly floatingCellRenderer?: Renderers<T, ColExt, S, Ext>["header"];
    readonly headerRenderer?: Renderers<T, ColExt, S, Ext>["header"];
    readonly cellRenderer?: Renderers<T, ColExt, S, Ext>["cell"];

    readonly editRenderer?: Renderers<T, ColExt, S, Ext>["edit"];
    readonly editable?: boolean | ((params: CellParamsWithIndex<T, ColExt, S, Ext>) => boolean);
    readonly editSetter?: (
      params: Pick<EditParams<T, ColExt, S, Ext>, "api" | "editValue" | "editData" | "row" | "column">,
    ) => unknown;
  }

  export type Column<
    T = unknown,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > = ColumnUnextended<T, ColExt, S, Ext> & ColExt;

  export type Props<
    Data = unknown,
    ColExt extends Record<string, any> = object,
    S extends RowSource<Data> = RowSource,
    Ext extends Record<string, any> = object,
  > = {
    readonly apiExtensions?: Ext;

    readonly columns?: Column<Data, ColExt, S, Ext>[];
    readonly columnBase?: Omit<Column<Data, ColExt, S, Ext>, "id" | "pin" | "field" | "editSetter">;
    readonly columnMarker?: Omit<Column<Data, ColExt, S, Ext>, "field"> & { width?: number };

    readonly columnMarkerEnabled?: boolean;
    readonly columnGroupDefaultExpansion?: boolean;
    readonly columnGroupExpansions?: Record<string, boolean>;
    readonly columnGroupJoinDelimiter?: string;
    readonly columnSizeToFit?: boolean;
    readonly columnDoubleClickToAutosize?: boolean;

    readonly columnMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((props: HeaderParams<Data, ColExt, S, Ext> & { readonly x: number; y: number }) => ReactNode);
    readonly columnGroupMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((
          props: HeaderGroupParams<Data, ColExt, S, Ext> & { readonly x: number; readonly y: number },
        ) => ReactNode);
    readonly columnGroupRenderer?: (props: HeaderGroupParams<Data, ColExt, S, Ext>) => ReactNode;

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
    readonly rowSource?: S;
    readonly rowHeight?: RowHeight;
    readonly rowAutoHeightGuess?: number;

    readonly rowGroupColumn?: Omit<Column<Data, ColExt, S, Ext>, "field" | "id">;
    readonly rowGroupDisplayMode?: RowGroupDisplayMode;

    readonly rowFullWidthPredicate?:
      | null
      | ((params: RowParams<RowNode<Data>, API<Data, ColExt, S, Ext>>) => boolean);
    readonly rowFullWidthRenderer?: Renderers<Data, ColExt, S, Ext>["row"] | null;

    readonly virtualizeCols?: boolean;
    readonly virtualizeRows?: boolean;

    readonly rowSelectionMode?: "single" | "multiple" | "none";
    readonly rowSelectionActivator?: "single-click" | "double-click" | "none";

    readonly rowDetailExpansions?: Set<string>;
    readonly rowDetailHeight?: number | "auto";
    readonly rowDetailAutoHeightGuess?: number;
    readonly rowDetailRenderer?: Renderers<Data, ColExt, S, Ext>["row"] | null;
    readonly rowDropAccept?: string[];

    readonly ref?: Ref<API<Data, ColExt, S, Ext>>;

    readonly editRowValidatorFn?: (
      params: Pick<EditParams<Data, ColExt, S, Ext>, "api" | "editData" | "row">,
    ) => boolean | Record<string, unknown>;
    readonly editClickActivator?: "single" | "double-click" | "none";
    readonly editMode?: "cell" | "row" | "readonly";

    // Values that can be changed by the grid
    readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
    readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
    readonly onRowGroupExpansionChange?: (deltaChange: Record<string, boolean>) => void;
    readonly onColumnsChange?: (columns: Column<Data, ColExt, S, Ext>[]) => void;
    readonly onRowGroupColumnChange?: (column: Omit<Column<Data, ColExt, S, Ext>, "field" | "id">) => void;

    // Events
    readonly onEditBegin?: (params: {
      readonly api: API<Data, ColExt, S, Ext>;
      readonly preventDefault: () => void;
      readonly row: RowNode<Data>;
      readonly column: Column<Data, ColExt, S, Ext>;
      readonly editData: unknown;
    }) => void;
    readonly onEditEnd?: (params: {
      readonly api: API<Data, ColExt, S, Ext>;
      readonly preventDefault: () => void;
      readonly row: RowNode<Data>;
      readonly column: Column<Data, ColExt, S, Ext>;
      readonly editData: unknown;
    }) => void;
    readonly onEditCancel?: (params: {
      readonly api: API<Data, ColExt, S, Ext>;
      readonly row: RowNode<Data>;
      readonly column: Column<Data, ColExt, S, Ext>;
      readonly editData: unknown;
    }) => void;
    readonly onEditFail?: (params: {
      readonly api: API<Data, ColExt, S, Ext>;
      readonly row: RowNode<Data>;
      readonly column: Column<Data, ColExt, S, Ext>;
      readonly editData: unknown;
      readonly validation: null | Record<string, unknown> | boolean;
    }) => void;
    readonly onRowSelect?: (params: {
      readonly preventDefault: () => void;
      readonly api: API<Data, ColExt, S, Ext>;
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
  };
}
