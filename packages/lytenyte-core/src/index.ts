import { Header } from "./components/header/header.js";
import { HeaderRow } from "./components/header/header-row/header-row.js";
import { HeaderCell } from "./components/header/header-cell/header-cell.js";
import { HeaderGroupCell } from "./components/header/header-cell/header-group-cell.js";
import { RowsContainer } from "./components/rows/rows-container/rows-container.js";
import { RowsTop } from "./components/rows/row-sections/rows-top.js";
import { RowsCenter } from "./components/rows/row-sections/rows-center.js";
import { RowsBottom } from "./components/rows/row-sections/rows-bottom.js";
import { Row } from "./components/rows/row/row.js";
import { RowFullWidth } from "./components/rows/row-full-width.js";
import { Cell } from "./components/cells/cell.js";
import { Viewport } from "./components/viewport/viewport.js";
import { Root } from "./root/root.js";
import type { CSSProperties, JSX, PropsWithChildren, ReactNode, Ref } from "react";
import type { ColumnAbstract, ColumnView, RowHeight, RowSource } from "@1771technologies/lytenyte-shared";
import type { ViewportShadowsProps } from "./components.js";
import type { useDraggable } from "./dnd/use-draggable.js";
import type { UseDraggableProps } from "./dnd/types.js";
import type { Piece } from "./hooks/use-piece.js";

import type * as LnTypes from "@1771technologies/lytenyte-shared";
import type * as DndTypes from "./dnd/types.js";

export const Grid = Root as GridComponent;
Grid.Header = Header;
Grid.HeaderRow = HeaderRow;
Grid.HeaderCell = HeaderCell;
Grid.HeaderGroupCell = HeaderGroupCell;
Grid.RowsContainer = RowsContainer;
Grid.RowsTop = RowsTop;
Grid.RowsCenter = RowsCenter;
Grid.RowsBottom = RowsBottom;
Grid.Row = Row;
Grid.RowFullWidth = RowFullWidth;
Grid.Cell = Cell;
Grid.Viewport = Viewport;

export { measureText } from "@1771technologies/dom-utils";
export { moveRelative, equal, arrayShallow } from "@1771technologies/js-utils";
export { getRowDragData } from "./dnd/get-drag-data.js";
export { computeField } from "./root/hooks/use-api/auxiliary-functions/compute-field.js";

export { useClientDataSource } from "./data-source/use-client-data-source.js";
export type { RowSourceClient, UseClientDataSourceParams } from "./data-source/use-client-data-source.js";

export type { Piece, PieceWritable } from "./hooks/use-piece.js";
export { usePiece } from "./hooks/use-piece.js";

// FROM HERE DOWN ONLY PUT TYPES RELATED TO THE GRID.

export interface GridComponent {
  <Spec extends Grid.GridSpec = Grid.GridSpec>(
    props: PropsWithChildren<
      Grid.Props<Spec> &
        (undefined extends Spec["api"]
          ? unknown
          : { apiExtension: ((incomplete: Root.API<Spec>) => Spec["api"] | null) | Spec["api"] })
    >,
  ): ReactNode;

  Header: typeof Header;
  HeaderRow: typeof HeaderRow;
  HeaderCell: typeof HeaderCell;

  HeaderGroupCell: typeof HeaderGroupCell;
  RowsContainer: typeof RowsContainer;
  RowsTop: typeof RowsTop;
  RowsCenter: typeof RowsCenter;
  RowsBottom: typeof RowsBottom;
  Row: typeof Row;
  RowFullWidth: typeof RowFullWidth;
  Cell: typeof Cell;
  Viewport: typeof Viewport;
}

export namespace Grid {
  export interface GridSpec<
    Data = unknown,
    ColExt extends Record<string, any> = object,
    S extends RowSource<Data> = RowSource,
    Ext extends Record<string, any> = object,
  > {
    readonly data?: Data;
    readonly column?: ColExt;
    readonly source?: S;
    readonly api?: Ext;
  }

  export type Props<Spec extends GridSpec = GridSpec> = {
    readonly cellSelectionMode?: "range" | "multi-range" | "none";
    readonly cellSelections?: T.DataRect[];
    readonly cellSelectionExcludeMarker?: boolean;
    readonly cellSelectionMaintainOnNonCellPosition?: boolean;
    readonly onCellSelectionChange?: (rects: T.DataRect[]) => void;

    readonly columns?: Column<Spec>[];
    readonly columnBase?: Omit<Partial<Column<Spec>>, "id" | "pin" | "field" | "editSetter">;
    readonly columnMarker?: Omit<Partial<Column<Spec>>, "id" | "field" | "pin"> & { on?: boolean };

    readonly columnGroupDefaultExpansion?: boolean;
    readonly columnGroupExpansions?: Record<string, boolean>;
    readonly columnGroupJoinDelimiter?: string;
    readonly columnSizeToFit?: boolean;
    readonly columnDoubleClickToAutosize?: boolean;

    readonly columnMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((
          props: T.HeaderParams<Spec> & {
            readonly x: number;
            readonly y: number;
            readonly outside: boolean;
          },
        ) => ReactNode);
    readonly columnGroupMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((
          props: T.HeaderGroupParams<Spec> & {
            readonly x: number;
            readonly y: number;
            readonly outside: boolean;
          },
        ) => ReactNode);
    readonly columnGroupRenderer?: (props: T.HeaderGroupParams<Spec>) => ReactNode;

    readonly gridId?: string;
    readonly events?: Events<Spec>;
    readonly styles?: Style;

    readonly rtl?: boolean;

    readonly headerHeight?: number;
    readonly headerGroupHeight?: number;
    readonly floatingRowHeight?: number;
    readonly floatingRowEnabled?: boolean;

    readonly suppressScrollFlash?: boolean;

    readonly viewportInitialWidth?: number;
    readonly viewportInitialHeight?: number;

    readonly rowOverscanTop?: number;
    readonly rowOverscanBottom?: number;

    readonly colOverscanStart?: number;
    readonly colOverscanEnd?: number;

    readonly rowAlternateAttr?: boolean;
    readonly rowScanDistance?: number;
    readonly rowSource?: Spec["source"];
    readonly rowHeight?: RowHeight;
    readonly rowAutoHeightGuess?: number;

    readonly rowGroupColumn?: false | Omit<Column<Spec>, "field" | "id">;

    readonly rowFullWidthPredicate?: null | ((params: T.RowParams<Spec>) => boolean);
    readonly rowFullWidthRenderer?: (props: T.RowFullWidthRendererParams<Spec>) => ReactNode | null;

    readonly virtualizeCols?: boolean;
    readonly virtualizeRows?: boolean;

    readonly rowAnimate?: boolean | RowAnimate;
    readonly columnAnimate?: boolean | ColumnAnimate;

    readonly rowSelectionMode?: "single" | "multiple" | "none";
    readonly rowSelectionActivator?: "single-click" | "double-click" | "none";

    readonly rowDetailExpansions?: Set<string>;
    readonly rowDetailHeight?: number | "auto";
    readonly rowDetailAutoHeightGuess?: number;
    readonly rowDetailRenderer?: (props: T.RowParams<Spec>) => ReactNode | null;
    readonly rowDropAccept?: string[];

    readonly ref?: Ref<API<Spec>>;

    readonly editRowValidatorFn?: (
      params: Pick<T.EditParams<Spec>, "api" | "editData" | "row">,
    ) => boolean | Record<string, unknown>;
    readonly editClickActivator?: "single-click" | "double-click" | "none";
    readonly editMode?: "cell" | "row" | "readonly";

    // Values that can be changed by the grid
    readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
    readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
    readonly onColumnsChange?: (columns: Column<Spec>[]) => void;
    readonly onRowGroupColumnChange?: (column: Omit<Column<Spec>, "field" | "id">) => void;

    readonly slotShadows?: (props: ViewportShadowsProps) => ReactNode;
    readonly slotViewportOverlay?: ((props: { api: API<Spec> }) => ReactNode) | ReactNode;
    readonly slotRowsOverlay?: ((props: { api: API<Spec> }) => ReactNode) | ReactNode;

    // Events

    readonly onColumnMoveOutside?: (params: {
      readonly api: API<Spec>;
      readonly columns: Column<Spec>[];
    }) => void;

    readonly onEditBegin?: (params: {
      readonly api: API<Spec>;
      readonly preventDefault: () => void;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditEnd?: (params: {
      readonly api: API<Spec>;
      readonly preventDefault: () => void;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditCancel?: (params: {
      readonly api: API<Spec>;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditFail?: (params: {
      readonly api: API<Spec>;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
      readonly validation: null | Record<string, unknown> | boolean;
    }) => void;

    readonly onRowSelect?: (params: {
      readonly preventDefault: () => void;
      readonly api: API<Spec>;
      readonly rows: string[] | "all";
      readonly deselect: boolean;
    }) => void;

    readonly onRowDrop?: (params: {
      readonly source: {
        id: string;
        api: API<GridSpec>;
        row: T.RowNode<any>;
        rowIndex: number;
        data?: any;
      };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<GridSpec> }
        | {
            kind: "row";
            id: string;
            api: API<GridSpec>;
            row: T.RowNode<any>;
            rowIndex: number;
            element: HTMLElement;
          };
    }) => void;

    readonly onRowDragEnter?: (params: {
      readonly source: {
        id: string;
        api: API<GridSpec>;
        row: T.RowNode<any>;
        rowIndex: number;
        data?: any;
      };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<GridSpec> }
        | {
            kind: "row";
            id: string;
            api: API<GridSpec>;
            row: T.RowNode<any>;
            rowIndex: number;
            element: HTMLElement;
          };
    }) => void;
    readonly onRowDragLeave?: (params: {
      readonly source: {
        id: string;
        api: API<GridSpec>;
        row: T.RowNode<any>;
        rowIndex: number | null;
        data?: any;
      };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<GridSpec> }
        | {
            kind: "row";
            id: string;
            api: API<GridSpec>;
            row: T.RowNode<any>;
            rowIndex: number | null;
            element: HTMLElement;
          };
    }) => void;
  };

  type WithId = { readonly id: string };
  export type API<Spec extends GridSpec = GridSpec> = {
    readonly cellSelections: () => T.DataRect[];
    readonly positionFromElement: (el: HTMLElement) => T.PositionUnion | null;

    readonly xPositions$: Piece<Uint32Array>;
    readonly yPositions$: Piece<Uint32Array>;
    readonly viewport$: Piece<HTMLElement | null>;

    readonly cellRoot: (row: number, column: number) => T.PositionGridCell | T.PositionFullWidthRow | null;
    readonly columnById: (id: string) => Column<Spec> | null;
    readonly columnByIndex: (index: number) => Column<Spec> | null;
    readonly columnField: (columnOrId: string | WithId, row: T.RowNode<Spec["data"]>) => unknown;
    readonly columnMove: (params: {
      readonly moveColumns: (string | WithId)[];
      readonly moveTarget: string | number | WithId;
      readonly before?: boolean;
      readonly updatePinState?: boolean;
    }) => void;
    readonly columnResize: (sizes: Record<string, number>) => void;
    readonly columnAutosize: (params?: {
      readonly dryRun?: boolean;
      readonly includeHeader?: boolean;
      readonly columns?: (string | number | WithId)[];
    }) => Record<string, number>;
    readonly columnUpdate: (updates: Record<string, Omit<Partial<Column<Spec>>, "id">>) => void;
    readonly columnToggleGroup: (group: string | string[], state?: boolean) => void;
    readonly columnView: () => ColumnView;
    readonly rowDetailHeight: (rowId: WithId | string) => number;
    readonly rowDetailExpanded: (rowOrId: T.RowNode<Spec["data"]> | string | number) => boolean;
    readonly rowDetailToggle: (rowOrId: string | T.RowNode<Spec["data"]>, state?: boolean) => void;

    readonly rowGroupToggle: (rowOrId: T.RowNode<Spec["data"]> | string, state?: boolean) => void;
    readonly rowIsLeaf: (row: T.RowNode<Spec["data"]>) => row is T.RowLeaf<Spec["data"]>;
    readonly rowIsGroup: (row: T.RowNode<Spec["data"]>) => row is T.RowGroup;
    readonly rowIsAggregated: (row: T.RowNode<Spec["data"]>) => row is T.RowAggregated;
    readonly rowIsExpanded: (row: T.RowNode<Spec["data"]>) => boolean;
    readonly rowIsExpandable: (row: T.RowNode<Spec["data"]>) => boolean;
    readonly rowView: () => { rowCount: number; topCount: number; bottomCount: number; centerCount: number };

    readonly exportData: (params?: { readonly rect?: T.DataRect }) => Promise<T.ExportDataRectResult<Spec>>;

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
    readonly editUpdateRows: (
      rows: Map<string | number, unknown>,
    ) => true | Map<string | number, boolean | Record<string, unknown>>;
    readonly editUpdateCells: (
      cells: Map<string | number, { value: any; column: Column<Spec> | string | number }[]>,
    ) => true | Map<string | number, boolean | Record<string, unknown>>;

    readonly rowSelect: (params: {
      readonly selected: string | [start: string, end: string] | Set<string> | "all";
      readonly deselect?: boolean;
    }) => void;
    readonly rowHandleSelect: (params: { readonly target: EventTarget; readonly shiftKey: boolean }) => void;

    readonly useRowDrag: (
      params: Partial<Pick<UseDraggableProps, "data" | "placeholder">> & {
        readonly rowIndex: number;
        readonly tags?: Record<string, T.DragItem>;
      },
    ) => ReturnType<typeof useDraggable>;

    readonly props: () => Grid.Props<Spec>;
  } & Omit<RowSource, "onRowGroupExpansionsChange" | "onRowsUpdated" | "onRowsSelected"> &
    (undefined extends Spec["source"]
      ? object
      : Omit<Spec["source"], "onRowGroupExpansionsChange" | "onRowsUpdated" | "onRowsSelected">) &
    Spec["api"];

  export type Column<Spec extends GridSpec = GridSpec> = T.ColumnUnextended<Spec> & Spec["column"];

  export type ColumnBase<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["columnBase"];
  export type ColumnMarker<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["columnMarker"];
  export type RowGroupColumn<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["rowGroupColumn"];

  export type Events<Spec extends GridSpec = GridSpec> = {
    readonly cell?: Partial<T.CellEvents<Spec>>;
    readonly row?: Partial<T.RowEvents<Spec>>;
    readonly headerCell?: Partial<T.HeaderEvents<Spec>>;
    readonly headerGroup?: Partial<T.HeaderGroupEvents<Spec>>;
    readonly viewport?: Partial<T.ViewportEvents<Spec>>;
  };

  export type Style = {
    readonly viewport?: {
      readonly style?: CSSProperties;
      readonly className?: string;
    };
    readonly row?: {
      readonly style?: CSSProperties;
      readonly className?: string;
    };
    readonly header?: {
      readonly style?: CSSProperties;
      readonly className?: string;
    };
    readonly detail?: {
      readonly style?: CSSProperties;
      readonly className?: string;
    };
    readonly headerGroup?: {
      readonly style?: CSSProperties;
      readonly className?: string;
    };
    readonly cell?: {
      readonly style?: CSSProperties;
      readonly className?: string;
    };
  };

  export type AnimateKeyframesFn = (element: HTMLElement) => Keyframe[];
  export type AnimateEnterExitType = "fade" | AnimateKeyframesFn;

  export type AnimateMove = {
    readonly duration?: number;
    readonly easing?: string;
  };

  export type AnimateEnterExit = {
    readonly type?: AnimateEnterExitType;
    readonly duration?: number;
    readonly easing?: string;
  };

  export type Animate = {
    readonly move?: AnimateMove | false;
    readonly enter?: AnimateEnterExit | false;
    readonly exit?: AnimateEnterExit | false;
  };

  export type RowAnimateEnterExitType = AnimateEnterExitType;
  export type RowAnimateMove = AnimateMove;
  export type RowAnimateEnterExit = AnimateEnterExit;
  export type RowAnimate = Animate;

  export type ColumnAnimateEnterExitType = AnimateEnterExitType;
  export type ColumnAnimateMove = AnimateMove;
  export type ColumnAnimateEnterExit = AnimateEnterExit;
  export type ColumnAnimate = Animate;

  export namespace Components {
    export type Header = Header.Props;
    export type HeaderRow = HeaderRow.Props;
    export type HeaderCell = HeaderCell.Props;
    export type HeaderGroupCell = HeaderGroupCell.Props;
    export type RowsContainer = RowsContainer.Props;
    export type RowsTop = RowsTop.Props;
    export type RowsCenter = RowsCenter.Props;
    export type RowsBottom = RowsBottom.Props;
    export type Row = Row.Props;
    export type RowFullWidth = RowFullWidth.Props;
    export type Cell = Cell.Props;
    export type Viewport = Viewport.Props;
  }

  export namespace T {
    export type AggregationFn<T> = LnTypes.AggregationFn<T>;
    export type Aggregator<T> = LnTypes.Aggregator<T>;

    export type Events = {
      [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${string}`
        ? key
        : never]: JSX.IntrinsicElements["div"][key];
    };

    export type ColumnUnextended<Spec extends GridSpec = GridSpec> = ColumnAbstract & {
      readonly field?: Field<Spec["data"]>;

      readonly colSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);
      readonly rowSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);

      readonly autosizeCellFn?: (params: CellParams<Spec>) => number | null | undefined;
      readonly autosizeHeaderFn?: (params: HeaderParams<Spec>) => number | null | undefined;

      readonly floatingCellRenderer?: (props: HeaderParams<Spec>) => ReactNode;
      readonly headerRenderer?: (props: HeaderParams<Spec>) => ReactNode;
      readonly cellRenderer?: (props: CellRendererParams<Spec>) => ReactNode;

      readonly editOnPrintable?: boolean;
      readonly editRenderer?: (props: EditParams<Spec>) => ReactNode;
      readonly editable?: boolean | ((params: CellParamsWithIndex<Spec>) => boolean);
      readonly editSetter?: (
        params: Pick<EditParams<Spec>, "api" | "editValue" | "editData" | "row" | "column">,
      ) => unknown;
      readonly editMutateCommit?: (
        params: Pick<EditParams<Spec>, "api" | "editData" | "row" | "column">,
      ) => void;
    };

    export type CellParams<Spec extends GridSpec = GridSpec> = {
      readonly row: RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly api: Grid.API<Spec>;
    };

    export type CellParamsWithIndex<Spec extends GridSpec = GridSpec> = {
      readonly rowIndex: number;
      readonly colIndex: number;
    } & CellParams<Spec>;

    export type CellRendererParams<Spec extends GridSpec = GridSpec> = {
      readonly selected: boolean;
      readonly indeterminate: boolean;
      readonly detailExpanded: boolean;
      readonly editData: unknown;
      readonly layout: LayoutCell;
    } & CellParamsWithIndex<Spec>;

    export type EditParams<Spec extends GridSpec = GridSpec> = {
      readonly editValue: unknown;
      readonly changeValue: (value: unknown) => boolean | Record<string, unknown>;
      readonly editData: unknown;
      readonly editValidation: boolean | Record<string, unknown>;
      readonly changeData: (data: unknown) => boolean | Record<string, unknown>;
      readonly commit: () => boolean | Record<string, unknown>;
      readonly cancel: () => void;
      readonly layout: LayoutCell;
    } & CellParamsWithIndex<Spec>;

    export type DataRect = LnTypes.DataRect;
    export type Dimension<T> = LnTypes.Dimension<T>;
    export type DimensionAgg<T> = LnTypes.DimensionAgg<T>;
    export type DimensionSort<T> = LnTypes.DimensionSort<T>;

    export type Field<T> = string | number | PathField | ((params: { row: RowNode<T> }) => unknown);
    export type FilterFn<T> = LnTypes.FilterFn<T>;
    export type GroupFn<T> = LnTypes.GroupFn<T>;
    export type GroupIdFn = LnTypes.GroupIdFn;

    export type HeaderGroupParams<Spec extends GridSpec = GridSpec> = {
      readonly collapsible: boolean;
      readonly collapsed: boolean;
      readonly groupPath: string[];
      readonly columns: Column<Spec>[];
      readonly api: API<Spec>;
    };
    export type HeaderParams<Spec extends GridSpec = GridSpec> = {
      readonly column: Column<Spec>;
      readonly api: API<Spec>;
    };

    export type LeafIdFn<T> = LnTypes.LeafIdFn<T>;
    export type PathField = { kind: "path"; path: string };

    export type RowParams<Spec extends GridSpec = GridSpec> = {
      readonly rowIndex: number;
      readonly row: RowNode<Spec["data"]>;
      readonly api: API<Spec>;
    };

    export type RowFullWidthRendererParams<Spec extends GridSpec = GridSpec> = RowParams<Spec> & {
      readonly layout: LayoutFullWidthRow;
    };

    export type RowSelectionState = LnTypes.RowSelectionState;
    export type RowSelectionIsolated = LnTypes.RowSelectionIsolated;
    export type RowSelectionLinked = LnTypes.RowSelectionLinked;
    export type RowSelectNode = LnTypes.RowSelectNode;
    export type SortFn<T> = LnTypes.SortFn<T>;

    export type RowDragPlaceholderFn = DndTypes.ReactPlaceholderFn;
    export type DragItem = DndTypes.DragItem;
    export type DragItemSiteLocal = DndTypes.DragItemSiteLocal;
    export type DragItemTransfer = DndTypes.DragItemTransfer;

    export type RowNode<T> = LnTypes.RowNode<T>;
    export type RowLeaf<T> = LnTypes.RowLeaf<T>;
    export type RowGroup = LnTypes.RowGroup;
    export type RowAggregated = LnTypes.RowAggregated;
    export type ColumnPin = LnTypes.ColumnPin;
    export type LayoutCell = LnTypes.LayoutCell;
    export type LayoutHeader = LnTypes.LayoutHeader;
    export type LayoutHeaderCell = LnTypes.LayoutHeaderCell;
    export type LayoutHeaderGroup = LnTypes.LayoutHeaderGroup;
    export type LayoutHeaderFloating = LnTypes.LayoutHeaderFloating;
    export type LayoutFullWidthRow = LnTypes.LayoutFullWidthRow;
    export type LayoutRow = LnTypes.LayoutRow;
    export type LayoutRowWithCells = LnTypes.LayoutRowWithCells;
    export type PositionDetailCell = LnTypes.PositionDetailCell;
    export type PositionFloatingCell = LnTypes.PositionFloatingCell;
    export type PositionFullWidthRow = LnTypes.PositionFullWidthRow;
    export type PositionGridCell = LnTypes.PositionGridCell;
    export type PositionGridCellRoot = LnTypes.PositionGridCellRoot;
    export type PositionHeaderCell = LnTypes.PositionHeaderCell;
    export type PositionHeaderGroupCell = LnTypes.PositionHeaderGroupCell;
    export type PositionUnion = LnTypes.PositionUnion;

    export interface ExportDataRectResult<Spec extends GridSpec = GridSpec> {
      readonly headers: string[];
      readonly groupHeaders: (string | null)[][];
      readonly data: unknown[][];
      readonly columns: Column<Spec>[];
    }

    export type CellEvents<Spec extends GridSpec = GridSpec> = {
      [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
        ? Uncapitalize<X>
        : never]: (params: {
        event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
        column: Column<Spec>;
        row: RowNode<Spec["data"]>;
        layout: LayoutCell;
        api: API<Spec>;
      }) => void;
    };

    export type RowEvents<Spec extends GridSpec = GridSpec> = {
      [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
        ? Uncapitalize<X>
        : never]: (params: {
        event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
        row: RowNode<Spec["data"]>;
        layout: LayoutRowWithCells | LayoutFullWidthRow;
        api: API<Spec>;
      }) => void;
    };

    export type HeaderEvents<Spec extends GridSpec = GridSpec> = {
      [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
        ? Uncapitalize<X>
        : never]: (params: {
        event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
        layout: LayoutHeaderCell | LayoutHeaderFloating;
        column: Column<Spec>;
        api: API<Spec>;
      }) => void;
    };

    export type HeaderGroupEvents<Spec extends GridSpec = GridSpec> = {
      [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
        ? Uncapitalize<X>
        : never]: (params: {
        event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
        layout: LayoutHeaderGroup;
        columns: Column<Spec>[];
        api: API<Spec>;
      }) => void;
    };

    export type ViewportEvents<Spec extends GridSpec = GridSpec> = {
      [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
        ? Uncapitalize<X>
        : never]: (params: {
        event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
        viewport: HTMLElement;
        api: API<Spec>;
      }) => void;
    };
  }
}
